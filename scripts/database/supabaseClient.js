/**
 * Supabase Client
 * Database connection for persistent storage
 */

const SupabaseClient = {
    get SUPABASE_URL() { return window.CONFIG?.SUPABASE_URL || ''; },
    get SUPABASE_ANON_KEY() { return window.CONFIG?.SUPABASE_ANON_KEY || ''; },

    client: null,
    isInitialized: false,
    userId: null,

    /**
     * Initialize Supabase client
     */
    async init() {
        if (this.isInitialized) return true;

        try {
            // Load Supabase JS library
            await this.loadSupabaseLib();

            // Create client
            this.client = supabase.createClient(this.SUPABASE_URL, this.SUPABASE_ANON_KEY);

            // Check for existing session
            const { data: { session } } = await this.client.auth.getSession();
            if (session) {
                this.userId = session.user.id;
            }

            this.isInitialized = true;
            console.log('Supabase initialized');
            return true;
        } catch (error) {
            console.error('Supabase init error:', error);
            return false;
        }
    },

    /**
     * Load Supabase library from CDN
     */
    loadSupabaseLib() {
        return new Promise((resolve, reject) => {
            if (window.supabase) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    },

    /**
     * Sign in anonymously (creates a persistent anonymous user)
     */
    async signInAnonymously() {
        if (!this.client) await this.init();

        // Check for existing anonymous session
        const { data: { session } } = await this.client.auth.getSession();
        if (session) {
            this.userId = session.user.id;
            return session.user;
        }

        // Create anonymous session
        const { data, error } = await this.client.auth.signInAnonymously();
        if (error) throw error;

        this.userId = data.user.id;
        return data.user;
    },

    /**
     * Get current user ID (creates anonymous if needed)
     */
    async getUserId() {
        if (this.userId) return this.userId;

        const user = await this.signInAnonymously();
        return user.id;
    },

    /**
     * Generic insert
     */
    async insert(table, data) {
        if (!this.client) await this.init();
        const userId = await this.getUserId();

        const { data: result, error } = await this.client
            .from(table)
            .insert({ ...data, user_id: userId })
            .select()
            .single();

        if (error) throw error;
        return result;
    },

    /**
     * Generic select
     */
    async select(table, options = {}) {
        if (!this.client) await this.init();
        const userId = await this.getUserId();

        let query = this.client
            .from(table)
            .select(options.columns || '*')
            .eq('user_id', userId);

        if (options.orderBy) {
            query = query.order(options.orderBy, { ascending: options.ascending ?? false });
        }

        if (options.limit) {
            query = query.limit(options.limit);
        }

        if (options.filter) {
            Object.entries(options.filter).forEach(([key, value]) => {
                query = query.eq(key, value);
            });
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    },

    /**
     * Generic update
     */
    async update(table, id, data) {
        if (!this.client) await this.init();

        const { data: result, error } = await this.client
            .from(table)
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return result;
    },

    /**
     * Generic delete
     */
    async delete(table, id) {
        if (!this.client) await this.init();

        const { error } = await this.client
            .from(table)
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    },

    /**
     * Search with text matching
     */
    async search(table, column, searchTerm, limit = 10) {
        if (!this.client) await this.init();
        const userId = await this.getUserId();

        const { data, error } = await this.client
            .from(table)
            .select('*')
            .eq('user_id', userId)
            .ilike(column, `%${searchTerm}%`)
            .limit(limit);

        if (error) throw error;
        return data;
    }
};

window.SupabaseClient = SupabaseClient;
