/**
 * Habit Tracker Tool
 * Simple daily habit tracking with streaks
 */

const HabitTracker = {
    state: {
        habits: []
    },

    init() {
        this.loadData();
        this.checkDayReset();
        this.bindEvents();
        this.render();
    },

    bindEvents() {
        const addBtn = document.getElementById('btn-add-habit');
        const input = document.getElementById('new-habit-input');

        if (addBtn) addBtn.addEventListener('click', () => this.addHabit());

        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.addHabit();
                }
            });
        }
    },

    loadData() {
        const saved = localStorage.getItem('adhd_habits');
        if (saved) {
            this.state.habits = JSON.parse(saved);
        } else {
            // Default habits
            this.state.habits = [
                { id: 'h1', name: 'Drink Water', streak: 0, completedToday: false, history: [] },
                { id: 'h2', name: 'Take Meds', streak: 0, completedToday: false, history: [] }
            ];
            this.saveData();
        }
    },

    saveData() {
        localStorage.setItem('adhd_habits', JSON.stringify(this.state.habits));
    },

    checkDayReset() {
        const lastLoginDate = localStorage.getItem('adhd_last_login_date');
        const today = new Date().toDateString();

        if (lastLoginDate !== today) {
            // New day
            this.state.habits.forEach(h => {
                if (!h.completedToday && h.streak > 0) {
                    // Streak broken (optional: forgive one day logic could go here)
                    h.streak = 0;
                }
                h.completedToday = false;
            });
            localStorage.setItem('adhd_last_login_date', today);
            this.saveData();
        }
    },

    addHabit() {
        const input = document.getElementById('new-habit-input');
        if (!input || !input.value.trim()) return;

        const newHabit = {
            id: Date.now().toString(),
            name: input.value.trim(),
            streak: 0,
            completedToday: false,
            history: []
        };

        this.state.habits.push(newHabit);
        this.saveData();
        this.render();
        input.value = '';

        if (window.App) App.showToast('Habit added!');
    },

    toggleHabit(id) {
        const habit = this.state.habits.find(h => h.id === id);
        if (!habit) return;

        habit.completedToday = !habit.completedToday;

        if (habit.completedToday) {
            habit.streak++;
            habit.history.push(new Date().toISOString());

            // XP Reward
            if (window.XPSystem) {
                window.XPSystem.addXP(10, 'Habit Completed');
            }

            // Celebration
            if (window.App) App.showToast(`Habit done! Streak: ${habit.streak} 🔥`);
        } else {
            habit.streak--;
            habit.history.pop();
        }

        this.saveData();
        this.render();
    },

    deleteHabit(id) {
        if (confirm('Delete this habit?')) {
            this.state.habits = this.state.habits.filter(h => h.id !== id);
            this.saveData();
            this.render();
        }
    },

    render() {
        const list = document.getElementById('habit-list');
        if (!list) return;

        if (this.state.habits.length === 0) {
            list.innerHTML = '<div class="empty-state">No habits yet. Add one!</div>';
            return;
        }

        list.innerHTML = this.state.habits.map(habit => `
            <div class="habit-item ${habit.completedToday ? 'completed' : ''}" id="habit-${habit.id}">
                <div class="habit-info">
                    <span class="habit-name">${habit.name}</span>
                    <span class="habit-streak">🔥 ${habit.streak}</span>
                </div>
                <div class="habit-actions">
                    <button class="btn-check" onclick="HabitTracker.toggleHabit('${habit.id}')">
                        ${habit.completedToday ? '✓' : '○'}
                    </button>
                    <button class="btn-delete-habit" onclick="HabitTracker.deleteHabit('${habit.id}')">×</button>
                </div>
            </div>
        `).join('');
    }
};

window.HabitTracker = HabitTracker;
