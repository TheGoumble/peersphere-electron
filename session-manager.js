// Session Manager - handles user session across pages
class SessionManager {
    static SESSION_KEY = 'peersphere_session';

    static saveSession(user) {
        const session = {
            userId: user.userId,
            name: user.name,
            email: user.email,
            loginTime: new Date().toISOString()
        };
        sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    }

    static getSession() {
        const sessionData = sessionStorage.getItem(this.SESSION_KEY);
        return sessionData ? JSON.parse(sessionData) : null;
    }

    static clearSession() {
        sessionStorage.removeItem(this.SESSION_KEY);
        localStorage.removeItem('currentUser'); // Clear old storage too
    }

    static isAuthenticated() {
        return this.getSession() !== null;
    }

    static requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = '../index.html';
            return false;
        }
        return true;
    }

    static getUserId() {
        const session = this.getSession();
        return session ? session.userId : null;
    }

    static getUserName() {
        const session = this.getSession();
        return session ? session.name : null;
    }

    static getUserEmail() {
        const session = this.getSession();
        return session ? session.email : null;
    }
}

// Export for use across pages
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SessionManager;
} else {
    window.SessionManager = SessionManager;
}
