/**
 * Journal Store
 * Manages journal entries with database persistence
 */

const JournalStore = {
    /**
     * Save a journal entry
     */
    async save(entry) {
        try {
            const result = await SupabaseClient.insert('journal_entries', {
                wins: entry.wins || '',
                challenges: entry.challenges || '',
                learnings: entry.learnings || '',
                mood: entry.mood || '',
                priorities: entry.priorities || []
            });

            // Also extract and save any important facts
            await this.extractAndSaveFacts(entry);

            return result;
        } catch (error) {
            console.error('Failed to save journal entry:', error);
            return this.saveLocal(entry);
        }
    },

    /**
     * Get recent entries
     */
    async getRecent(limit = 10) {
        try {
            return await SupabaseClient.select('journal_entries', {
                orderBy: 'created_at',
                ascending: false,
                limit
            });
        } catch (error) {
            console.error('Failed to get journal entries:', error);
            return this.getLocal();
        }
    },

    /**
     * Search entries
     */
    async search(query) {
        try {
            // Search across wins, challenges, and learnings
            const results = await SupabaseClient.search('journal_entries', 'wins', query, 10);
            return results;
        } catch (error) {
            console.error('Failed to search journal:', error);
            return [];
        }
    },

    /**
     * Delete entry
     */
    async delete(id) {
        try {
            return await SupabaseClient.delete('journal_entries', id);
        } catch (error) {
            console.error('Failed to delete journal entry:', error);
            return false;
        }
    },

    /**
     * Extract important facts from journal entry for AI memory
     */
    async extractAndSaveFacts(entry) {
        const facts = [];

        // Extract wins as positive facts
        if (entry.wins && entry.wins.length > 20) {
            facts.push({
                type: 'insight',
                content: `Accomplished: ${entry.wins}`,
                source: 'journal',
                importance: 6
            });
        }

        // Extract learnings as facts
        if (entry.learnings && entry.learnings.length > 20) {
            facts.push({
                type: 'fact',
                content: `Learned: ${entry.learnings}`,
                source: 'journal',
                importance: 7
            });
        }

        // Save to memory store
        for (const fact of facts) {
            if (window.MemoryStore) {
                await MemoryStore.save(fact.type, fact.content, fact.source, fact.importance);
            }
        }
    },

    /**
     * Get journal summary for AI context
     */
    async getSummary() {
        const entries = await this.getRecent(5);
        if (entries.length === 0) {
            return "No journal entries yet.";
        }

        let summary = `Recent journal highlights (${entries.length} entries):\n`;

        entries.forEach((entry, i) => {
            const date = new Date(entry.created_at).toLocaleDateString();
            summary += `\n${date}:`;
            if (entry.wins) summary += `\n  ✓ ${entry.wins.substring(0, 100)}`;
            if (entry.learnings) summary += `\n  💡 ${entry.learnings.substring(0, 100)}`;
        });

        return summary;
    },

    // ==================== LOCAL FALLBACK ====================

    saveLocal(entry) {
        const entries = this.getLocal();
        const newEntry = {
            id: Date.now().toString(),
            ...entry,
            created_at: new Date().toISOString()
        };
        entries.unshift(newEntry);
        localStorage.setItem('journal_entries_fallback', JSON.stringify(entries.slice(0, 50)));
        return newEntry;
    },

    getLocal() {
        // Also get from old localStorage key
        const oldEntries = JSON.parse(localStorage.getItem('adhd_journal') || '[]');
        const newEntries = JSON.parse(localStorage.getItem('journal_entries_fallback') || '[]');
        return [...newEntries, ...oldEntries];
    },

    /**
     * Migrate from localStorage to database
     */
    async migrateFromLocal() {
        const local = JSON.parse(localStorage.getItem('adhd_journal') || '[]');
        if (local.length === 0) return;

        console.log(`Migrating ${local.length} journal entries to database...`);

        for (const entry of local) {
            try {
                await this.save(entry);
            } catch (e) {
                console.warn('Migration failed for entry:', entry.id);
            }
        }

        console.log('Journal migration complete');
    }
};

window.JournalStore = JournalStore;
