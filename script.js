class QuizApp {
    constructor() {
        this.welcomeScreen = document.getElementById('welcome-screen');
        this.quizScreen = document.getElementById('quiz-screen');
        this.resultsScreen = document.getElementById('results-screen');
        this.startBtn = document.getElementById('start-btn');
        this.categorySelect = document.getElementById('category-select');
        this.questionElement = document.getElementById('question');
        this.answersContainer = document.getElementById('answers');
        this.progressElement = document.getElementById('progress');
        this.scoreElement = document.getElementById('score');
        this.playAgainBtn = document.getElementById('play-again');

        this.currentQuestion = 0;
        this.score = 0;
        this.questions = [];

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.startBtn.addEventListener('click', () => this.startQuiz());
        this.playAgainBtn.addEventListener('click', () => this.resetQuiz());
    }

    async fetchQuestions() {
        const category = this.categorySelect.value;
        const url = `https://opentdb.com/api.php?amount=10&category=${category}&type=multiple`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching questions:', error);
            return [];
        }
    }

    async startQuiz() {
        this.questions = await this.fetchQuestions();
        if (this.questions.length === 0) {
            alert('Error loading questions. Please try again.');
            return;
        }

        this.currentQuestion = 0;
        this.score = 0;
        this.showScreen(this.quizScreen);
        this.displayQuestion();
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestion];
        this.questionElement.innerHTML = this.decodeHTML(question.question);
        this.progressElement.textContent = `Question ${this.currentQuestion + 1}/10`;

        // Combine correct and incorrect answers
        const answers = [
            question.correct_answer,
            ...question.incorrect_answers
        ];
        
        // Shuffle answers
        const shuffledAnswers = this.shuffleArray(answers);

        // Clear previous answers
        this.answersContainer.innerHTML = '';

        // Create answer buttons
        shuffledAnswers.forEach(answer => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.innerHTML = this.decodeHTML(answer);
            button.addEventListener('click', () => this.handleAnswer(answer, question.correct_answer));
            this.answersContainer.appendChild(button);
        });
    }

    handleAnswer(selectedAnswer, correctAnswer) {
        const buttons = this.answersContainer.getElementsByClassName('answer-btn');
        Array.from(buttons).forEach(button => {
            button.disabled = true;
            if (button.innerHTML === this.decodeHTML(correctAnswer)) {
                button.classList.add('correct');
            } else if (button.innerHTML === this.decodeHTML(selectedAnswer)) {
                button.classList.add('wrong');
            }
        });

        if (selectedAnswer === correctAnswer) {
            this.score++;
        }

        setTimeout(() => {
            this.currentQuestion++;
            if (this.currentQuestion < 10) {
                this.displayQuestion();
            } else {
                this.showResults();
            }
        }, 1500);
    }

    showResults() {
        this.showScreen(this.resultsScreen);
        this.scoreElement.textContent = this.score;
    }

    resetQuiz() {
        this.showScreen(this.welcomeScreen);
    }

    showScreen(screen) {
        [this.welcomeScreen, this.quizScreen, this.resultsScreen].forEach(s => {
            s.classList.remove('active');
        });
        screen.classList.add('active');
    }

    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    decodeHTML(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new QuizApp();
});
