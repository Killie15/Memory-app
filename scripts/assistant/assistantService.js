/**
 * AI Personal Assistant Service
 * Powered by Google Gemini API with persistent memory
 */

const Assistant = {
    get API_KEY() { return window.CONFIG?.GEMINI_API_KEY || ''; },
    get MODEL() { return window.CONFIG?.GEMINI_MODEL || 'gemini-2.5-flash'; },
    BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models',

    conversationHistory: [],
    isProcessing: false,
    userMemories: [],

    // System prompt for ADHD-friendly assistant
    getSystemPrompt() {
        return `You are an ADHD-friendly personal assistant integrated into a memory and productivity app.

Your key traits:
- Be concise and direct (ADHD users lose focus with long responses)
- Use bullet points and clear structure
- Offer actionable next steps
- Be encouraging and supportive
- Remember important things the user tells you

You have access to these capabilities:
- Check today's calendar events
- Create calendar events/reminders
- Check emails and unread count
- Create and track tasks
- Remember important facts about the user
- Access journal entries

IMPORTANT: When the user tells you something important about themselves (preferences, facts, goals, struggles), 
add [REMEMBER: <what to remember>] at the end of your response so I can save it.

When the user asks you to create a task or reminder, add [TASK: <task title>] at the end.

Current date/time: ${new Date().toLocaleString()}`;
    },

    /**
     * Initialize assistant
     */
    async init() {
        this.conversationHistory = [];
        this.bindEvents();
        this.loadHistory();

        // Load user memories from database
        await this.loadUserMemories();
    },

    /**
     * Load user memories from database
     */
    async loadUserMemories() {
        try {
            if (window.MemoryStore) {
                const facts = await MemoryStore.getFacts();
                const preferences = await MemoryStore.getPreferences();
                this.userMemories = [...facts, ...preferences].slice(0, 20);
                console.log(`Loaded ${this.userMemories.length} memories for context`);
            }
        } catch (error) {
            console.warn('Could not load memories:', error);
        }
    },

    bindEvents() {
        const sendBtn = document.getElementById('btn-send-message');
        const input = document.getElementById('assistant-input');

        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }

        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
    },

    /**
     * Send message to Gemini and get response
     */
    async sendMessage() {
        const input = document.getElementById('assistant-input');
        if (!input || !input.value.trim() || this.isProcessing) return;

        const userMessage = input.value.trim();
        input.value = '';

        // Add user message to UI
        this.addMessageToUI('user', userMessage);
        this.isProcessing = true;
        this.showTypingIndicator();

        try {
            // Check for action keywords and gather context
            const context = await this.gatherContext(userMessage);

            // Build the conversation
            const contents = this.buildContents(userMessage, context);

            // Call Gemini API
            const response = await this.callGemini(contents);

            // Process response for actions (tasks, memories)
            const { displayResponse, actions } = this.parseResponseActions(response);

            // Execute actions
            await this.executeActions(actions);

            // Add to history
            this.conversationHistory.push(
                { role: 'user', content: userMessage },
                { role: 'assistant', content: displayResponse }
            );
            this.saveHistory();

            // Display response
            this.hideTypingIndicator();
            this.addMessageToUI('assistant', displayResponse);

        } catch (error) {
            console.error('Assistant error:', error);
            this.hideTypingIndicator();
            this.addMessageToUI('assistant', `Sorry, I encountered an error: ${error.message}`);
        }

        this.isProcessing = false;
    },

    /**
     * Parse response for action tags
     */
    parseResponseActions(response) {
        const actions = [];
        let displayResponse = response;

        // Extract [REMEMBER: ...] tags
        const rememberMatches = response.matchAll(/\[REMEMBER:\s*(.+?)\]/gi);
        for (const match of rememberMatches) {
            actions.push({ type: 'remember', content: match[1].trim() });
            displayResponse = displayResponse.replace(match[0], '');
        }

        // Extract [TASK: ...] tags
        const taskMatches = response.matchAll(/\[TASK:\s*(.+?)\]/gi);
        for (const match of taskMatches) {
            actions.push({ type: 'task', content: match[1].trim() });
            displayResponse = displayResponse.replace(match[0], '✅ Task created: ' + match[1].trim());
        }

        return { displayResponse: displayResponse.trim(), actions };
    },

    /**
     * Execute parsed actions
     */
    async executeActions(actions) {
        for (const action of actions) {
            try {
                if (action.type === 'remember' && window.MemoryStore) {
                    await MemoryStore.save('fact', action.content, 'chat', 7);
                    console.log('Saved memory:', action.content);
                } else if (action.type === 'task' && window.TaskStore) {
                    await TaskStore.create(action.content);
                    console.log('Created task:', action.content);
                }
            } catch (error) {
                console.warn('Action failed:', action, error);
            }
        }
    },

    /**
     * Gather context based on user message
     */
    async gatherContext(message) {
        const lower = message.toLowerCase();
        let context = '';

        try {
            // Always include user memories
            if (this.userMemories.length > 0) {
                context += '\n[WHAT YOU KNOW ABOUT THE USER]\n';
                this.userMemories.forEach(m => {
                    context += `• ${m.content}\n`;
                });
            }

            // Task context
            if (lower.includes('task') || lower.includes('todo') || lower.includes('do i need')) {
                if (window.TaskStore) {
                    const summary = await TaskStore.getSummary();
                    context += `\n[TASKS]\n${summary}\n`;
                }
            }

            // Journal context
            if (lower.includes('journal') || lower.includes('wrote') || lower.includes('feeling')) {
                if (window.JournalStore) {
                    const summary = await JournalStore.getSummary();
                    context += `\n[JOURNAL]\n${summary}\n`;
                }
            }

            // Calendar context
            if (lower.includes('calendar') || lower.includes('schedule') || lower.includes('event') ||
                lower.includes('today') || lower.includes('meeting') || lower.includes('appointment')) {
                if (window.GoogleAuth && GoogleAuth.isSignedIn && window.CalendarService) {
                    const summary = await CalendarService.getTodaySummary();
                    context += `\n[CALENDAR]\n${summary}\n`;
                }
            }

            // Email context
            if (lower.includes('email') || lower.includes('mail') || lower.includes('inbox') || lower.includes('unread')) {
                if (window.GoogleAuth && GoogleAuth.isSignedIn && window.GmailService) {
                    const summary = await GmailService.getInboxSummary();
                    context += `\n[EMAIL]\n${summary}\n`;
                }
            }
        } catch (error) {
            console.warn('Error gathering context:', error);
        }

        return context;
    },

    /**
     * Build contents array for Gemini API
     */
    buildContents(userMessage, context) {
        const systemWithContext = this.getSystemPrompt() +
            (context ? `\n\nContext:\n${context}` : '');

        const contents = [
            {
                role: 'user',
                parts: [{ text: systemWithContext + '\n\nUser: ' + userMessage }]
            }
        ];

        // Add conversation history (last 10 messages)
        const recentHistory = this.conversationHistory.slice(-10);
        recentHistory.forEach(msg => {
            contents.push({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            });
        });

        return contents;
    },

    /**
     * Call Gemini API
     */
    async callGemini(contents) {
        const apiKey = this.API_KEY;
        if (!apiKey) {
            console.error('No Gemini API key found');
            return 'I need to be configured with an API key to help you. Please check the setup.';
        }

        const url = `${this.BASE_URL}/${this.MODEL}:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: contents,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1024,
                    topP: 0.9
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Gemini API error:', data);
            throw new Error(data.error?.message || 'API request failed');
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
            console.error('No text in response:', data);
            return 'I received an empty response. Please try again.';
        }
        return text;
    },

    /**
     * UI Methods
     */
    addMessageToUI(role, content) {
        const messagesDiv = document.getElementById('assistant-messages');
        if (!messagesDiv) return;

        const messageEl = document.createElement('div');
        messageEl.className = `message message-${role}`;
        messageEl.innerHTML = `
            <div class="message-avatar">${role === 'user' ? '👤' : '🤖'}</div>
            <div class="message-content">${this.formatMessage(content)}</div>
        `;

        messagesDiv.appendChild(messageEl);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    },

    formatMessage(content) {
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .replace(/• /g, '• ');
    },

    showTypingIndicator() {
        const messagesDiv = document.getElementById('assistant-messages');
        if (!messagesDiv) return;

        const indicator = document.createElement('div');
        indicator.id = 'typing-indicator';
        indicator.className = 'message message-assistant';
        indicator.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content typing">
                <span></span><span></span><span></span>
            </div>
        `;
        messagesDiv.appendChild(indicator);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    },

    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    },

    /**
     * Persistence
     */
    saveHistory() {
        const toSave = this.conversationHistory.slice(-20);
        localStorage.setItem('assistant_history', JSON.stringify(toSave));
    },

    loadHistory() {
        const saved = localStorage.getItem('assistant_history');
        if (saved) {
            this.conversationHistory = JSON.parse(saved);
            this.conversationHistory.forEach(msg => {
                this.addMessageToUI(msg.role, msg.content);
            });
        }
    },

    /**
     * Quick action methods
     */
    async quickCalendarCheck() {
        if (!window.GoogleAuth?.isSignedIn) {
            return "Please sign in to Google first to access your calendar.";
        }
        return await CalendarService.getTodaySummary();
    },

    async quickEmailCheck() {
        if (!window.GoogleAuth?.isSignedIn) {
            return "Please sign in to Google first to access your email.";
        }
        return await GmailService.getInboxSummary();
    },

    async quickTaskCheck() {
        if (window.TaskStore) {
            return await TaskStore.getSummary();
        }
        return "Task store not available.";
    },

    clearHistory() {
        this.conversationHistory = [];
        localStorage.removeItem('assistant_history');
        const messagesDiv = document.getElementById('assistant-messages');
        if (messagesDiv) messagesDiv.innerHTML = '';
    }
};

window.Assistant = Assistant;
