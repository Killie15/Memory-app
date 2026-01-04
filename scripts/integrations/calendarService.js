/**
 * Google Calendar Service
 * Read and write calendar events
 */

const CalendarService = {
    BASE_URL: 'https://www.googleapis.com/calendar/v3',

    /**
     * Get upcoming events for today and tomorrow
     * @param {number} maxResults - Maximum events to fetch
     */
    async getUpcomingEvents(maxResults = 10) {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 2);

        const timeMin = now.toISOString();
        const timeMax = tomorrow.toISOString();

        const url = `${this.BASE_URL}/calendars/primary/events?` + new URLSearchParams({
            maxResults: maxResults,
            orderBy: 'startTime',
            singleEvents: true,
            timeMin: timeMin,
            timeMax: timeMax
        });

        const response = await GoogleAuth.fetch(url);
        const data = await response.json();
        return data.items || [];
    },

    /**
     * Get events for a specific date range
     */
    async getEventsInRange(startDate, endDate, maxResults = 50) {
        const url = `${this.BASE_URL}/calendars/primary/events?` + new URLSearchParams({
            maxResults: maxResults,
            orderBy: 'startTime',
            singleEvents: true,
            timeMin: startDate.toISOString(),
            timeMax: endDate.toISOString()
        });

        const response = await GoogleAuth.fetch(url);
        const data = await response.json();
        return data.items || [];
    },

    /**
     * Create a new event
     */
    async createEvent(title, startDateTime, endDateTime, description = '') {
        const url = `${this.BASE_URL}/calendars/primary/events`;

        const event = {
            summary: title,
            description: description,
            start: {
                dateTime: startDateTime.toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            end: {
                dateTime: endDateTime.toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }
        };

        const response = await GoogleAuth.fetch(url, {
            method: 'POST',
            body: JSON.stringify(event)
        });

        return await response.json();
    },

    /**
     * Create a quick reminder (30 min event)
     */
    async quickReminder(title, minutesFromNow = 30) {
        const start = new Date();
        start.setMinutes(start.getMinutes() + minutesFromNow);

        const end = new Date(start);
        end.setMinutes(end.getMinutes() + 30);

        return this.createEvent(title, start, end, 'Created by ADHD Mastery Assistant');
    },

    /**
     * Format event for display
     */
    formatEvent(event) {
        const start = event.start.dateTime || event.start.date;
        const time = new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `${time} - ${event.summary}`;
    },

    /**
     * Get readable summary of today's events
     */
    async getTodaySummary() {
        try {
            const events = await this.getUpcomingEvents(10);
            if (events.length === 0) {
                return "You have no events scheduled for today.";
            }

            const today = new Date().toDateString();
            const todayEvents = events.filter(e => {
                const start = new Date(e.start.dateTime || e.start.date);
                return start.toDateString() === today;
            });

            if (todayEvents.length === 0) {
                return "You have no more events today.";
            }

            const list = todayEvents.map(e => this.formatEvent(e)).join('\n');
            return `Today's schedule (${todayEvents.length} events):\n${list}`;
        } catch (error) {
            return `Unable to fetch calendar: ${error.message}`;
        }
    }
};

window.CalendarService = CalendarService;
