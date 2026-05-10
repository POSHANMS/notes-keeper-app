# Import db object from flask_sqlalchemy
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Create the db object - we will connect it to Flask app later in app.py
db = SQLAlchemy

# User table - stores registered users
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # One user can have many notes
    notes = db.relationship('Note', backref='author', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<User {self.email}>'
    
class Note(db.Model):
    __tablename__ = 'notes'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.Foreign('user.id'), nullable=False)
    title = db.Column(db.String(200))
    content = db.Column(db.Text)
    color = db.Column(db.String(20), default='white')
    pinned = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DataTime, default=datetime.utcnow)
    updated_at = db.Column(db.DataTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Note {self.id}>'