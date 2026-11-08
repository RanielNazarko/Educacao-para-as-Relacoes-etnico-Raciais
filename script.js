const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.textContent = isOpen ? '×' : '☰';
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = '☰';
    document.querySelectorAll('.nav-link').forEach(item => item.classList.remove('active'));
    link.classList.add('active');
  });
});

// Glossário pesquisável em tempo real
const glossarySearch = document.getElementById('glossarySearch');
const glossaryItems = [...document.querySelectorAll('.glossary-item')];
const noResults = document.getElementById('noResults');

glossarySearch.addEventListener('input', event => {
  const term = event.target.value.trim().toLocaleLowerCase('pt-BR');
  let visible = 0;
  glossaryItems.forEach(item => {
    const matches = item.textContent.toLocaleLowerCase('pt-BR').includes(term);
    item.hidden = !matches;
    if (matches) visible++;
  });
  noResults.hidden = visible !== 0;
});

// Quiz com pontuação e feedback imediato
const questions = [
  {
    question: 'Qual é o objetivo da educação das relações étnico-raciais?',
    answers: ['Valorizar a diversidade e combater o racismo', 'Estudar somente uma cultura', 'Apagar diferenças culturais'],
    correct: 0,
    explanation: 'Isso mesmo! A proposta valoriza a diversidade e contribui para enfrentar o racismo.'
  },
  {
    question: 'O que significa ancestralidade?',
    answers: ['Uma moda passageira', 'A relação com antepassados, memórias e saberes', 'Somente uma data histórica'],
    correct: 1,
    explanation: 'Correto! A ancestralidade conecta histórias, memórias, conhecimentos e tradições.'
  },
  {
    question: 'Qual atitude representa a equidade?',
    answers: ['Oferecer exatamente o mesmo apoio em qualquer situação', 'Ignorar as desigualdades', 'Considerar diferentes barreiras para garantir oportunidades justas'],
    correct: 2,
    explanation: 'Muito bem! Equidade considera diferentes necessidades para promover justiça.'
  }
];
let currentQuestion = 0;
let score = 0;
let answered = false;

const questionText = document.getElementById('questionText');
const answersBox = document.getElementById('answers');
const questionCount = document.getElementById('questionCount');
const scoreLabel = document.getElementById('scoreLabel');
const progressFill = document.getElementById('progressFill');
const feedback = document.getElementById('quizFeedback');
const nextButton = document.getElementById('nextQuestion');

function renderQuestion() {
  const item = questions[currentQuestion];
  answered = false;
  questionCount.textContent = `PERGUNTA 0${currentQuestion + 1} / 0${questions.length}`;
  scoreLabel.textContent = `PONTOS: ${score}`;
  progressFill.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  questionText.textContent = item.question;
  feedback.textContent = '';
  nextButton.hidden = true;
  nextButton.textContent = currentQuestion === questions.length - 1 ? 'Ver resultado ↗' : 'Próxima pergunta →';
  answersBox.innerHTML = '';
  item.answers.forEach((answer, index) => {
    const button = document.createElement('button');
    button.className = 'answer';
    button.textContent = answer;
    button.addEventListener('click', () => chooseAnswer(index));
    answersBox.appendChild(button);
  });
}

function chooseAnswer(selected) {
  if (answered) return;
  answered = true;
  const item = questions[currentQuestion];
  const buttons = [...answersBox.querySelectorAll('button')];
  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === item.correct) button.classList.add('correct');
    else if (index === selected) button.classList.add('wrong');
  });
  if (selected === item.correct) {
    score++;
    feedback.textContent = `✓ ${item.explanation}`;
  } else {
    feedback.textContent = `Quase! ${item.explanation}`;
  }
  scoreLabel.textContent = `PONTOS: ${score}`;
  nextButton.hidden = false;
}

let quizFinished = false;
nextButton.addEventListener('click', () => {
  if (quizFinished) {
    currentQuestion = 0;
    score = 0;
    quizFinished = false;
    renderQuestion();
    return;
  }
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    renderQuestion();
    return;
  }
  showResult();
});

function showResult() {
  questionCount.textContent = 'QUIZ CONCLUÍDO';
  scoreLabel.textContent = `PONTOS: ${score}`;
  progressFill.style.width = '100%';
  questionText.textContent = score === 3 ? 'Excelente! Você mandou muito bem.' : 'Sua jornada de aprendizado continua!';
  answersBox.innerHTML = '';
  feedback.textContent = `Você acertou ${score} de ${questions.length} perguntas. Continue explorando o Raízes em Rede e aprendendo sobre diversidade.`;
  nextButton.hidden = false;
  nextButton.textContent = 'Refazer quiz ↻';
  quizFinished = true;
}

renderQuestion();
