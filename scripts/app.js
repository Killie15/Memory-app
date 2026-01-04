/**
 * ADHD Mastery App - Main Controller
 * Handles navigation, view switching, and module integration
 */

const App = {
    currentTab: 'memory',
    currentSubView: {},
    mode: 'place',

    async init() {
        // Initialize sub-view tracking
        this.currentSubView = {
            memory: 'memory-home',
            cbt: 'cbt-home',
            tools: 'tools-home',
            assistant: 'assistant-home',
            progress: 'progress-home'
        };

        // Initialize database first
        if (window.SupabaseClient) {
            try {
                await SupabaseClient.init();
                console.log('Database initialized');
            } catch (error) {
                console.warn('Database init failed, using localStorage fallback:', error);
            }
        }

        // Initialize all modules
        this.initModules();

        // Bind navigation events
        this.bindNavigation();

        // Bind back buttons
        this.bindBackButtons();

        // Bind action buttons
        this.bindActions();

        // Load saved data
        this.loadData();

        // Update all UI
        this.updateAllStats();

        // Notifications
        if (window.Notifications) {
            Notifications.init();
        }

        // Audio
        if (window.AudioManager) {
            AudioManager.init();
        }

        // Theme
        if (window.ThemeSwitcher) {
            ThemeSwitcher.init();
        }

        console.log('ADHD Mastery App initialized');
    },

    initModules() {
        // XP System
        if (window.XPSystem) {
            XPSystem.init();
        }

        // Focus Timer
        if (window.FocusTimer) {
            FocusTimer.init();
        }

        // Thought Challenger
        if (window.ThoughtChallenger) {
            ThoughtChallenger.init();
        }

        // Habit Tracker
        if (window.HabitTracker) {
            HabitTracker.init();
        }

        // Task Breaker
        if (window.TaskBreaker) {
            TaskBreaker.init();
        }

        // Memory Palace (existing)
        if (window.Palace) {
            Palace.init();
        }

        // AI Assistant
        if (window.Assistant) {
            // Initialize Google Auth first (for Calendar/Gmail)
            if (window.GoogleAuth && window.CONFIG?.GOOGLE_CLIENT_ID) {
                GoogleAuth.init(window.CONFIG.GOOGLE_CLIENT_ID)
                    .then(() => console.log('Google Auth initialized'))
                    .catch(err => console.warn('Google Auth failed:', err));
            }
            Assistant.init();
        }

        // Bind Assistant quick actions and Google Sign-in
        this.bindAssistantActions();
    },

    // ==================== NAVIGATION ====================

    bindNavigation() {
        // Bottom nav
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        });
    },

    switchTab(tabId) {
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.toggle('active', tab.id === `tab-${tabId}`);
        });

        this.currentTab = tabId;

        // Reset to home sub-view when switching tabs
        this.showSubView(tabId, `${tabId}-home`);
    },

    showSubView(tab, viewId) {
        const tabElement = document.getElementById(`tab-${tab}`);
        if (!tabElement) return;

        tabElement.querySelectorAll('.sub-view').forEach(view => {
            view.classList.toggle('active', view.id === viewId);
        });

        this.currentSubView[tab] = viewId;
    },

    // ==================== BACK BUTTONS ====================

    bindBackButtons() {
        // Memory section backs
        this.bindBack('btn-back-memory-home', () => this.showSubView('memory', 'memory-home'));
        this.bindBack('btn-back-memory-home-2', () => this.showSubView('memory', 'memory-home'));
        this.bindBack('btn-back-memory-campaign', () => this.showSubView('memory', 'memory-campaign'));

        // CBT section backs
        this.bindBack('btn-back-cbt-home', () => this.showSubView('cbt', 'cbt-home'));

        // Tools section backs
        this.bindBack('btn-back-tools-focus', () => this.showSubView('tools', 'tools-home'));
        this.bindBack('btn-back-tools-thoughts', () => this.showSubView('tools', 'tools-home'));
        this.bindBack('btn-back-tools-tasks', () => this.showSubView('tools', 'tools-home'));
        this.bindBack('btn-back-tools-checkin', () => this.showSubView('tools', 'tools-home'));
        this.bindBack('btn-back-tools-skills', () => this.showSubView('tools', 'tools-home'));
        this.bindBack('btn-back-tools-journal', () => this.showSubView('tools', 'tools-home'));

        // Settings back
        this.bindBack('btn-back-settings', () => this.showSubView('progress', 'progress-home'));
    },

    bindBack(btnId, callback) {
        const btn = document.getElementById(btnId);
        if (btn) btn.addEventListener('click', callback);
    },

    // ==================== ACTION BUTTONS ====================

    bindActions() {
        // Memory section
        this.bindClick('btn-memory-campaign', () => {
            this.showSubView('memory', 'memory-campaign');
            this.renderMemoryLessons();
        });

        this.bindClick('btn-memory-freeform', () => {
            this.showSubView('memory', 'memory-palace');
            this.mode = 'place';
            this.updateModeUI();
        });

        this.bindClick('btn-memory-review', () => {
            this.showSubView('memory', 'memory-palace');
            this.mode = 'review';
            this.updateModeUI();
        });

        // Mode toggle in palace
        this.bindClick('btn-place', () => {
            this.mode = 'place';
            this.updateModeUI();
        });

        this.bindClick('btn-review', () => {
            this.mode = 'review';
            this.updateModeUI();
        });

        // CBT module clicks
        document.querySelectorAll('.module-card').forEach(card => {
            card.addEventListener('click', () => {
                if (!card.classList.contains('locked')) {
                    const moduleId = card.dataset.module;
                    this.startCBTModule(moduleId);
                }
            });
        });

        // Tools
        this.bindClick('btn-tool-focus', () => this.showSubView('tools', 'tools-focus'));
        this.bindClick('btn-tool-thoughts', () => this.showSubView('tools', 'tools-thoughts'));
        this.bindClick('btn-tool-tasks', () => this.showSubView('tools', 'tools-tasks'));
        this.bindClick('btn-tool-habit', () => {
            this.showSubView('tools', 'tools-habit');
            if (window.HabitTracker) HabitTracker.render();
        });
        this.bindClick('btn-tool-checkin', () => {
            this.showSubView('tools', 'tools-checkin');
            this.initDailyCheckin();
        });
        this.bindClick('btn-tool-skills', () => {
            this.showSubView('tools', 'tools-skills');
            this.renderSkillCards();
        });
        this.bindClick('btn-tool-journal', () => {
            this.showSubView('tools', 'tools-journal');
            this.renderJournalEntries();
        });

        // Locus clicks (Memory Palace)
        document.querySelectorAll('.locus').forEach(locus => {
            locus.addEventListener('click', () => this.handleLocusClick(locus));
        });

        // Modal
        this.bindClick('modal-close', () => this.closeModal());
        this.bindClick('modal-overlay', (e) => {
            if (e.target.id === 'modal-overlay') this.closeModal();
        });

        // Memory save
        this.bindClick('btn-save-memory', () => this.saveMemory());

        // Review reveal
        this.bindClick('btn-reveal', () => this.revealMemory());

        // Rating buttons
        document.querySelectorAll('.rating-btn').forEach(btn => {
            btn.addEventListener('click', () => this.rateMemory(btn.dataset.rating));
        });

        // Memory lesson next button
        this.bindClick('btn-memory-lesson-next', () => {
            if (window.Campaign) Campaign.nextStep();
        });

        // Progress & Settings
        this.bindClick('btn-open-settings', () => this.showSubView('progress', 'view-settings'));
        this.bindClick('btn-factory-reset', () => this.handleFactoryReset());

        // Initialize tool button bindings
        this.bindToolActions();
    },

    bindToolActions() {
        // Daily Check-in
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
        });

        this.bindClick('btn-save-checkin', () => this.saveDailyCheckin());

        // Journal
        this.bindClick('btn-save-journal', () => this.saveJournalEntry());
    },

    bindClick(id, callback) {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('click', (e) => {
                if (window.AudioManager) AudioManager.play('click');
                callback(e);
            });
        }
    },

    // ==================== ASSISTANT ====================

    bindAssistantActions() {
        // Google Sign In
        this.bindClick('btn-google-signin', () => {
            if (window.GoogleAuth) {
                GoogleAuth.signIn();
            } else {
                this.showToast('Google Auth not available');
            }
        });

        // Google Sign Out
        this.bindClick('btn-google-signout', () => {
            if (window.GoogleAuth) {
                GoogleAuth.signOut();
                this.showToast('Disconnected from Google');
            }
        });

        // Quick Calendar Check
        this.bindClick('btn-quick-calendar', async () => {
            if (!window.GoogleAuth?.isSignedIn) {
                this.showToast('Please connect Google first');
                return;
            }
            if (window.Assistant) {
                const summary = await Assistant.quickCalendarCheck();
                Assistant.addMessageToUI('assistant', summary);
            }
        });

        // Quick Email Check
        this.bindClick('btn-quick-email', async () => {
            if (!window.GoogleAuth?.isSignedIn) {
                this.showToast('Please connect Google first');
                return;
            }
            if (window.Assistant) {
                const summary = await Assistant.quickEmailCheck();
                Assistant.addMessageToUI('assistant', summary);
            }
        });

        // Focus Tips
        this.bindClick('btn-quick-focus', () => {
            if (window.Assistant) {
                const tips = [
                    "🎯 **Quick Focus Tip:**\n• Close all unnecessary tabs\n• Put phone in another room\n• Set a 15-minute timer\n• Start with the smallest task",
                    "🎯 **Energy Check:**\n• Low energy? Do admin tasks\n• High energy? Do creative work\n• Match your tasks to your current state",
                    "🎯 **Stuck Starting?**\n• Commit to just 2 minutes\n• The hardest part is starting\n• Movement creates momentum"
                ];
                const tip = tips[Math.floor(Math.random() * tips.length)];
                Assistant.addMessageToUI('assistant', tip);
            }
        });
    },

    // ==================== DAILY CHECK-IN ====================

    initDailyCheckin() {
        // Load history
        const history = JSON.parse(localStorage.getItem('adhd_checkins') || '[]');
        const list = document.getElementById('checkin-list');

        if (list) {
            list.innerHTML = history.slice(0, 5).map(entry => `
                <div class="history-item">
                    <span class="history-date">${new Date(entry.date).toLocaleDateString()}</span>
                    <span class="history-mood">${entry.mood}</span>
                    <span class="history-focus">Focus: ${entry.intention}</span>
                </div>
            `).join('');
        }
    },

    saveDailyCheckin() {
        const moodBtn = document.querySelector('.mood-btn.selected');
        const p1 = document.getElementById('priority-1').value;
        const p2 = document.getElementById('priority-2').value;
        const p3 = document.getElementById('priority-3').value;
        const intention = document.getElementById('focus-intention').value;

        if (!moodBtn) {
            this.showToast('How are you feeling properly? Select a mood!');
            return;
        }

        const checkin = {
            id: Date.now(),
            date: new Date().toISOString(),
            mood: moodBtn.textContent, // Save the emoji
            priorities: [p1, p2, p3].filter(p => p),
            intention: intention
        };

        const history = JSON.parse(localStorage.getItem('adhd_checkins') || '[]');
        history.unshift(checkin);
        localStorage.setItem('adhd_checkins', JSON.stringify(history));

        // XP Reward
        if (window.XPSystem) {
            XPSystem.addXP(30, 'Daily Check-in');
            XPSystem.incrementStat('checkins');
            XPSystem.completeQuest('daily-checkin');
        }

        this.showToast('Check-in saved! Have a great day! 🌟');
        this.showSubView('tools', 'tools-home');
    },

    // ==================== SKILL CARDS ====================

    renderSkillCards() {
        const grid = document.getElementById('skill-cards-grid');
        if (!grid) return;

        // Get skills from CBT campaign storage (it manages them)
        // We'll peek into localStorage used by CBTCampaign
        const cbtData = JSON.parse(localStorage.getItem('adhd_cbt_campaign') || '{"skillCards": []}');
        const skills = cbtData.skillCards || [];

        if (skills.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <p>No skill cards yet. Complete CBT lessons to earn them!</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = skills.map(skill => `
            <div class="skill-card-item">
                <h3>${skill.id.replace(/-/g, ' ').toUpperCase()}</h3>
                <div class="card-content">${this.formatContent(skill.content)}</div>
            </div>
        `).join('');
    },

    // ==================== JOURNAL ====================

    renderJournalEntries() {
        const list = document.getElementById('journal-entries-list');
        const entries = JSON.parse(localStorage.getItem('adhd_journal') || '[]');

        if (list) {
            if (entries.length === 0) {
                list.innerHTML = '<p class="empty-text">No entries yet. Start writing!</p>';
                return;
            }

            list.innerHTML = entries.map(entry => `
                <div class="journal-card">
                    <div class="journal-date">${new Date(entry.date).toLocaleString()}</div>
                    <div class="journal-section">
                        <strong>Wins:</strong> ${entry.wins}
                    </div>
                </div>
            `).join('');
        }
    },

    saveJournalEntry() {
        const wins = document.getElementById('journal-wins').value;
        const challenges = document.getElementById('journal-challenges').value;
        const learnings = document.getElementById('journal-learnings').value;

        if (!wins && !challenges) {
            this.showToast('Write a little something first! ✍️');
            return;
        }

        const entry = {
            id: Date.now(),
            date: new Date().toISOString(),
            wins,
            challenges,
            learnings
        };

        const entries = JSON.parse(localStorage.getItem('adhd_journal') || '[]');
        entries.unshift(entry);
        localStorage.setItem('adhd_journal', JSON.stringify(entries));

        // XP Reward
        if (window.XPSystem) {
            XPSystem.addXP(40, 'Reflection Journal');
        }

        // Clear form
        document.getElementById('journal-wins').value = '';
        document.getElementById('journal-challenges').value = '';
        document.getElementById('journal-learnings').value = '';

        this.showToast('Entry saved! Great reflection. 🧠');
        this.renderJournalEntries();
    },

    // ==================== MEMORY PALACE ====================

    handleLocusClick(locus) {
        const locusId = locus.dataset.locusId;
        const locusName = locus.dataset.name;

        if (this.mode === 'place') {
            this.openPlaceModal(locusId, locusName);
        } else {
            this.openReviewModal(locusId, locusName);
        }
    },

    openPlaceModal(locusId, locusName) {
        const modal = document.getElementById('modal-overlay');
        const title = document.getElementById('modal-title');
        const placeForm = document.getElementById('place-form');
        const reviewForm = document.getElementById('review-form');
        const locationDisplay = document.getElementById('location-display');

        if (title) title.textContent = 'Place Memory';
        if (locationDisplay) locationDisplay.textContent = locusName;
        if (placeForm) placeForm.style.display = 'block';
        if (reviewForm) reviewForm.style.display = 'none';
        if (modal) modal.classList.add('active');

        this.currentLocusId = locusId;
        this.currentLocusName = locusName;

        // Clear form
        const contentInput = document.getElementById('memory-content');
        const mnemonicInput = document.getElementById('memory-mnemonic');
        if (contentInput) contentInput.value = '';
        if (mnemonicInput) mnemonicInput.value = '';
        if (contentInput) contentInput.focus();
    },

    openReviewModal(locusId, locusName) {
        const memory = Memory.getByLocusId(locusId);
        if (!memory) {
            this.showToast('No memory stored here yet!');
            return;
        }

        const modal = document.getElementById('modal-overlay');
        const title = document.getElementById('modal-title');
        const placeForm = document.getElementById('place-form');
        const reviewForm = document.getElementById('review-form');
        const reviewLocation = document.getElementById('review-location');
        const revealedContent = document.getElementById('revealed-content');

        if (title) title.textContent = 'Review Memory';
        if (reviewLocation) reviewLocation.textContent = locusName;
        if (placeForm) placeForm.style.display = 'none';
        if (reviewForm) reviewForm.style.display = 'block';
        if (revealedContent) revealedContent.style.display = 'none';
        if (modal) modal.classList.add('active');

        this.currentMemory = memory;
    },

    revealMemory() {
        const revealedContent = document.getElementById('revealed-content');
        const reviewFact = document.getElementById('review-fact');
        const reviewMnemonic = document.getElementById('review-mnemonic');
        const revealBtn = document.getElementById('btn-reveal');

        if (this.currentMemory) {
            if (reviewFact) reviewFact.textContent = this.currentMemory.content;
            if (reviewMnemonic) reviewMnemonic.textContent = this.currentMemory.mnemonic;
            if (revealedContent) revealedContent.style.display = 'block';
            if (revealBtn) revealBtn.style.display = 'none';
        }
    },

    saveMemory() {
        const content = document.getElementById('memory-content')?.value.trim();
        const mnemonic = document.getElementById('memory-mnemonic')?.value.trim();

        if (!content) {
            this.showToast('Please enter something to remember!');
            return;
        }

        Memory.create({
            locusId: this.currentLocusId,
            locusName: this.currentLocusName,
            content: content,
            mnemonic: mnemonic
        });

        // Update XP
        if (window.XPSystem) {
            XPSystem.addXP(20, 'Created memory');
            XPSystem.incrementStat('memories');
        }

        this.closeModal();
        this.updateAllStats();
        this.updateLocusVisuals();
        this.showToast('Memory imprinted! 🧠');
    },

    rateMemory(rating) {
        if (this.currentMemory) {
            // Use the correct method that updates SRS internally
            Memory.updateAfterReview(this.currentMemory.locusId, rating);

            // Award XP & Quest
            if (window.XPSystem) {
                XPSystem.addXP(5, 'Memory Reviewed');
                XPSystem.completeQuest('review-memories');
            }

            // Update palace visuals
            if (window.Palace) {
                Palace.updateLociVisuals();
            }

            this.closeModal();
            this.updateAllStats();
            this.showToast('Memory reviewed! 💪');
        }
    },

    closeModal() {
        const modal = document.getElementById('modal-overlay');
        if (modal) modal.classList.remove('active');
    },

    updateModeUI() {
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === this.mode);
        });

        const instruction = document.getElementById('instruction-text');
        if (instruction) {
            instruction.textContent = this.mode === 'place'
                ? 'Click on any object to place a memory'
                : 'Click on a glowing object to review';
        }
    },

    updateLocusVisuals() {
        document.querySelectorAll('.locus').forEach(locus => {
            const locusId = locus.dataset.locusId;
            const memory = Memory.getByLocusId(locusId);
            locus.classList.toggle('has-memory', !!memory);
        });
    },

    // ==================== MEMORY CAMPAIGN ====================

    renderMemoryLessons() {
        const list = document.getElementById('memory-lesson-list');
        if (!list || !window.Campaign) return;

        const progress = Campaign.getProgress();

        list.innerHTML = Campaign.lessons.map((lesson, i) => {
            const isCompleted = progress.completedLessons.includes(lesson.id);
            const isLocked = i > 0 && !progress.completedLessons.includes(Campaign.lessons[i - 1].id);

            return `
                <div class="lesson-card ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}" 
                     data-lesson-id="${lesson.id}">
                    <span class="lesson-number">${i + 1}</span>
                    <div class="lesson-info">
                        <h3>${lesson.title}</h3>
                        <p>${lesson.steps.length} steps</p>
                    </div>
                    <span class="lesson-status">${isCompleted ? '✅' : isLocked ? '🔒' : '▶️'}</span>
                </div>
            `;
        }).join('');

        // Bind lesson clicks
        list.querySelectorAll('.lesson-card:not(.locked)').forEach(card => {
            card.addEventListener('click', () => {
                const lessonId = parseInt(card.dataset.lessonId);
                this.startMemoryLesson(lessonId);
            });
        });
    },

    startMemoryLesson(lessonId) {
        if (window.Campaign) {
            Campaign.startLesson(lessonId);
            this.showSubView('memory', 'memory-lesson');
        }
    },

    // ==================== CBT CAMPAIGN ====================

    startCBTModule(moduleId) {
        if (!window.CBTCampaign) return;

        const module = CBTCampaign.modules.find(m => m.id === moduleId);
        if (!module || module.lessons.length === 0) return;

        // Start first incomplete lesson
        const progress = CBTCampaign.getProgress();
        const nextLesson = module.lessons.find(l => !progress.completedLessons.includes(l.id));

        if (nextLesson) {
            this.startCBTLesson(nextLesson);
        } else {
            this.showToast('Module complete! 🎉');
        }
    },


    currentCBTLesson: null,
    currentCBTStep: 0,

    startCBTLesson(lesson) {
        this.currentCBTLesson = lesson;
        this.currentCBTStep = 0;
        this.showSubView('cbt', 'cbt-lesson');
        this.renderCBTStep();

        // Bind next button
        const nextBtn = document.getElementById('btn-cbt-lesson-next');
        if (nextBtn) {
            nextBtn.onclick = () => this.nextCBTStep();
        }
    },

    // ==================== DAILY CHALLENGE ====================

    startDailyChallenge(type) {
        if (!window.DailyChallenge) return;

        const difficultySelect = document.getElementById('challenge-uidifficulty');
        const difficulty = difficultySelect ? difficultySelect.value : 'easy';

        const challenge = DailyChallenge.generate(type, difficulty);

        // Convert challenge to a temporary lesson format relative to campaign
        const tempLesson = {
            id: challenge.id,
            title: challenge.title,
            steps: [
                {
                    type: 'info',
                    title: 'Memorize These Items',
                    content: `Time to memorize! Here are your items:\n\n${challenge.items.map(i => `• ${i}`).join('\n')}\n\nTake your time. Click continue when ready to test.`,
                    icon: '🧠'
                },
                {
                    type: 'fill-blank',
                    title: 'Recall Test',
                    content: 'Type as many items as you can remember. (Comma separated)',
                    correctAnswer: challenge.items,
                    validation: 'list-match',
                    xp: challenge.xp
                },
                {
                    type: 'complete',
                    title: 'Challenge Complete!',
                    content: `Great practice! You earned ${challenge.xp} XP.`,
                    xp: challenge.xp
                }
            ]
        };

        // Use CBT renderer for now as it's flexible
        this.startCBTLesson(tempLesson);
    },

    renderCBTStep() {
        if (!this.currentCBTLesson) return;

        const step = this.currentCBTLesson.steps[this.currentCBTStep];
        const content = document.getElementById('cbt-lesson-content');
        const progressFill = document.getElementById('cbt-lesson-progress');
        const nextBtn = document.getElementById('btn-cbt-lesson-next');

        // Update progress
        const total = this.currentCBTLesson.steps.length;
        const progress = ((this.currentCBTStep + 1) / total) * 100;
        if (progressFill) progressFill.style.width = `${progress}%`;

        if (!content || !step) return;

        // Update button text
        if (nextBtn) {
            nextBtn.textContent = (this.currentCBTStep === total - 1) ? 'Finish Lesson' : 'Continue →';
            nextBtn.disabled = false;
        }

        // Render based on step type
        let html = '';

        switch (step.type) {
            case 'info':
                html = `
                    <div class="lesson-step info-step">
                        <div class="step-icon">${step.icon || '📖'}</div>
                        <h2>${step.title}</h2>
                        <div class="step-content">${this.formatContent(step.content)}</div>
                    </div>
                `;
                break;

            case 'reflection':
                html = `
                    <div class="lesson-step reflection-step">
                        <div class="step-icon">🤔</div>
                        <h2>${step.title}</h2>
                        <div class="step-content">${this.formatContent(step.content)}</div>
                        <div class="reflection-options">
                            ${step.options.map(opt => `<button class="reflection-option">${opt}</button>`).join('')}
                        </div>
                    </div>
                `;
                break;

            case 'action':
            case 'skill-card':
                html = `
                    <div class="lesson-step">
                        <div class="step-icon">${step.type === 'action' ? '⚡' : '🃏'}</div>
                        <h2>${step.title}</h2>
                        <div class="step-content">${this.formatContent(step.content)}</div>
                        ${step.saveAs ? `<div class="save-indicator">Card saved to Toolbox</div>` : ''}
                    </div>
                `;
                // Auto-save skill card
                if (step.saveAs && window.CBTCampaign) {
                    CBTCampaign.saveSkillCard(step.saveAs, step.content);
                }
                break;

            case 'complete':
                html = `
                    <div class="lesson-step complete-step">
                        <div class="step-icon">🎉</div>
                        <h2>${step.title}</h2>
                        <div class="step-content">${this.formatContent(step.content)}</div>
                        ${step.xp ? `<div class="xp-reward">+${step.xp} XP</div>` : ''}
                    </div>
                `;
                if (nextBtn) nextBtn.textContent = 'FINISH →';
                // Award XP if first time? (Logic usually in nextStep)
                if (step.xp && window.XPSystem) {
                    // Logic to ensure not double counting handled in completeLesson
                }
                break;

            case 'quiz':
                html = `
                    <div class="lesson-step quiz-step">
                        <div class="step-icon">❓</div>
                        <h2>${step.title}</h2>
                        <p class="quiz-question">${step.question}</p>
                        <div class="quiz-options">
                            ${step.options.map((opt, i) => `
                                <button class="quiz-option" data-index="${i}">${opt}</button>
                            `).join('')}
                        </div>
                        <div class="quiz-feedback" id="quiz-feedback" style="display:none;"></div>
                    </div>
                `;
                if (nextBtn) nextBtn.disabled = true;
                break;

            case 'project':
                html = `
                    <div class="lesson-step project-step">
                        <div class="step-icon">🚀</div>
                        <h2>${step.title}</h2>
                        <div class="step-content">${this.formatContent(step.content)}</div>
                        <div class="project-commitment">
                            <label class="checkbox-container">
                                <input type="checkbox" id="project-check">
                                <span class="checkmark"></span>
                                I commit to trying this project
                            </label>
                        </div>
                    </div>
                `;
                if (nextBtn) nextBtn.disabled = true;
                break;

            // NEW INTERACTIVE TYPES
            case 'fill-blank':
                html = `
                    <div class="lesson-step interactive-step">
                        <div class="step-icon">✍️</div>
                        <h2>${step.title}</h2>
                        <p class="instruction">${step.content}</p>
                        <textarea id="interactive-input" class="interactive-input" placeholder="Type your answer here..."></textarea>
                        <div id="interactive-feedback" class="feedback"></div>
                        <button id="btn-check-answer" class="btn-primary" style="margin-top:10px;">Check Answer</button>
                    </div>
                `;
                if (nextBtn) nextBtn.disabled = true;
                break;

            case 'reframe':
                html = `
                    <div class="lesson-step interactive-step">
                        <div class="step-icon">🔄</div>
                        <h2>${step.title}</h2>
                        <div class="step-content">
                            <div class="negative-thought">"${step.negativeThought || 'I hate myself'}"</div>
                            <p>Reframe this into a more balanced or positive statement:</p>
                        </div>
                        <textarea id="interactive-input" class="interactive-input" placeholder="I..."></textarea>
                         <div id="interactive-feedback" class="feedback"></div>
                         <button id="btn-check-answer" class="btn-primary" style="margin-top:10px;">Validate Reframe</button>
                    </div>
                `;
                if (nextBtn) nextBtn.disabled = true;
                break;
        }

        content.innerHTML = html;

        // BIND EVENT LISTENERS LOCALLY

        // Reflection
        content.querySelectorAll('.reflection-option').forEach(btn => {
            btn.addEventListener('click', () => {
                content.querySelectorAll('.reflection-option').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
        });

        // Quiz
        content.querySelectorAll('.quiz-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedIndex = parseInt(btn.dataset.index);
                this.handleQuizAnswer(step, selectedIndex, btn);
            });
        });

        // Project
        const projectCheck = document.getElementById('project-check');
        if (projectCheck) {
            projectCheck.addEventListener('change', (e) => {
                if (nextBtn) nextBtn.disabled = !e.target.checked;
            });
        }

        // Interactive (Check Answer)
        const checkBtn = document.getElementById('btn-check-answer');
        if (checkBtn) {
            checkBtn.addEventListener('click', () => {
                this.handleInteractiveCheck(step);
            });
        }
    },

    nextCBTStep() {
        if (!this.currentCBTLesson) return;

        this.currentCBTStep++;

        if (this.currentCBTStep >= this.currentCBTLesson.steps.length) {
            // Lesson complete
            const lastStep = this.currentCBTLesson.steps[this.currentCBTLesson.steps.length - 1];
            const xp = lastStep.xp || 50;

            if (window.CBTCampaign) {
                CBTCampaign.completeLesson(this.currentCBTLesson.id, xp);
            }

            // Quest check
            if (window.XPSystem) {
                // Only count as CBT lesson if it is actually from the campaign (not a daily challenge)
                if (window.CBTCampaign && CBTCampaign.getLesson(this.currentCBTLesson.id)) {
                    XPSystem.completeQuest('cbt-lesson');
                }
            }

            this.showSubView('cbt', 'cbt-home');
            this.updateCBTModuleUI();
            this.showToast('Lesson complete! 🎉');
        } else {
            this.renderCBTStep();
        }
    },

    handleQuizAnswer(step, selectedIndex, btnElement) {
        const feedback = document.getElementById('quiz-feedback');
        const nextBtn = document.getElementById('btn-cbt-lesson-next');
        const allBtns = document.querySelectorAll('.quiz-option');

        // Disable all buttons to prevent re-answering
        // allBtns.forEach(b => b.disabled = true);

        if (selectedIndex === step.correctIndex) {
            // Correct
            btnElement.classList.add('correct');
            feedback.className = 'quiz-feedback feedback-correct';
            feedback.innerHTML = `< strong > Correct!</strong > ${step.explanation} `;
            feedback.style.display = 'block';
            if (nextBtn) nextBtn.disabled = false;
        } else {
            // Incorrect
            btnElement.classList.add('incorrect');
            feedback.className = 'quiz-feedback feedback-incorrect';
            feedback.innerHTML = `<strong>Not quite.</strong> Try again!`;
            feedback.style.display = 'block';
        }
    },

    handleInteractiveCheck(step) {
        const input = document.getElementById('interactive-input');
        const feedback = document.getElementById('interactive-feedback');
        const nextBtn = document.getElementById('btn-cbt-lesson-next');

        if (!input || !feedback) return;

        const userAnswer = input.value.trim();

        if (!userAnswer) {
            feedback.textContent = 'Please enter an answer first!';
            feedback.className = 'feedback feedback-incorrect';
            return;
        }

        // Handle list-match validation (for Daily Challenge)
        if (step.validation === 'list-match' && step.correctAnswer) {
            const correctItems = step.correctAnswer.map(i => i.toString().toLowerCase());
            const userItems = userAnswer.split(',').map(i => i.trim().toLowerCase()).filter(i => i);

            const matches = userItems.filter(item => correctItems.includes(item));
            const score = matches.length;
            const total = correctItems.length;
            const percentage = Math.round((score / total) * 100);

            feedback.innerHTML = `You remembered <strong>${score}/${total}</strong> items (${percentage}%)!`;
            feedback.className = score >= total * 0.7 ? 'feedback feedback-correct' : 'feedback feedback-partial';

            // Award XP based on performance
            if (step.xp && window.XPSystem) {
                const earnedXP = Math.round(step.xp * (score / total));
                XPSystem.addXP(earnedXP, 'Daily Challenge');
            }

            if (nextBtn) nextBtn.disabled = false;
        }
        // Handle reframe validation (just needs some text)
        else if (step.type === 'reframe' || !step.validation) {
            if (userAnswer.length >= 10) {
                feedback.innerHTML = '<strong>Great reframe!</strong> Keep practicing this skill.';
                feedback.className = 'feedback feedback-correct';
                if (nextBtn) nextBtn.disabled = false;

                if (window.XPSystem) {
                    XPSystem.addXP(15, 'Thought Reframe');
                }
            } else {
                feedback.textContent = 'Try to write a bit more...';
                feedback.className = 'feedback feedback-incorrect';
            }
        }
    },

    handleFactoryReset() {
        if (confirm('Are you SURE? This will delete all memories, progress, and settings. This cannot be undone.')) {
            // Explicitly remove known keys
            const keys = ['xp_data', 'adhd_campaign', 'adhd_cbt_campaign', 'memory_palace_data', 'srs_data'];
            keys.forEach(key => localStorage.removeItem(key));

            // Clear everything else to be safe
            localStorage.clear();

            // Force save emptiness if any systems try to autosave on unload
            if (window.XPSystem) window.XPSystem.saveData({ xp: 0, level: 1, streak: 0 });

            alert('App has been reset. Reloading...');
            setTimeout(() => {
                location.reload();
            }, 100);
        }
    },

    updateCBTModuleUI() {
        if (!window.CBTCampaign) return;

        document.querySelectorAll('.module-card').forEach((card, i) => {
            const moduleId = card.dataset.module;
            const isUnlocked = CBTCampaign.isModuleUnlocked(i);
            const completion = CBTCampaign.getModuleCompletion(moduleId);

            card.classList.toggle('locked', !isUnlocked);

            const status = card.querySelector('.module-status');
            const progressFill = card.querySelector('.module-progress-fill');

            if (status) {
                if (!isUnlocked) {
                    status.textContent = '🔒';
                } else {
                    const module = CBTCampaign.modules.find(m => m.id === moduleId);
                    const total = module ? module.lessons.length : 0;
                    const completed = Math.round((completion / 100) * total);
                    status.textContent = `${completed}/${total}`;
                }
            }

            if (progressFill) {
                progressFill.style.width = `${completion}%`;
            }
        });
    },

    formatContent(content) {
        // Convert markdown-style formatting to HTML
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .replace(/• /g, '• ')
            .replace(/✓ /g, '✓ ');
    },

    // ==================== STATS & DATA ====================

    loadData() {
        // Update memory stats
        this.updateAllStats();
        this.updateLocusVisuals();
        this.updateCBTModuleUI();
    },

    updateAllStats() {
        const memories = Memory.getAll();
        const dueMemories = memories.filter(m => SRS.isDue(m.nextReview));

        // Memory stats
        this.updateStat('stat-total-memories', memories.length);
        this.updateStat('stat-mastered', memories.filter(m => m.srsBucket >= 5).length);
        this.updateStat('memory-due-count', dueMemories.length);

        // Campaign progress
        if (window.Campaign) {
            const progress = Campaign.getProgress();
            const progressText = document.getElementById('memory-campaign-progress');
            if (progressText) {
                progressText.textContent = `${progress.completedLessons.length}/5`;
            }

            // Unlock freeform if campaign complete
            const freeformBtn = document.getElementById('btn-memory-freeform');
            const lock = document.getElementById('freeform-lock');
            if (progress.completedLessons.length >= 1) {
                if (freeformBtn) freeformBtn.disabled = false;
                if (lock) lock.style.display = 'none';
            }
        }

        // Streak
        if (window.XPSystem) {
            const data = XPSystem.getData();
            this.updateStat('stat-streak', data.streak);
        }
    },

    updateStat(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
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

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Export
window.App = App;
