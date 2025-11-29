// Authentication Manager
class AuthManager {
    constructor(api) {
        this.api = api;
        this.currentUser = null;
        this.loadUser();
    }

    loadUser() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
    }

    async login(email, password) {
        const response = await this.api.login(email, password);
        this.currentUser = {
            userId: response.userId,
            name: response.name,
            email: response.email
        };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        return this.currentUser;
    }

    async register(name, email, password) {
        const response = await this.api.register(name, email, password);
        this.currentUser = {
            userId: response.userId,
            name: name,
            email: email
        };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        return this.currentUser;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getUser() {
        return this.currentUser;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
} else {
    window.AuthManager = AuthManager;
}
