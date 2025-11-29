// Main Application Controller
class App {
    constructor() {
        this.api = new PeerSphereAPI();
        this.auth = new AuthManager(this.api);
        this.ui = new UIManager();
        
        this.init();
    }

    init() {
        // Check if user is already logged in
        if (this.auth.isAuthenticated()) {
            this.showDashboard();
        }

        // Bind event listeners
        this.bindEvents();
    }

    bindEvents() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
    }

    async handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const btn = document.getElementById('loginBtn');
        
        btn.disabled = true;
        btn.textContent = 'Logging in...';
        this.ui.hideMessage();
        
        try {
            await this.auth.login(email, password);
            this.ui.showMessage('Login successful! Welcome back!', 'success');
            setTimeout(() => this.showDashboard(), 1000);
        } catch (error) {
            this.ui.showMessage('Login failed: ' + error.message, 'error');
            btn.disabled = false;
            btn.textContent = 'Login';
        }
    }

    async handleRegister(event) {
        event.preventDefault();
        
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const btn = document.getElementById('registerBtn');
        
        btn.disabled = true;
        btn.textContent = 'Creating account...';
        this.ui.hideMessage();
        
        try {
            await this.auth.register(name, email, password);
            this.ui.showMessage('Account created successfully! Welcome!', 'success');
            setTimeout(() => this.showDashboard(), 1000);
        } catch (error) {
            this.ui.showMessage('Registration failed: ' + error.message, 'error');
            btn.disabled = false;
            btn.textContent = 'Create Account';
        }
    }

    showDashboard() {
        this.ui.hide('authContent');
        this.ui.show('dashboard');
        this.ui.updateUserInfo(this.auth.getUser());
    }

    handleLogout() {
        this.auth.logout();
        this.ui.resetForms();
        this.ui.hide('dashboard');
        this.ui.show('authContent');
        this.ui.hideMessage();
    }

    switchTab(tabName) {
        this.ui.switchTab(tabName);
        this.ui.hideMessage();
    }
}

// Initialize app when DOM is ready
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
} else {
    window.App = App;
}
