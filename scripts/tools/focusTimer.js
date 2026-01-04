/**
 * Focus Timer Tool
 * Pomodoro-style focus sessions with distraction logging
 */

const FocusTimer = {
    state: {
        duration: 15, // minutes
        remaining: 15 * 60, // seconds
        isRunning: false,
        isPaused: false,
        intervalId: null,
        distractions: [],
        sessionStart: null
    },

    init() {
        this.bindEvents();
        this.updateDisplay();
    },

    bindEvents() {
        const startBtn = document.getElementById('btn-timer-start');
        const pauseBtn = document.getElementById('btn-timer-pause');
        const resetBtn = document.getElementById('btn-timer-reset');
        const durationSelect = document.getElementById('timer-duration');
        const logBtn = document.getElementById('btn-log-distraction');

        if (startBtn) startBtn.addEventListener('click', () => this.start());
        if (pauseBtn) pauseBtn.addEventListener('click', () => this.pause());
        if (resetBtn) resetBtn.addEventListener('click', () => this.reset());
        if (durationSelect) {
            durationSelect.addEventListener('change', (e) => {
                this.setDuration(parseInt(e.target.value));
            });
        }
        if (logBtn) logBtn.addEventListener('click', () => this.logDistraction());
    },

    setDuration(minutes) {
        if (!this.state.isRunning) {
            this.state.duration = minutes;
            this.state.remaining = minutes * 60;
            this.updateDisplay();
        }
    },

    start() {
        if (this.state.isRunning) return;

        this.state.isRunning = true;
        this.state.isPaused = false;
        this.state.sessionStart = Date.now();

        const startBtn = document.getElementById('btn-timer-start');
        const pauseBtn = document.getElementById('btn-timer-pause');
        if (startBtn) startBtn.style.display = 'none';
        if (pauseBtn) pauseBtn.style.display = 'inline-flex';

        this.state.intervalId = setInterval(() => {
            this.state.remaining--;
            this.updateDisplay();

            if (this.state.remaining <= 0) {
                this.complete();
            }
        }, 1000);
    },

    pause() {
        if (!this.state.isRunning) return;

        this.state.isPaused = true;
        this.state.isRunning = false;
        clearInterval(this.state.intervalId);

        const startBtn = document.getElementById('btn-timer-start');
        const pauseBtn = document.getElementById('btn-timer-pause');
        if (startBtn) {
            startBtn.textContent = '▶️ RESUME';
            startBtn.style.display = 'inline-flex';
        }
        if (pauseBtn) pauseBtn.style.display = 'none';
    },

    reset() {
        this.state.isRunning = false;
        this.state.isPaused = false;
        clearInterval(this.state.intervalId);
        this.state.remaining = this.state.duration * 60;
        this.state.distractions = [];
        this.state.sessionStart = null;

        const startBtn = document.getElementById('btn-timer-start');
        const pauseBtn = document.getElementById('btn-timer-pause');
        if (startBtn) {
            startBtn.textContent = '▶️ START';
            startBtn.style.display = 'inline-flex';
        }
        if (pauseBtn) pauseBtn.style.display = 'none';

        this.updateDisplay();
        this.renderDistractions();
    },

    complete() {
        clearInterval(this.state.intervalId);
        this.state.isRunning = false;

        // Save session
        this.saveSession();

        // Award XP
        if (window.XPSystem) {
            window.XPSystem.addXP(30, 'Completed focus session');
            window.XPSystem.incrementStat('focusSessions');
            window.XPSystem.completeQuest('focus-session');
        }

        // Show completion
        const msg = `Focus session complete! ${this.state.distractions.length} distractions logged.`;
        this.showToast(msg);

        if (window.Notifications) {
            Notifications.show('Focus Session Complete! 🎯', {
                body: msg
            });
        }

        // Play sound (if available)
        this.playCompletionSound();

        // Reset for next session
        setTimeout(() => this.reset(), 2000);
    },

    logDistraction() {
        const distraction = {
            time: this.formatTime(this.state.duration * 60 - this.state.remaining),
            note: 'Distraction noted'
        };
        this.state.distractions.push(distraction);
        this.renderDistractions();

        // Quick feedback
        this.showToast('Distraction logged. Refocus! 💪');
    },

    saveSession() {
        const sessions = JSON.parse(localStorage.getItem('focus_sessions') || '[]');
        sessions.push({
            date: new Date().toISOString(),
            duration: this.state.duration,
            distractions: this.state.distractions.length
        });
        localStorage.setItem('focus_sessions', JSON.stringify(sessions));
    },

    updateDisplay() {
        const display = document.getElementById('timer-display');
        if (display) {
            display.textContent = this.formatTime(this.state.remaining);

            // Color based on time remaining
            const pct = this.state.remaining / (this.state.duration * 60);
            if (pct < 0.1) {
                display.style.color = 'var(--color-warning)';
            } else {
                display.style.color = 'var(--color-primary)';
            }
        }
    },

    renderDistractions() {
        const list = document.getElementById('distraction-list');
        if (!list) return;

        if (this.state.distractions.length === 0) {
            list.innerHTML = '<li class="no-distractions">No distractions yet. Stay focused! 🎯</li>';
        } else {
            list.innerHTML = this.state.distractions.map((d, i) =>
                `<li>@${d.time} - Distraction #${i + 1}</li>`
            ).join('');
        }
    },

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

    playCompletionSound() {
        // Simple beep using Web Audio API
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            gainNode.gain.value = 0.3;

            oscillator.start();
            setTimeout(() => oscillator.stop(), 200);
        } catch (e) {
            // Audio not available, silent fail
        }
    }
};

// Export
window.FocusTimer = FocusTimer;
