/**
 * Tab Manager
 * Handles tab switching functionality across pages
 */

class TabManager {
    constructor(options = {}) {
        this.currentTab = options.defaultTab || 'notes';
        this.tabContentIds = {
            notes: 'notesTab',
            decks: 'decksTab',
            ...options.customTabs
        };
        this.onTabChange = options.onTabChange || null;
    }

    /**
     * Switch to a different tab
     * @param {string} tabName - Name of tab to switch to
     * @param {Event} event - Optional click event
     */
    switchTab(tabName, event = null) {
        this.currentTab = tabName;

        // Update tab buttons
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });

        if (event) {
            event.target.classList.add('active');
        } else {
            // Find and activate the matching tab button
            const tabButton = document.querySelector(`.tab[onclick*="${tabName}"]`);
            if (tabButton) {
                tabButton.classList.add('active');
            }
        }

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        const targetContentId = this.tabContentIds[tabName];
        if (targetContentId) {
            const targetContent = document.getElementById(targetContentId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        }

        // Call callback if provided
        if (this.onTabChange) {
            this.onTabChange(tabName);
        }
    }

    /**
     * Get current active tab
     * @returns {string} Current tab name
     */
    getCurrentTab() {
        return this.currentTab;
    }

    /**
     * Initialize tab from URL parameter
     * @param {string} paramName - URL parameter name (default: 'tab')
     */
    initFromURL(paramName = 'tab') {
        const urlParams = new URLSearchParams(window.location.search);
        const tabFromURL = urlParams.get(paramName);
        
        if (tabFromURL && this.tabContentIds[tabFromURL]) {
            this.switchTab(tabFromURL);
        }
    }

    /**
     * Add a custom tab mapping
     * @param {string} tabName - Tab name
     * @param {string} contentId - Content div ID
     */
    addTab(tabName, contentId) {
        this.tabContentIds[tabName] = contentId;
    }
}
