/**
 * Audio Manager
 * Synthesized sound effects using Web Audio API
 * No external assets required
 */

const AudioManager = {
    ctx: null,
    enabled: true,

    init() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.enabled = localStorage.getItem('adhd_audio_enabled') !== 'false';
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.enabled = false;
        }
    },

    play(type) {
        if (!this.enabled || !this.ctx) return;

        // Resume context if suspended (browser policy)
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        switch (type) {
            case 'click':
                this.playTone(600, 'sine', 0.05, 0.05);
                break;
            case 'success':
                this.playChord([523.25, 659.25, 783.99], 'sine', 0.3); // C Major
                break;
            case 'level-up':
                this.playArpeggio([523.25, 659.25, 783.99, 1046.50], 0.1);
                break;
            case 'completion':
                this.playTone(880, 'sine', 0.1, 0.4);
                break;
            case 'error':
                this.playTone(150, 'sawtooth', 0.1, 0.2);
                break;
        }
    },

    playTone(freq, type, duration, vol = 0.1) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },

    playChord(freqs, type, duration) {
        freqs.forEach(f => this.playTone(f, type, duration, 0.05));
    },

    playArpeggio(freqs, interval) {
        freqs.forEach((f, i) => {
            setTimeout(() => {
                this.playTone(f, 'sine', 0.3, 0.1);
            }, i * (interval * 1000));
        });
    },

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('adhd_audio_enabled', this.enabled);
        return this.enabled;
    }
};

window.AudioManager = AudioManager;
