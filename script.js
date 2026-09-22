// ====== Переключение игр ======
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        switchGame(btn.dataset.game);
    });
});

function switchGame(gameId) {
    document.querySelectorAll('.game-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(gameId).classList.add('active');
    const navBtn = document.querySelector(`[data-game="${gameId}"]`);
    if (navBtn) navBtn.classList.add('active');

    // Автозапуск игр
    if (gameId === 'letters') startLetterGame();
    if (gameId === 'words') startWordGame();
    if (gameId === 'syllables') startSyllableGame();
}

// ====== ИГРА 1: Найди букву ======
let letterScore = 0;
let lettersToFind = 0;

function startLetterGame() {
    const grid = document.getElementById('letters-grid');
    grid.innerHTML = '';
    
    const letters = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
    const targetLetter = 'А';
    const cells = [];
    
    // Создаём 24 ячейки, из них 6 - буква А
    for (let i = 0; i < 24; i++) {
        const isTarget = i < 6;
        const letter = isTarget ? targetLetter : 
            letters[Math.floor(Math.random() * letters.length)];
        cells.push({ letter, isTarget, found: false });
    }
    
    // Перемешиваем
    cells.sort(() => Math.random() - 0.5);
    lettersToFind = 6;
    letterScore = 0;
    document.getElementById('letter-score').textContent = 0;
    
    cells.forEach((cell, idx) => {
        const div = document.createElement('div');
        div.className = 'letter-cell';
        div.textContent = cell.letter;
        div.onclick = () => {
            if (cell.letter === targetLetter) {
                div.classList.add('found');
                letterScore += 10;
                document.getElementById('letter-score').textContent = letterScore;
                lettersToFind--;
                
                if (lettersToFind === 0) {
                    setTimeout(() => {
                        alert(`🎉 Молодец! Ты нашёл все буквы А!\nСчёт: ${letterScore}`);
                    }, 300);
                }
            } else {
                div.classList.add('wrong');
                setTimeout(() => div.classList.remove('wrong'), 400);
                letterScore = Math.max(0, letterScore - 2);
                document.getElementById('letter-score').textContent = letterScore;
            }
        };
        grid.appendChild(div);
    });
}

// ====== ИГРА 2: Собери слово ======
const wordData = [
    { word: 'МАМА', hint: '👩' },
    { word: 'ПАПА', hint: '👨' },
    { word: 'КОТ', hint: '🐱' },
    { word: 'ДОМ', hint: '🏠' },
    { word: 'СОК', hint: '🧃' },
    { word: 'МЯЧ', hint: '⚽' },
    { word: 'ЛУНА', hint: '🌙' },
    { word: 'РЫБА', hint: '🐟' },
    { word: 'ЛИСА', hint: '🦊' },
    { word: 'СЛОН', hint: '🐘' }
];

let currentWord = null;
let currentPosition = 0;
let wordScore = 0;

function startWordGame() {
    currentWord = wordData[Math.floor(Math.random() * wordData.length)];
    currentPosition = 0;
    
    document.getElementById('word-hint').textContent = currentWord.hint;
    
    // Слоты для букв
    const slots = document.getElementById('word-slots');
    slots.innerHTML = '';
    for (let i = 0; i < currentWord.word.length; i++) {
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.id = 'slot-' + i;
        slots.appendChild(slot);
    }
    
    // Перемешанные буквы
    const pool = document.getElementById('letters-pool');
    pool.innerHTML = '';
    const shuffled = currentWord.word.split('').sort(() => Math.random() - 0.5);
    
    shuffled.forEach((letter, idx) => {
        const btn = document.createElement('div');
        btn.className = 'pool-letter';
        btn.textContent = letter;
        btn.dataset.letter = letter;
        btn.onclick = () => placeLetter(btn, letter);
        pool.appendChild(btn);
    });
}

function placeLetter(btn, letter) {
    if (currentPosition >= currentWord.word.length) return;
    
    // Проверяем, правильная ли буква
    if (letter === currentWord.word[currentPosition]) {
        const slot = document.getElementById('slot-' + currentPosition);
        slot.textContent = letter;
        slot.classList.add('filled');
        btn.classList.add('used');
        currentPosition++;
        
        // Слово собрано!
        if (currentPosition === currentWord.word.length) {
            wordScore += 20;
            document.getElementById('word-score').textContent = wordScore;
            setTimeout(() => {
                alert(`🎉 Правильно! Слово «${currentWord.word}» собрано!\nСчёт: ${wordScore}`);
                startWordGame();
            }, 300);
        }
    } else {
        btn.classList.add('wrong');
        btn.style.background = '#ff6b6b';
        setTimeout(() => {
            btn.style.background = '';
            btn.classList.remove('wrong');
        }, 400);
    }
}

// ====== ИГРА 3: Слоги ======
const syllableWords = [
    { word: 'МАМА', syllables: 2 },
    { word: 'ПАПА', syllables: 2 },
    { word: 'КОТ', syllables: 1 },
    { word: 'СОБАКА', syllables: 3 },
    { word: 'МОЛОКО', syllables: 3 },
    { word: 'ЛИСА', syllables: 2 },
    { word: 'РЫБА', syllables: 2 },
    { word: 'ВОРОНА', syllables: 3 },
    { word: 'ДОМ', syllables: 1 },
    { word: 'МЯЧИК', syllables: 2 },
    { word: 'БАНАН', syllables: 2 },
    { word: 'ЯБЛОКО', syllables: 3 },
    { word: 'КОРОВА', syllables: 3 },
    { word: 'СОК', syllables: 1 }
];

let currentSyllable = null;
let syllableScore = 0;

function startSyllableGame() {
    currentSyllable = syllableWords[Math.floor(Math.random() * syllableWords.length)];
    document.getElementById('syllable-word').textContent = currentSyllable.word;
    document.getElementById('syllable-feedback').textContent = '';
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.classList.remove('correct', 'wrong');
        btn.disabled = false;
    });
}

function checkSyllable(answer) {
    const feedback = document.getElementById('syllable-feedback');
    
    if (answer === currentSyllable.syllables) {
        feedback.textContent = '✅ Правильно! Молодец!';
        feedback.style.color = '#4CAF50';
        syllableScore += 10;
        document.getElementById('syllable-score').textContent = syllableScore;
        
        setTimeout(() => startSyllableGame(), 1200);
    } else {
        feedback.textContent = `❌ Неправильно. Правильный ответ: ${currentSyllable.syllables}`;
        feedback.style.color = '#ff6b6b';
        
        setTimeout(() => startSyllableGame(), 2000);
    }
}