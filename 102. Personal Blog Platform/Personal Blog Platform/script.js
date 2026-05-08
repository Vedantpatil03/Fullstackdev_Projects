// Blog Platform - JavaScript
class BlogPlatform {
    constructor() {
        this.posts = [];
        this.currentPage = 'home';
        this.init();
    }

    init() {
        this.loadPostsFromStorage();
        this.setupEventListeners();
        this.renderPosts();
        this.updateCategoryFilter();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo(e.target.dataset.page);
            });
        });

        // Post Form
        document.getElementById('postForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createPost();
        });

        // Search
        document.getElementById('searchInput').addEventListener('input', () => {
            this.filterPosts();
        });

        // Category Filter
        document.getElementById('categoryFilter').addEventListener('change', () => {
            this.filterPosts();
        });

        // Modal Close
        const modal = document.getElementById('postModal');
        const closeBtn = document.querySelector('.close');
        
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    navigateTo(page) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });

        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Show selected page
        document.getElementById(page).classList.add('active');

        // Mark nav link as active
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        this.currentPage = page;
    }

    createPost() {
        const title = document.getElementById('postTitle').value;
        const category = document.getElementById('postCategory').value;
        const content = document.getElementById('postContent').value;
        const author = document.getElementById('postAuthor').value;

        if (!title || !category || !content || !author) {
            alert('Please fill in all fields');
            return;
        }

        const post = {
            id: Date.now(),
            title,
            category,
            content,
            author,
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            timestamp: new Date().getTime()
        };

        this.posts.unshift(post);
        this.savePostsToStorage();
        this.renderPosts();
        this.updateCategoryFilter();

        // Reset form
        document.getElementById('postForm').reset();

        // Navigate to home
        this.navigateTo('home');

        // Show success message
        alert('Post published successfully!');
    }

    deletePost(id) {
        if (confirm('Are you sure you want to delete this post?')) {
            this.posts = this.posts.filter(post => post.id !== id);
            this.savePostsToStorage();
            this.renderPosts();
            this.updateCategoryFilter();
        }
    }

    renderPosts(postsToRender = this.posts) {
        const container = document.getElementById('postsContainer');
        const noPostsMessage = document.getElementById('noPostsMessage');

        if (postsToRender.length === 0) {
            container.innerHTML = '';
            noPostsMessage.style.display = 'block';
            return;
        }

        noPostsMessage.style.display = 'none';

        container.innerHTML = postsToRender.map(post => `
            <div class="post-card" onclick="blogPlatform.viewPost(${post.id})">
                <div class="post-header">
                    <span class="post-category">${this.escapeHtml(post.category)}</span>
                    <h3 class="post-title">${this.escapeHtml(post.title)}</h3>
                </div>
                <div class="post-body">
                    <p class="post-excerpt">${this.escapeHtml(post.content.substring(0, 150))}...</p>
                    <div class="post-footer">
                        <div>
                            <p class="post-author">By ${this.escapeHtml(post.author)}</p>
                            <p class="post-date">${post.date}</p>
                        </div>
                        <div class="post-actions">
                            <button class="btn-small" onclick="event.stopPropagation(); blogPlatform.viewPost(${post.id})">Read More</button>
                            <button class="btn-small btn-delete" onclick="event.stopPropagation(); blogPlatform.deletePost(${post.id})">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    viewPost(id) {
        const post = this.posts.find(p => p.id === id);
        if (!post) return;

        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <h2 class="modal-post-title">${this.escapeHtml(post.title)}</h2>
            <div class="modal-post-meta">
                <div class="modal-post-meta-item"><strong>Author:</strong> ${this.escapeHtml(post.author)}</div>
                <div class="modal-post-meta-item"><strong>Category:</strong> ${this.escapeHtml(post.category)}</div>
                <div class="modal-post-meta-item"><strong>Date:</strong> ${post.date}</div>
            </div>
            <div class="modal-post-content">${this.escapeHtml(post.content)}</div>
        `;

        const modal = document.getElementById('postModal');
        modal.classList.add('active');
    }

    filterPosts() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const selectedCategory = document.getElementById('categoryFilter').value;

        const filtered = this.posts.filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(searchTerm) ||
                                post.content.toLowerCase().includes(searchTerm) ||
                                post.author.toLowerCase().includes(searchTerm);
            
            const matchesCategory = !selectedCategory || post.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });

        this.renderPosts(filtered);
    }

    updateCategoryFilter() {
        const categories = [...new Set(this.posts.map(post => post.category))];
        const select = document.getElementById('categoryFilter');
        const currentValue = select.value;

        select.innerHTML = '<option value="">All Categories</option>' +
            categories.map(cat => `<option value="${cat}">${this.escapeHtml(cat)}</option>`).join('');

        select.value = currentValue;
    }

    savePostsToStorage() {
        localStorage.setItem('blogPosts', JSON.stringify(this.posts));
    }

    loadPostsFromStorage() {
        const stored = localStorage.getItem('blogPosts');
        this.posts = stored ? JSON.parse(stored) : this.getDefaultPosts();
    }

    getDefaultPosts() {
        return [
            {
                id: Date.now() - 1000,
                title: 'Welcome to My Blog',
                category: 'General',
                content: 'Hello everyone! Welcome to my personal blog platform. This is a place where I share my thoughts, experiences, and insights on various topics. I\'m excited to have you here. Feel free to explore the different posts and don\'t hesitate to come back often for new content. Stay tuned for more interesting articles and stories!',
                author: 'Blog Owner',
                date: new Date(Date.now() - 86400000).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                timestamp: Date.now() - 1000
            },
            {
                id: Date.now() - 2000,
                title: 'Getting Started with Web Development',
                category: 'Technology',
                content: 'Web development is an exciting field that combines creativity with technical skills. In this post, I\'ll share some tips and resources for beginners who want to get started with HTML, CSS, and JavaScript. Whether you\'re interested in frontend, backend, or full-stack development, there\'s a path for you. The key is to start small, practice consistently, and never stop learning. Good luck on your web development journey!',
                author: 'Tech Enthusiast',
                date: new Date(Date.now() - 172800000).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                timestamp: Date.now() - 2000
            }
        ];
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the blog platform when DOM is ready
let blogPlatform;
document.addEventListener('DOMContentLoaded', () => {
    blogPlatform = new BlogPlatform();
});
