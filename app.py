from flask import Flask, render_template, session

app = Flask(__name__)
app.secret_key = "previewkey"

@app.route('/')
def login():
    return render_template('login.html')

@app.route('/register')
def register():
    return render_template('register.html')

@app.route('/notes')
def notes():
    # Fake session and empty notes just for preview
    session['name'] = 'Poshan'
    return render_template('notes.html', notes=[])

if __name__ == '__main__':
    app.run(debug=True)