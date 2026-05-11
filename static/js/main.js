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