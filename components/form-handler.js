/**
 * Form Handler Component
 * Provides unified form submission handling with loading states, error handling, and auto-reset
 */

class FormHandler {
    /**
     * Handle form submission with standardized flow
     * @param {Event} event - Form submit event
     * @param {Function} apiCall - Async function that makes the API call
     * @param {Function} onSuccess - Async function to call on success (e.g., reload data)
     * @param {Object} options - Configuration options
     * @param {string} options.loadingText - Text to show while loading (default: 'Processing...')
     * @param {string} options.successText - Text to show in success alert (default: '✅ Success!')
     * @param {string} options.errorPrefix - Prefix for error messages (default: '❌ ')
     * @param {boolean} options.resetForm - Whether to reset form on success (default: true)
     * @param {Array<string>} options.preserveFields - Field IDs to preserve values after reset (e.g., ['groupId'])
     * @param {boolean} options.focusFirst - Whether to focus first input after success (default: true)
     * @param {boolean} options.showSuccessAlert - Whether to show success alert (default: true)
     * @param {Function} options.onError - Optional custom error handler
     * @param {Function} options.beforeSubmit - Optional function to call before submission
     * @param {Function} options.afterSubmit - Optional function to call after submission (success or error)
     * @returns {Promise<boolean>} - Returns true if successful, false if error
     */
    static async handleSubmit(event, apiCall, onSuccess, options = {}) {
        event.preventDefault();
        
        const {
            loadingText = 'Processing...',
            successText = '✅ Success!',
            errorPrefix = '❌ ',
            resetForm = true,
            preserveFields = [],
            focusFirst = true,
            showSuccessAlert = true,
            onError = null,
            beforeSubmit = null,
            afterSubmit = null
        } = options;

        const form = event.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        
        if (!submitBtn) {
            console.error('Submit button not found in form');
            return false;
        }

        const originalText = submitBtn.textContent;
        const originalDisabledState = submitBtn.disabled;
        
        // Save values of fields to preserve
        const preservedValues = {};
        if (resetForm && preserveFields.length > 0) {
            preserveFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    preservedValues[fieldId] = field.value;
                }
            });
        }
        
        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = loadingText;
        
        try {
            // Call optional beforeSubmit hook
            if (beforeSubmit) {
                await beforeSubmit(form);
            }

            // Make API call
            await apiCall();
            
            // Call success callback
            if (onSuccess) {
                await onSuccess();
            }
            
            // Show success message
            if (showSuccessAlert) {
                alert(successText);
            }
            
            // Reset form if requested
            if (resetForm) {
                form.reset();
                
                // Restore preserved field values
                if (preserveFields.length > 0) {
                    preserveFields.forEach(fieldId => {
                        const field = document.getElementById(fieldId);
                        if (field && preservedValues[fieldId] !== undefined) {
                            field.value = preservedValues[fieldId];
                        }
                    });
                }
            }
            
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            
            // Focus first input if requested
            if (focusFirst) {
                const firstInput = form.querySelector('input:not([type="hidden"]), select, textarea');
                if (firstInput) {
                    setTimeout(() => firstInput.focus(), 100);
                }
            }
            
            // Call optional afterSubmit hook
            if (afterSubmit) {
                await afterSubmit(form, true);
            }
            
            return true;
            
        } catch (error) {
            console.error('Form submission error:', error);
            
            // Custom error handler or default alert
            if (onError) {
                onError(error, form);
            } else {
                const errorMessage = error.message || error.toString();
                alert(`${errorPrefix}${errorMessage}`);
            }
            
            // Re-enable button and restore original text
            submitBtn.disabled = originalDisabledState;
            submitBtn.textContent = originalText;
            
            // Call optional afterSubmit hook
            if (afterSubmit) {
                await afterSubmit(form, false, error);
            }
            
            return false;
        }
    }

    /**
     * Simplified wrapper for create operations
     * @param {Event} event - Form submit event
     * @param {Function} apiCall - API call function
     * @param {Function} reloadData - Function to reload data after creation
     * @param {string} itemName - Name of item being created (e.g., 'Note', 'Deck')
     * @param {Array<string>} preserveFields - Field IDs to preserve after reset (e.g., ['noteGroup', 'deckGroup'])
     * @returns {Promise<boolean>}
     */
    static async handleCreate(event, apiCall, reloadData, itemName = 'Item', preserveFields = [], closeModal = null) {
        return this.handleSubmit(event, apiCall, reloadData, {
            loadingText: `Creating ${itemName}...`,
            successText: `✅ ${itemName} created successfully!`,
            errorPrefix: `❌ Failed to create ${itemName}: `,
            resetForm: true,
            preserveFields: preserveFields,
            focusFirst: true,
            showSuccessAlert: false,
            afterSubmit: async (form, success) => {
                if (success && closeModal) {
                    closeModal();
                }
            }
        });
    }

    /**
     * Simplified wrapper for update operations
     * @param {Event} event - Form submit event
     * @param {Function} apiCall - API call function
     * @param {Function} reloadData - Function to reload data after update
     * @param {Function} closeModal - Function to close the modal
     * @param {string} itemName - Name of item being updated (e.g., 'Note', 'Deck')
     * @returns {Promise<boolean>}
     */
    static async handleUpdate(event, apiCall, reloadData, closeModal, itemName = 'Item') {
        return this.handleSubmit(event, apiCall, async () => {
            if (closeModal) closeModal();
            if (reloadData) await reloadData();
        }, {
            loadingText: `Updating ${itemName}...`,
            successText: `✅ ${itemName} updated successfully!`,
            errorPrefix: `❌ Failed to update ${itemName}: `,
            resetForm: false,
            focusFirst: false
        });
    }

    /**
     * Disable all inputs in a form
     * @param {HTMLFormElement} form - The form element
     */
    static disableForm(form) {
        const inputs = form.querySelectorAll('input, select, textarea, button');
        inputs.forEach(input => input.disabled = true);
    }

    /**
     * Enable all inputs in a form
     * @param {HTMLFormElement} form - The form element
     */
    static enableForm(form) {
        const inputs = form.querySelectorAll('input, select, textarea, button');
        inputs.forEach(input => input.disabled = false);
    }

    /**
     * Get form data as an object
     * @param {HTMLFormElement} form - The form element
     * @returns {Object} - Form data as key-value pairs
     */
    static getFormData(form) {
        const formData = new FormData(form);
        const data = {};
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        return data;
    }

    /**
     * Validate form and show errors
     * @param {HTMLFormElement} form - The form element
     * @param {Object} rules - Validation rules
     * @returns {Object} - {valid: boolean, errors: Array}
     */
    static validate(form, rules = {}) {
        const errors = [];
        
        for (const [fieldName, rule] of Object.entries(rules)) {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (!field) continue;
            
            const value = field.value.trim();
            
            if (rule.required && !value) {
                errors.push(`${rule.label || fieldName} is required`);
            }
            
            if (rule.minLength && value.length < rule.minLength) {
                errors.push(`${rule.label || fieldName} must be at least ${rule.minLength} characters`);
            }
            
            if (rule.maxLength && value.length > rule.maxLength) {
                errors.push(`${rule.label || fieldName} must be less than ${rule.maxLength} characters`);
            }
            
            if (rule.pattern && !rule.pattern.test(value)) {
                errors.push(rule.patternMessage || `${rule.label || fieldName} format is invalid`);
            }
            
            if (rule.custom && !rule.custom(value, form)) {
                errors.push(rule.customMessage || `${rule.label || fieldName} is invalid`);
            }
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Show validation errors in form
     * @param {HTMLFormElement} form - The form element
     * @param {Array} errors - Array of error messages
     */
    static showErrors(form, errors) {
        // Remove existing error messages
        const existingErrors = form.querySelectorAll('.form-error');
        existingErrors.forEach(el => el.remove());
        
        if (errors.length === 0) return;
        
        // Create error container
        const errorContainer = document.createElement('div');
        errorContainer.className = 'form-error';
        errorContainer.style.cssText = `
            background: rgba(220, 53, 69, 0.1);
            border: 1px solid rgba(220, 53, 69, 0.5);
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 15px;
            color: #ff6b6b;
        `;
        
        const errorList = document.createElement('ul');
        errorList.style.cssText = 'margin: 0; padding-left: 20px;';
        
        errors.forEach(error => {
            const li = document.createElement('li');
            li.textContent = error;
            errorList.appendChild(li);
        });
        
        errorContainer.appendChild(errorList);
        form.insertBefore(errorContainer, form.firstChild);
    }
}

// Make it globally available
if (typeof window !== 'undefined') {
    window.FormHandler = FormHandler;
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormHandler;
}
