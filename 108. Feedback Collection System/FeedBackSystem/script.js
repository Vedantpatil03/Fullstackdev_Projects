// Feedback Collection System
let allFeedback = [];
let currentModalFeedback = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    setupEventListeners();
    renderFeedback();
    updateAnalytics();
    showPage('submit');
});

// Setup event listeners
function setupEventListeners() {
    // Star rating
    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', () => {
            const rating = star.dataset.value;
            selectRating(rating);
        });
    });

    // Character counter
    const messageInput = document.getElementById('message');
    if (messageInput) {
        messageInput.addEventListener('input', () => {
            const count = messageInput.value.length;
            document.getElementById('charCount').textContent = count;
        });
    }

    // Form submission
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', handleFormSubmit);
    }
}

// Select rating
function selectRating(rating) {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        if (star.dataset.value <= rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });

    document.getElementById('rating').value = rating;
    const labels = ['No rating selected', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    document.getElementById('ratingLabel').textContent = labels[rating];
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();

    if (document.getElementById('rating').value === '0') {
        showAlert('Please select a rating', 'error');
        return;
    }

    const feedback = {
        id: Date.now(),
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        type: document.getElementById('type').value,
        rating: parseInt(document.getElementById('rating').value),
        message: document.getElementById('message').value.trim(),
        allowContact: document.getElementById('allowContact').checked,
        attachment: document.getElementById('attachment').files.length > 0 ? 
                   document.getElementById('attachment').files[0].name : null,
        date: new Date().toLocaleString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };

    allFeedback.unshift(feedback);
    saveToLocalStorage();
    
    showAlert('Thank you! Your feedback has been submitted successfully.', 'success');
    document.getElementById('feedbackForm').reset();
    document.getElementById('rating').value = '0';
    document.getElementById('ratingLabel').textContent = 'No rating selected';
    document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));

    setTimeout(() => {
        showPage('view');
        renderFeedback();
        updateAnalytics();
    }, 2000);
}

// Render feedback list
function renderFeedback(feedbackToRender = allFeedback) {
    const feedbackList = document.getElementById('feedbackList');
    feedbackList.innerHTML = '';

    if (feedbackToRender.length === 0) {
        feedbackList.innerHTML = '<p class="empty-message">No feedback yet. Be the first to share!</p>';
        return;
    }

    feedbackToRender.forEach(feedback => {
        const card = document.createElement('div');
        card.className = 'feedback-card';
        
        const initials = feedback.name.split(' ').map(n => n[0]).join('').toUpperCase();
        const stars = '⭐'.repeat(feedback.rating) + '☆'.repeat(5 - feedback.rating);
        const messageTruncated = feedback.message.length > 150 ? 
            feedback.message.substring(0, 150) + '...' : feedback.message;

        card.innerHTML = `
            <div>
                <div class="feedback-header">
                    <div class="feedback-avatar">${initials}</div>
                    <div class="feedback-info">
                        <div class="feedback-name">${escapeHtml(feedback.name)}</div>
                        <div class="feedback-meta">
                            <span class="feedback-type ${feedback.type}">${feedback.type.replace('-', ' ')}</span>
                            <span class="feedback-stars">${stars}</span>
                            <span>${feedback.date}</span>
                        </div>
                    </div>
                </div>
                <div class="feedback-message truncated">${escapeHtml(messageTruncated)}</div>
            </div>
            <div class="feedback-actions">
                <button class="btn btn-primary btn-small" onclick="openFeedbackModal(${feedback.id})">View</button>
            </div>
        `;

        card.addEventListener('click', () => openFeedbackModal(feedback.id));
        feedbackList.appendChild(card);
    });
}

// Filter feedback
function filterFeedback() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const typeFilter = document.getElementById('typeFilter').value;
    const ratingFilter = document.getElementById('ratingFilter').value;

    const filtered = allFeedback.filter(feedback => {
        const matchesSearch = feedback.name.toLowerCase().includes(searchQuery) ||
                             feedback.message.toLowerCase().includes(searchQuery) ||
                             feedback.email.toLowerCase().includes(searchQuery);
        const matchesType = !typeFilter || feedback.type === typeFilter;
        const matchesRating = !ratingFilter || feedback.rating >= parseInt(ratingFilter);
        
        return matchesSearch && matchesType && matchesRating;
    });

    renderFeedback(filtered);
}

// Open feedback modal
function openFeedbackModal(feedbackId) {
    const feedback = allFeedback.find(f => f.id === feedbackId);
    if (!feedback) return;

    currentModalFeedback = feedback;
    const stars = '⭐'.repeat(feedback.rating) + '☆'.repeat(5 - feedback.rating);

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="modal-detail">
            <div class="modal-detail-label">Name</div>
            <div class="modal-detail-value">${escapeHtml(feedback.name)}</div>
        </div>
        <div class="modal-detail">
            <div class="modal-detail-label">Email</div>
            <div class="modal-detail-value">${escapeHtml(feedback.email)}</div>
        </div>
        <div class="modal-detail">
            <div class="modal-detail-label">Type</div>
            <div class="modal-detail-value">
                <span class="feedback-type ${feedback.type}">${feedback.type.replace('-', ' ')}</span>
            </div>
        </div>
        <div class="modal-detail">
            <div class="modal-detail-label">Rating</div>
            <div class="modal-detail-value feedback-stars">${stars}</div>
        </div>
        <div class="modal-detail">
            <div class="modal-detail-label">Feedback</div>
            <div class="modal-detail-value">${escapeHtml(feedback.message)}</div>
        </div>
        <div class="modal-detail">
            <div class="modal-detail-label">Date & Time</div>
            <div class="modal-detail-value">${feedback.date}</div>
        </div>
        ${feedback.allowContact ? `
            <div class="modal-detail">
                <div class="modal-detail-label">Contact Permission</div>
                <div class="modal-detail-value">✓ Can be contacted about this feedback</div>
            </div>
        ` : ''}
        ${feedback.attachment ? `
            <div class="modal-detail">
                <div class="modal-detail-label">Attachment</div>
                <div class="modal-detail-value">📎 ${escapeHtml(feedback.attachment)}</div>
            </div>
        ` : ''}
    `;

    document.getElementById('feedbackModal').classList.add('show');
}

// Close feedback modal
function closeFeedbackModal() {
    document.getElementById('feedbackModal').classList.remove('show');
    currentModalFeedback = null;
}

// Delete feedback
function deleteFeedback() {
    if (!currentModalFeedback) return;

    if (confirm('Are you sure you want to delete this feedback?')) {
        allFeedback = allFeedback.filter(f => f.id !== currentModalFeedback.id);
        saveToLocalStorage();
        closeFeedbackModal();
        renderFeedback();
        updateAnalytics();
        showAlert('Feedback deleted successfully', 'success');
    }
}

// Update analytics
function updateAnalytics() {
    if (allFeedback.length === 0) {
        document.getElementById('totalFeedback').textContent = '0';
        document.getElementById('avgRating').textContent = '0.0';
        document.getElementById('satisfactionRate').textContent = '0%';
        return;
    }

    // Total feedback
    document.getElementById('totalFeedback').textContent = allFeedback.length;

    // Average rating
    const avgRating = (allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length).toFixed(1);
    document.getElementById('avgRating').textContent = avgRating;

    // Satisfaction rate (4+ stars)
    const satisfactionCount = allFeedback.filter(f => f.rating >= 4).length;
    const satisfactionRate = ((satisfactionCount / allFeedback.length) * 100).toFixed(0);
    document.getElementById('satisfactionRate').textContent = satisfactionRate + '%';

    // Rating distribution
    updateRatingDistribution();

    // Type distribution
    updateTypeDistribution();

    // Sentiment metrics
    updateSentimentMetrics();
}

// Update rating distribution
function updateRatingDistribution() {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    allFeedback.forEach(f => distribution[f.rating]++);

    const container = document.getElementById('ratingDistribution');
    container.innerHTML = '';

    Object.entries(distribution).reverse().forEach(([rating, count]) => {
        const percentage = allFeedback.length > 0 ? (count / allFeedback.length) * 100 : 0;
        const bar = document.createElement('div');
        bar.className = 'distribution-bar';
        bar.innerHTML = `
            <div class="bar-label">${rating} ⭐</div>
            <div class="bar-container">
                <div class="bar-fill" style="width: ${percentage}%">${count > 0 ? percentage.toFixed(0) + '%' : ''}</div>
            </div>
            <div class="bar-count">${count}</div>
        `;
        container.appendChild(bar);
    });
}

// Update type distribution
function updateTypeDistribution() {
    const types = {};
    allFeedback.forEach(f => {
        types[f.type] = (types[f.type] || 0) + 1;
    });

    const container = document.getElementById('typeDistribution');
    container.innerHTML = '';

    Object.entries(types).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
        const percentage = ((count / allFeedback.length) * 100).toFixed(1);
        const item = document.createElement('div');
        item.className = 'type-item';
        item.innerHTML = `
            <span class="type-name">${type.replace('-', ' ')}</span>
            <span class="type-percent">${percentage}%</span>
            <span class="type-count">${count}</span>
        `;
        container.appendChild(item);
    });
}

// Update sentiment metrics
function updateSentimentMetrics() {
    const positive = allFeedback.filter(f => f.rating === 5).length;
    const neutral = allFeedback.filter(f => f.rating === 3 || f.rating === 4).length;
    const negative = allFeedback.filter(f => f.rating === 1 || f.rating === 2).length;

    document.getElementById('positive').textContent = positive;
    document.getElementById('neutral').textContent = neutral;
    document.getElementById('negative').textContent = negative;

    const total = allFeedback.length;
    document.getElementById('positivePercent').textContent = 
        ((positive / total) * 100).toFixed(1) + '%';
    document.getElementById('neutralPercent').textContent = 
        ((neutral / total) * 100).toFixed(1) + '%';
    document.getElementById('negativePercent').textContent = 
        ((negative / total) * 100).toFixed(1) + '%';
}

// Show page
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    if (pageId === 'submit') {
        document.querySelectorAll('.nav-btn')[0].classList.add('active');
    } else if (pageId === 'view') {
        document.querySelectorAll('.nav-btn')[1].classList.add('active');
        renderFeedback();
    } else if (pageId === 'analytics') {
        document.querySelectorAll('.nav-btn')[2].classList.add('active');
        updateAnalytics();
    }
}

// Show alert
function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    const container = document.querySelector('.container');
    container.insertBefore(alert, container.firstChild);

    setTimeout(() => alert.remove(), 4000);
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Local storage
function saveToLocalStorage() {
    localStorage.setItem('feedback', JSON.stringify(allFeedback));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('feedback');
    if (saved) {
        try {
            allFeedback = JSON.parse(saved);
        } catch (error) {
            console.error('Error loading feedback:', error);
            allFeedback = [];
        }
    }
}

// Close modal on background click
window.addEventListener('click', (e) => {
    const modal = document.getElementById('feedbackModal');
    if (e.target === modal) {
        closeFeedbackModal();
    }
});
