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

// ============================================
// COLOR PICKER - Add note editor
// ============================================

// Handle color dot clicks in add note editor
document.querySelectorAll('#addNoteCard .color-dot').forEach(function(dot) {
    dot.addEventListener('click', function() {
        // Remove active class from all dots
        document.querySelectorAll('#addNoteCard .color-dot')
            .forEach(d => d.classList.remove('active'));

        // Add active class to clicked dot
        this.classList.add('active');

        // Store selected color in hidden input
        document.getElementById('selectedColor').value = this.getAttribute('data-color');
    });
});

// ============================================
// PIN TOGGLE - Add note editor
// ============================================

const pinToggle = document.getElementById('pinToggle');

if (pinToggle) {
    pinToggle.addEventListener('click', function() {
        const isPinned = document.getElementById('isPinned');

        if (isPinned.value == '0') {
            // Pin it
            isPinned.value = '1';
            this.style.color = 'var(--brand-primary)';
            this.title = 'Unpin note';
        } else {
            // Unpin it
            isPinned.value = '0';
            this.style.color = '';
            this.title = 'Pin note';
        }
    });
}

// ============================================
// COLOR PICKER - Edit modal
// ============================================

document.querySelectorAll('#editModal .color-dot').forEach(function(dot) {
    dot.addEventListener('click', function() {
        // Remove active from all dots in edit modal
        document.querySelectorAll('#editModal .color-dot')
            .forEach(d => d.classList.remove('active'));

            // Add active to clicked dot
            this.classList.add('active');

            // Store selected color in hidden input
            document.getElementById('editSelectedColor').value = this.getAttribute('data-color');
    });
});

// ============================================
// PIN TOGGLE - Edit modal
// ============================================

const editPinToggle = document.getElementById('editPinToggle');

if (editPinToggle) {
    editPinToggle.addEventListener('click', function() {
        const editIspinned = document.getElementById('editIsPinned');

        if (editIspinned.value === '0') {
            editIspinned.value = '1';
            this.style.color = 'var(--brand-primary';
            this.title = 'Unpin note';
        } else {
            editIspinned.value = '0';
            this.style.color = '';
            this.title = 'Pin note';
        }
    });
}

// ============================================
// SAVE NOTE - Send to Flask /add-note
// ============================================

const saveNoteBtn = document.getElementById('saveNote');

if (saveNoteBtn) {
    saveNoteBtn.addEventListener('click', async function() {
        const title = document.getElementById('noteTitle').value.trim();
        const content = quill ? quill.root.innerHTML : '';
        const color = document.getElementById('selectedColor').value;
        const pinned = document.getElementById('isPinned').value;

        // Don't save if both title and content are empty
        if (!title && quill.getText().trim() === '') {
            alert('Please add a title or some content!');
            return;
        }

        // Send to Flask
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('color', color);
        formData.append('pinned', pinned);

        const response = await fetch('/add-note', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            // Reload page to show new note
            window.location.reload();
        } else {
            alert('Error saving note. Please try again. ');
        }
    });
}