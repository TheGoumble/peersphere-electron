// UI Components Manager
class UIManager {
    constructor() {
        this.components = {};
    }

    // Show/hide components
    show(componentId) {
        const element = document.getElementById(componentId);
        if (element) {
            element.style.display = 'block';
            if (element.classList) element.classList.add('active');
        }
    }

    hide(componentId) {
        const element = document.getElementById(componentId);
        if (element) {
            element.style.display = 'none';
            if (element.classList) element.classList.remove('active');
        }
    }

    // Switch between tabs
    switchTab(tabName) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.form-container').forEach(f => f.classList.remove('active'));
        
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) activeTab.classList.add('active');
        
        const activeForm = document.getElementById(tabName + 'Form');
        if (activeForm) activeForm.classList.add('active');
    }

    // Show messages
    showMessage(text, type = 'info') {
        const messageBox = document.getElementById('messageBox');
        if (messageBox) {
            messageBox.textContent = text;
            messageBox.className = `message ${type} show`;
        }
    }

    hideMessage() {
        const messageBox = document.getElementById('messageBox');
        if (messageBox) {
            messageBox.className = 'message';
        }
    }

    // Update user info in dashboard
    updateUserInfo(user) {
        const elements = {
            userName: user.name,
            userEmail: user.email,
            userId: user.userId
        };

        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = elements[id];
        });
    }

    // Reset forms
    resetForms() {
        document.querySelectorAll('form').forEach(form => form.reset());
        document.querySelectorAll('button[type="submit"]').forEach(btn => {
            btn.disabled = false;
            btn.textContent = btn.dataset.originalText || btn.textContent;
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
} else {
    window.UIManager = UIManager;
}
