/**
 * Daily Challenge Generator
 * procedural generation of memory drills
 */

const DailyChallenge = {
    wordBank: [
        'Apple', 'Book', 'Cat', 'Dog', 'Elephant', 'Frog', 'Guitar', 'House', 'Ice', 'Jacket',
        'Kite', 'Lamp', 'Moon', 'Nest', 'Orange', 'Piano', 'Queen', 'Rain', 'Sun', 'Tree',
        'Umbrella', 'Violin', 'Water', 'Xylophone', 'Yacht', 'Zebra', 'Anchor', 'Balloon', 'Camera',
        'Desk', 'Eagle', 'Feather', 'Globe', 'Hammer', 'Island', 'Jelly', 'Kangaroo', 'Lemon',
        'Mountain', 'Notebook', 'Ocean', 'Pencil', 'Quilt', 'Robot', 'Star', 'Tiger', 'Unicorn',
        'Volcano', 'Whale', 'X-ray', 'Yo-yo', 'Zipper'
    ],

    nameBank: [
        'Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack',
        'Kate', 'Liam', 'Mia', 'Noah', 'Olivia', 'Paul', 'Quinn', 'Ryan', 'Sarah', 'Tom',
        'Uma', 'Victor', 'Wendy', 'Xander', 'Yara', 'Zack', 'Arthur', 'Bella', 'Caleb', 'Daisy'
    ],

    // Generate a random challenge
    generate(type, difficulty) {
        // difficulty: 'easy', 'medium', 'hard'
        let count = 5;
        if (difficulty === 'medium') count = 10;
        if (difficulty === 'hard') count = 20;

        let items = [];

        switch (type) {
            case 'numbers':
                items = this.generateNumbers(count);
                break;
            case 'words':
                items = this.generateWords(count);
                break;
            case 'names':
                items = this.generateNames(count);
                break;
            default:
                items = this.generateWords(count);
        }

        return {
            id: `daily-${Date.now()}`,
            title: `Daily Challenge: ${difficulty.toUpperCase()} ${type}`,
            type: 'challenge',
            items: items,
            difficulty: difficulty,
            xp: count * 5 // 5 XP per item
        };
    },

    generateNumbers(count) {
        const nums = [];
        for (let i = 0; i < count; i++) {
            nums.push(Math.floor(Math.random() * 100)); // 0-99
        }
        return nums;
    },

    generateWords(count) {
        const words = [];
        for (let i = 0; i < count; i++) {
            const word = this.wordBank[Math.floor(Math.random() * this.wordBank.length)];
            words.push(word);
        }
        return words;
    },

    generateNames(count) {
        const names = [];
        for (let i = 0; i < count; i++) {
            const name = this.nameBank[Math.floor(Math.random() * this.nameBank.length)];
            names.push(name);
        }
        return names;
    }
};

window.DailyChallenge = DailyChallenge;
