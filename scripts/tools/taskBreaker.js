/**
 * Task Breaker Tool - AI Powered with Visual Timeline
 * Uses Gemini AI to break down tasks with adaptive time scales
 */

const TaskBreaker = {
    API_KEY: () => window.CONFIG?.GEMINI_API_KEY || '',
    MODEL: 'gemini-2.5-flash',
    BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models',

    currentTask: '',
    currentSteps: [],
    timeScale: 'hours', // hours, days, weeks, months, years

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

    async breakTask() {
        const input = document.getElementById('big-task-input');
        if (!input || !input.value.trim()) {
            this.showToast('Please enter a task to break down');
            return;
        }

        this.currentTask = input.value.trim();

        // Show loading state
        const stepsDiv = document.getElementById('micro-steps');
        if (stepsDiv) {
            stepsDiv.style.display = 'block';
            stepsDiv.innerHTML = `
                <div class="timeline-loading">
                    <div class="loading-spinner">🤖</div>
                    <p>AI is analyzing your task and creating a timeline...</p>
                </div>
            `;
        }

        try {
            const result = await this.generateAITimeline(this.currentTask);
            this.currentSteps = result.steps;
            this.timeScale = result.timeScale;
            this.displayTimeline(result);
        } catch (error) {
            console.error('AI breakdown error:', error);
            this.showToast('AI unavailable - try again');
            if (stepsDiv) stepsDiv.innerHTML = '<p>Could not generate timeline. Please try again.</p>';
        }
    },

    async generateAITimeline(task) {
        const prompt = `You are an ADHD-friendly task planner. Analyze this task and create a visual timeline breakdown.

Task: "${task}"

First, determine the appropriate TIME SCALE:
- "hours" for tasks under 4 hours (cleaning, cooking, quick projects)
- "days" for tasks taking a few days to a week
- "weeks" for tasks taking 2-8 weeks (small projects, habits)
- "months" for tasks taking 1-6 months (learning skills, medium projects)
- "years" for long-term goals (mastering a language, career changes)

Then break the task into 5-8 phases/steps appropriate for that time scale.

Return ONLY valid JSON in this exact format:
{
    "timeScale": "hours|days|weeks|months|years",
    "totalDuration": "estimated total time (e.g., '2 hours', '3 months', '1 year')",
    "steps": [
        {
            "title": "Step name",
            "duration": "time for this step",
            "description": "What to do in this phase",
            "milestone": "What success looks like"
        }
    ]
}`;

        const response = await fetch(`${this.BASE_URL}/${this.MODEL}:generateContent?key=${this.API_KEY()}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1000
                }
            })
        });

        if (!response.ok) throw new Error('API request failed');

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Parse JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error('Could not parse AI response');
    },

    displayTimeline(result) {
        const stepsDiv = document.getElementById('micro-steps');
        if (!stepsDiv) return;

        const scaleEmoji = {
            'hours': '⏱️',
            'days': '📅',
            'weeks': '📆',
            'months': '🗓️',
            'years': '🎯'
        };

        const scaleColor = {
            'hours': 'var(--neon-green)',
            'days': 'var(--neon-cyan)',
            'weeks': 'var(--neon-blue)',
            'months': 'var(--neon-purple)',
            'years': 'var(--neon-pink)'
        };

        stepsDiv.innerHTML = `
            <div class="timeline-header">
                <h4>${scaleEmoji[result.timeScale] || '📋'} ${this.currentTask}</h4>
                <div class="timeline-meta">
                    <span class="timeline-scale" style="color: ${scaleColor[result.timeScale]}">${result.timeScale.toUpperCase()} VIEW</span>
                    <span class="timeline-total">Total: ${result.totalDuration}</span>
                </div>
            </div>
            
            <div class="visual-timeline" data-scale="${result.timeScale}">
                <div class="timeline-track"></div>
                ${result.steps.map((step, i) => `
                    <div class="timeline-step" data-index="${i}" style="--step-color: ${scaleColor[result.timeScale]}">
                        <div class="timeline-node">
                            <span class="node-number">${i + 1}</span>
                        </div>
                        <div class="timeline-content">
                            <div class="step-header">
                                <h5 class="step-title">${step.title}</h5>
                                <span class="step-duration">${step.duration}</span>
                            </div>
                            <p class="step-description">${step.description}</p>
                            <div class="step-milestone">🎯 ${step.milestone}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="timeline-actions">
                <button class="btn-primary" id="btn-save-timeline">
                    💾 Save This Plan
                </button>
                <button class="btn-secondary" id="btn-start-first-step">
                    ▶️ Start Step 1
                </button>
            </div>
        `;

        // Bind save button
        const saveBtn = document.getElementById('btn-save-timeline');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveTimeline(result));
        }

        // Bind start button
        const startBtn = document.getElementById('btn-start-first-step');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startFirstStep());
        }

        // Add click handlers for steps
        stepsDiv.querySelectorAll('.timeline-step').forEach(step => {
            step.addEventListener('click', () => this.toggleStep(step));
        });

        // Add CSS if not present
        this.injectTimelineStyles();
    },

    toggleStep(stepEl) {
        if (stepEl.classList.contains('completed')) {
            stepEl.classList.remove('completed');
        } else {
            stepEl.classList.add('completed');
            this.showToast('Step completed! 🎉');
            if (window.XPSystem) {
                window.XPSystem.addXP(10, 'Timeline step complete');
            }
        }
    },

    async saveTimeline(result) {
        this.showToast('Saving plan...');

        let saved = 0;
        for (const step of result.steps) {
            try {
                if (window.TaskStore) {
                    await TaskStore.create(
                        step.title,
                        `${step.description}\n\nMilestone: ${step.milestone}\nDuration: ${step.duration}`,
                        7
                    );
                    saved++;
                }
            } catch (error) {
                console.warn('Failed to save:', step.title);
            }
        }

        if (saved > 0) {
            this.showToast(`✅ Saved ${saved} steps to your tasks!`);
            if (window.MemoryStore) {
                await MemoryStore.save('task', `Created ${result.timeScale} plan for: ${this.currentTask}`, 'manual', 7);
            }
        }
    },

    startFirstStep() {
        const firstStep = document.querySelector('.timeline-step:not(.completed)');
        if (firstStep) {
            const title = firstStep.querySelector('.step-title')?.textContent;
            this.showToast(`Starting: ${title}`);

            if (window.App && window.App.showSubView) {
                window.App.showSubView('tools', 'tools-focus');
            }
        }
    },

    injectTimelineStyles() {
        if (document.getElementById('timeline-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'timeline-styles';
        styles.textContent = `
            .timeline-loading {
                text-align: center;
                padding: 40px;
            }
            .loading-spinner {
                font-size: 3rem;
                animation: spin 2s linear infinite;
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            .timeline-header {
                margin-bottom: 20px;
            }
            .timeline-header h4 {
                font-family: var(--font-display);
                color: var(--text-primary);
                margin-bottom: 8px;
            }
            .timeline-meta {
                display: flex;
                gap: 15px;
                font-size: 0.85rem;
            }
            .timeline-scale {
                font-weight: bold;
                text-transform: uppercase;
            }
            .timeline-total {
                color: var(--text-secondary);
            }
            .visual-timeline {
                position: relative;
                padding-left: 40px;
                margin: 20px 0;
            }
            .timeline-track {
                position: absolute;
                left: 15px;
                top: 0;
                bottom: 0;
                width: 2px;
                background: linear-gradient(to bottom, var(--neon-cyan), var(--neon-purple));
            }
            .timeline-step {
                position: relative;
                margin-bottom: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .timeline-step:hover {
                transform: translateX(5px);
            }
            .timeline-step.completed {
                opacity: 0.5;
            }
            .timeline-step.completed .timeline-node {
                background: var(--neon-green);
            }
            .timeline-step.completed .step-title {
                text-decoration: line-through;
            }
            .timeline-node {
                position: absolute;
                left: -40px;
                width: 30px;
                height: 30px;
                background: var(--step-color, var(--neon-cyan));
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 0.8rem;
                color: var(--bg-dark);
                box-shadow: 0 0 10px var(--step-color, var(--neon-cyan));
            }
            .timeline-content {
                background: var(--bg-light);
                padding: 15px;
                border-radius: var(--radius-md);
                border-left: 3px solid var(--step-color, var(--neon-cyan));
            }
            .step-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }
            .step-title {
                font-family: var(--font-display);
                color: var(--text-primary);
                margin: 0;
                font-size: 1rem;
            }
            .step-duration {
                font-size: 0.75rem;
                color: var(--neon-green);
                background: rgba(0,255,136,0.1);
                padding: 2px 8px;
                border-radius: 10px;
            }
            .step-description {
                color: var(--text-secondary);
                font-size: 0.85rem;
                margin: 0 0 10px 0;
                line-height: 1.5;
            }
            .step-milestone {
                font-size: 0.8rem;
                color: var(--neon-pink);
                font-style: italic;
            }
            .timeline-actions {
                display: flex;
                gap: 10px;
                margin-top: 20px;
            }
            .timeline-actions .btn-primary,
            .timeline-actions .btn-secondary {
                flex: 1;
            }
        `;
        document.head.appendChild(styles);
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
