/**
 * SRS (Spaced Repetition System) Module
 * Implements SM-2 algorithm variant for memory scheduling
 */

const SRS = {
    // Interval multipliers based on difficulty rating
    INTERVALS: {
        hard: 1,      // 1 day
        medium: 3,    // 3 days  
        easy: 7       // 7 days
    },

    // Multipliers for subsequent reviews
    MULTIPLIERS: {
        hard: 1.2,
        medium: 2.0,
        easy: 2.5
    },

    /**
     * Calculate next review date based on rating and current bucket
     * @param {string} rating - 'hard', 'medium', or 'easy'
     * @param {number} currentBucket - Current SRS bucket (0-5)
     * @returns {object} - { nextReview: Date, newBucket: number }
     */
    calculateNextReview(rating, currentBucket = 0) {
        const now = new Date();
        let intervalDays;
        let newBucket;

        if (rating === 'hard') {
            // Reset bucket, short interval
            newBucket = Math.max(0, currentBucket - 1);
            intervalDays = this.INTERVALS.hard;
        } else if (rating === 'medium') {
            // Keep bucket, medium interval
            newBucket = currentBucket;
            intervalDays = this.INTERVALS.medium * Math.pow(this.MULTIPLIERS.medium, currentBucket);
        } else {
            // Advance bucket, long interval
            newBucket = Math.min(5, currentBucket + 1);
            intervalDays = this.INTERVALS.easy * Math.pow(this.MULTIPLIERS.easy, currentBucket);
        }

        // Calculate next review date
        const nextReview = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);

        return {
            nextReview: nextReview.toISOString(),
            newBucket: newBucket,
            intervalDays: Math.round(intervalDays)
        };
    },

    /**
     * Check if a memory is due for review
     * @param {string} nextReviewDate - ISO date string
     * @returns {boolean}
     */
    isDue(nextReviewDate) {
        if (!nextReviewDate) return false;
        const reviewDate = new Date(nextReviewDate);
        const now = new Date();
        return reviewDate <= now;
    },

    /**
     * Get time until review in human-readable format
     * @param {string} nextReviewDate - ISO date string
     * @returns {string}
     */
    getTimeUntilReview(nextReviewDate) {
        if (!nextReviewDate) return 'Never';
        
        const reviewDate = new Date(nextReviewDate);
        const now = new Date();
        const diffMs = reviewDate - now;
        
        if (diffMs <= 0) return 'Now';
        
        const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
        const diffHours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        
        if (diffDays > 0) {
            return `${diffDays}d ${diffHours}h`;
        }
        return `${diffHours}h`;
    }
};

// Export for use in other modules
window.SRS = SRS;
