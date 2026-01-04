/**
 * Palace Module
 * Manages the room, loci, and visual state
 */

const Palace = {
    currentPalace: {
        id: 'cyberpunk_apartment',
        name: 'Cyberpunk Apartment',
        loci: []
    },

    /**
     * Initialize palace by discovering loci from DOM
     */
    init() {
        const lociElements = document.querySelectorAll('.locus');
        this.currentPalace.loci = [];

        lociElements.forEach(el => {
            const locus = {
                id: el.dataset.locusId,
                name: el.dataset.name,
                element: el
            };
            this.currentPalace.loci.push(locus);
        });

        this.updateLociVisuals();
        console.log(`Palace initialized with ${this.currentPalace.loci.length} loci`);
    },

    /**
     * Get all loci
     * @returns {Array}
     */
    getLoci() {
        return this.currentPalace.loci;
    },

    /**
     * Get locus by ID
     * @param {string} locusId
     * @returns {object|null}
     */
    getLocusById(locusId) {
        return this.currentPalace.loci.find(l => l.id === locusId) || null;
    },

    /**
     * Update visual state of all loci based on stored memories
     */
    updateLociVisuals() {
        this.currentPalace.loci.forEach(locus => {
            const hasMemory = Memory.hasMemory(locus.id);
            const memory = Memory.getByLocusId(locus.id);
            const isDue = memory && SRS.isDue(memory.nextReview);

            // Update has-memory class
            if (hasMemory) {
                locus.element.classList.add('has-memory');
            } else {
                locus.element.classList.remove('has-memory');
            }

            // Update needs-review class
            if (isDue) {
                locus.element.classList.add('needs-review');
            } else {
                locus.element.classList.remove('needs-review');
            }
        });
    },

    /**
     * Get loci that need review
     * @returns {Array}
     */
    getLociNeedingReview() {
        return this.currentPalace.loci.filter(locus => {
            const memory = Memory.getByLocusId(locus.id);
            return memory && SRS.isDue(memory.nextReview);
        });
    },

    /**
     * Get loci with memories
     * @returns {Array}
     */
    getLociWithMemories() {
        return this.currentPalace.loci.filter(locus => Memory.hasMemory(locus.id));
    },

    /**
     * Get empty loci
     * @returns {Array}
     */
    getEmptyLoci() {
        return this.currentPalace.loci.filter(locus => !Memory.hasMemory(locus.id));
    }
};

// Export for use in other modules
window.Palace = Palace;
