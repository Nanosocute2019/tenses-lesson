const tenseData = {
    // Present
    'Present Simple': {
        meaning: 'ใช้พูดถึงความจริง, นิสัย, หรือตารางเวลา',
        structure: 'Subject + V1 \\text{(s/es)}',
    },
    'Present Continuous': {
        meaning: 'ใช้พูดถึงสิ่งที่กำลังทำอยู่ในขณะนี้',
        structure: 'Subject + \\text{is/am/are} + \\text{V-ing}',
    },
    'Present Perfect': {
        meaning: 'ใช้พูดถึงเหตุการณ์ที่เริ่มในอดีตและยังดำเนินต่อ/เพิ่งจบ/ผลยังคงอยู่',
        structure: 'Subject + \\text{has/have} + \\text{V3}',
    },
    'Present Perfect Continuous': {
        meaning: 'ใช้พูดถึงการกระทำที่เริ่มในอดีตและทำต่อเนื่องจนถึงปัจจุบัน (เน้นระยะเวลา)',
        structure: 'Subject + \\text{has/have been} + \\text{V-ing}',
    },

    // Past
    'Past Simple': {
        meaning: 'ใช้พูดถึงเหตุการณ์ที่เกิดขึ้นและจบลงแล้วในอดีตอย่างชัดเจน',
        structure: 'Subject + \\text{V2}',
    },
    'Past Continuous': {
        meaning: 'ใช้พูดถึงเหตุการณ์ที่กำลังดำเนินอยู่ในช่วงเวลาหนึ่งในอดีต',
        structure: 'Subject + \\text{was/were} + \\text{V-ing}',
    },
    'Past Perfect': {
        meaning: 'ใช้พูดถึงเหตุการณ์ที่เกิดและจบลงก่อนเหตุการณ์อีกอย่างหนึ่งในอดีต',
        structure: 'Subject + \\text{had} + \\text{V3}',
    },
    'Past Perfect Continuous': {
        meaning: 'ใช้พูดถึงการกระทำที่ดำเนินต่อเนื่องก่อนเหตุการณ์อีกอย่างหนึ่งในอดีต (เน้นระยะเวลา)',
        structure: 'Subject + \\text{had been} + \\text{V-ing}',
    },
    
    // Future
    'Future Simple': {
        meaning: 'ใช้พูดถึงการคาดการณ์, การตัดสินใจทันที, หรือเหตุการณ์ที่จะเกิดขึ้นในอนาคต',
        structure: 'Subject + \\text{will/shall} + \\text{V1}',
    },
    'Future Continuous': {
        meaning: 'ใช้พูดถึงสิ่งที่กำลังจะทำ ณ จุดเวลาหนึ่งในอนาคต',
        structure: 'Subject + \\text{will be} + \\text{V-ing}',
    },
    'Future Perfect': {
        meaning: 'ใช้พูดถึงเหตุการณ์ที่จะเสร็จสมบูรณ์ก่อนจุดเวลาหนึ่งในอนาคต',
        structure: 'Subject + \\text{will have} + \\text{V3}',
    },
    'Future Perfect Continuous': {
        meaning: 'ใช้พูดถึงการกระทำที่ดำเนินต่อเนื่องจนถึงจุดเวลาหนึ่งในอนาคต (เน้นระยะเวลา)',
        structure: 'Subject + \\text{will have been} + \\text{V-ing}',
    }
};

let selectedTime = '';
let selectedForm = '';
let currentQuestionIndex = 0;
let quizQuestions = [];
let currentQuizFile = 'test1.json'; 

async function loadQuizData(filename) {
    try {
        const response = await fetch(filename);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        quizQuestions = data;
        currentQuestionIndex = 0;
        shuffleArray(quizQuestions); 
        displayQuestion();
    } catch (error) {
        console.error('Could not load quiz data:', error);
        document.getElementById('question-text').innerHTML = `เกิดข้อผิดพลาดในการโหลดโจทย์จากไฟล์ ${filename}`;
        document.getElementById('check-answer-btn').style.display = 'none';
        document.getElementById('next-question-btn').style.display = 'none';
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function updateTenseResult() {
    const timePartElement = document.getElementById('time-part');
    const formPartElement = document.getElementById('form-part');
    const fullTenseElement = document.getElementById('full-tense-name');
    const meaningElement = document.getElementById('tense-meaning');
    const structureElement = document.getElementById('tense-structure');
    
    timePartElement.textContent = selectedTime || '???';
    formPartElement.textContent = selectedForm ? selectedForm + ' ' : '???';

    if (selectedTime && selectedForm) {
        const fullTenseName = `${selectedTime} ${selectedForm}`; 
        
        fullTenseElement.textContent = fullTenseName + ' Tense';

        const data = tenseData[fullTenseName];
        if (data) {
            meaningElement.textContent = data.meaning;
            structureElement.innerHTML = `$$${data.structure}$$`; 
            if (window.MathJax) {
                MathJax.typesetPromise([structureElement]);
            }
        } else {
            meaningElement.textContent = 'ไม่พบข้อมูล Tense นี้';
            structureElement.textContent = 'ไม่พบข้อมูลโครงสร้าง';
        }
    } else {
        fullTenseElement.textContent = '(รอการเลือก...)';
        meaningElement.textContent = 'เลือก Time และ Form เพื่อดูรายละเอียด';
        structureElement.textContent = 'เลือก Time และ Form เพื่อดูรายละเอียด';
        structureElement.innerHTML = 'เลือก Time และ Form เพื่อดูรายละเอียด';
    }
}


function resetSelectionAndFeedback() {
    document.querySelectorAll('.time-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.form-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('feedback-message').textContent = '';
    selectedTime = '';
    selectedForm = '';
    updateTenseResult();
}


function displayQuestion() {
    if (quizQuestions.length === 0) return;

    resetSelectionAndFeedback();
    
    const currentQ = quizQuestions[currentQuestionIndex];
    document.getElementById('question-text').innerHTML = currentQ.question;
    
    document.getElementById('check-answer-btn').style.display = 'inline-block';
    document.getElementById('next-question-btn').style.display = 'none';
}


function checkAnswer() {
    if (quizQuestions.length === 0) return;
    
    const currentQ = quizQuestions[currentQuestionIndex];
    const feedbackElement = document.getElementById('feedback-message');
    
    if (!selectedTime || !selectedForm) {
        feedbackElement.textContent = 'เลือก Time และ Form ก่อนกดตรวจ';
        feedbackElement.style.color = '#dc3545';
        return;
    }
    
    if (selectedTime === currentQ.correctTime && selectedForm === currentQ.correctForm) {
        feedbackElement.textContent = `ถูกต้อง.. ก็แค่เดา ${currentQ.correctTime} ${currentQ.correctForm} Tense`;
        feedbackElement.style.color = '#28a745';
    } else {
        const correctTenseName = `${currentQ.correctTime} ${currentQ.correctForm} Tense`;
        feedbackElement.textContent = `ผิด คำที่ถูกคือ ${correctTenseName} ไอควาย`;
        feedbackElement.style.color = '#dc3545';
    }
    selectedTime = currentQ.correctTime;
    selectedForm = currentQ.correctForm;
    document.querySelectorAll('.time-btn').forEach(btn => {
        if (btn.getAttribute('data-value') === currentQ.correctTime) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    document.querySelectorAll('.form-btn').forEach(btn => {
        if (btn.getAttribute('data-value') === currentQ.correctForm) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    document.getElementById('check-answer-btn').style.display = 'none';
    document.getElementById('next-question-btn').style.display = 'inline-block';
    
    updateTenseResult();
}


function nextQuestion() {
    if (quizQuestions.length === 0) return;

    currentQuestionIndex++;
    if (currentQuestionIndex >= quizQuestions.length) {
        alert(`จบชุด ${currentQuizFile} แล้ว จะเริ่มวนคำถามใหม่`);
        currentQuestionIndex = 0; 
        shuffleArray(quizQuestions); 
    }
    displayQuestion();
}


document.querySelectorAll('.time-btn').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.time-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        selectedTime = this.getAttribute('data-value');
        updateTenseResult();
    });
});

document.querySelectorAll('.form-btn').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.form-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        selectedForm = this.getAttribute('data-value');
        updateTenseResult();
    });
});

document.getElementById('check-answer-btn').addEventListener('click', checkAnswer);
document.getElementById('next-question-btn').addEventListener('click', nextQuestion);


loadQuizData(currentQuizFile);