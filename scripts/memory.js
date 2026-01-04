/**
 * Memory Module
 * Handles CRUD operations for memories with localStorage persistence
 */

const Memory = {
    STORAGE_KEY: 'memoryPalace_memories',

    /**
     * Get all memories from localStorage
     * @returns {Array}
     */
    getAll() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    /**
     * Save all memories to localStorage
     * @param {Array} memories
     */
    saveAll(memories) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(memories));
    },

    /**
     * Create a new memory
     * @param {object} memoryData - { locusId, locusName, content, mnemonic }
     * @returns {object} - The created memory
     */
    create(memoryData) {
        const memories = this.getAll();

        // Check if locus already has a memory
        const existingIndex = memories.findIndex(m => m.locusId === memoryData.locusId);

        const memory = {
            id: existingIndex >= 0 ? memories[existingIndex].id : this.generateId(),
            locusId: memoryData.locusId,
            locusName: memoryData.locusName,
            content: memoryData.content,
            mnemonic: memoryData.mnemonic,
            createdAt: existingIndex >= 0 ? memories[existingIndex].createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            srsBucket: existingIndex >= 0 ? memories[existingIndex].srsBucket : 0,
            nextReview: SRS.calculateNextReview('medium', 0).nextReview,
            reviewCount: existingIndex >= 0 ? memories[existingIndex].reviewCount : 0
        };

        if (existingIndex >= 0) {
            memories[existingIndex] = memory;
        } else {
            memories.push(memory);
        }

        this.saveAll(memories);
        return memory;
    },

    /**
     * Get memory by locus ID
     * @param {string} locusId
     * @returns {object|null}
     */
    getByLocusId(locusId) {
        const memories = this.getAll();
        return memories.find(m => m.locusId === locusId) || null;
    },

    /**
     * Get memory by ID
     * @param {string} memoryId
     * @returns {object|null}
     */
    getById(memoryId) {
        const memories = this.getAll();
        return memories.find(m => m.id === memoryId) || null;
    },

    /**
     * Update memory after review
     * @param {string} locusId
     * @param {string} rating - 'hard', 'medium', or 'easy'
     * @returns {object|null}
     */
    updateAfterReview(locusId, rating) {
        const memories = this.getAll();
        const index = memories.findIndex(m => m.locusId === locusId);

        if (index === -1) return null;

        const memory = memories[index];
        const srsResult = SRS.calculateNextReview(rating, memory.srsBucket);

        memory.srsBucket = srsResult.newBucket;
        memory.nextReview = srsResult.nextReview;
        memory.reviewCount = (memory.reviewCount || 0) + 1;
        memory.lastReviewedAt = new Date().toISOString();
        memory.lastRating = rating;

        memories[index] = memory;
        this.saveAll(memories);

        return memory;
    },

    /**
     * Delete memory by locus ID
     * @param {string} locusId
     * @returns {boolean}
     */
    deleteByLocusId(locusId) {
        const memories = this.getAll();
        const filtered = memories.filter(m => m.locusId !== locusId);

        if (filtered.length !== memories.length) {
            this.saveAll(filtered);
            return true;
        }
        return false;
    },

    /**
     * Get all memories due for review
     * @returns {Array}
     */
    getDueForReview() {
        const memories = this.getAll();
        return memories.filter(m => SRS.isDue(m.nextReview));
    },

    /**
     * Get count of memories due today
     * @returns {number}
     */
    getDueCount() {
        return this.getDueForReview().length;
    },

    /**
     * Get total memory count
     * @returns {number}
     */
    getTotalCount() {
        return this.getAll().length;
    },

    /**
     * Generate unique ID
     * @returns {string}
     */
    generateId() {
        return 'mem_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    },

    /**
     * Check if locus has a memory
     * @param {string} locusId
     * @returns {boolean}
     */
    hasMemory(locusId) {
        return this.getByLocusId(locusId) !== null;
    }
};

// Export for use in other modules
window.Memory = Memory;
