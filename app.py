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

# ─── NOTES ROUTE ────────────────────────────────────────────

# Show all notes
@app.route('/notes')
def notes():
    # If not logged in, redirect to login
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    # Fetch all notes for logged in user
    # Pinned notes first, then by updated_at newest first
    user_notes = Note.query.filter_by(user_id=session['user_id'])\
                            .order_by(Note.pinned.desc(), Note.updated_at.desc())\
                            .all()
    return render_template('notes.html', notes=user_notes)

# ─── NOTE ACTIONS ────────────────────────────────────────────

# Add new note
@app.route('/add-note', methods=['POST'])
def add_note():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    title = request.form.get('title')
    content = request.form.get('content')
    color = request.form.get('color', 'white')
    pinned = int(request.form.get('pinned', 0))

    new_note = Note(
        User_id = session['user_id'],
        title = title,
        content =content,
        color = color,
        pinned = pinned
    )
    db.session.add(new_note)
    db.session.commit()

    return jsonify({'success': True, 'message': 'Note saves'})

# Edit existing note
@app.route('/edit-note', methods=['POST'])
def edit_note():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    note_id = request.form.get('note_id')
    note = Note.query.filter_by(id=note_id, user_id=session['user_id']).first()

    if not note:
        return jsonify({'error': 'Note not found'}), 404
    
    note.title = request.form.get('title')
    note.content = request.form.get('content')
    note.color = request.form.get('color', 'white')
    note.pinned = int(request.form.get('pinned', 0))
    db.session.commit()

    return jsonify({'success': True, 'message': 'Note updated'})

# Delete note
@app.route('/delete-note', methods=['POST'])
def delete_note():
    if 'user_id' not in session:
        return jsonify({ 'error': 'Unauthorized'}), 401
    
    note_id = request.form.get('note_id')
    note = Note.query.filter_by(id=note_id, user_id=session['user_id']).first()

    if not note:
        return jsonify({'error': 'note not found'}), 404
    
    db.session.delete(note)
    db.session.commit()

    return jsonify({'success': True, 'message': 'Note deleted' })

# ─── PIN, COLOR, SEARCH ────────────────────────────────────────────

# Toggle pin on a note
@app.route('/pin-note', methods=['POST'])
def pin_note():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    note_id = request.form.get('note_id')
    note = Note.query.filter_by(id=note_id, user_id=session['user_id']).first()

    if not note:
        return jsonify({'error': 'Note not found'}), 404
    
    # Toggle - if pinned make unpinned, if unpinned make pinned
    note.pinned = 0 if note.pinned == 1 else 1
    db.session.commit()

    return jsonify({'success': True, 'pinned': note.pinned})

# Change note color
@app.route('/color-note', methods=['POST'])
def color_note():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    note_id = request.form.get('note_id')
    color   = request.form.get('color')
    note    = Note.query.filter_by(id=note_id, user_id=session['user_id']).first()

    if not note:
        return jsonify({'error': 'Note not found'}), 404

    note.color = color
    db.session.commit()

    return jsonify({'success': True, 'color': note.color})

# Search notes
@app.route('/search')
def search():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    query = request.args.get('q', '')

    # Search in both title and content
    results = Note.query.filter(
        Note.user_id == session['user_id'],
        db.or_(
            Note.title.ilike(f'%{query}%')
            Note.content.ilike(f'%{query}%')
        )
    ).order_by(Note.pinned.desc(), Note.updated_at.desc()).all()

    # Convert notes to list of dicts for JSON response
    notes_list = []
    for note in results:
        notes_list.append({
            'id':   note.id,
            'title':    note.title or '',
            'content':  note.content or '',
            'color':    note.color,
            'pinned':   note.pinned,
            'updated_at':   note.updated_at.strftime('%b %d, %Y')
        })
    return jsonify(notes_list)

# ─── AUTO SAVE ────────────────────────────────────────────

# Auto save note while typing
@app.route('/autosave', methods=['POST'])
def autosave():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    note_id = request.form.get('note_id')
    title = request.form.get('title')
    content = request.form.get('content')

    # If note_id exists update it, else create new note
    if note_id:
        note = Note.query.filter_by(id=note_id, user_id=session['user_id']).first()
        if note:
            note.title = title
            note.content = content
            db.session.commit()
            return jsonify({'success': True, 'note_id': note.id})
        
        # Create new note if no note_id
        new_note = Note(
            user_id = session['user_id'],
            title = title,
            content = content
        )
        db.session.add(new_note)
        db.session.commit()

        return jsonify({'success': True, 'note_id': new_note.id})

# ─── RUN APP ────────────────────────────────────────────

if __name__ == '__main__':
    app.run(debug=True)