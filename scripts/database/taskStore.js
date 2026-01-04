/**
 * Task Store
 * Manages tasks with database persistence
 */

const TaskStore = {
    /**
     * Create a new task
     */
    async create(title, description = '', priority = 3, dueDate = null) {
        try {
            return await SupabaseClient.insert('tasks', {
                title,
                description,
                priority,
                due_date: dueDate,
                status: 'pending'
            });
        } catch (error) {
            console.error('Failed to create task:', error);
            return this.createLocal(title, description, priority, dueDate);
        }
    },

    /**
     * Get all tasks
     */
    async getAll(status = null) {
        try {
            const options = {
                orderBy: 'created_at',
                ascending: false
            };
            if (status) {
                options.filter = { status };
            }
            return await SupabaseClient.select('tasks', options);
        } catch (error) {
            console.error('Failed to get tasks:', error);
            return this.getLocal();
        }
    },

    /**
     * Get pending tasks
     */
    async getPending() {
        return this.getAll('pending');
    },

    /**
     * Mark task as complete
     */
    async complete(id) {
        try {
            return await SupabaseClient.update('tasks', id, {
                status: 'completed',
                completed_at: new Date().toISOString()
            });
        } catch (error) {
            console.error('Failed to complete task:', error);
            return this.updateLocal(id, 'completed');
        }
    },

    /**
     * Update task status
     */
    async updateStatus(id, status) {
        try {
            return await SupabaseClient.update('tasks', id, { status });
        } catch (error) {
            console.error('Failed to update task:', error);
            return this.updateLocal(id, status);
        }
    },

    /**
     * Delete a task
     */
    async delete(id) {
        try {
            return await SupabaseClient.delete('tasks', id);
        } catch (error) {
            console.error('Failed to delete task:', error);
            return this.deleteLocal(id);
        }
    },

    // ==================== LOCAL FALLBACK ====================

    createLocal(title, description, priority, dueDate) {
        const tasks = this.getLocal();
        const task = {
            id: Date.now().toString(),
            title,
            description,
            priority,
            due_date: dueDate,
            status: 'pending',
            created_at: new Date().toISOString()
        };
        tasks.unshift(task);
        localStorage.setItem('tasks_fallback', JSON.stringify(tasks));
        return task;
    },

    getLocal() {
        return JSON.parse(localStorage.getItem('tasks_fallback') || '[]');
    },

    updateLocal(id, status) {
        const tasks = this.getLocal();
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.status = status;
            if (status === 'completed') {
                task.completed_at = new Date().toISOString();
            }
            localStorage.setItem('tasks_fallback', JSON.stringify(tasks));
        }
        return task;
    },

    deleteLocal(id) {
        const tasks = this.getLocal().filter(t => t.id !== id);
        localStorage.setItem('tasks_fallback', JSON.stringify(tasks));
        return true;
    },

    /**
     * Get task summary for AI context
     */
    async getSummary() {
        const pending = await this.getPending();
        if (pending.length === 0) {
            return "No pending tasks.";
        }

        const high = pending.filter(t => t.priority >= 7);
        const medium = pending.filter(t => t.priority >= 4 && t.priority < 7);
        const low = pending.filter(t => t.priority < 4);

        let summary = `You have ${pending.length} pending task(s):\n`;

        if (high.length > 0) {
            summary += `\n🔴 High priority (${high.length}):\n`;
            high.forEach(t => summary += `  • ${t.title}\n`);
        }
        if (medium.length > 0) {
            summary += `\n🟡 Medium priority (${medium.length}):\n`;
            medium.forEach(t => summary += `  • ${t.title}\n`);
        }
        if (low.length > 0) {
            summary += `\n🟢 Low priority (${low.length}):\n`;
            low.forEach(t => summary += `  • ${t.title}\n`);
        }

        return summary;
    }
};

window.TaskStore = TaskStore;
