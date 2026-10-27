import { getApiUrl } from '../context/ContentContext';

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  category: string;
  tags?: string | null;
  author: string;
  authorRole?: string | null;
  authorAvatar?: string | null;
  status: 'published' | 'draft' | 'archived';
  isFeatured: boolean | number;
  readTimeMinutes: number;
  views: number;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogMetrics {
  total: number;
  published: number;
  draft: number;
  totalViews: number;
}

const getAdminHeaders = (): HeadersInit => {
  const token = localStorage.getItem('amg_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const blogService = {
  // ==========================================
  // PUBLIC BLOG VISITOR METHODS
  // ==========================================
  async getArticles(params?: {
    category?: string;
    search?: string;
    tag?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    success: boolean;
    articles?: BlogPost[];
    total?: number;
    featured?: BlogPost | null;
    categories?: string[];
    error?: string;
  }> {
    try {
      const q = new URLSearchParams();
      if (params?.category) q.set('category', params.category);
      if (params?.search) q.set('search', params.search);
      if (params?.tag) q.set('tag', params.tag);
      if (params?.limit) q.set('limit', String(params.limit));
      if (params?.offset) q.set('offset', String(params.offset));

      const res = await fetch(getApiUrl(`api/blog?${q.toString()}`));
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message || 'Failed to load blog articles' };
    }
  },

  async getArticleBySlug(slug: string): Promise<{
    success: boolean;
    article?: BlogPost;
    related?: BlogPost[];
    error?: string;
  }> {
    try {
      const res = await fetch(getApiUrl(`api/blog?slug=${encodeURIComponent(slug)}`));
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message || 'Failed to load article' };
    }
  },

  async getCategories(): Promise<{
    success: boolean;
    categories?: { category: string; count: number }[];
    error?: string;
  }> {
    try {
      const res = await fetch(getApiUrl('api/blog/categories'));
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  // ==========================================
  // ADMIN BLOG MANAGEMENT METHODS
  // ==========================================
  async adminGetArticles(params?: {
    search?: string;
    status?: string;
    category?: string;
  }): Promise<{
    success: boolean;
    articles?: BlogPost[];
    metrics?: BlogMetrics;
    categories?: string[];
    error?: string;
  }> {
    try {
      const q = new URLSearchParams();
      if (params?.search) q.set('search', params.search);
      if (params?.status) q.set('status', params.status);
      if (params?.category) q.set('category', params.category);

      const res = await fetch(getApiUrl(`api/blog/admin-list?${q.toString()}`), {
        headers: getAdminHeaders()
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message || 'Failed to load admin articles' };
    }
  },

  async adminCreateArticle(data: Partial<BlogPost>): Promise<{
    success: boolean;
    message?: string;
    article?: any;
    error?: string;
  }> {
    try {
      const res = await fetch(getApiUrl('api/blog'), {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message || 'Failed to create article' };
    }
  },

  async adminUpdateArticle(data: Partial<BlogPost> & { id: number }): Promise<{
    success: boolean;
    message?: string;
    article?: any;
    error?: string;
  }> {
    try {
      const res = await fetch(getApiUrl('api/blog'), {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message || 'Failed to update article' };
    }
  },

  async adminDeleteArticle(id: number): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    try {
      const res = await fetch(getApiUrl(`api/blog?id=${id}`), {
        method: 'DELETE',
        headers: getAdminHeaders()
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message || 'Failed to delete article' };
    }
  },

  async adminToggleStatus(id: number, status?: 'published' | 'draft'): Promise<{
    success: boolean;
    message?: string;
    status?: string;
    error?: string;
  }> {
    try {
      const res = await fetch(getApiUrl('api/blog/toggle-status'), {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ id, status })
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message || 'Failed to toggle status' };
    }
  },

  async adminToggleFeatured(id: number): Promise<{
    success: boolean;
    message?: string;
    isFeatured?: number;
    error?: string;
  }> {
    try {
      const res = await fetch(getApiUrl('api/blog/toggle-featured'), {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ id })
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message || 'Failed to toggle featured' };
    }
  },

  /**
   * Upload an image (cover photo or inline editor image)
   */
  async uploadImage(file: File): Promise<{
    success: boolean;
    url?: string;
    message?: string;
    error?: string;
  }> {
    try {
      const token = localStorage.getItem('amg_admin_token');
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(getApiUrl('api/upload.php'), {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: formData
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message || 'Failed to upload image' };
    }
  }
};
