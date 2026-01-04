/**
 * Campaign Module
 * Manages the learning campaign with 5 lessons that teach the memory palace technique
 */

const Campaign = {
    STORAGE_KEY: 'memoryPalace_campaign',

    // Lesson definitions
    lessons: [
        {
            id: 1,
            title: "Enter the Palace",
            description: "Learn what a Memory Palace is and how it works",
            steps: [
                {
                    icon: "🏛️",
                    title: "Welcome to Your Mind Palace",
                    text: "For thousands of years, memory champions have used a technique called the <strong>Method of Loci</strong> (or Memory Palace) to memorize incredible amounts of information.",
                    highlight: null
                },
                {
                    icon: "🧠",
                    title: "How It Works",
                    text: "Your brain is naturally good at remembering <strong>places</strong> and <strong>locations</strong>. Think about it — you can probably walk through your home in your mind right now, room by room.",
                    highlight: "The Memory Palace technique hijacks this spatial memory to store ANY information."
                },
                {
                    icon: "📍",
                    title: "Loci = Locations",
                    text: "Inside a Memory Palace, we have <strong>Loci</strong> (Latin for 'places'). These are specific objects or spots where you attach memories.",
                    highlight: "Each locus becomes a 'mental hook' for one piece of information."
                },
                {
                    icon: "🎯",
                    title: "Your Mission",
                    text: "Instead of imagining your own palace (which is hard for beginners), we provide you with <strong>pre-built virtual rooms</strong>. You just need to walk through them and attach your memories!",
                    highlight: null
                }
            ]
        },
        {
            id: 2,
            title: "Your First Memory",
            description: "Place your first memory on a locus with guidance",
            steps: [
                {
                    icon: "🖥️",
                    title: "Let's Place a Memory",
                    text: "See that <strong>Holographic Desk</strong> in the room? That's your first locus. We're going to attach a fact to it.",
                    highlight: "Fact to memorize: 'The capital of Australia is Canberra'"
                },
                {
                    icon: "🎨",
                    title: "Create a Mental Image",
                    text: "Here's the key: you need to create a <strong>vivid, bizarre mental image</strong> that connects the desk to 'Canberra'.",
                    highlight: "Example: Imagine a giant CAN of BERRIES exploding all over the desk, sticky juice everywhere!"
                },
                {
                    icon: "🔗",
                    title: "The Link",
                    text: "<strong>CAN-BERRIES → Canberra</strong><br><br>The weirder and more visual your mnemonic, the better it sticks. Your brain remembers bizarre things!",
                    highlight: null
                },
                {
                    icon: "✅",
                    title: "Try It Yourself",
                    text: "When you finish this lesson, click on the <strong>Holographic Desk</strong> in the room and place this memory. Use the 'Can-Berries' mnemonic or create your own!",
                    highlight: null,
                    action: "practice"
                }
            ]
        },
        {
            id: 3,
            title: "Make It Weird",
            description: "Master the art of creating unforgettable mnemonics",
            steps: [
                {
                    icon: "🎭",
                    title: "The Von Restorff Effect",
                    text: "Psychology shows that <strong>unusual things are more memorable</strong> than ordinary ones. This is called the Von Restorff Effect.",
                    highlight: "Boring = Forgettable. Weird = Memorable."
                },
                {
                    icon: "🔥",
                    title: "Make It VIVID",
                    text: "Good mnemonics use:<br><br>• <strong>Exaggeration</strong> — Make things GIANT or tiny<br>• <strong>Motion</strong> — Things should move, explode, dance<br>• <strong>Emotion</strong> — Funny, gross, scary = memorable<br>• <strong>Sound</strong> — Add sound effects in your mind",
                    highlight: null
                },
                {
                    icon: "❌",
                    title: "Bad Example",
                    text: "Trying to remember 'The Eiffel Tower is 330m tall'<br><br><strong>Bad:</strong> 'Tower with 330'<br><br>This is too abstract. Nothing to visualize!",
                    highlight: null
                },
                {
                    icon: "✅",
                    title: "Good Example",
                    text: "<strong>Good:</strong> Imagine the Eiffel Tower wearing 3 giant 3D glasses (33) and doing a victory dance (0 = O = victory circle)<br><br>Silly? Yes. Memorable? <strong>Absolutely.</strong>",
                    highlight: "Your mnemonics should make you smile or cringe. That's how you know they'll stick!"
                }
            ]
        },
        {
            id: 4,
            title: "Walk the Path",
            description: "Learn the review technique to lock memories in",
            steps: [
                {
                    icon: "🚶",
                    title: "The Mental Walk",
                    text: "Placing memories is only half the technique. To truly remember, you need to <strong>walk through your palace regularly</strong>.",
                    highlight: null
                },
                {
                    icon: "🔄",
                    title: "Spaced Repetition",
                    text: "Memories fade over time unless you refresh them. But here's the trick: you don't need to review constantly.",
                    highlight: "Review at increasing intervals: 1 day → 3 days → 1 week → 2 weeks → 1 month..."
                },
                {
                    icon: "👻",
                    title: "The Ghost Hint",
                    text: "When you review, we show you a 'ghost' of your mnemonic. Try to recall the full memory <strong>before</strong> revealing the answer.",
                    highlight: "Active recall (struggling to remember) strengthens memory more than passive reading!"
                },
                {
                    icon: "📊",
                    title: "Rate Yourself",
                    text: "After revealing the answer, rate how well you remembered:<br><br>• <strong>Easy</strong> — Instant recall, push review further out<br>• <strong>Medium</strong> — Got it with effort, maintain interval<br>• <strong>Hard</strong> — Struggled or forgot, review again soon",
                    highlight: null
                }
            ]
        },
        {
            id: 5,
            title: "The Challenge",
            description: "Prove your skills by placing 5 memories",
            steps: [
                {
                    icon: "🏆",
                    title: "Final Challenge",
                    text: "You've learned the theory. Now it's time to prove you can do it!",
                    highlight: "Your challenge: Place 5 memories in the Cyberpunk Apartment"
                },
                {
                    icon: "📝",
                    title: "Here Are 5 Facts",
                    text: "1. <strong>Largest desert</strong> = Antarctica (not Sahara!)<br>2. <strong>Fastest land animal</strong> = Cheetah (70mph)<br>3. <strong>Longest river</strong> = Nile (6,650km)<br>4. <strong>Smallest country</strong> = Vatican City<br>5. <strong>Hardest natural substance</strong> = Diamond",
                    highlight: null
                },
                {
                    icon: "🎨",
                    title: "Create Your Mnemonics",
                    text: "For each fact, create a <strong>vivid, weird mental image</strong> and place it on a locus in the room.<br><br>Use what you learned:<br>• Exaggeration<br>• Motion<br>• Sound/Emotion<br>• Word associations",
                    highlight: null
                },
                {
                    icon: "🚀",
                    title: "You're Ready!",
                    text: "After placing all 5 memories, you'll unlock <strong>Freeform Mode</strong> where you can memorize anything you want!",
                    highlight: "Go place those memories! Click 'FINISH' to enter the palace.",
                    action: "complete"
                }
            ]
        }
    ],

    /**
     * Get campaign progress from localStorage
     */
    getProgress() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : {
            completedLessons: [],
            currentLesson: 1,
            freeformUnlocked: false
        };
    },

    /**
     * Save campaign progress
     */
    saveProgress(progress) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
    },

    /**
     * Mark a lesson as complete
     */
    completeLesson(lessonId) {
        const progress = this.getProgress();

        if (!progress.completedLessons.includes(lessonId)) {
            progress.completedLessons.push(lessonId);
        }

        // Advance to next lesson
        if (lessonId < 5) {
            progress.currentLesson = lessonId + 1;
        }

        // Check if all lessons complete
        if (progress.completedLessons.length >= 5) {
            progress.freeformUnlocked = true;
        }

        this.saveProgress(progress);
        return progress;
    },

    /**
     * Get lesson by ID
     */
    getLesson(id) {
        return this.lessons.find(l => l.id === id);
    },

    /**
     * Check if freeform is unlocked
     */
    isFreeformUnlocked() {
        const progress = this.getProgress();
        // Also check if user has placed any memories (allows skip for returning users)
        const memoryCount = Memory.getTotalCount();
        return progress.freeformUnlocked || memoryCount >= 5;
    },

    /**
     * Get lesson status
     */
    getLessonStatus(lessonId) {
        const progress = this.getProgress();

        if (progress.completedLessons.includes(lessonId)) {
            return 'completed';
        }
        if (lessonId === progress.currentLesson) {
            return 'current';
        }
        if (lessonId < progress.currentLesson) {
            return 'available';
        }
        return 'locked';
    },

    /**
     * Render lesson list
     */
    renderLessonList() {
        const container = document.getElementById('memory-lesson-list');
        const progress = this.getProgress();

        container.innerHTML = this.lessons.map(lesson => {
            const status = this.getLessonStatus(lesson.id);
            let statusIcon = '';

            if (status === 'completed') statusIcon = '✅';
            else if (status === 'current') statusIcon = '▶️';
            else if (status === 'locked') statusIcon = '🔒';

            return `
                <div class="lesson-card ${status}" data-lesson-id="${lesson.id}">
                    <div class="lesson-number">${status === 'completed' ? '✓' : lesson.id}</div>
                    <div class="lesson-info">
                        <div class="lesson-title">${lesson.title}</div>
                        <div class="lesson-desc">${lesson.description}</div>
                    </div>
                    <div class="lesson-status">${statusIcon}</div>
                </div>
            `;
        }).join('');

        // Add click handlers
        container.querySelectorAll('.lesson-card:not(.locked)').forEach(card => {
            card.addEventListener('click', () => {
                const lessonId = parseInt(card.dataset.lessonId);
                this.startLesson(lessonId);
            });
        });
    },

    /**
     * Start a specific lesson
     */
    startLesson(lessonId) {
        const lesson = this.getLesson(lessonId);
        if (!lesson) return;

        this.currentLessonId = lessonId;
        this.currentStep = 0;

        // Show lesson view
        if (window.App) {
            App.showSubView('memory', 'memory-lesson');
        }

        this.renderCurrentStep();
    },

    /**
     * Render current lesson step
     */
    renderCurrentStep() {
        console.log('DEBUG: renderCurrentStep called');
        console.log('DEBUG: currentLessonId:', this.currentLessonId);
        console.log('DEBUG: currentStep:', this.currentStep);

        const lesson = this.getLesson(this.currentLessonId);
        console.log('DEBUG: Lesson object:', lesson);

        if (!lesson) {
            console.error('DEBUG: Lesson NOT FOUND for ID:', this.currentLessonId);
            return;
        }

        const step = lesson.steps[this.currentStep];
        console.log('DEBUG: Step object:', step);

        const totalSteps = lesson.steps.length;

        // Update progress bar
        const progress = ((this.currentStep + 1) / totalSteps) * 100;
        const progressFill = document.getElementById('memory-lesson-progress');
        if (progressFill) progressFill.style.width = `${progress}%`;

        // Render step content
        const container = document.getElementById('memory-lesson-content');
        console.log('DEBUG: Container element:', container);

        if (!container) {
            console.error('DEBUG: Container #memory-lesson-content NOT FOUND in DOM');
            return;
        }

        container.innerHTML = `
            <div class="lesson-step">
                <div class="lesson-step-icon">${step.icon}</div>
                <h3 class="lesson-step-title">${step.title}</h3>
                <p class="lesson-step-text">${step.text}</p>
                ${step.highlight ? `<div class="lesson-step-highlight">${step.highlight}</div>` : ''}
            </div>
        `;

        // Update button
        const btn = document.getElementById('btn-memory-lesson-next');
        const isLastStep = this.currentStep === totalSteps - 1;

        if (step.action === 'practice' || step.action === 'complete') {
            btn.textContent = 'GO TO PALACE →';
        } else if (isLastStep) {
            btn.textContent = 'FINISH LESSON ✓';
        } else {
            btn.textContent = 'CONTINUE →';
        }
    },

    /**
     * Handle next step/complete
     */
    nextStep() {
        const lesson = this.getLesson(this.currentLessonId);
        const step = lesson.steps[this.currentStep];
        const totalSteps = lesson.steps.length;

        // If special action, go to palace
        if (step.action === 'practice' || step.action === 'complete') {
            this.completeLesson(this.currentLessonId);
            this.goToPalace();
            return;
        }

        // If last step, complete lesson
        if (this.currentStep === totalSteps - 1) {
            // Disable button to prevent double-clicks
            const btn = document.getElementById('btn-memory-lesson-next');
            if (btn) btn.disabled = true;

            this.completeLesson(this.currentLessonId);
            this.goToCampaign();
            return;
        }

        // Otherwise, next step
        this.currentStep++;
        this.renderCurrentStep();
    },

    /**
     * Navigate to palace view
     */
    goToPalace() {
        if (window.App) {
            App.showSubView('memory', 'memory-palace');
            // If it's a practice step, engage place mode
            const lesson = this.getLesson(this.currentLessonId);
            const step = lesson.steps[this.currentStep];
            if (step.action === 'practice') {
                App.mode = 'place';
                App.updateModeUI();
                App.showToast('Click a locus to place your memory!');
            }
            App.updateLocusVisuals();
        }
    },

    /**
     * Navigate to campaign view
     */
    goToCampaign() {
        if (window.App) {
            App.showSubView('memory', 'memory-campaign');
            App.renderMemoryLessons();
        }
    },

    /**
     * Navigate to home
     */
    goToHome() {
        if (window.App) {
            App.showSubView('memory', 'memory-home');
            App.updateAllStats();
        }
    },

    /**
     * Update home screen stats
     */
    updateHomeStats() {
        // Handled by App.updateAllStats()
    }
};

// Export
window.Campaign = Campaign;
