/**
 * Modal Utilities
 * Provides reusable modal functionality
 */

class ModalUtils {
    /**
     * Get common modal CSS
     * @returns {string} CSS string for modals
     */
    static getModalCSS() {
        return `
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
            z-index: 2000;
            justify-content: center;
            align-items: center;
        }

        .modal.active {
            display: flex;
        }

        .modal-content {
            background: rgba(10, 14, 39, 0.95);
            backdrop-filter: blur(20px);
            border: 2px solid rgba(102, 126, 234, 0.5);
            border-radius: 25px;
            padding: 40px;
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 8px 40px rgba(102, 126, 234, 0.3);
            position: relative;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }

        .modal-header h2 {
            color: white;
            font-size: 1.8rem;
            margin: 0;
        }

        .close-btn {
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            padding: 0;
            width: 40px;
            height: 40px;
            line-height: 1;
            transition: all 0.3s;
        }

        .close-btn:hover {
            color: rgba(102, 126, 234, 1);
            transform: rotate(90deg);
        }

        .modal-actions {
            display: flex;
            gap: 15px;
            justify-content: flex-end;
            margin-top: 30px;
        }
        `;
    }

    /**
     * Open a modal by ID
     * @param {string} modalId - ID of the modal element
     */
    static open(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    }

    /**
     * Close a modal by ID
     * @param {string} modalId - ID of the modal element
     * @param {string} formId - Optional: ID of form to reset
     */
    static close(modalId, formId = null) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }

        if (formId) {
            const form = document.getElementById(formId);
            if (form) {
                form.reset();
            }
        }
    }

    /**
     * Create a confirmation modal
     * @param {string} title - Modal title
     * @param {string} message - Confirmation message
     * @param {Function} onConfirm - Callback when confirmed
     * @param {Function} onCancel - Optional callback when cancelled
     */
    static confirm(title, message, onConfirm, onCancel = null) {
        return new Promise((resolve) => {
            // Check if confirmation modal already exists
            let modal = document.getElementById('confirmModal');
            
            if (!modal) {
                // Create modal
                modal = document.createElement('div');
                modal.id = 'confirmModal';
                modal.className = 'modal';
                modal.innerHTML = `
                    <div class="modal-content" style="max-width: 400px;">
                        <div class="modal-header">
                            <h2 id="confirmTitle">${title}</h2>
                        </div>
                        <p id="confirmMessage" style="color: rgba(255, 255, 255, 0.8); margin-bottom: 30px; line-height: 1.6;">
                            ${message}
                        </p>
                        <div class="modal-actions">
                            <button type="button" class="btn-secondary" id="confirmCancel">Cancel</button>
                            <button type="button" class="btn-primary" id="confirmOk">Confirm</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);
            } else {
                // Update existing modal
                document.getElementById('confirmTitle').textContent = title;
                document.getElementById('confirmMessage').textContent = message;
            }

            // Set up event listeners
            const cancelBtn = document.getElementById('confirmCancel');
            const okBtn = document.getElementById('confirmOk');

            const handleCancel = () => {
                modal.classList.remove('active');
                if (onCancel) onCancel();
                resolve(false);
            };

            const handleConfirm = () => {
                modal.classList.remove('active');
                if (onConfirm) onConfirm();
                resolve(true);
            };

            cancelBtn.onclick = handleCancel;
            okBtn.onclick = handleConfirm;

            // Show modal
            modal.classList.add('active');

            // Close on background click
            modal.onclick = (e) => {
                if (e.target === modal) {
                    handleCancel();
                }
            };
        });
    }

    /**
     * Show an alert modal
     * @param {string} title - Alert title
     * @param {string} message - Alert message
     * @param {string} type - Alert type: 'success', 'error', 'warning', 'info'
     */
    static alert(title, message, type = 'info') {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        const icon = icons[type] || icons.info;

        return new Promise((resolve) => {
            let modal = document.getElementById('alertModal');
            
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'alertModal';
                modal.className = 'modal';
                modal.innerHTML = `
                    <div class="modal-content" style="max-width: 400px;">
                        <div class="modal-header">
                            <h2><span id="alertIcon">${icon}</span> <span id="alertTitle">${title}</span></h2>
                        </div>
                        <p id="alertMessage" style="color: rgba(255, 255, 255, 0.8); margin-bottom: 30px; line-height: 1.6;">
                            ${message}
                        </p>
                        <div class="modal-actions" style="justify-content: center;">
                            <button type="button" class="btn-primary" id="alertOk">OK</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);
            } else {
                document.getElementById('alertIcon').textContent = icon;
                document.getElementById('alertTitle').textContent = title;
                document.getElementById('alertMessage').textContent = message;
            }

            const okBtn = document.getElementById('alertOk');
            const handleClose = () => {
                modal.classList.remove('active');
                resolve();
            };

            okBtn.onclick = handleClose;
            modal.classList.add('active');

            modal.onclick = (e) => {
                if (e.target === modal) {
                    handleClose();
                }
            };
        });
    }
}

// Make available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModalUtils;
}
