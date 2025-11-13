const API_BASE_URL = 'http://localhost:8080/api';

class PeerSphereAPI {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        if (options.body && typeof options.body === 'object') {
            config.body = JSON.stringify(options.body);
        }

        try {
            const response = await fetch(url, config);
            
            // Handle non-JSON responses
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || `HTTP error! status: ${response.status}`);
                }
                
                return data;
            } else {
                // Handle non-JSON response
                const text = await response.text();
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status} - ${text}`);
                }
                return text;
            }
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Health check endpoint
    async healthCheck() {
        return this.request('/health', {
            method: 'GET',
        });
    }

    // Auth endpoints
    async register(name, email, password) {
        return this.request('/auth/register', {
            method: 'POST',
            body: { name, email, password },
        });
    }

    async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: { email, password },
        });
    }

    // Group endpoints
    async createGroup(name, courseCode, creatorUserId) {
        return this.request('/groups', {
            method: 'POST',
            body: { name, courseCode, creatorUserId },
        });
    }

    async joinGroup(userId, groupCode) {
        return this.request(`/groups/join?userId=${userId}`, {
            method: 'POST',
            body: { groupCode },
        });
    }

    async getUserGroups(userId) {
        return this.request(`/groups/user/${userId}`, {
            method: 'GET',
        });
    }

    async getGroup(groupId) {
        return this.request(`/groups/${groupId}`, {
            method: 'GET',
        });
    }

    // Deck endpoints
    async createDeck(groupId, title, description, createdBy) {
        return this.request('/decks', {
            method: 'POST',
            body: { groupId, title, description, createdBy },
        });
    }

    async getDecksByGroup(groupId) {
        return this.request(`/decks/group/${groupId}`, {
            method: 'GET',
        });
    }

    async getDeck(deckId) {
        return this.request(`/decks/${deckId}`, {
            method: 'GET',
        });
    }

    async updateDeck(deckId, title, description) {
        return this.request(`/decks/${deckId}`, {
            method: 'PUT',
            body: { title, description },
        });
    }

    async deleteDeck(deckId) {
        return this.request(`/decks/${deckId}`, {
            method: 'DELETE',
        });
    }

    // Flashcard endpoints
    async createFlashcard(deckId, question, answer, createdBy) {
        return this.request('/flashcards', {
            method: 'POST',
            body: { deckId, question, answer, createdBy },
        });
    }

    async getFlashcardsByDeck(deckId) {
        return this.request(`/flashcards/deck/${deckId}`, {
            method: 'GET',
        });
    }

    async getFlashcard(cardId) {
        return this.request(`/flashcards/${cardId}`, {
            method: 'GET',
        });
    }

    async updateFlashcard(cardId, question, answer) {
        return this.request(`/flashcards/${cardId}`, {
            method: 'PUT',
            body: { question, answer },
        });
    }

    async deleteFlashcard(cardId) {
        return this.request(`/flashcards/${cardId}`, {
            method: 'DELETE',
        });
    }

    // Note endpoints
    async createNote(groupId, authorId, title, content) {
        return this.request('/notes', {
            method: 'POST',
            body: { groupId, authorId, title, content },
        });
    }

    async getNotesByGroup(groupId) {
        return this.request(`/notes/group/${groupId}`, {
            method: 'GET',
        });
    }

    async getNote(noteId) {
        return this.request(`/notes/${noteId}`, {
            method: 'GET',
        });
    }

    async updateNote(noteId, title, content) {
        return this.request(`/notes/${noteId}`, {
            method: 'PUT',
            body: { title, content },
        });
    }

    async deleteNote(noteId) {
        return this.request(`/notes/${noteId}`, {
            method: 'DELETE',
        });
    }

    // Message endpoints
    async sendMessage(groupId, authorId, content) {
        return this.request('/messages', {
            method: 'POST',
            body: { groupId, authorId, content },
        });
    }

    async getMessages(groupId, limit = 50) {
        return this.request(`/messages/group/${groupId}?limit=${limit}`, {
            method: 'GET',
        });
    }

    // Calendar endpoints
    async createEvent(groupId, title, description, startTime, endTime, createdBy) {
        return this.request('/calendar', {
            method: 'POST',
            body: { groupId, title, description, startTime, endTime, createdBy },
        });
    }

    async getEventsByGroup(groupId) {
        return this.request(`/calendar/group/${groupId}`, {
            method: 'GET',
        });
    }

    async getEvent(eventId) {
        return this.request(`/calendar/${eventId}`, {
            method: 'GET',
        });
    }

    async updateEvent(eventId, title, description, startTime, endTime) {
        return this.request(`/calendar/${eventId}`, {
            method: 'PUT',
            body: { title, description, startTime, endTime },
        });
    }

    async deleteEvent(eventId) {
        return this.request(`/calendar/${eventId}`, {
            method: 'DELETE',
        });
    }
}

// Export for use in frontend
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PeerSphereAPI;
} else {
    window.PeerSphereAPI = PeerSphereAPI;
}

