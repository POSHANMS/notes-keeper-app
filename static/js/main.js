// ============================================
// PASSWORD TOGGLE - Login and Register pages
// ============================================

// Toggle password visibility
function togglePasswordVisibility(toggleId, inputId) {
    const toggle = document.getElementById(toggleId);
    const input = document.getElementById(inputId);

    // If elements don't exist on this page, stop
    if (!toggle || !input) return;

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
    quill = new Quill('#quill-editor', {
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
            this.style.color = 'var(--brand-primary)';
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

        if (currentNoteId) {
            formData.append('note_id', currentNoteId);
        }

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

// ============================================
// EDIT NOTE - Open modal with prefilled data
// ============================================

// Listen for clicks on all edit buttons
document.querySelectorAll('.btn-edit').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
        // Stop click from bubbling up to card
        e.stopPropagation();

        // Get note data from data attributes
        const noteId = this.getAttribute('data-id');
        const title = this.getAttribute('data-title');
        const content = this.getAttribute('data-content');
        const color = this.getAttribute('data-color')

        // Prefill edit modal fields
        document.getElementById('editNoteId').value = noteId;
        document.getElementById('editTitle').value = title || '';

        // Set Quill editor content
        if (quillEdit) quillEdit.root.innerHTML = content || '';

        // Set active color dot in edit modal
        document.querySelectorAll('#editModal .color-dot')
            .forEach(dot => {
                dot.classList.remove('active');
                if (dot.getAttribute('data-color') === color) {
                    dot.classList.add('active');
                }
            });

        // Set color hidden input
        document.getElementById('editSelectedColor').value = color || 'white';

        // Open Bootstrap modal
        const modal = new bootstrap.Modal(document.getElementById('editModal'));
        modal.show(); 
    });
});

// ============================================
// SAVE EDIT - Send to Flask /edit-note
// ============================================

const saveEditBtn =document.getElementById('saveEditNote');

if (saveEditBtn) {
    saveEditBtn.addEventListener('click', async function() {
        const noteId = document.getElementById('editNoteId').value;
        const title = document.getElementById('editTitle').value.trim();
        const content = quillEdit ? quillEdit.root.innerHTML : '';
        const color = document.getElementById('editSelectedColor').value;
        const pinned = document.getElementById('editIsPinned').value;

        const formData = new FormData();
        formData.append('note_id', noteId);
        formData.append('title', title);
        formData.append('content', content);
        formData.append('color', color);
        formData.append('pinned', pinned);

        const response = await fetch('/edit-note', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            window.location.reload();
        } else {
            alert('Error updating note. Please try again. ');
        }
    });
}

// ============================================
// DELETE NOTE - Send to Flask /delete-note
// ============================================

document.querySelectorAll('.btn-delete').forEach(function(btn) {
    btn.addEventListener('click', async function(e) {
        // Stop click from bubbling up to card
        e.stopPropagation();

        // Ask for confirmation before deleting
        if (!confirm('Delete this note?')) return;

        const noteId = this.getAttribute('data-id');

        const formData = new FormData();
        formData.append('note_id', noteId);

        const response = await fetch('/delete-note', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            // Remove note card from DOM without reloading
            const card = document.querySelector(`.note-card[data-id="${noteId}"]`);
            if (card) card.remove();
        } else {
            alert('Error deleting note. Please try again. ');
        }
    });
});

// ============================================
// PIN FROM CARD - Send to Flask /pin-note
// ============================================

document.querySelectorAll('.btn-pin').forEach(function(btn) {
    btn.addEventListener('click', async function(e) {
        // Stop click from bubbling up to card
        e.stopPropagation();

        const noteId = this.getAttribute('data-id');

        const formData = new FormData();
        formData.append('note_id', noteId);

        const response =await fetch('/pin-note', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            // Reload to reorder pinned and unpinned notes
            window.location.reload();
        } else {
            alert('Error pinning note. Please try again.');
        }
    });
});

// ============================================
// REAL-TIME SEARCH with Debouncing
// ============================================

const searchInput = document.getElementById('searchInput');
const notesSection = document.getElementById('notesSection');
let searchTimer;

if (searchInput) {
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();

        // Debounce - wait 300ms after user stops typing
        clearTimeout(searchTimer);
        searchTimer = setTimeout(async function() {
            
            // If search is empty reload page to show all notes
            if (query === '') {
                window.location.reload();
                return;
            }

            // Send search request to Flask
            const response = await fetch(`/search?q=${encodeURIComponent(query)}`);
            const notes = await response.json();

            // Clear current notes display
            notesSection.innerHTML='';

            if (notes.length === 0) {
                // Show no results message
                notesSection.innerHTML =`
                    <div class="empty-state">
                        <i class="fas fa-search"></i>
                        <h3>No results found</h3>
                        <p>Try a different search term</p>
                    </div>
                `;
                return;
            }

            // Build notes grid from search results
            let html = `<div class="notes-grid">`;
            notes.forEach(function(note) {
                html += `
                <div class="note-card ${note.color}" data-id="${note.id}">
                     ${note.title ? `<h3 class="note-card-title">${note.title}</h3>` : ''}
                     <p class="note-card-content">${note.content.replace(/<[^>]*>/g, '').substring(0, 150)}</p>
                     <span class="note-timestamp">${note.updated_at}</span>
                        <div class="note-actions">
                            <button class="btn-note-action btn-edit"
                                    data-id="${note.id}"
                                    data-title="${note.title}"
                                    data-content="${note.content}"
                                    data-color="${note.color}"
                                    title="Edit note">
                                <i class="fas fa-pen"></i>
                            </button>
                            <button class="btn-note-action btn-pin"
                                    data-id="${note.id}"
                                    title="Pin note">
                                <i class="fas fa-thumbtack"></i>
                            </button>
                            <button class="btn-note-action btn-delete"
                                    data-id="${note.id}"
                                    title="Delete note">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
            notesSection.innerHTML = html;

        }, 300);
    });
}

// ============================================
// AUTO-SAVE - Save note while typing
// ============================================

let autoSaveTimer;
let currentNoteId = null; // tracks the note being auto-saved

// Function to trigger auto-save
function triggerAutoSave() {
    const title = document.getElementById('noteTitle');
    const content = quill ? quill.root.innerHTML : '';

    // Only auto-save if editor is open
    if (!title || !noteEditor || noteEditor.style.display === 'none') return;

    // Debounce - wait 1 second after user stops typing
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(async function() {
        const titleValue = title.value.trim();

        // Don't auto-save if completely empty
        if (!titleValue && quill.getText().trim() === '') return;

        const formData = new FormData();
        formData.append('title', titleValue);
        formData.append('content', content);

        // If we already have a note_id send it to update
        if (currentNoteId) {
            formData.append('note_id', currentNoteId);
        }

        const response = await fetch('/autosave', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            // Store note_id for next auto-save
            currentNoteId = data.note_id;
        }
    }, 1000);
}

// Listen for typing in title input
const noteTitle = document.getElementById('noteTitle');
if (noteTitle) {
    noteTitle.addEventListener('input', triggerAutoSave);
}

// Listen for typing in Quill editor
if (quill) {
    quill.on('text-change', triggerAutoSave);
}