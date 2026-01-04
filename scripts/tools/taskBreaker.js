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
                    <p>Creating your timeline...</p>
                </div>
            `;
        }

        try {
            const apiKey = this.API_KEY();
            if (!apiKey) {
                console.warn('No API key, using fallback');
                throw new Error('No API key');
            }
            const result = await this.generateAITimeline(this.currentTask);
            this.currentSteps = result.steps;
            this.timeScale = result.timeScale;
            this.displayTimeline(result);
        } catch (error) {
            console.error('AI error, using fallback:', error);
            // Use fallback timeline
            this.showToast('AI failed, using smart templates 🤖');
            const result = this.generateFallbackTimeline(this.currentTask);
            this.currentSteps = result.steps;
            this.timeScale = result.timeScale;
            this.displayTimeline(result);
        }
    },

    generateFallbackTimeline(task) {
        // Detect time scale based on keywords
        const taskLower = task.toLowerCase();
        let timeScale = 'hours';
        let totalDuration = '2 hours';
        let steps = [];

        if (taskLower.includes('learn') || taskLower.includes('master') || taskLower.includes('fluent')) {
            timeScale = 'months';
            totalDuration = '6-12 months';
            steps = [
                { title: 'Research & Setup', duration: 'Week 1', description: 'Find the best resources, apps, and materials', milestone: 'Have a clear learning plan' },
                { title: 'Build Foundation', duration: 'Month 1-2', description: 'Learn the basics and core concepts', milestone: 'Understand fundamentals' },
                { title: 'Daily Practice', duration: 'Month 2-4', description: 'Practice consistently every day (15-30 min)', milestone: 'Build a habit' },
                { title: 'Intermediate Skills', duration: 'Month 4-6', description: 'Tackle harder concepts and real-world application', milestone: 'Handle most situations' },
                { title: 'Advanced Practice', duration: 'Month 6-9', description: 'Deepen knowledge with challenging material', milestone: 'Feel confident' },
                { title: 'Mastery & Fluency', duration: 'Month 9-12', description: 'Refine skills and use in real contexts', milestone: 'Achieve your goal!' }
            ];
        } else if (taskLower.includes('clean') || taskLower.includes('room') || taskLower.includes('organize')) {
            timeScale = 'hours';
            totalDuration = '1-2 hours';
            steps = [
                { title: 'Quick Scan', duration: '5 min', description: 'Look around and identify the biggest messes', milestone: 'Know where to start' },
                { title: 'Trash Run', duration: '10 min', description: 'Grab a bag and throw away all obvious trash', milestone: 'No more trash visible' },
                { title: 'Surface Clear', duration: '15 min', description: 'Clear off desks, tables, and flat surfaces', milestone: 'Surfaces are clear' },
                { title: 'Floor Pickup', duration: '10 min', description: 'Pick up everything from the floor', milestone: 'Floor is walkable' },
                { title: 'Put Things Away', duration: '15 min', description: 'Return items to their proper places', milestone: 'Everything has a home' },
                { title: 'Final Touch', duration: '10 min', description: 'Quick dust/wipe and final adjustments', milestone: 'Room looks great!' }
            ];
        } else {
            // Generic project breakdown
            timeScale = 'days';
            totalDuration = '3-5 days';
            steps = [
                { title: 'Define the Goal', duration: '30 min', description: 'Write down exactly what you want to accomplish', milestone: 'Clear written goal' },
                { title: 'Break It Down', duration: '30 min', description: 'List all the smaller parts of this task', milestone: 'Have a task list' },
                { title: 'Gather Resources', duration: '1 hour', description: 'Get everything you need before starting', milestone: 'All materials ready' },
                { title: 'First Small Win', duration: '1-2 hours', description: 'Complete the easiest part first', milestone: 'Momentum started' },
                { title: 'Core Work', duration: '1-2 days', description: 'Work on the main parts in focused sessions', milestone: 'Most work done' },
                { title: 'Review & Finish', duration: '1-2 hours', description: 'Check your work and complete final details', milestone: 'Task complete!' }
            ];
        }

        return { timeScale, totalDuration, steps };
    },

    async generateAITimeline(task) {
        const apiKey = this.API_KEY();
        if (!apiKey) throw new Error('No API Key');

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

        // List of models to try in order of preference
        // List of models to try in order of preference
        const modelsToTry = [
            { id: 'gemini-2.5-flash', version: 'v1beta' } // The only working model
        ];

        let lastError = null;
        let triedCount = 0;

        for (const model of modelsToTry) {
            try {
                if (triedCount > 0) {
                    this.showToast(`Retry: Trying ${model.id}... 🤖`);
                }

                const baseUrl = `https://generativelanguage.googleapis.com/${model.version}/models`;
                const url = `${baseUrl}/${model.id}:generateContent?key=${apiKey}`;

                const response = await fetch(url, {
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

                if (!response.ok) {
                    throw new Error(`Status ${response.status}`);
                }

                const data = await response.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

                if (text) {
                    // Parse JSON from response
                    const jsonMatch = text.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        return JSON.parse(jsonMatch[0]);
                    }
                }
            } catch (error) {
                console.warn(`TaskBreaker model ${model.id} failed:`, error);

                // Show visible warning for each failure
                let status = 'Error';
                if (error.message.includes('429')) status = 'Quota Exceeded';
                else if (error.message.includes('404')) status = 'Not Found (404)';
                else if (error.message.includes('403')) status = 'Forbidden (403)';
                else if (error.message.includes('400')) status = 'Bad Request (400)';

                this.showToast(`Model ${model.id} failed (${status}). switching... ⚠️`);

                lastError = error;
                triedCount++;
                // Continue to next model
            }
        }

        console.error('All AI models failed, last error:', lastError);
        throw new Error('All AI models failed');
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
                white-space: pre-wrap;
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
