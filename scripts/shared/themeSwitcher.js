/**
 * Theme Switcher
 * Dynamically swaps CSS variables to change the app's look.
 */

const ThemeSwitcher = {
    themes: {
        cyberpunk: {
            '--bg-deep': '#050510',
            '--bg-dark': '#0a0a1a',
            '--bg-medium': '#12122a',
            '--bg-light': '#1a1a3e',
            '--neon-cyan': '#00f0ff',
            '--neon-pink': '#ff0080',
            '--neon-purple': '#bf00ff',
            '--neon-blue': '#4d4dff',
            '--neon-green': '#00ff88',
            '--text-primary': '#ffffff',
            '--text-secondary': '#a0a0c0',
            '--font-display': "'Orbitron', sans-serif",
            '--font-mono': "'JetBrains Mono', monospace"
        },
        zen: {
            '--bg-deep': '#e2e8f0', // Darker gray-blue
            '--bg-dark': '#f1f5f9', // Slightly off-white
            '--bg-medium': '#cbd5e1', // Mid-gray
            '--bg-light': '#94a3b8', // Darker accent
            '--neon-cyan': '#2563eb', // Darker blue
            '--neon-pink': '#dc2626', // Red
            '--neon-purple': '#7c3aed', // Purple
            '--neon-blue': '#1e40af', // Navy
            '--neon-green': '#16a34a', // Green
            '--text-primary': '#111827', // Almost black
            '--text-secondary': '#374151', // Dark gray
            '--font-display': "'Helvetica Neue', sans-serif",
            '--font-mono': "'Consolas', monospace"
        },
        vaporwave: {
            '--bg-deep': '#240046',
            '--bg-dark': '#3c096c',
            '--bg-medium': '#5a189a',
            '--bg-light': '#7b2cbf',
            '--neon-cyan': '#00ffff',
            '--neon-pink': '#ff00ff',
            '--neon-purple': '#e0aaff',
            '--neon-blue': '#9d4edd',
            '--neon-green': '#00ff9d',
            '--text-primary': '#ffffff', // Pure white
            '--text-secondary': '#e0e0e0', // Very light gray
            '--font-display': "'VCR OSD Mono', monospace",
            '--font-mono': "'Courier New', monospace"
        }
    },

    setTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;

        const root = document.documentElement;
        for (const [key, value] of Object.entries(theme)) {
            root.style.setProperty(key, value);
        }

        // Handle specific styles for light themes
        if (themeName === 'zen') {
            root.style.setProperty('--glow-cyan', 'none');
            root.style.setProperty('--glow-pink', 'none');
            root.style.setProperty('--glow-purple', 'none');
            document.querySelector('.scanlines').style.display = 'none';
        } else {
            // Restore glows (simplified fallback)
            root.style.setProperty('--glow-cyan', '0 0 20px rgba(0, 240, 255, 0.5)');
            document.querySelector('.scanlines').style.display = 'block';
        }

        localStorage.setItem('adhd_theme', themeName);
        console.log(`Theme set to ${themeName}`);
    },

    init() {
        const saved = localStorage.getItem('adhd_theme') || 'cyberpunk';
        this.setTheme(saved);
    }
};

window.ThemeSwitcher = ThemeSwitcher;
