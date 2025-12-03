/**
 * Authentication Utilities
 * Provides common auth functions and checks
 */

class AuthUtils {
    /**
     * Initialize authentication check and return user data
     * Automatically redirects if not authenticated
     * @returns {Object} User data { userId, userName, userEmail }
     */
    static initializeAuth() {
        if (!SessionManager.requireAuth()) {
            // Will redirect if not authenticated
            return null;
        }

        return {
            userId: SessionManager.getUserId(),
            userName: SessionManager.getUserName(),
            userEmail: SessionManager.getUserEmail()
        };
    }

    /**
     * Check if user is authenticated
     * @returns {boolean} True if authenticated
     */
    static isAuthenticated() {
        return SessionManager.isAuthenticated();
    }

    /**
     * Get current user ID
     * @returns {number|null} User ID or null if not authenticated
     */
    static getUserId() {
        return SessionManager.getUserId();
    }

    /**
     * Get current user name
     * @returns {string|null} User name or null if not authenticated
     */
    static getUserName() {
        return SessionManager.getUserName();
    }

    /**
     * Get current user email
     * @returns {string|null} User email or null if not authenticated
     */
    static getUserEmail() {
        return SessionManager.getUserEmail();
    }

    /**
     * Logout and redirect to login page
     */
    static logout() {
        SessionManager.clearSession();
        location.href = '../index.html';
    }
}

// Make available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthUtils;
}
