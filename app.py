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