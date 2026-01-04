/**
 * XP & Gamification System
 * Levels, achievements, streaks, and daily quests
 */

const XPSystem = {
    // Level definitions
    levels: [
        { level: 1, title: 'Beginner', xpRequired: 0 },
        { level: 2, title: 'Learner', xpRequired: 200 },
        { level: 3, title: 'Apprentice', xpRequired: 500 },
        { level: 4, title: 'Practitioner', xpRequired: 1000 },
        { level: 5, title: 'Skilled', xpRequired: 2000 },
        { level: 6, title: 'Expert', xpRequired: 4000 },
        { level: 7, title: 'Master', xpRequired: 8000 },
        { level: 8, title: 'Champion', xpRequired: 15000 }
    ],

    // Achievement definitions
    achievements: [
        { id: 'first-focus', name: 'First Focus', icon: '🎯', description: 'Complete first focus session', condition: (data) => data.focusSessions >= 1 },
        { id: 'thought-detective', name: 'Thought Detective', icon: '🧠', description: 'Challenge 10 negative thoughts', condition: (data) => data.thoughtChallenges >= 10 },
        { id: 'streak-7', name: '7-Day Streak', icon: '🔥', description: 'Use the app 7 days in a row', condition: (data) => data.streak >= 7 },
        { id: 'streak-30', name: 'Monthly Master', icon: '🌟', description: 'Use the app 30 days in a row', condition: (data) => data.streak >= 30 },
        { id: 'palace-builder', name: 'Palace Builder', icon: '🏰', description: 'Store 20 memories', condition: (data) => data.memories >= 20 },
        { id: 'memory-athlete', name: 'Memory Athlete', icon: '🏆', description: 'Store 50 memories', condition: (data) => data.memories >= 50 },
        { id: 'cbt-graduate', name: 'CBT Graduate', icon: '🎓', description: 'Complete all CBT modules', condition: (data) => data.cbtComplete },
        { id: 'focus-master', name: 'Focus Master', icon: '⏱️', description: 'Complete 25 focus sessions', condition: (data) => data.focusSessions >= 25 }
    ],

    // Daily quests (refreshed daily)
    // Daily quests (refreshed daily)
    dailyQuests: [
        { id: 'cbt-lesson', text: 'Complete 1 CBT lesson', xp: 50 },
        { id: 'focus-session', text: 'Do a 15-min focus session', xp: 30 },
        { id: 'review-memories', text: 'Review a memory', xp: 25 },
        { id: 'thought-challenge', text: 'Log 1 thought challenge', xp: 25 },
        { id: 'daily-checkin', text: 'Complete daily check-in', xp: 20 }
    ],

    // Initialize
    init() {
        this.checkStreak();
        this.updateUI();
    },

    // Get user data
    getData() {
        const defaultData = {
            xp: 0,
            level: 1,
            streak: 0,
            lastVisit: null,
            unlockedAchievements: [],
            questsCompletedToday: [],
            focusSessions: 0,
            thoughtChallenges: 0,
            memories: 0,
            cbtComplete: false
        };
        const saved = localStorage.getItem('xp_data');
        return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
    },

    // Save user data
    saveData(data) {
        localStorage.setItem('xp_data', JSON.stringify(data));
    },

    // Add XP
    addXP(amount, reason = '') {
        const data = this.getData();
        const oldLevel = this.getLevelInfo(data.xp).level;

        data.xp += amount;
        this.saveData(data);

        const newLevel = this.getLevelInfo(data.xp).level;

        // Level up notification
        if (newLevel > oldLevel) {
            this.showLevelUp(newLevel);
        }

        // Show XP gain
        this.showXPGain(amount, reason);

        // Update UI
        this.updateUI();

        return data.xp;
    },

    // Get level info for given XP
    getLevelInfo(xp) {
        let currentLevel = this.levels[0];
        let nextLevel = this.levels[1];

        for (let i = this.levels.length - 1; i >= 0; i--) {
            if (xp >= this.levels[i].xpRequired) {
                currentLevel = this.levels[i];
                nextLevel = this.levels[i + 1] || null;
                break;
            }
        }

        return {
            level: currentLevel.level,
            title: currentLevel.title,
            currentXP: xp,
            xpForNext: nextLevel ? nextLevel.xpRequired : null,
            xpInLevel: xp - currentLevel.xpRequired,
            xpNeededForNext: nextLevel ? nextLevel.xpRequired - currentLevel.xpRequired : 0,
            progress: nextLevel ?
                ((xp - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100 : 100
        };
    },

    // Check and update streak
    checkStreak() {
        const data = this.getData();
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        if (data.lastVisit === today) {
            // Already visited today
            return data.streak;
        } else if (data.lastVisit === yesterday) {
            // Continuing streak
            data.streak++;
            data.lastVisit = today;
            data.questsCompletedToday = []; // Reset daily quests
        } else if (data.lastVisit === null) {
            // First visit ever
            data.streak = 1;
            data.lastVisit = today;
        } else {
            // Streak broken
            data.streak = 1;
            data.lastVisit = today;
            data.questsCompletedToday = [];
        }

        this.saveData(data);
        this.checkAchievements();
        return data.streak;
    },

    // Complete a daily quest
    completeQuest(questId) {
        const data = this.getData();
        if (!data.questsCompletedToday.includes(questId)) {
            data.questsCompletedToday.push(questId);
            const quest = this.dailyQuests.find(q => q.id === questId);
            if (quest) {
                data.xp += quest.xp;
                this.showToast(`Quest complete! +${quest.xp} XP`);
                if (window.AudioManager) AudioManager.play('success');
            }
            this.saveData(data);
            this.updateUI();
        }
    },

    // Alias for method called in app.js
    checkDailyQuests() {
        // This function seems to have been intended to check logic, but current implementation 
        // relies on explicit completeQuest calls. We'll leave this empty or deprecated.
        console.warn('XPSystem.checkDailyQuests is deprecated. Use completeQuest(id) instead.');
    },

    // Increment stat and check achievements
    incrementStat(stat, amount = 1) {
        const data = this.getData();
        if (data[stat] !== undefined) {
            data[stat] += amount;
            this.saveData(data);
            this.checkAchievements();
        }
    },

    // Check and award achievements
    checkAchievements() {
        const data = this.getData();

        this.achievements.forEach(achievement => {
            if (!data.unlockedAchievements.includes(achievement.id)) {
                if (achievement.condition(data)) {
                    data.unlockedAchievements.push(achievement.id);
                    this.showAchievement(achievement);
                    data.xp += 100; // Bonus XP for achievement
                }
            }
        });

        this.saveData(data);
        this.updateUI();
    },

    // UI Updates
    updateUI() {
        const data = this.getData();
        const levelInfo = this.getLevelInfo(data.xp);

        // Level & XP bar
        const levelBadge = document.getElementById('user-level');
        const levelTitle = document.getElementById('user-title');
        const xpFill = document.getElementById('xp-fill');
        const xpText = document.getElementById('xp-text');

        if (levelBadge) levelBadge.textContent = `Level ${levelInfo.level}`;
        if (levelTitle) levelTitle.textContent = levelInfo.title;
        if (xpFill) xpFill.style.width = `${levelInfo.progress}%`;
        if (xpText) {
            xpText.textContent = levelInfo.xpForNext ?
                `${data.xp} / ${levelInfo.xpForNext} XP` :
                `${data.xp} XP (Max Level!)`;
        }

        // Streak
        const streakNumber = document.getElementById('streak-number');
        if (streakNumber) streakNumber.textContent = data.streak;

        // Daily quests
        this.updateQuestUI(data);

        // Achievements
        this.updateAchievementsUI(data);
    },

    updateQuestUI(data) {
        const questList = document.getElementById('quest-list');
        if (!questList) return;

        questList.innerHTML = this.dailyQuests.map(quest => {
            const completed = data.questsCompletedToday.includes(quest.id);
            return `
                <div class="quest-item ${completed ? 'completed' : ''}">
                    <span class="quest-check">${completed ? '☑' : '☐'}</span>
                    <span class="quest-text">${quest.text}</span>
                    <span class="quest-xp">+${quest.xp} XP</span>
                </div>
            `;
        }).join('');
    },

    updateAchievementsUI(data) {
        const grid = document.getElementById('achievements-grid');
        if (!grid) return;

        grid.innerHTML = this.achievements.map(achievement => {
            const unlocked = data.unlockedAchievements.includes(achievement.id);
            return `
                <div class="achievement ${unlocked ? 'unlocked' : 'locked'}" title="${achievement.description}">
                    <span class="achievement-icon">${achievement.icon}</span>
                    <span class="achievement-name">${achievement.name}</span>
                </div>
            `;
        }).join('');
    },

    // Notifications
    showXPGain(amount, reason) {
        this.showToast(`+${amount} XP${reason ? `: ${reason}` : ''}`);
    },

    showLevelUp(newLevel) {
        const levelInfo = this.levels.find(l => l.level === newLevel);
        this.showToast(`🎉 LEVEL UP! You're now ${levelInfo.title}!`);
    },

    showAchievement(achievement) {
        this.showToast(`🏆 Achievement Unlocked: ${achievement.name}!`);
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
window.XPSystem = XPSystem;
