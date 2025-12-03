/**
 * Modal Manager
 * Centralized modal management for opening, closing, and handling modals
 * Fixes Electron-specific modal bugs with input locking
 */

class ModalManager {
    constructor() {
        this.activeModals = new Set();
    }

    /**
     * Open a modal by ID
     * @param {string} modalId - ID of the modal to open
     * @param {Object} options - Additional options
     */
    openModal(modalId, options = {}) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error(`Modal with ID "${modalId}" not found`);
            return;
        }

        // Close any currently open modals first
        this.closeAllModals();

        // Small delay to ensure cleanup completes
        setTimeout(() => {
            modal.classList.add('active');
            this.activeModals.add(modalId);

            // Force enable all inputs (fix Electron modal bug)
            this.enableModalInputs(modal);

            // Focus first input if requested
            if (options.focusFirst !== false) {
                setTimeout(() => {
                    const form = modal.querySelector('form');
                    const firstInput = form?.querySelector('input:not([type="hidden"]), select, textarea');
                    if (firstInput) {
                        firstInput.focus();
                    }
                }, 100);
            }

            // Call onOpen callback if provided
            if (options.onOpen) {
                options.onOpen(modal);
            }
        }, 50);
    }

    /**
     * Close a modal by ID
     * @param {string} modalId - ID of the modal to close
     */
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.classList.remove('active');
        this.activeModals.delete(modalId);

        // Reset form and button states
        const form = modal.querySelector('form');
        if (form) {
            form.reset();

            // Force re-enable all inputs for next use (fix Electron bug)
            setTimeout(() => {
                this.enableModalInputs(modal);

                // Reset submit button text
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    this.resetSubmitButtonText(submitBtn, modalId);
                }
            }, 50);
        }
    }

    /**
     * Close all open modals
     */
    closeAllModals() {
        document.querySelectorAll('.modal.active').forEach(modal => {
            this.closeModal(modal.id);
        });
    }

    /**
     * Enable all inputs in a modal (fixes Electron bug)
     * @param {HTMLElement} modal - Modal element
     */
    enableModalInputs(modal) {
        const form = modal.querySelector('form');
        if (!form) return;

        const inputs = form.querySelectorAll('input, textarea, select, button');
        inputs.forEach(input => {
            input.disabled = false;
            input.style.pointerEvents = 'auto';
            input.style.userSelect = 'text';
            input.removeAttribute('readonly');
        });
    }

    /**
     * Reset submit button text based on modal type
     * @param {HTMLElement} button - Submit button
     * @param {string} modalId - Modal ID
     */
    resetSubmitButtonText(button, modalId) {
        if (modalId.includes('Note')) {
            button.textContent = modalId.includes('edit') ? 'Update Note' : 'Create Note';
        } else if (modalId.includes('Deck')) {
            button.textContent = modalId.includes('edit') ? 'Update Deck' : 'Create Deck';
        } else if (modalId.includes('Event')) {
            button.textContent = modalId.includes('edit') ? 'Update Event' : 'Create Event';
        }
    }

    /**
     * Setup modal close on backdrop click
     * @param {string} modalId - Modal ID
     */
    setupBackdropClose(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modalId);
            }
        });
    }

    /**
     * Setup escape key to close modals
     */
    setupEscapeKey() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModals.size > 0) {
                const lastModal = Array.from(this.activeModals).pop();
                this.closeModal(lastModal);
            }
        });
    }

    /**
     * Open create modal based on current tab
     * @param {string} currentTab - Current active tab ('notes' or 'decks')
     */
    openCreateModalForTab(currentTab) {
        const modalId = currentTab === 'notes' ? 'createNoteModal' : 'createDeckModal';
        this.openModal(modalId);
    }

    /**
     * Populate edit modal with data
     * @param {string} type - Type of item ('note' or 'deck')
     * @param {Object} data - Data to populate
     */
    populateEditModal(type, data) {
        if (type === 'note') {
            document.getElementById('editNoteId').value = data.noteId;
            document.getElementById('editNoteTitle').value = data.title;
            document.getElementById('editNoteContent').value = data.content;
            this.openModal('editNoteModal');
        } else if (type === 'deck') {
            document.getElementById('editDeckId').value = data.deckId;
            document.getElementById('editDeckTitle').value = data.name || data.title;
            document.getElementById('editDeckDescription').value = data.description || '';
            this.openModal('editDeckModal');
        }
    }
}

// Create global instance
window.modalManager = new ModalManager();

// Setup escape key globally
modalManager.setupEscapeKey();
