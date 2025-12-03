/**
 * PeerSphere Space Theme Initializer
 * Auto-initializes stars, auth, and common functionality
 * Usage: Just include this script, everything is automatic
 */

(function() {
    'use strict';

    // Generate stars on page load
    function generateStars(count = 200) {
        const starsContainer = document.getElementById('stars');
        if (!starsContainer) {
            console.warn('Stars container not found');
            return;
        }

        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.width = Math.random() * 3 + 'px';
            star.style.height = star.style.width;
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 3 + 's';
            starsContainer.appendChild(star);
        }
    }

    // Auto-initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            generateStars();
        });
    } else {
        generateStars();
    }

    // Make functions globally available
    window.PeerSphereTheme = {
        generateStars: generateStars
    };
})();
