// Shared utility functions for edit/delete operations on notes and decks

class EditDeleteUtils {
    constructor(api) {
        this.api = api;
    }

    // Create card HTML with edit/delete buttons using data attributes
    createCard(item, type, currentUserId, onView, options = {}) {
        const isNote = type === 'note';
        const id = isNote ? item.noteId : item.deckId;
        const title = isNote ? item.title : (item.title || item.name);
        const content = isNote 
            ? `${(item.content || '').substring(0, 150)}${(item.content || '').length > 150 ? '...' : ''}`
            : item.description || 'No description';
        
        const authorId = isNote ? (item.authorId || item.userId) : (item.createdBy || item.userId);
        const isOwner = authorId === currentUserId;
        const showButtons = options.showButtons !== false && isOwner;

        const groupKey = options.groupKey;
        const groupName = groupKey ? item[groupKey] : null;
        
        const metaInfo = isNote
            ? `<span>📅 ${new Date(item.updatedAt || item.createdAt).toLocaleDateString()}</span>
               ${groupName ? `<span>🌐 ${groupName}</span>` : `<span>👤 ${item.userName || item.authorName || 'Unknown'}</span>`}`
            : `<span>🃏 ${item.cardCount || 0} cards</span>
               ${groupName ? `<span>🌐 ${groupName}</span>` : `<span>👤 ${item.userName || item.creatorName || 'Unknown'}</span>`}`;

        return `
            <div class="work-card" data-type="${type}" data-id="${id}">
                <div class="card-content" data-action="view">
                    <h3>${this.escapeHtml(title || `Untitled ${isNote ? 'Note' : 'Deck'}`)}</h3>
                    <p>${this.escapeHtml(content)}</p>
                    <div class="work-meta">
                        ${metaInfo}
                    </div>
                </div>
                ${showButtons ? `
                <div class="card-actions">
                    <button class="btn-secondary" data-action="edit">✏️ Edit</button>
                    <button class="btn-danger" data-action="delete">🗑️ Delete</button>
                </div>
                ` : ''}
            </div>
        `;
    }

    // Render items in container with event delegation
    renderItems(items, type, container, loadingDiv, currentUserId, onView, emptyMessage, options = {}) {
        loadingDiv.style.display = 'none';

        if (!items || items.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h2>${type === 'note' ? '📝 No Notes Yet' : '🃏 No Flashcard Decks Yet'}</h2>
                    <p>${emptyMessage}</p>
                </div>
            `;
            return;
        }

        container.innerHTML = items.map(item => 
            this.createCard(item, type, currentUserId, onView, options)
        ).join('');

        // Store items data for later retrieval
        container.setAttribute('data-items', JSON.stringify(items));
    }

    // Setup event delegation for card interactions
    setupEventDelegation(container, handlers) {
        // Remove existing listener if any to prevent duplicates
        if (container._delegationHandler) {
            container.removeEventListener('click', container._delegationHandler);
        }

        // Create and store the handler
        const handler = (e) => {
            const card = e.target.closest('.work-card');
            if (!card) return;

            const action = e.target.dataset.action || e.target.closest('[data-action]')?.dataset.action;
            const type = card.dataset.type;
            const id = parseInt(card.dataset.id);

            // Get the item data
            const items = JSON.parse(container.getAttribute('data-items') || '[]');
            const item = items.find(i => {
                return type === 'note' ? i.noteId === id : i.deckId === id;
            });

            if (!item) return;

            // Handle different actions
            if (action === 'view' && handlers.onView) {
                handlers.onView(id);
            } else if (action === 'edit' && handlers.onEdit) {
                e.stopPropagation();
                if (type === 'note') {
                    handlers.onEdit(id, item.title, item.content);
                } else {
                    handlers.onEdit(id, item.title || item.name, item.description);
                }
            } else if (action === 'delete' && handlers.onDelete) {
                e.stopPropagation();
                handlers.onDelete(id);
            }
        };

        container._delegationHandler = handler;
        container.addEventListener('click', handler);
    }

    // Show error state
    showError(container, loadingDiv, message, retryFn) {
        loadingDiv.style.display = 'none';
        container.innerHTML = `
            <div class="empty-state">
                <h2>⚠️ Error</h2>
                <p>${this.escapeHtml(message)}</p>
                <button onclick="${retryFn}()" class="btn-primary">Try Again</button>
            </div>
        `;
    }

    // Open edit modal for note
    openEditNoteModal(noteId, title, content) {
        document.getElementById('editNoteId').value = noteId;
        document.getElementById('editNoteTitle').value = title;
        document.getElementById('editNoteContent').value = content;
        const modal = document.getElementById('editNoteModal');
        modal.classList.add('active');
        
        // Focus first input after modal is visible
        setTimeout(() => {
            const firstInput = modal.querySelector('input:not([type="hidden"]), textarea');
            if (firstInput) firstInput.focus();
        }, 100);
    }

    // Open edit modal for deck
    openEditDeckModal(deckId, name, description) {
        document.getElementById('editDeckId').value = deckId;
        document.getElementById('editDeckTitle').value = name;
        document.getElementById('editDeckDescription').value = description;
        const modal = document.getElementById('editDeckModal');
        modal.classList.add('active');
        
        // Focus first input after modal is visible
        setTimeout(() => {
            const firstInput = modal.querySelector('input:not([type="hidden"]), textarea');
            if (firstInput) firstInput.focus();
        }, 100);
    }

    // Handle edit note form submission
    async handleEditNote(event, reloadFn) {
        const noteId = parseInt(document.getElementById('editNoteId').value);
        const title = document.getElementById('editNoteTitle').value.trim();
        const content = document.getElementById('editNoteContent').value.trim();

        if (!title || !content) {
            event.preventDefault();
            alert('Title and content cannot be empty');
            return;
        }

        // Use FormHandler if available, otherwise fall back to manual handling
        if (typeof FormHandler !== 'undefined') {
            await FormHandler.handleUpdate(
                event,
                () => this.api.updateNote(noteId, title, content),
                reloadFn,
                () => this.closeModal('editNoteModal'),
                'Note'
            );
        } else {
            // Fallback implementation
            event.preventDefault();
            const submitBtn = event.target.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Updating...';

            try {
                await this.api.updateNote(noteId, title, content);
                this.closeModal('editNoteModal');
                await reloadFn();
                alert('✅ Note updated successfully!');
            } catch (error) {
                console.error('Error updating note:', error);
                alert('❌ Failed to update note: ' + error.message);
                submitBtn.disabled = false;
                submitBtn.textContent = 'Update Note';
            }
        }
    }

    // Handle edit deck form submission
    async handleEditDeck(event, reloadFn) {
        const deckId = parseInt(document.getElementById('editDeckId').value);
        const name = document.getElementById('editDeckTitle').value.trim();
        const description = document.getElementById('editDeckDescription').value.trim();

        if (!name) {
            event.preventDefault();
            alert('Deck name cannot be empty');
            return;
        }

        // Use FormHandler if available, otherwise fall back to manual handling
        if (typeof FormHandler !== 'undefined') {
            await FormHandler.handleUpdate(
                event,
                () => this.api.updateDeck(deckId, name, description),
                reloadFn,
                () => this.closeModal('editDeckModal'),
                'Deck'
            );
        } else {
            // Fallback implementation
            event.preventDefault();
            const submitBtn = event.target.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Updating...';

            try {
                await this.api.updateDeck(deckId, name, description);
                this.closeModal('editDeckModal');
                await reloadFn();
                alert('✅ Deck updated successfully!');
            } catch (error) {
                console.error('Error updating deck:', error);
                alert('❌ Failed to update deck: ' + error.message);
                submitBtn.disabled = false;
                submitBtn.textContent = 'Update Deck';
            }
        }
    }

    // Delete note with confirmation
    async deleteNote(noteId, reloadFn) {
        if (!confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
            return;
        }

        try {
            await this.api.deleteNote(noteId);
            alert('✅ Note deleted successfully!');
            await reloadFn();
        } catch (error) {
            console.error('Error deleting note:', error);
            alert('❌ Failed to delete note: ' + error.message);
        }
    }

    // Delete deck with confirmation
    async deleteDeck(deckId, reloadFn) {
        if (!confirm('Are you sure you want to delete this deck and all its flashcards? This action cannot be undone.')) {
            return;
        }

        try {
            await this.api.deleteDeck(deckId);
            alert('✅ Deck deleted successfully!');
            await reloadFn();
        } catch (error) {
            console.error('Error deleting deck:', error);
            alert('❌ Failed to delete deck: ' + error.message);
        }
    }

    // Close modal
    // Close modal and reset form
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            // Reset form first before hiding
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
                
                // Reset submit button state
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    // Reset text based on modal type
                    if (modalId.includes('Note')) {
                        submitBtn.textContent = modalId.includes('edit') ? 'Update Note' : 'Create Note';
                    } else if (modalId.includes('Deck')) {
                        submitBtn.textContent = modalId.includes('edit') ? 'Update Deck' : 'Create Deck';
                    }
                }
            }
            
            // Remove active class to hide modal
            modal.classList.remove('active');
        }
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Escape backticks for template literals
    escapeBacktick(text) {
        return text.replace(/`/g, '\\`').replace(/\$/g, '\\$');
    }
}
