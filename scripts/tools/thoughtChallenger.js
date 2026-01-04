/**
 * Thought Challenger Tool
 * CBT-based cognitive restructuring for ADHD
 */

const ThoughtChallenger = {
    // Common ADHD thought traps and their patterns
    thoughtTraps: {
        'all-or-nothing': {
            name: 'All-or-Nothing Thinking',
            keywords: ['always', 'never', 'completely', 'totally', 'everything', 'nothing', 'perfect'],
            description: 'Seeing things in black-and-white categories',
            challenge: 'Are there any shades of gray here? Any exceptions?'
        },
        'overgeneralization': {
            name: 'Overgeneralization',
            keywords: ['always', 'never', 'everyone', 'no one', 'every time'],
            description: 'Using one event as evidence for a general pattern',
            challenge: 'Is this really true EVERY time? What are the exceptions?'
        },
        'mind-reading': {
            name: 'Mind Reading',
            keywords: ['they think', 'everyone thinks', 'they know', 'people see me as'],
            description: 'Assuming you know what others are thinking',
            challenge: 'Do you have actual evidence of what they think?'
        },
        'catastrophizing': {
            name: 'Catastrophizing',
            keywords: ['disaster', 'terrible', 'horrible', 'ruin', 'worst', 'end of', 'never recover'],
            description: 'Expecting the worst possible outcome',
            challenge: 'What is the MOST LIKELY outcome? How bad would it really be?'
        },
        'should-statements': {
            name: 'Should Statements',
            keywords: ['should', 'must', 'have to', 'ought to', 'supposed to'],
            description: 'Rigid rules about how things should be',
            challenge: 'Says who? Is this a rule or a preference?'
        },
        'labeling': {
            name: 'Labeling',
            keywords: ['i am', 'i\'m such a', 'i\'m just', 'i\'m so', 'i\'m a'],
            description: 'Attaching a negative label to yourself',
            challenge: 'Would you label a friend this way for the same thing?'
        },
        'emotional-reasoning': {
            name: 'Emotional Reasoning',
            keywords: ['i feel like', 'i feel that', 'feels like'],
            description: 'Assuming feelings reflect reality',
            challenge: 'Just because you FEEL it, does that make it TRUE?'
        }
    },

    init() {
        this.bindEvents();
    },

    bindEvents() {
        const analyzeBtn = document.getElementById('btn-analyze-thought');
        const saveBtn = document.getElementById('btn-save-thought');
        const thoughtInput = document.getElementById('thought-input');

        if (analyzeBtn) analyzeBtn.addEventListener('click', () => this.analyzeThought());
        if (saveBtn) saveBtn.addEventListener('click', () => this.saveToJournal());

        // Auto-analyze on Enter
        if (thoughtInput) {
            thoughtInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.analyzeThought();
                }
            });
        }
    },

    analyzeThought() {
        const input = document.getElementById('thought-input');
        if (!input || !input.value.trim()) {
            this.showToast('Please enter a thought to analyze');
            return;
        }

        const thought = input.value.toLowerCase();
        const detectedTraps = this.detectTraps(thought);

        this.displayAnalysis(detectedTraps);
    },

    detectTraps(thought) {
        const detected = [];

        for (const [id, trap] of Object.entries(this.thoughtTraps)) {
            for (const keyword of trap.keywords) {
                if (thought.includes(keyword)) {
                    if (!detected.find(d => d.id === id)) {
                        detected.push({ id, ...trap });
                    }
                    break;
                }
            }
        }

        // If no specific trap detected, suggest general negative thinking
        if (detected.length === 0) {
            detected.push({
                id: 'general',
                name: 'Negative Self-Talk',
                description: 'A thought that may be unnecessarily harsh or unhelpful',
                challenge: 'Is this thought helpful? Is it balanced?'
            });
        }

        return detected;
    },

    displayAnalysis(traps) {
        const analysisDiv = document.getElementById('thought-analysis');
        const trapName = document.getElementById('thought-trap-name');
        const questionsList = document.getElementById('challenge-questions-list');
        const analyzeBtn = document.getElementById('btn-analyze-thought');

        if (!analysisDiv) return;

        // Show analysis
        analysisDiv.style.display = 'block';
        if (analyzeBtn) analyzeBtn.style.display = 'none';

        // Display detected trap(s)
        if (trapName && traps.length > 0) {
            trapName.textContent = traps.map(t => t.name).join(', ');
        }

        // Display challenge questions
        if (questionsList) {
            const questions = [
                'What is the evidence FOR this thought?',
                'What is the evidence AGAINST this thought?',
                'What would I tell a friend in this situation?',
                ...traps.map(t => t.challenge)
            ];
            questionsList.innerHTML = questions.map(q => `<li>${q}</li>`).join('');
        }
    },

    saveToJournal() {
        const thoughtInput = document.getElementById('thought-input');
        const alternativeInput = document.getElementById('alternative-thought');

        if (!thoughtInput || !alternativeInput) return;

        const entry = {
            date: new Date().toISOString(),
            negativeThought: thoughtInput.value,
            alternativeThought: alternativeInput.value,
            id: Date.now()
        };

        // Save to localStorage
        const journal = JSON.parse(localStorage.getItem('thought_journal') || '[]');
        journal.push(entry);
        localStorage.setItem('thought_journal', JSON.stringify(journal));

        // Award XP
        if (window.XPSystem) {
            window.XPSystem.addXP(25, 'Logged thought challenge');
            window.XPSystem.incrementStat('thoughtChallenges');
            window.XPSystem.completeQuest('thought-challenge');
        }

        // Clear and reset
        this.showToast('Saved to journal! 🧠');
        this.reset();
    },

    reset() {
        const thoughtInput = document.getElementById('thought-input');
        const alternativeInput = document.getElementById('alternative-thought');
        const analysisDiv = document.getElementById('thought-analysis');
        const analyzeBtn = document.getElementById('btn-analyze-thought');

        if (thoughtInput) thoughtInput.value = '';
        if (alternativeInput) alternativeInput.value = '';
        if (analysisDiv) analysisDiv.style.display = 'none';
        if (analyzeBtn) analyzeBtn.style.display = 'block';
    },

    showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }
    },

    // Get journal entries for display
    getJournal() {
        return JSON.parse(localStorage.getItem('thought_journal') || '[]');
    }
};

// Export
window.ThoughtChallenger = ThoughtChallenger;
