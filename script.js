// ===== Motivasyon Mesajları =====
const motivationMessages = {
    pomodoro: [
        "Harika işler çıkarmaya hazır mısın? 🚀",
        "Odaklanma zamanı! Sen yaparsın! 💪",
        "Her büyük iş, küçük adımlarla başlar 🌟",
        "Başarı yolundasın! Devam et! 🎯",
        "Konsantrasyon modunda! Hadi yapalım! 🔥",
        "Zamanı verimli kullanmanın tam zamanı! ⏰",
        "Sen bir yıldızsın! Parlamaya devam! ✨",
        "Odaklan, çalış, başar! İşte bu kadar basit! 🎓",
        "Büyük hayaller, güçlü çalışma! 💫",
        "Başarı senin için çalışıyor! 🏆"
    ],
    shortBreak: [
        "Harika gidiyorsun! Kısa bir mola hak ettin! ☕",
        "Dinlenme zamanı! Biraz nefes al 🌸",
        "Mükemmel! Enerji doldurma vakti! 🔋",
        "Süper! Şimdi biraz esne ve rahatla 🧘",
        "Mola zamanı! Gözlerini dinlendir 👀",
        "Harika performans! Kısa bir soluk al 🌿",
        "Çok iyisin! Biraz uzaklaş ve gevşe 😌",
        "Mola = Yeniden şarj! Tadını çıkar! 🌈",
        "Beynini dinlendir, enerjini topla! 🧠",
        "Kısa ama tatlı bir mola! İyi dinlenmeler! 🍃"
    ],
    longBreak: [
        "Müthiş! Uzun bir mola hak ettin! 🎉",
        "Süpersin! Şimdi güzelce dinlen 🌺",
        "Harika çalışma! Uzun molayı hak ettin! 🏖️",
        "Tebrikler! Kendine iyi bak şimdi 💆",
        "Mükemmel! Biraz dolaş, hareket et! 🚶",
        "Harika performans! Uzun molanın tadını çıkar! 🎊",
        "Sen inanılmazsın! İyi dinlen! 🌟",
        "Uzun mola zamanı! Enerji doldur! ⚡",
        "Bravo! Kendini ödüllendir! 🎁",
        "Süper çalışma! Şimdi rahatla! 🛋️"
    ],
    completed: [
        "Pomodoro tamamlandı! Aferin sana! 🎊",
        "Bir pomodoro daha! Harikasın! 🌟",
        "Mükemmel odaklanma! Tebrikler! 🎯",
        "Bir adım daha ilerleme! Süpersin! 🚀",
        "Tamamlandı! Başarıya giden yoldasın! 🏆",
        "Harika! Bir pomodoro daha geride kaldı! ✨",
        "Mükemmel! Devam böyle! 💪",
        "Başarılı! Sen inanılmazsın! 🌈",
        "Pomodoro bitti! Kendini ödüllendir! 🎁",
        "Tebrikler! Bir pomodoro daha tamamladın! 🎉"
    ]
};

// ===== Global Variables =====
let timerInterval;
let timeLeft;
let totalSeconds;
let isRunning = false;
let currentMode = 'pomodoro';
let completedPomodoros = 0;
let totalWorkTime = 0;
let completedTasks = 0;

// Settings
let settings = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    notifications: true,
    sound: true
};

// ===== DOM Elements =====
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const modeButtons = document.querySelectorAll('.mode-btn');
const motivationText = document.querySelector('.motivation-text');
const progressCircle = document.getElementById('progress');
const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const closeSettingsBtn = document.getElementById('closeSettings');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// Stats
const completedPomodorosEl = document.getElementById('completedPomodoros');
const totalTimeEl = document.getElementById('totalTime');
const completedTasksEl = document.getElementById('completedTasks');

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    loadStats();
    loadTasks();
    initTimer();
    setupEventListeners();
    updateMotivation('pomodoro');
    requestNotificationPermission();
});

// ===== Timer Functions =====
function initTimer() {
    const minutes = settings[currentMode];
    totalSeconds = minutes * 60;
    timeLeft = totalSeconds;
    updateTimerDisplay();
    updateProgressRing();
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateProgressRing() {
    const radius = 140;
    const circumference = 2 * Math.PI * radius;
    const progress = (timeLeft / totalSeconds) * circumference;
    
    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = circumference - progress;
}

function startTimer() {
    if (isRunning) {
        pauseTimer();
        return;
    }

    isRunning = true;
    startBtn.innerHTML = '<span class="btn-icon">⏸</span><span class="btn-text">Duraklat</span>';
    startBtn.classList.add('paused');

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        updateProgressRing();

        if (timeLeft === 0) {
            completeTimer();
        }
    }, 1000);
}

function pauseTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    startBtn.innerHTML = '<span class="btn-icon">▶</span><span class="btn-text">Devam Et</span>';
    startBtn.classList.remove('paused');
}

function resetTimer() {
    pauseTimer();
    initTimer();
    startBtn.innerHTML = '<span class="btn-icon">▶</span><span class="btn-text">Başlat</span>';
}

function completeTimer() {
    pauseTimer();
    
    // Update stats
    if (currentMode === 'pomodoro') {
        completedPomodoros++;
        totalWorkTime += settings.pomodoro;
        updateStats();
        updateMotivation('completed');
    }

    // Play sound
    if (settings.sound) {
        playCompletionSound();
    }

    // Show notification
    if (settings.notifications) {
        showNotification();
    }

    // Auto switch to break
    setTimeout(() => {
        if (currentMode === 'pomodoro') {
            switchMode(completedPomodoros % 4 === 0 ? 'long' : 'short');
        } else {
            switchMode('pomodoro');
        }
    }, 2000);
}

// ===== Mode Switching =====
function switchMode(mode) {
    currentMode = mode === 'short' ? 'shortBreak' : mode === 'long' ? 'longBreak' : 'pomodoro';
    
    modeButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        }
    });

    resetTimer();
    updateMotivation(mode === 'short' ? 'shortBreak' : mode === 'long' ? 'longBreak' : 'pomodoro');
}

// ===== Motivation =====
function updateMotivation(type) {
    const messages = motivationMessages[type];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    motivationText.textContent = randomMessage;
}

// ===== Stats =====
function updateStats() {
    completedPomodorosEl.textContent = completedPomodoros;
    totalTimeEl.textContent = `${totalWorkTime}dk`;
    completedTasksEl.textContent = completedTasks;
    saveStats();
}

function loadStats() {
    const savedStats = localStorage.getItem('pomodoroStats');
    if (savedStats) {
        const stats = JSON.parse(savedStats);
        completedPomodoros = stats.pomodoros || 0;
        totalWorkTime = stats.totalTime || 0;
        completedTasks = stats.tasks || 0;
        updateStats();
    }
}

function saveStats() {
    const stats = {
        pomodoros: completedPomodoros,
        totalTime: totalWorkTime,
        tasks: completedTasks
    };
    localStorage.setItem('pomodoroStats', JSON.stringify(stats));
}

// ===== Tasks =====
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    createTaskElement(task);
    saveTasks();
    taskInput.value = '';
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = task.id;

    li.innerHTML = `
        <div class="task-content">
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask(${task.id})"></div>
            <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
        </div>
        <button class="task-delete" onclick="deleteTask(${task.id})">×</button>
    `;

    taskList.appendChild(li);
}

function toggleTask(id) {
    const taskItem = document.querySelector(`[data-id="${id}"]`);
    const checkbox = taskItem.querySelector('.task-checkbox');
    const text = taskItem.querySelector('.task-text');
    
    checkbox.classList.toggle('checked');
    text.classList.toggle('completed');

    const tasks = getTasks();
    const task = tasks.find(t => t.id === id);
    
    if (task) {
        const wasCompleted = task.completed;
        task.completed = !task.completed;
        
        if (!wasCompleted && task.completed) {
            completedTasks++;
        } else if (wasCompleted && !task.completed) {
            completedTasks--;
        }
        
        updateStats();
    }

    saveTasks();
}

function deleteTask(id) {
    const taskItem = document.querySelector(`[data-id="${id}"]`);
    const wasCompleted = taskItem.querySelector('.task-checkbox').classList.contains('checked');
    
    if (wasCompleted) {
        completedTasks--;
        updateStats();
    }
    
    taskItem.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => {
        taskItem.remove();
        saveTasks();
    }, 300);
}

function getTasks() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(item => {
        tasks.push({
            id: parseInt(item.dataset.id),
            text: item.querySelector('.task-text').textContent,
            completed: item.querySelector('.task-checkbox').classList.contains('checked')
        });
    });
    return tasks;
}

function saveTasks() {
    const tasks = getTasks();
    localStorage.setItem('pomodoroTasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem('pomodoroTasks');
    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        tasks.forEach(task => createTaskElement(task));
    }
}

// ===== Settings =====
function loadSettings() {
    const savedSettings = localStorage.getItem('pomodoroSettings');
    if (savedSettings) {
        settings = { ...settings, ...JSON.parse(savedSettings) };
        document.getElementById('pomodoroTime').value = settings.pomodoro;
        document.getElementById('shortBreakTime').value = settings.shortBreak;
        document.getElementById('longBreakTime').value = settings.longBreak;
        document.getElementById('notificationsToggle').checked = settings.notifications;
        document.getElementById('soundToggle').checked = settings.sound;
    }
}

function saveSettings() {
    settings.pomodoro = parseInt(document.getElementById('pomodoroTime').value);
    settings.shortBreak = parseInt(document.getElementById('shortBreakTime').value);
    settings.longBreak = parseInt(document.getElementById('longBreakTime').value);
    settings.notifications = document.getElementById('notificationsToggle').checked;
    settings.sound = document.getElementById('soundToggle').checked;
    
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
    initTimer();
}

// ===== Theme =====
function setTheme(theme) {
    document.body.dataset.theme = theme;
    localStorage.setItem('pomodoroTheme', theme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('pomodoroTheme');
    if (savedTheme) {
        document.body.dataset.theme = savedTheme;
    }
}

// ===== Notifications =====
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function showNotification() {
    if ('Notification' in window && Notification.permission === 'granted') {
        const title = currentMode === 'pomodoro' ? '🎉 Pomodoro Tamamlandı!' : '⏰ Mola Bitti!';
        const body = currentMode === 'pomodoro' 
            ? 'Harika! Mola zamanı!' 
            : 'Çalışmaya geri dönme zamanı!';
        
        new Notification(title, {
            body: body,
            icon: '🍅',
            badge: '🍅'
        });
    }
}

// ===== Sounds =====
function playCompletionSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);

    setTimeout(() => {
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();

        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);

        oscillator2.frequency.value = 1000;
        oscillator2.type = 'sine';

        gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator2.start(audioContext.currentTime);
        oscillator2.stop(audioContext.currentTime + 0.5);
    }, 200);
}

// ===== Event Listeners =====
function setupEventListeners() {
    startBtn.addEventListener('click', startTimer);
    resetBtn.addEventListener('click', resetTimer);

    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => switchMode(btn.dataset.mode));
    });

    settingsBtn.addEventListener('click', () => {
        settingsPanel.classList.add('active');
    });

    closeSettingsBtn.addEventListener('click', () => {
        settingsPanel.classList.remove('active');
        saveSettings();
    });

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => setTheme(btn.dataset.theme));
    });

    // Settings inputs
    document.querySelectorAll('.setting-item input').forEach(input => {
        input.addEventListener('change', saveSettings);
    });

    // Load theme on startup
    loadTheme();

    // Close settings panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!settingsPanel.contains(e.target) && 
            !settingsBtn.contains(e.target) && 
            settingsPanel.classList.contains('active')) {
            settingsPanel.classList.remove('active');
            saveSettings();
        }
    });

    // Prevent space key from triggering buttons
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
            e.preventDefault();
            startTimer();
        }
    });
}

// ===== Keyboard Shortcuts Info =====
console.log('⌨️ Klavye Kısayolları:');
console.log('Space - Timer\'ı başlat/duraklat');
console.log('🍅 Pomodoro Timer - Başarılar!');