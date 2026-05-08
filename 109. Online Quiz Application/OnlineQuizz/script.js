// Online Quiz Application with Live API
const TRIVIA_API = 'https://opentdb.com/api.php';

let quizzes = [];
let currentQuiz = null;
let currentQuestionIndex = 0;
let answers = [];
let quizStartTime = 0;
let timerInterval = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    updateStats();
    updateResultsBadge();
});

// Load quizzes from localStorage
function loadFromLocalStorage() {
    const saved = localStorage.getItem('quizzes');
    if (saved) {
        try {
            quizzes = JSON.parse(saved);
        } catch (error) {
            console.error('Error loading quizzes:', error);
            quizzes = [];
        }
    }
}

// Save quizzes to localStorage
function saveToLocalStorage() {
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
}

// Start quiz
async function startQuiz() {
    const numQuestions = document.getElementById('numQuestions').value;
    const category = document.getElementById('category').value;
    const difficulty = document.getElementById('difficulty').value;
    const type = document.getElementById('type').value;

    // Build API URL
    let url = `${TRIVIA_API}?amount=${numQuestions}`;
    if (category) url += `&category=${category}`;
    if (difficulty) url += `&difficulty=${difficulty}`;
    if (type) url += `&type=${type}`;

    showPage('quiz');
    document.getElementById('loadingSpinner').style.display = 'block';
    document.getElementById('quizContent').style.display = 'none';

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results.length === 0) {
            showAlert('No questions available. Try different settings.', 'error');
            showPage('home');
            return;
        }

        // Initialize quiz
        currentQuiz = {
            id: Date.now(),
            questions: data.results,
            category: category || 'Mixed',
            difficulty: difficulty || 'Any',
            score: 0,
            totalQuestions: data.results.length,
            startTime: new Date(),
            endTime: null,
            answers: [],
            duration: 0
        };

        currentQuestionIndex = 0;
        answers = new Array(currentQuiz.questions.length).fill(null);
        quizStartTime = Date.now();

        document.getElementById('totalQuestions').textContent = currentQuiz.questions.length;
        document.getElementById('currentQuestion').textContent = '1';

        document.getElementById('loadingSpinner').style.display = 'none';
        document.getElementById('quizContent').style.display = 'block';

        loadQuestion(0);
        startTimer();
    } catch (error) {
        console.error('Error fetching quiz:', error);
        showAlert('Failed to load quiz. Please check your connection and try again.', 'error');
        showPage('home');
    }
}

// Load question
function loadQuestion(index) {
    if (!currentQuiz || index < 0 || index >= currentQuiz.questions.length) return;

    const question = currentQuiz.questions[index];
    currentQuestionIndex = index;

    // Update progress
    document.getElementById('currentQuestion').textContent = index + 1;
    const progress = ((index + 1) / currentQuiz.questions.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';

    // Set category
    const categoryMap = {
        9: 'General Knowledge',
        11: 'Film',
        12: 'Music',
        21: 'Sports',
        23: 'History',
        27: 'Animals',
        28: 'Vehicles',
        17: 'Science & Nature',
        18: 'Computers',
        22: 'Geography'
    };
    
    const categoryText = categoryMap[question.category] || question.category;
    document.getElementById('questionCategory').textContent = 
        `${categoryText} • ${capitalizeFirst(question.difficulty)}`;

    // Decode HTML entities
    document.getElementById('questionText').textContent = decodeHTML(question.question);

    // Generate options
    const allOptions = [...question.incorrect_answers, question.correct_answer];
    shuffleArray(allOptions);

    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    allOptions.forEach((option, idx) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';

        const inputId = `option-${idx}`;
        const isSelected = answers[index] === option;
        const isChecked = isSelected ? 'checked' : '';

        optionDiv.innerHTML = `
            <input 
                type="radio" 
                id="${inputId}" 
                name="answer" 
                value="${option}"
                ${isChecked}
            >
            <label for="${inputId}" style="margin: 0; cursor: pointer; flex: 1;">
                <div class="option-radio"></div>
                <span>${decodeHTML(option)}</span>
            </label>
        `;

        optionDiv.addEventListener('click', () => {
            document.getElementById(inputId).checked = true;
            answers[index] = option;
        });

        optionsContainer.appendChild(optionDiv);
    });

    // Update button visibility
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const prevBtn = document.querySelector('.quiz-actions .btn-secondary');

    prevBtn.style.display = index === 0 ? 'none' : 'inline-block';
    
    if (index === currentQuiz.questions.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    }
}

// Next question
function nextQuestion() {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        loadQuestion(currentQuestionIndex + 1);
    }
}

// Previous question
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        loadQuestion(currentQuestionIndex - 1);
    }
}

// Submit quiz
function submitQuiz() {
    if (!currentQuiz) return;

    // Calculate score
    let score = 0;
    currentQuiz.answers = [];

    currentQuiz.questions.forEach((question, index) => {
        const userAnswer = answers[index];
        const isCorrect = userAnswer === question.correct_answer;
        
        if (isCorrect) score++;

        currentQuiz.answers.push({
            question: question.question,
            userAnswer: userAnswer,
            correctAnswer: question.correct_answer,
            isCorrect: isCorrect
        });
    });

    currentQuiz.score = score;
    currentQuiz.endTime = new Date();
    currentQuiz.duration = Math.round((Date.now() - quizStartTime) / 1000);

    clearInterval(timerInterval);

    // Save quiz
    quizzes.unshift(currentQuiz);
    saveToLocalStorage();

    // Show result
    showResultModal();
    updateStats();
    updateResultsBadge();
}

// Show result modal
function showResultModal() {
    const percentage = Math.round((currentQuiz.score / currentQuiz.totalQuestions) * 100);
    const isPassed = percentage >= 60;

    let message = '';
    if (percentage === 100) {
        message = '🎉 Perfect Score!';
    } else if (percentage >= 80) {
        message = '🏆 Excellent!';
    } else if (percentage >= 60) {
        message = '✅ Good Job!';
    } else {
        message = '💪 Keep Practicing!';
    }

    const resultSummary = document.getElementById('resultSummary');
    resultSummary.innerHTML = `
        <div class="result-score-large">${percentage}%</div>
        <div class="result-message">${message}</div>
        <div class="result-stats">
            <div class="stat-item">
                <div class="stat-item-label">Correct Answers</div>
                <div class="stat-item-value">${currentQuiz.score}/${currentQuiz.totalQuestions}</div>
            </div>
            <div class="stat-item">
                <div class="stat-item-label">Time Taken</div>
                <div class="stat-item-value">${formatTime(currentQuiz.duration)}</div>
            </div>
        </div>
    `;

    document.getElementById('resultModal').classList.add('show');
}

// Close result modal
function closeResultModal() {
    document.getElementById('resultModal').classList.remove('show');
}

// Close detailed result modal
function closeDetailedResultModal() {
    document.getElementById('detailedResultModal').classList.remove('show');
}

// Render results list
function renderResultsList() {
    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = '';

    if (quizzes.length === 0) {
        resultsList.innerHTML = '<p class="empty-message">No quizzes taken yet. Start a quiz to see results!</p>';
        return;
    }

    quizzes.forEach((quiz, index) => {
        const percentage = Math.round((quiz.score / quiz.totalQuestions) * 100);
        const date = new Date(quiz.startTime).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const card = document.createElement('div');
        card.className = 'result-card';
        card.onclick = () => showDetailedResults(index);

        card.innerHTML = `
            <div class="result-info">
                <div class="result-title">Quiz ${quizzes.length - index}</div>
                <div class="result-meta">
                    <span>📅 ${date}</span>
                    <span>⏱️ ${formatTime(quiz.duration)}</span>
                    <span>📊 ${quiz.totalQuestions} Questions</span>
                </div>
            </div>
            <div class="result-score">
                <div class="result-percentage">${percentage}%</div>
                <div class="result-details">${quiz.score}/${quiz.totalQuestions} correct</div>
            </div>
        `;

        resultsList.appendChild(card);
    });
}

// Show detailed results
function showDetailedResults(quizIndex) {
    const quiz = quizzes[quizIndex];
    const detailedResults = document.getElementById('detailedResults');
    detailedResults.innerHTML = '';

    quiz.answers.forEach((answer, index) => {
        const isCorrect = answer.isCorrect;
        const questionDiv = document.createElement('div');
        questionDiv.className = 'detailed-question';

        questionDiv.innerHTML = `
            <div class="detailed-q-text">Q${index + 1}. ${decodeHTML(answer.question)}</div>
            <div class="detailed-q-option user-answer">
                <span>${isCorrect ? '✓' : '✗'}</span>
                <span>Your answer: ${decodeHTML(answer.userAnswer)}</span>
            </div>
            ${!isCorrect ? `
                <div class="detailed-q-option correct-answer">
                    <span>✓</span>
                    <span>Correct answer: ${decodeHTML(answer.correctAnswer)}</span>
                </div>
            ` : ''}
        `;

        detailedResults.appendChild(questionDiv);
    });

    document.getElementById('detailedResultModal').classList.add('show');
}

// Render leaderboard
function renderLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = '';

    if (quizzes.length === 0) {
        leaderboardList.innerHTML = '<p class="empty-message">No scores recorded yet.</p>';
        return;
    }

    // Sort by score and time
    const sorted = [...quizzes].sort((a, b) => {
        const scoreA = a.score / a.totalQuestions;
        const scoreB = b.score / b.totalQuestions;
        if (scoreB !== scoreA) return scoreB - scoreA;
        return a.duration - b.duration;
    });

    sorted.forEach((quiz, index) => {
        const percentage = Math.round((quiz.score / quiz.totalQuestions) * 100);
        const medals = ['🥇', '🥈', '🥉'];
        const medal = index < 3 ? medals[index] : (index + 1);

        const item = document.createElement('div');
        item.className = 'leaderboard-item';

        let rankClass = '';
        if (index === 0) rankClass = 'first';
        if (index === 1) rankClass = 'second';
        if (index === 2) rankClass = 'third';

        item.innerHTML = `
            <div class="rank ${rankClass}">${medal}</div>
            <div class="leaderboard-info">
                <div class="leaderboard-name">Quiz ${index + 1} • ${quiz.totalQuestions} Questions</div>
                <div style="font-size: 0.85em; color: #6b7280;">
                    ${new Date(quiz.startTime).toLocaleDateString()} • ${formatTime(quiz.duration)}
                </div>
            </div>
            <div class="leaderboard-score">
                <div class="leaderboard-value">${percentage}%</div>
            </div>
        `;

        leaderboardList.appendChild(item);
    });
}

// Update stats
function updateStats() {
    if (quizzes.length === 0) {
        document.getElementById('totalQuizzes').textContent = '0';
        document.getElementById('bestScore').textContent = '0%';
        document.getElementById('avgScore').textContent = '0%';
        return;
    }

    document.getElementById('totalQuizzes').textContent = quizzes.length;

    const scores = quizzes.map(q => (q.score / q.totalQuestions) * 100);
    const bestScore = Math.max(...scores);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    document.getElementById('bestScore').textContent = Math.round(bestScore) + '%';
    document.getElementById('avgScore').textContent = Math.round(avgScore) + '%';
}

// Update results badge
function updateResultsBadge() {
    document.getElementById('resultsBadge').textContent = quizzes.length;
}

// Timer
function startTimer() {
    let seconds = 0;
    timerInterval = setInterval(() => {
        seconds++;
        document.getElementById('timer').textContent = formatTime(seconds);
    }, 1000);
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

    if (pageId === 'home') {
        document.querySelectorAll('.nav-btn')[0].classList.add('active');
    } else if (pageId === 'results') {
        document.querySelectorAll('.nav-btn')[1].classList.add('active');
        renderResultsList();
    } else if (pageId === 'leaderboard') {
        document.querySelectorAll('.nav-btn')[2].classList.add('active');
        renderLeaderboard();
    }
}

// Utility functions
function decodeHTML(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        background: ${type === 'error' ? '#fee2e2' : '#d1fae5'};
        color: ${type === 'error' ? '#7f1d1d' : '#065f46'};
        border: 1px solid ${type === 'error' ? '#fca5a5' : '#6ee7b7'};
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    alert.textContent = message;
    document.body.appendChild(alert);

    setTimeout(() => alert.remove(), 3000);
}

// Close modal on background click
window.addEventListener('click', (e) => {
    const resultModal = document.getElementById('resultModal');
    const detailedModal = document.getElementById('detailedResultModal');

    if (e.target === resultModal) closeResultModal();
    if (e.target === detailedModal) closeDetailedResultModal();
});
