/**
 * Page Utilities
 * Common utilities used across multiple pages
 */

class PageUtils {
    /**
     * Initialize page with common setup
     * @param {Object} options - Configuration options
     * @returns {Object} Initialized resources
     */
    static initializePage(options = {}) {
        const {
            requireAuth = true,
            requireGroupId = false,
            redirectOnMissingGroup = 'mySpheres.html'
        } = options;

        const api = new PeerSphereAPI();
        
        // Check authentication
        if (requireAuth && !SessionManager.requireAuth()) {
            return null; // Will redirect if not authenticated
        }

        const userId = SessionManager.getUserId();
        const userName = SessionManager.getUserName();
        const userEmail = SessionManager.getUserEmail();

        // Handle group ID from URL if required
        let groupId = null;
        if (requireGroupId) {
            const urlParams = new URLSearchParams(window.location.search);
            groupId = parseInt(urlParams.get('groupId'));
            
            if (!groupId) {
                alert('No sphere selected');
                location.href = redirectOnMissingGroup;
                return null;
            }
        }

        return {
            api,
            userId,
            userName,
            userEmail,
            groupId
        };
    }

    /**
     * Get group ID from URL parameters
     * @returns {number|null} Group ID or null
     */
    static getGroupIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const groupId = urlParams.get('groupId');
        return groupId ? parseInt(groupId) : null;
    }

    /**
     * Get tab parameter from URL
     * @returns {string|null} Tab name or null
     */
    static getTabFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('tab');
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped HTML
     */
    static escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Navigate back with optional groupId
     * @param {string} page - Page to navigate to
     * @param {number} groupId - Optional group ID
     */
    static navigateTo(page, groupId = null) {
        if (groupId) {
            location.href = `${page}?groupId=${groupId}`;
        } else {
            location.href = page;
        }
    }

    /**
     * Show loading state
     * @param {HTMLElement} element - Element to show loading in
     * @param {string} message - Loading message
     */
    static showLoading(element, message = 'Loading...') {
        element.innerHTML = `<div class="loading-spinner">${message}</div>`;
    }

    /**
     * Show error state
     * @param {HTMLElement} element - Element to show error in
     * @param {string} message - Error message
     * @param {Function} retryFn - Optional retry function
     */
    static showError(element, message, retryFn = null) {
        element.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <p style="color: #ff6b6b;">${this.escapeHtml(message)}</p>
                ${retryFn ? '<button onclick="' + retryFn.name + '()" class="btn-primary">Try Again</button>' : ''}
            </div>
        `;
    }

    /**
     * Show empty state
     * @param {HTMLElement} element - Element to show empty state in
     * @param {string} icon - Emoji icon
     * @param {string} title - Title text
     * @param {string} message - Message text
     * @param {Object} action - Optional action button {text, onClick}
     */
    static showEmptyState(element, icon, title, message, action = null) {
        element.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">${icon}</div>
                <h2>${title}</h2>
                <p>${message}</p>
                ${action ? `<button onclick="${action.onClick}" class="btn-primary" style="margin-top: 15px;">${action.text}</button>` : ''}
            </div>
        `;
    }

    /**
     * Copy text to clipboard with visual feedback
     * @param {string} text - Text to copy
     * @param {HTMLElement} button - Button element for feedback
     * @param {string} successText - Success message
     */
    static async copyToClipboard(text, button = null, successText = '✓ Copied!') {
        try {
            await navigator.clipboard.writeText(text);
            
            if (button) {
                const originalText = button.innerHTML;
                const originalBg = button.style.background;
                button.innerHTML = successText;
                button.style.background = 'rgba(40, 167, 69, 0.8)';
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.background = originalBg;
                }, 2000);
            }
            
            return true;
        } catch (err) {
            console.error('Failed to copy:', err);
            return false;
        }
    }

    /**
     * Format date for display
     * @param {string|Date} date - Date to format
     * @param {Object} options - Intl.DateTimeFormat options
     * @returns {string} Formatted date
     */
    static formatDate(date, options = { month: 'short', day: 'numeric', year: 'numeric' }) {
        return new Date(date).toLocaleDateString('en-US', options);
    }

    /**
     * Get user's initial for avatar
     * @param {string} name - User name
     * @returns {string} First letter uppercase
     */
    static getUserInitial(name) {
        return name ? name.charAt(0).toUpperCase() : '?';
    }

    /**
     * Confirm action with custom message
     * @param {string} title - Confirmation title
     * @param {string} message - Confirmation message
     * @param {string} confirmText - Confirm button text
     * @returns {boolean} User confirmation
     */
    static confirm(title, message, confirmText = 'Yes') {
        return confirm(`${title}\n\n${message}`);
    }

    /**
     * Confirm dangerous action with double confirmation
     * @param {string} itemName - Name of item being deleted
     * @param {Array} dataList - List of data that will be deleted
     * @returns {boolean} User confirmation
     */
    static confirmDelete(itemName, dataList = []) {
        const dataText = dataList.length > 0 
            ? '\n\nThis will permanently delete:\n' + dataList.map(d => `• ${d}`).join('\n')
            : '';
        
        if (!confirm(`⚠️ DELETE: "${itemName}"${dataText}\n\nThis action CANNOT be undone!\n\nAre you sure?`)) {
            return false;
        }

        return confirm('⚠️ FINAL WARNING\n\nThis is your last chance.\n\nAre you ABSOLUTELY SURE?');
    }

    /**
     * Debounce function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
    static debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Show success message
     * @param {string} message - Success message
     * @param {number} duration - Duration in ms
     */
    static showSuccess(message, duration = 3000) {
        const div = document.createElement('div');
        div.className = 'toast-message success';
        div.textContent = message;
        div.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(40, 167, 69, 0.9);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(div);
        
        setTimeout(() => {
            div.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => div.remove(), 300);
        }, duration);
    }

    /**
     * Show error message
     * @param {string} message - Error message
     * @param {number} duration - Duration in ms
     */
    static showErrorMessage(message, duration = 3000) {
        const div = document.createElement('div');
        div.className = 'toast-message error';
        div.textContent = message;
        div.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(220, 53, 69, 0.9);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(div);
        
        setTimeout(() => {
            div.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => div.remove(), 300);
        }, duration);
    }
}
