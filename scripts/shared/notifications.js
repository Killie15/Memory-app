/**
 * Notification System
 * Handles app-wide notifications and reminders
 */

const Notifications = {
    permission: 'default',

    init() {
        if (!('Notification' in window)) {
            console.log('This browser does not support desktop notification');
            return;
        }

        // Check permission
        if (Notification.permission !== 'denied' && Notification.permission !== 'granted') {
            Notification.requestPermission().then(permission => {
                this.permission = permission;
            });
        } else {
            this.permission = Notification.permission;
        }
    },

    /**
     * Show a notification
     * @param {string} title - Notification title
     * @param {object} options - Notification options (body, icon, etc)
     */
    show(title, options = {}) {
        // Fallback to in-app toast if permission not granted
        if (this.permission !== 'granted') {
            if (window.App && App.showToast) {
                App.showToast(`${title}: ${options.body || ''}`);
            }
            return;
        }

        // Send native notification
        const notification = new Notification(title, {
            icon: 'assets/icon.png', // Placeholder
            badge: 'assets/badge.png', // Placeholder
            ...options
        });

        notification.onclick = () => {
            window.focus();
            notification.close();
        };
    },

    /**
     * Schedule a reminder (simple timeout for now)
     * @param {string} title 
     * @param {string} body 
     * @param {number} minutes 
     */
    scheduleReminder(title, body, minutes) {
        setTimeout(() => {
            this.show(title, { body });
        }, minutes * 60 * 1000);

        if (window.App && App.showToast) {
            App.showToast(`Reminder set for ${minutes} minutes! ⏱️`);
        }
    }
};

window.Notifications = Notifications;
