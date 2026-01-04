/**
 * Gmail Service
 * Read and summarize emails
 */

const GmailService = {
    BASE_URL: 'https://www.googleapis.com/gmail/v1/users/me',

    /**
     * Get recent emails
     * @param {number} maxResults - Maximum emails to fetch
     * @param {string} query - Gmail search query (optional)
     */
    async getRecentEmails(maxResults = 10, query = '') {
        let url = `${this.BASE_URL}/messages?maxResults=${maxResults}`;
        if (query) {
            url += `&q=${encodeURIComponent(query)}`;
        }

        const response = await GoogleAuth.fetch(url);
        const data = await response.json();

        if (!data.messages) return [];

        // Fetch details for each message
        const emails = await Promise.all(
            data.messages.slice(0, maxResults).map(msg => this.getEmailById(msg.id))
        );

        return emails.filter(e => e !== null);
    },

    /**
     * Get unread emails
     */
    async getUnreadEmails(maxResults = 10) {
        return this.getRecentEmails(maxResults, 'is:unread');
    },

    /**
     * Get unread count
     */
    async getUnreadCount() {
        const url = `${this.BASE_URL}/messages?maxResults=1&q=is:unread`;
        const response = await GoogleAuth.fetch(url);
        const data = await response.json();
        return data.resultSizeEstimate || 0;
    },

    /**
     * Get email by ID with full details
     */
    async getEmailById(messageId) {
        try {
            const url = `${this.BASE_URL}/messages/${messageId}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`;
            const response = await GoogleAuth.fetch(url);
            const data = await response.json();

            const headers = data.payload?.headers || [];
            const getHeader = (name) => headers.find(h => h.name === name)?.value || '';

            return {
                id: data.id,
                threadId: data.threadId,
                snippet: data.snippet,
                from: this.parseFrom(getHeader('From')),
                subject: getHeader('Subject') || '(No Subject)',
                date: new Date(getHeader('Date')),
                isUnread: data.labelIds?.includes('UNREAD') || false
            };
        } catch (error) {
            console.error('Error fetching email:', error);
            return null;
        }
    },

    /**
     * Parse From header to get name/email
     */
    parseFrom(fromHeader) {
        const match = fromHeader.match(/^(.+?)\s*<(.+?)>$/);
        if (match) {
            return { name: match[1].replace(/"/g, ''), email: match[2] };
        }
        return { name: fromHeader, email: fromHeader };
    },

    /**
     * Get readable summary of recent emails
     */
    async getInboxSummary() {
        try {
            const unreadCount = await this.getUnreadCount();
            const recentEmails = await this.getRecentEmails(5);

            if (recentEmails.length === 0) {
                return "Your inbox is empty.";
            }

            let summary = `You have ${unreadCount} unread email${unreadCount !== 1 ? 's' : ''}.\n\n`;
            summary += "Recent emails:\n";

            recentEmails.forEach((email, i) => {
                const unread = email.isUnread ? '📩' : '📧';
                summary += `${unread} ${email.from.name}: ${email.subject}\n`;
            });

            return summary;
        } catch (error) {
            return `Unable to fetch emails: ${error.message}`;
        }
    },

    /**
     * Search emails
     */
    async searchEmails(query, maxResults = 5) {
        return this.getRecentEmails(maxResults, query);
    }
};

window.GmailService = GmailService;
