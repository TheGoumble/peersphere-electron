# FormHandler Component Usage Guide

## Overview
The `FormHandler` component provides a standardized way to handle form submissions with automatic loading states, error handling, form resets, and focus management.

## Basic Usage

### 1. Include the Script
```html
<script src="../components/form-handler.js"></script>
```

### 2. Simple Create Operation
```javascript
async function handleCreateNote(event) {
    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();
    
    if (!title || !content) {
        event.preventDefault();
        alert('Please fill in all required fields');
        return;
    }

    await FormHandler.handleCreate(
        event,
        () => api.createNote(groupId, title, content, userId),
        loadNotes,
        'Note'
    );
}
```

### 3. Simple Update Operation
```javascript
async function handleEditNote(event) {
    const noteId = parseInt(document.getElementById('editNoteId').value);
    const title = document.getElementById('editNoteTitle').value.trim();
    const content = document.getElementById('editNoteContent').value.trim();

    await FormHandler.handleUpdate(
        event,
        () => api.updateNote(noteId, title, content),
        loadNotes,
        () => closeModal('editNoteModal'),
        'Note'
    );
}
```

## Advanced Usage

### Custom Options
```javascript
await FormHandler.handleSubmit(
    event,
    () => api.someOperation(),
    async () => {
        await reloadData();
        // Additional success actions
    },
    {
        loadingText: 'Processing...',
        successText: '✅ Operation completed!',
        errorPrefix: '❌ Error: ',
        resetForm: true,
        focusFirst: true,
        showSuccessAlert: true,
        beforeSubmit: async (form) => {
            // Custom validation or preprocessing
            console.log('Before submit', form);
        },
        afterSubmit: async (form, success, error) => {
            // Custom cleanup
            console.log('After submit', success, error);
        },
        onError: (error, form) => {
            // Custom error handling
            alert(`Custom error: ${error.message}`);
        }
    }
);
```

### Form Validation
```javascript
const validation = FormHandler.validate(form, {
    email: {
        required: true,
        label: 'Email',
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        patternMessage: 'Please enter a valid email address'
    },
    password: {
        required: true,
        label: 'Password',
        minLength: 8,
        custom: (value) => /[A-Z]/.test(value) && /[0-9]/.test(value),
        customMessage: 'Password must contain uppercase letter and number'
    }
});

if (!validation.valid) {
    FormHandler.showErrors(form, validation.errors);
    return;
}
```

### Utility Methods

#### Get Form Data as Object
```javascript
const data = FormHandler.getFormData(form);
console.log(data); // { name: 'John', email: 'john@example.com', ... }
```

#### Disable/Enable Form
```javascript
FormHandler.disableForm(form);  // Disable all inputs
FormHandler.enableForm(form);   // Enable all inputs
```

## Benefits

✅ **Consistent UX** - Same loading behavior across all forms
✅ **Error Handling** - Automatic error catching and display
✅ **Auto Reset** - Forms automatically reset after successful submission
✅ **Focus Management** - Auto-focus first input for quick re-entry
✅ **Button States** - Automatic button disable/enable with loading text
✅ **Less Code** - Reduces ~30 lines to ~10 lines per form handler
✅ **Maintainable** - Changes to form behavior happen in one place

## Migration Example

### Before (Manual Handling)
```javascript
async function handleCreateNote(event) {
    event.preventDefault();
    
    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();
    
    if (!title || !content) {
        alert('Please fill in all required fields');
        return;
    }

    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating...';
    
    try {
        await api.createNote(groupId, title, content, userId);
        await loadNotes();
        alert('✅ Note created successfully!');
        event.target.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Note';
        const firstInput = event.target.querySelector('input, select, textarea');
        if (firstInput) firstInput.focus();
    } catch (error) {
        console.error('Error creating note:', error);
        alert('❌ Failed to create note: ' + error.message);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Note';
    }
}
```

### After (With FormHandler)
```javascript
async function handleCreateNote(event) {
    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();
    
    if (!title || !content) {
        event.preventDefault();
        alert('Please fill in all required fields');
        return;
    }

    await FormHandler.handleCreate(
        event,
        () => api.createNote(groupId, title, content, userId),
        loadNotes,
        'Note'
    );
}
```

**Result:** 33 lines → 13 lines (60% reduction)
