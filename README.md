# NoteFlash ⚡
 
A Google Keep-inspired notes web application built with Flask and SQLAlchemy.
 
---
 
## Features
 
### Authentication
- User registration with name, email, password
- Secure login with session management
- Password hashing with Werkzeug
- Protected routes — unauthenticated users redirected to login
- Duplicate email detection on registration
### Notes
- Create notes with Quill.js rich text editor (bold, italic, underline, strikethrough, ordered/unordered lists)
- Edit existing notes via modal popup
- Delete notes with confirmation dialog
- Pin important notes — pinned notes always appear above others
- Color-code notes with 6 color options (white, yellow, green, blue, pink, purple)
- Auto-save while typing — notes saved silently after 1 second of inactivity
- No data loss — auto-save runs in background before manual save
### Search
- Real-time search as user types
- Searches both title and content
- Debounced — sends request only after user stops typing (300ms)
- Shows "No results found" state when nothing matches
### UI/UX
- Masonry grid layout — cards stack naturally without empty gaps
- Note preview shows first 150 characters of content
- Action buttons (edit, pin, delete) appear only on card hover
- Last updated timestamp on every note card
- Empty state screen when no notes exist
- Flash messages for errors and success
### Dark Mode
- Toggle between light and dark themes
- Preference saved in localStorage — persists across page refreshes
- Full dark theme including Quill editor, modals, inputs, cards
---
 
## Tech Stack
 
| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, JavaScript (Vanilla) |
| UI Framework | Bootstrap 5.3 |
| Icons | Font Awesome 6.4 |
| Typography | Space Grotesk (Google Fonts) |
| Rich Text Editor | Quill.js 1.3.6 |
| Backend | Python 3.13, Flask 3.x |
| ORM | Flask-SQLAlchemy |
| Database | MySQL 8.0 |
| Auth | Werkzeug password hashing |
| Environment | python-dotenv |
 
---
 
## Project Structure
 
```
notes-keeper-app/
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
├── templates/
│   ├── login.html
│   ├── register.html
│   └── notes.html
├── .env
├── .gitignore
├── app.py
├── models.py
└── requirements.txt
```
 
---
 
## Database Schema
 
### Users Table
```sql
CREATE TABLE users (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(100) UNIQUE NOT NULL,
    password   VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
 
### Notes Table
```sql
CREATE TABLE notes (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    title      VARCHAR(200),
    content    TEXT,
    color      VARCHAR(20) DEFAULT 'white',
    pinned     TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```
 
---
 
## API Routes
 
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Login page |
| POST | `/login` | Handle login |
| GET | `/register` | Register page |
| POST | `/register` | Handle registration |
| GET | `/notes` | Notes dashboard |
| POST | `/add-note` | Create or update note |
| POST | `/edit-note` | Edit existing note |
| POST | `/delete-note` | Delete note |
| POST | `/pin-note` | Toggle pin on note |
| POST | `/color-note` | Change note color |
| POST | `/autosave` | Auto-save note while typing |
| GET | `/search` | Search notes by title and content |
| GET | `/logout` | Logout and clear session |
 
---
 
## Setup and Installation
 
### Prerequisites
- Python 3.13
- MySQL 8.0
- Git
### Steps
 
1. Clone the repository
```bash
git clone https://github.com/POSHANMS/notes-keeper-app.git
cd notes-keeper-app
```
 
2. Create and activate virtual environment
```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
```
 
3. Install dependencies
```bash
pip install -r requirements.txt
```
 
4. Create `.env` file in root directory
```
SECRET_KEY=your_secret_key_here
DATABASE_URL=mysql+pymysql://root:yourpassword@localhost/notesapp
```
 
5. Create MySQL database
```sql
CREATE DATABASE notesapp;
```
 
6. Run the application
```bash
python app.py
```
 
7. Open browser at `http://127.0.0.1:5000`
---
 
## Key Implementation Details
 
- **Flask-SQLAlchemy ORM** — database tables defined as Python classes, no raw SQL queries
- **Quill.js** — rich text editor saves content as HTML, stripped to plain text for card previews using Jinja2 `striptags` filter
- **Debouncing** — auto-save and search use `setTimeout`/`clearTimeout` pattern to avoid excessive server requests
- **Auto-save flow** — creates note on first save, returns `note_id`, subsequent saves update the same note
- **Masonry layout** — achieved with CSS `columns` property, no JavaScript library required
- **Dark mode** — CSS custom properties (variables) swapped on `body.dark` class, state persisted in `localStorage`
- **Security** — all note routes filter by both `note_id` AND `session['user_id']` to prevent cross-user data access
---
 
## Screenshots
 
### Login
![Login](static/screenshots/login.png)

### Register
![Register](static/screenshots/register.png)

### Notes Empty Dashboard
![Notes](static/screenshots/notes-dashboard.png)

### Notes Dashboard
![Notes](static/screenshots/notes.png)

### Dark Mode — Empty State
![Dark Empty](static/screenshots/dark-empty.png)

### Dark Mode — With Notes
![Dark Notes](static/screenshots/dark-notes.png)
 
---
 
## Author
 
**Poshan M S**
GitHub: [@POSHANMS](https://github.com/POSHANMS)