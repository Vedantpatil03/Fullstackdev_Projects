# 🎯 Online Quiz Application

A fully-featured online quiz application powered by the **Open Trivia Database API**. Create custom quizzes with multiple categories, difficulty levels, and track your progress!

## 🎯 Features

### Quiz Customization
- ✅ **Adjustable Questions** - 5, 10, 15, or 20 questions
- ✅ **10+ Categories** - General Knowledge, Film, Music, Sports, History, Science, and more
- ✅ **3 Difficulty Levels** - Easy, Medium, Hard
- ✅ **Question Types** - Multiple Choice or True/False
- ✅ **Live API Integration** - Questions fetched from Open Trivia Database
- ✅ **No Repetition** - Fresh questions every quiz

### Quiz Experience
- ✅ **Interactive Questions** - Click to select answers
- ✅ **Progress Bar** - Visual indication of quiz progress
- ✅ **Timer** - Track time spent on quiz
- ✅ **Navigation** - Move between questions freely
- ✅ **Question Review** - Go back and change answers before submitting
- ✅ **Loading Spinner** - Visual feedback while fetching questions

### Results & Analytics
- ✅ **Instant Results** - Score percentage and performance message
- ✅ **Detailed Review** - View all questions with correct answers
- ✅ **Result History** - Complete quiz history saved locally
- ✅ **Statistics** - Total quizzes, best score, average score
- ✅ **Time Tracking** - See how long each quiz took

### Leaderboard
- ✅ **Score Ranking** - Top performers ranked by score
- ✅ **Medals** - 🥇 🥈 🥉 for top 3 performers
- ✅ **Performance Stats** - View date, time, and question count
- ✅ **Historical Tracking** - All past quizzes ranked

### Data Management
- ✅ **Local Storage** - All quiz results persist across sessions
- ✅ **No Login Required** - Anonymous tracking
- ✅ **Automatic Saving** - Results saved instantly

## 📁 Project Structure

```
OnlineQuizz/
├── index.html          # Main HTML file
├── styles.css          # Complete responsive styling
├── script.js           # Quiz logic and API integration
└── README.md           # This file
```

## 🚀 Getting Started

### Installation
Simply open `index.html` in your web browser. No installation or setup required!

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for API access)

## 📊 How It Works

### 1. **Configure Quiz**
   - Select number of questions (5, 10, 15, or 20)
   - Choose category (Optional - Any Category for mixed)
   - Pick difficulty level (Easy, Medium, Hard)
   - Select question type (Multiple Choice or True/False)

### 2. **Take Quiz**
   - Questions are fetched live from Open Trivia Database
   - Click options to select your answer
   - Track progress with the progress bar
   - Navigate back to previous questions anytime
   - Submit when ready

### 3. **View Results**
   - See your score percentage immediately
   - Get performance feedback (Perfect! Excellent! Good Job!)
   - Review time taken
   - View detailed question-by-question review

### 4. **Track Progress**
   - View all past quiz results
   - Check leaderboard of your best performances
   - Monitor your statistics and improvement

## 🎨 Categories Available

| Code | Category |
|------|----------|
| 9 | General Knowledge |
| 11 | Film |
| 12 | Music |
| 21 | Sports |
| 23 | History |
| 27 | Animals |
| 28 | Vehicles |
| 17 | Science & Nature |
| 18 | Computers |
| 22 | Geography |

## 📡 API Integration

### Open Trivia Database
- **Endpoint**: `https://opentdb.com/api.php`
- **Free API** - No authentication required
- **Real Questions** - Verified by trivia community
- **Always Updated** - New questions regularly added

### Query Parameters
```
amount=10              # Number of questions
category=9            # Category ID
difficulty=medium     # easy, medium, hard
type=multiple         # multiple, boolean
```

### Response Format
```json
{
  "results": [
    {
      "category": "General Knowledge",
      "type": "multiple",
      "difficulty": "medium",
      "question": "What is...?",
      "correct_answer": "Answer",
      "incorrect_answers": ["Wrong1", "Wrong2", "Wrong3"]
    }
  ]
}
```

## 💾 Data Structure

### Quiz Object
```javascript
{
  id: 1706234567890,                    // Unique ID
  questions: [],                         // All questions with options
  category: "9",                         // Category ID
  difficulty: "medium",                  // Difficulty level
  score: 8,                              // Number of correct answers
  totalQuestions: 10,                    // Total questions in quiz
  startTime: "2026-02-01T...",          // When quiz started
  endTime: "2026-02-01T...",            // When quiz ended
  answers: [],                           // User's answers with feedback
  duration: 245                          // Time taken in seconds
}
```

### Answer Object
```javascript
{
  question: "Question text",
  userAnswer: "Selected answer",
  correctAnswer: "Right answer",
  isCorrect: true
}
```

## 🎮 Quiz Settings

### Question Count Options
- 5 Questions - Quick quiz (2-5 minutes)
- 10 Questions - Standard quiz (5-15 minutes)
- 15 Questions - Extended quiz (15-30 minutes)
- 20 Questions - Full quiz (30-60 minutes)

### Difficulty Levels
- **Easy** - Basic knowledge, straightforward answers
- **Medium** - Moderate difficulty, requires some thinking
- **Hard** - Advanced knowledge, tricky questions

### Question Types
- **Multiple Choice** - 4 options, pick the right one
- **True/False** - 2 options, quick answers

## 📈 Performance Metrics

### Scoring
- Percentage based on correct answers
- 100% = All correct
- 60% = Passing grade
- Below 60% = Needs improvement

### Performance Messages
- 100% - 🎉 Perfect Score!
- 80-99% - 🏆 Excellent!
- 60-79% - ✅ Good Job!
- Below 60% - 💪 Keep Practicing!

### Time Tracking
- Records time for each quiz
- Formats as MM:SS display
- Useful for competitive scoring

## 🔧 Customization

### Change Passing Score
In `script.js`:
```javascript
const isPassed = percentage >= 60; // Change 60 to desired %
```

### Add More Categories
Edit the category dropdown in `index.html` and add to the categoryMap in `script.js`

### Modify Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary: #6366f1;
    --secondary: #ec4899;
    /* ... more colors */
}
```

## 🚀 Future Enhancements

- User authentication and profiles
- Multiplayer quizzes (compete with friends)
- Timed mode (questions with countdown)
- Difficulty progression (auto-adjust difficulty)
- Achievement badges
- Social sharing (share scores)
- Daily challenges
- Quiz creation tool (user-generated quizzes)
- Mobile app version
- Offline mode with cached questions
- Advanced analytics dashboard
- AI-generated difficulty ranking

## ⚠️ Limitations

- Dependent on Open Trivia Database availability
- Random questions (no custom question pools)
- No user accounts (anonymous tracking)
- Results stored in browser only
- Maximum browser storage limit (~5-10MB)

## 🐛 Troubleshooting

### API Not Working
- Check internet connection
- Open Trivia Database might be down
- Try a different category/difficulty

### Questions Look Weird
- HTML entities are decoded automatically
- If still seeing HTML tags, check browser console for errors

### Results Not Saving
- Check browser's localStorage limit
- Clear browser cache and try again
- Use private/incognito mode test

## 📱 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🎓 Learning Value

This project demonstrates:
- Fetch API for external data
- Async/await with error handling
- DOM manipulation and dynamic content
- Event handling and navigation
- Local Storage API for persistence
- HTML entity decoding
- Array shuffling algorithms
- Timer and interval management
- Responsive CSS design
- Modal dialogs
- Data visualization (progress bars, charts)

## 📝 License

Free to use and modify for educational and commercial purposes.

## 🙏 Credits

- **Questions**: [Open Trivia Database](https://opentdb.com/)
- **API**: Powered by OTDB

## 👨‍💻 Author

Created as a comprehensive online quiz application - 2026

---

**Start your quiz journey today and challenge yourself!** 🎯

