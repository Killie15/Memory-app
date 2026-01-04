/**
 * Memory Store
 * Stores AI memories, facts, and important information
 */

const MemoryStore = {
    /**
     * Save a new memory/fact
     * @param {string} type - 'fact', 'preference', 'task', 'reminder', 'insight'
     * @param {string} content - The content to remember
     * @param {string} source - Where this came from: 'chat', 'journal', 'manual'
     * @param {number} importance - 1-10 scale
     */
    async save(type, content, source = 'chat', importance = 5) {
        try {
            return await SupabaseClient.insert('ai_memories', {
                type,
                content,
                source,
                importance
            });
        } catch (error) {
            console.error('Failed to save memory:', error);
            // Fallback to localStorage
            this.saveToLocal(type, content, source, importance);
            return null;
        }
    },

    /**
     * Get recent memories
     */
    async getRecent(limit = 20) {
        try {
            return await SupabaseClient.select('ai_memories', {
                orderBy: 'created_at',
                ascending: false,
                limit
            });
        } catch (error) {
            console.error('Failed to get memories:', error);
            return this.getFromLocal();
        }
    },

    /**
     * Get memories by type
     */
    async getByType(type, limit = 20) {
        try {
            return await SupabaseClient.select('ai_memories', {
                filter: { type },
                orderBy: 'created_at',
                ascending: false,
                limit
            });
        } catch (error) {
            console.error('Failed to get memories by type:', error);
            return [];
        }
    },

    /**
     * Search memories for relevant context
     */
    async search(query, limit = 10) {
        try {
            return await SupabaseClient.search('ai_memories', 'content', query, limit);
        } catch (error) {
            console.error('Failed to search memories:', error);
            return [];
        }
    },

    /**
     * Get all facts (for AI context)
     */
    async getFacts() {
        return this.getByType('fact', 50);
    },

    /**
     * Get all preferences
     */
    async getPreferences() {
        return this.getByType('preference', 20);
    },

    /**
     * Get pending tasks
     */
    async getPendingTasks() {
        try {
            return await SupabaseClient.select('tasks', {
                filter: { status: 'pending' },
                orderBy: 'created_at',
                ascending: false
            });
        } catch (error) {
            console.error('Failed to get tasks:', error);
            return [];
        }
    },

    /**
     * Delete a memory
     */
    async delete(id) {
        try {
            return await SupabaseClient.delete('ai_memories', id);
        } catch (error) {
            console.error('Failed to delete memory:', error);
            return false;
        }
    },

    // ==================== LOCAL FALLBACK ====================

    saveToLocal(type, content, source, importance) {
        const memories = JSON.parse(localStorage.getItem('ai_memories_fallback') || '[]');
        memories.unshift({
            id: Date.now().toString(),
            type,
            content,
            source,
            importance,
            created_at: new Date().toISOString()
        });
        localStorage.setItem('ai_memories_fallback', JSON.stringify(memories.slice(0, 100)));
    },

    getFromLocal() {
        return JSON.parse(localStorage.getItem('ai_memories_fallback') || '[]');
    },

    /**
     * Migrate local memories to database
     */
    async migrateFromLocal() {
        const local = this.getFromLocal();
        if (local.length === 0) return;

        console.log(`Migrating ${local.length} local memories to database...`);

        for (const memory of local) {
            try {
                await this.save(memory.type, memory.content, memory.source, memory.importance);
            } catch (e) {
                console.warn('Migration failed for memory:', memory.id);
            }
        }

        // Clear local after migration
        localStorage.removeItem('ai_memories_fallback');
        console.log('Migration complete');
    }
};

window.MemoryStore = MemoryStore;
