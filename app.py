from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Note
from dotenv import load_dotenv
import os

# Load .env variables
load_dotenv()

# Create Flask app
app = Flask(__name__)

# Configure app
app.secret_key = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK-MODIFICATIONS'] = False

# Connect SQLAlchemy to Flask app
db.init_app(app)

# Create all tables if they don't exist
with app.app_context():
    db.create_all()

# ─── AUTH ROUTES ────────────────────────────────────────────

# Show login page
@app.route('/')
def login():
    # If already logged in, go straight to notes
    if 'user_id' in session:
        return redirect(url_for('notes'))
    return render_template('login.html')

# Handle login form submission
@app.route('/login', methods=['POST'])
def login_post():
    email = request.form.get('email')
    password = request.form.get('password')

    # Find user by email
    user = User.query.filter_by(email=email).first()

    # Check user exists and password is correct
    if not user or not check_password_hash(user.passowrd, password):
        flash('Invalid email or password', 'danger')
        return redirect(url_for('login'))
    
    # Save user in session
    session['user_id'] = user.id
    session['name'] = user.name
    return redirect(url_for('notes'))

# Show register page
@app.route('/register')
def register():
    if 'user_id' in session:
        return redirect(url_for('notes'))
    return render_template('register.html')

# Handle register form submission
@app.route('/register', methods=['POST'])
def register_post():
    name = request.form.get('name')
    email = request.form.get('email')
    password = request.form.get('password')
    confirm_password = request.form.get('confirm_password')

    # Check passwords match
    if password != confirm_password:
        flash('Password do not match', 'danger')
        return redirect(url_for('register'))
    
    # Check email not already registered
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        flash('Email already registered', 'danger')
        return redirect(url_for('register'))
    
    # Hash password and save new user
    hashed_password = generate_password_hash(password)
    new_user = User(name=name, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    flash('Account created! Please sign in', 'success')
    return redirect(url_for('login'))

# Logout
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))