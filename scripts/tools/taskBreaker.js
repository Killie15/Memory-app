/**
 * Task Breaker Tool - AI Powered
 * Uses Gemini AI to break down overwhelming tasks into micro-steps
 */

const TaskBreaker = {
    API_KEY: () => window.CONFIG?.GEMINI_API_KEY || '',
    MODEL: 'gemini-2.5-flash',
    BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models',

    currentTask: '',
    currentSteps: [],

    init() {
        this.bindEvents();
    },

    bindEvents() {
        const breakBtn = document.getElementById('btn-break-task');
        const startBtn = document.getElementById('btn-start-first-step');
        const saveBtn = document.getElementById('btn-save-tasks');
        const input = document.getElementById('big-task-input');

        if (breakBtn) breakBtn.addEventListener('click', () => this.breakTask());
        if (startBtn) startBtn.addEventListener('click', () => this.startFirstStep());
        if (saveBtn) saveBtn.addEventListener('click', () => this.saveAllTasks());

        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.breakTask();
                }
            });
        }
    },

    async breakTask() {
        const input = document.getElementById('big-task-input');
        if (!input || !input.value.trim()) {
            this.showToast('Please enter a task to break down');
            return;
        }

        this.currentTask = input.value.trim();

        // Show loading state
        const stepsDiv = document.getElementById('micro-steps');
        const stepsList = document.getElementById('micro-steps-list');
        if (stepsDiv) stepsDiv.style.display = 'block';
        if (stepsList) stepsList.innerHTML = '<li class="loading">🤖 AI is breaking down your task...</li>';

        try {
            const steps = await this.generateAISteps(this.currentTask);
            this.currentSteps = steps;
            this.displaySteps(steps);
        } catch (error) {
            console.error('AI breakdown error:', error);
            // Fallback to simple breakdown
            const steps = this.generateFallbackSteps(this.currentTask);
            this.currentSteps = steps;
            this.displaySteps(steps);
            this.showToast('Using basic breakdown (AI unavailable)');
        }
    },

    async generateAISteps(task) {
        const prompt = `You are an ADHD coach helping break down an overwhelming task into tiny, concrete micro-steps.

Task: "${task}"

Break this into 5-8 small, SPECIFIC steps that:
- Are so small they take 2-10 minutes each
- Start with an action verb
- Are concrete and specific (not vague)
- Include helpful time estimates in parentheses

Return ONLY a JSON array of strings, no other text. Example:
["Open laptop and create new document (2 min)", "Write the title and your name (1 min)", "List 3 main points to cover (5 min)"]`;

        const response = await fetch(`${this.BASE_URL}/${this.MODEL}:generateContent?key=${this.API_KEY()}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500
                }
            })
        });

        if (!response.ok) throw new Error('API request failed');

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Parse JSON from response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error('Could not parse AI response');
    },

    generateFallbackSteps(task) {
        return [
            `Gather materials for: ${task}`,
            `Spend 5 min planning approach`,
            `Start with the easiest part`,
            `Work for 15 min, then take a break`,
            `Review progress and continue`
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
            </li>
        `).join('');

        // Add save button if not exists
        const actionsDiv = document.querySelector('.task-actions');
        if (actionsDiv && !document.getElementById('btn-save-tasks')) {
            const saveBtn = document.createElement('button');
            saveBtn.id = 'btn-save-tasks';
            saveBtn.className = 'btn-primary';
            saveBtn.innerHTML = '💾 Save to My Tasks';
            saveBtn.style.marginTop = '10px';
            saveBtn.addEventListener('click', () => this.saveAllTasks());
            actionsDiv.appendChild(saveBtn);
        }

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

            if (window.XPSystem) {
                window.XPSystem.addXP(5, 'Task step complete');
            }
        }
    },

    async saveAllTasks() {
        if (!this.currentSteps.length) {
            this.showToast('No tasks to save');
            return;
        }

        this.showToast('Saving tasks...');

        let saved = 0;
        for (const step of this.currentSteps) {
            try {
                if (window.TaskStore) {
                    await TaskStore.create(step, `Part of: ${this.currentTask}`, 5);
                    saved++;
                }
            } catch (error) {
                console.warn('Failed to save task:', step, error);
            }
        }

        if (saved > 0) {
            this.showToast(`✅ Saved ${saved} tasks!`);

            // Also tell the Assistant about these tasks
            if (window.MemoryStore) {
                await MemoryStore.save('task', `User created task: ${this.currentTask} with ${saved} micro-steps`, 'manual', 6);
            }
        } else {
            this.showToast('Could not save tasks');
        }
    },

    startFirstStep() {
        const firstStep = document.querySelector('.micro-step:not(.completed) .step-text');
        if (firstStep) {
            this.showToast(`Starting: ${firstStep.textContent}`);

            if (window.App && window.App.showSubView) {
                window.App.showSubView('tools', 'tools-focus');
            }

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

window.TaskBreaker = TaskBreaker;
