/**
 * Task Breaker Tool
 * Breaks overwhelming tasks into micro-steps
 */

const TaskBreaker = {
    // Common task templates for quick breakdown
    templates: {
        'clean': [
            'Pick up 5 items from floor',
            'Put dishes in sink',
            'Wipe one surface',
            'Take out trash',
            'Straighten one area'
        ],
        'email': [
            'Open email app',
            'Read first email',
            'Decide: Reply, Delete, or Archive',
            'Handle next email',
            'Repeat until inbox zero (or 10 min)'
        ],
        'write': [
            'Open document',
            'Write one sentence',
            'Write intro paragraph',
            'Outline main points',
            'Write each section (15 min each)'
        ],
        'study': [
            'Gather materials',
            'Set timer for 15 min',
            'Read/review first section',
            'Take quick notes',
            'Take 5 min break'
        ],
        'exercise': [
            'Put on workout clothes',
            'Do 5 jumping jacks',
            'Do 5 min warm-up',
            'Main workout (10-20 min)',
            'Cool down stretch'
        ]
    },

    init() {
        this.bindEvents();
    },

    bindEvents() {
        const breakBtn = document.getElementById('btn-break-task');
        const startBtn = document.getElementById('btn-start-first-step');
        const input = document.getElementById('big-task-input');

        if (breakBtn) breakBtn.addEventListener('click', () => this.breakTask());
        if (startBtn) startBtn.addEventListener('click', () => this.startFirstStep());

        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.breakTask();
                }
            });
        }
    },

    breakTask() {
        const input = document.getElementById('big-task-input');
        if (!input || !input.value.trim()) {
            this.showToast('Please enter a task to break down');
            return;
        }

        const task = input.value.toLowerCase();
        const steps = this.generateSteps(task);
        this.displaySteps(steps);
    },

    generateSteps(task) {
        // Check for template matches
        for (const [key, template] of Object.entries(this.templates)) {
            if (task.includes(key)) {
                return template;
            }
        }

        // Generic breakdown for unknown tasks
        return [
            `Gather materials for: ${task}`,
            `Spend 5 min planning approach`,
            `Start with easiest part`,
            `Work for 15 min, then break`,
            `Review progress, continue or stop`
        ];
    },

    displaySteps(steps) {
        const stepsDiv = document.getElementById('micro-steps');
        const stepsList = document.getElementById('micro-steps-list');

        if (!stepsDiv || !stepsList) return;

        stepsDiv.style.display = 'block';

        stepsList.innerHTML = steps.map((step, i) => `
            <li class="micro-step" data-index="${i}">
                <span class="step-check">☐</span>
                <span class="step-text">${step}</span>
                <span class="step-time">~5 min</span>
            </li>
        `).join('');

        // Add click handlers for checking off steps
        stepsList.querySelectorAll('.micro-step').forEach(li => {
            li.addEventListener('click', () => this.toggleStep(li));
        });
    },

    toggleStep(li) {
        const check = li.querySelector('.step-check');
        if (li.classList.contains('completed')) {
            li.classList.remove('completed');
            check.textContent = '☐';
        } else {
            li.classList.add('completed');
            check.textContent = '☑';
            this.showToast('Step done! 🎉');

            // Micro-XP reward
            if (window.XPSystem) {
                window.XPSystem.addXP(5, 'Task step complete');
            }
        }
    },

    startFirstStep() {
        // Navigate to focus timer with first step context
        const firstStep = document.querySelector('.micro-step:not(.completed) .step-text');
        if (firstStep) {
            this.showToast(`Starting: ${firstStep.textContent}`);

            // Switch to focus timer
            if (window.App && window.App.showSubView) {
                window.App.showSubView('tools', 'tools-focus');
            }

            // Auto-set 5 min duration
            const durationSelect = document.getElementById('timer-duration');
            if (durationSelect) {
                durationSelect.value = '5';
                if (window.FocusTimer) {
                    window.FocusTimer.setDuration(5);
                }
            }
        }
    },

    showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }
    }
};

// Export
window.TaskBreaker = TaskBreaker;
