# Import db object from flask_sqlalchemy
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Create the db object - we will connect it to Flask app later in app.py
db = SQLAlchemy