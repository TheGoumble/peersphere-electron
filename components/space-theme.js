/**
 * Reusable Space Theme Components
 * Provides CSS and JS utilities for consistent space-themed UI
 */

class SpaceTheme {
    /**
     * Generate stars background animation
     * @param {string} containerId - ID of the container element
     * @param {number} starCount - Number of stars to generate (default: 200)
     */
    static generateStars(containerId = 'stars', starCount = 200) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Star container with id "${containerId}" not found`);
            return;
        }

        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.width = Math.random() * 3 + 'px';
            star.style.height = star.style.width;
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 3 + 's';
            container.appendChild(star);
        }
    }

    /**
     * Get the common CSS for space theme
     * @returns {string} CSS string
     */
    static getCommonCSS() {
        return `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: #0a0e27;
            min-height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            overflow-x: hidden;
            position: relative;
            color: white;
        }

        .stars {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        }

        .star {
            position: absolute;
            background: white;
            border-radius: 50%;
            animation: twinkle 3s infinite;
        }

        @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }

        .back-btn {
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            width: 60px;
            height: 60px;
            font-size: 1.8rem;
            cursor: pointer;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            transition: all 0.3s;
            z-index: 1000;
            color: white;
        }

        .back-btn:hover {
            transform: scale(1.1);
            background: rgba(255, 255, 255, 0.2);
            box-shadow: 0 12px 40px rgba(102, 126, 234, 0.5);
        }

        .container {
            position: relative;
            max-width: 1200px;
            margin: 0 auto;
            padding: 100px 20px 40px 20px;
            z-index: 1;
            min-height: 100vh;
        }

        .glass-container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        h1 {
            color: white;
            text-align: center;
            margin-bottom: 40px;
            font-size: 2.5rem;
            text-shadow: 0 4px 12px rgba(102, 126, 234, 0.5);
        }

        button {
            padding: 12px 24px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: bold;
            transition: all 0.3s;
        }

        .btn-primary {
            background: rgba(102, 126, 234, 0.8);
            color: white;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .btn-primary:hover {
            background: rgba(102, 126, 234, 1);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }

        .btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .form-group {
            margin-bottom: 25px;
        }

        .form-group label {
            display: block;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 8px;
            font-weight: bold;
            font-size: 1rem;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 12px;
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 10px;
            color: white;
            font-size: 1rem;
            font-family: inherit;
            transition: all 0.3s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: rgba(102, 126, 234, 1);
            background: rgba(255, 255, 255, 0.15);
            box-shadow: 0 0 15px rgba(102, 126, 234, 0.3);
        }

        .form-group textarea {
            min-height: 150px;
            resize: vertical;
        }

        .form-group select option {
            background: #0a0e27;
            color: white;
        }

        input::placeholder,
        textarea::placeholder {
            color: rgba(255, 255, 255, 0.5);
        }

        .loading {
            text-align: center;
            padding: 60px;
            color: white;
            font-size: 1.2rem;
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: white;
        }

        .empty-state h2 {
            margin-bottom: 20px;
            font-size: 2rem;
        }
        `;
    }

    /**
     * Initialize space theme on a page
     * @param {Object} options - Configuration options
     * @param {string} options.starsContainerId - ID for stars container (default: 'stars')
     * @param {number} options.starCount - Number of stars (default: 200)
     * @param {boolean} options.addStarsContainer - Whether to add stars container to body (default: true)
     * @param {boolean} options.addBackButton - Whether to add back button (default: false)
     * @param {string} options.backButtonHref - Back button destination (default: 'homePage.html')
     */
    static initialize(options = {}) {
        const {
            starsContainerId = 'stars',
            starCount = 200,
            addStarsContainer = true,
            addBackButton = false,
            backButtonHref = 'homePage.html'
        } = options;

        // Add stars container if needed
        if (addStarsContainer && !document.getElementById(starsContainerId)) {
            const starsDiv = document.createElement('div');
            starsDiv.className = 'stars';
            starsDiv.id = starsContainerId;
            document.body.insertBefore(starsDiv, document.body.firstChild);
        }

        // Generate stars
        this.generateStars(starsContainerId, starCount);

        // Add back button if needed
        if (addBackButton && !document.querySelector('.back-btn')) {
            const backBtn = document.createElement('button');
            backBtn.className = 'back-btn';
            backBtn.innerHTML = '←';
            backBtn.title = 'Back';
            backBtn.onclick = () => location.href = backButtonHref;
            document.body.appendChild(backBtn);
        }
    }
}

// Make available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpaceTheme;
}
