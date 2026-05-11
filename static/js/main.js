// ============================================
// PASSWORD TOGGLE - Login and Register pages
// ============================================

// Toggle password visibility
function togglePasswordVisibility(toggleId, inputId) {
    const toggle = document.getElementById(toggleId);
    const input = document.getElementById(inputId);

    // If elements don't exist on this page, stop
    if (toggle || !input) return;

    toggle.addEventListener('click', function() {
        // Switch between password and text type
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);

        // Switch between eye and eye-slash icon
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
}

// Initialize toggles for login and register pages
togglePasswordVisibility('togglePassword', 'password');
togglePasswordVisibility('toggleConfirm', 'confirmPassword');

// ============================================
// DARK MODE - Toggle with localStorage
// ============================================

const darkModeToggle = document.getElementById('darkModeToggle');

// Apply dark mode on page load if it was previously enabled
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark');
    // Switch icon to sun if dark mode is on
    if (darkModeToggle) {
        darkModeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    }
}

// Toggle dark mode on button click
if (darkModeToggle) {
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark');

        const icon = this.querySelector('i');

        if (document.body.classList.contains('dark')) {
            // Dark mode turned ON
            localStorage.setItem('darkMode', 'enabled');
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            // Dark mode turned OFF
            localStorage.removeItem('darkMode');
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    });
}

// ============================================
// QUILL.JS SETUP - Rich text editors
// ============================================

// Toolbar options - which buttons to show
const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['clean']
];

// Initialize Quill for ADD note editor
// Check if element exists first - only on notes page
let quill = null;
if (document.getElementById('quill-editor')) {
    quill = new quill('#quill-editor', {
        theme: 'snow',
        placeholder: 'Take a note...',
        modules: {
            toolbar: toolbarOptions
        }

    });
}

// Initialize Quill for EDIT note modal
let quillEdit = null;
if (document.getElementById('quill-editor-edit')) {
    quillEdit = new Quill('#quill-editor-edit', {
        theme: 'snow',
        placeholder: 'Edit your note...',
        modules: {
            toolbar: toolbarOptions
        }
    });
}

// ============================================
// NOTE EDITOR - Open and Close
// ============================================

const addNoteCard = document.getElementById('addNoteCard');
const notePlaceholder = document.getElementById('notePlaceholder');
const noteEditor = document.getElementById('noteEditor');

// Open editor when placeholder is clicked
if (notePlaceholder) {
    notePlaceholder.addEventListener('click', function() {
        notePlaceholder.style.display = 'none';
        noteEditor.style.display = 'block';
        document.getElementById('noteTitle').focus();
    });
}

// Close editor when clicking outside the add note card
document.addEventListener('click', function(e) {
    if (addNoteCard && !addNoteCard.contains(e.target)) {
        // Only close if editor is open
        if (noteEditor && noteEditor.style.display === 'block') {
            notePlaceholder.style.display = 'flex';
            noteEditor.style.display = 'none';

            // Reset editor fields
            document.getElementById('noteTitle').value = '';
            document.getElementById('selectedColor').value = 'white';
            document.getElementById('isPinned').value = '0';

            // Reset Quill editor content
            if (quill) quill.setText('');

            // Reset color dots
            document.querySelectorAll('#addNoteCard .color-dot')
                .forEach(dot => dot.classList.remove('active'));

            // Reset pin button
            const pinToggle = document.getElementById('pinToggle');
            if (pinToggle) pinToggle.style.color = '';
        }
    }
});