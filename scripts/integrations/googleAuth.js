/**
 * Google Authentication Service
 * Handles OAuth2 authentication with Google APIs
 */

const GoogleAuth = {
    // Using Google Identity Services (GIS) - modern approach
    CLIENT_ID: null, // Will be set from config
    SCOPES: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/gmail.readonly'
    ].join(' '),

    tokenClient: null,
    accessToken: null,
    isSignedIn: false,

    /**
     * Initialize Google Auth
     * @param {string} clientId - Google OAuth Client ID
     */
    init(clientId) {
        this.CLIENT_ID = clientId;

        // Load Google Identity Services script
        return new Promise((resolve, reject) => {
            if (window.google && window.google.accounts) {
                this.setupTokenClient();
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = () => {
                this.setupTokenClient();
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    },

    setupTokenClient() {
        if (!this.CLIENT_ID) {
            console.warn('Google Auth: No Client ID configured');
            return;
        }

        this.tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: this.CLIENT_ID,
            scope: this.SCOPES,
            callback: (response) => {
                if (response.error) {
                    console.error('Auth error:', response);
                    return;
                }
                this.accessToken = response.access_token;
                this.isSignedIn = true;
                localStorage.setItem('google_access_token', this.accessToken);
                this.onSignInChange(true);
            }
        });

        // Check for existing token
        const savedToken = localStorage.getItem('google_access_token');
        if (savedToken) {
            this.accessToken = savedToken;
            this.isSignedIn = true;
            this.onSignInChange(true);
        }
    },

    /**
     * Request sign in
     */
    signIn() {
        if (!this.tokenClient) {
            console.error('Token client not initialized');
            return;
        }

        if (this.accessToken) {
            // Token exists, request with prompt
            this.tokenClient.requestAccessToken({ prompt: '' });
        } else {
            // First time, show consent screen
            this.tokenClient.requestAccessToken({ prompt: 'consent' });
        }
    },

    /**
     * Sign out
     */
    signOut() {
        if (this.accessToken) {
            google.accounts.oauth2.revoke(this.accessToken);
        }
        this.accessToken = null;
        this.isSignedIn = false;
        localStorage.removeItem('google_access_token');
        this.onSignInChange(false);
    },

    /**
     * Get current access token
     */
    getToken() {
        return this.accessToken;
    },

    /**
     * Callback when sign in state changes
     * Override this in your app
     */
    onSignInChange(isSignedIn) {
        console.log('Google sign-in state:', isSignedIn);
        // Update UI
        const signInBtn = document.getElementById('btn-google-signin');
        const signOutBtn = document.getElementById('btn-google-signout');
        const statusEl = document.getElementById('google-status');

        if (signInBtn) signInBtn.style.display = isSignedIn ? 'none' : 'block';
        if (signOutBtn) signOutBtn.style.display = isSignedIn ? 'block' : 'none';
        if (statusEl) statusEl.textContent = isSignedIn ? '✓ Connected to Google' : 'Not connected';
    },

    /**
     * Make authenticated API request
     */
    async fetch(url, options = {}) {
        if (!this.accessToken) {
            throw new Error('Not signed in to Google');
        }

        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401) {
            // Token expired, try to refresh
            this.accessToken = null;
            localStorage.removeItem('google_access_token');
            this.signIn();
            throw new Error('Token expired, please sign in again');
        }

        return response;
    }
};

window.GoogleAuth = GoogleAuth;
