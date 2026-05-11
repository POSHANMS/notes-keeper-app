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

