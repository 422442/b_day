// Game State
let gameState = {
    score: 0,
    powerupsCollected: 0,
    bossHealth: 100,
    isGameActive: false
};

// Audio Context for Sound Effects
let audioContext;
let isAudioInitialized = false;

// Initialize Audio Context
function initAudio() {
    if (!isAudioInitialized) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        isAudioInitialized = true;
    }
}

// Power On Function
function powerOn() {
    initAudio();
    playPowerOnSound();
    
    const powerScreen = document.getElementById('powerScreen');
    const loadingScreen = document.getElementById('loadingScreen');
    
    powerScreen.style.opacity = '0';
    setTimeout(() => {
        powerScreen.classList.add('hidden');
        loadingScreen.classList.remove('hidden');
        startLoadingSequence();
    }, 500);
}

// Loading Sequence
function startLoadingSequence() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        const gameScreen = document.getElementById('gameScreen');
        
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            gameScreen.classList.remove('hidden');
            startGame();
        }, 500);
    }, 3500);
}

// Start Game
function startGame() {
    gameState.isGameActive = true;
    spawnFloatingCoins();
    playBackgroundMusic();
    
    // Show achievement after 2 seconds
    setTimeout(() => {
        showAchievement();
    }, 2000);
}

// Spawn Floating Coins
function spawnFloatingCoins() {
    const coinsContainer = document.querySelector('.floating-coins');
    const coinEmojis = ['🪙', '💰', '💎', '⭐', '🎁'];
    
    setInterval(() => {
        if (gameState.isGameActive) {
            const coin = document.createElement('div');
            coin.className = 'coin';
            coin.textContent = coinEmojis[Math.floor(Math.random() * coinEmojis.length)];
            coin.style.left = Math.random() * 90 + '%';
            coin.style.top = Math.random() * 80 + '%';
            coin.style.animationDelay = Math.random() * 2 + 's';
            
            coinsContainer.appendChild(coin);
            
            // Remove coin after animation
            setTimeout(() => {
                if (coin.parentNode) {
                    coin.parentNode.removeChild(coin);
                }
            }, 6000);
        }
    }, 1000);
}

// Collect Powerup
function collectPowerup(element) {
    gameState.powerupsCollected++;
    gameState.score += 100;
    updateScore();
    
    // Visual effect
    element.style.transform = 'scale(2)';
    element.style.opacity = '0';
    
    // Play collect sound
    playCollectSound();
    
    // Create floating score
    createFloatingScore(element, '+100');
    
    setTimeout(() => {
        element.style.transform = 'scale(1)';
        element.style.opacity = '1';
    }, 1000);
    
    // Check for special achievement
    if (gameState.powerupsCollected === 3) {
        setTimeout(() => {
            showSpecialAchievement();
        }, 500);
    }
}

// Attack Boss
function attackBoss() {
    if (gameState.bossHealth > 0) {
        gameState.bossHealth -= 10;
        gameState.score += 50;
        updateScore();
        
        // Update boss health bar
        const healthFill = document.querySelector('.health-fill');
        healthFill.style.width = gameState.bossHealth + '%';
        
        // Boss damage effect
        const boss = document.querySelector('.cake-sprite');
        boss.style.filter = 'hue-rotate(180deg)';
        boss.style.transform = 'scale(1.1)';
        
        // Play attack sound
        playAttackSound();
        
        // Create floating damage
        createFloatingScore(boss, '-10 HP');
        
        setTimeout(() => {
            boss.style.filter = 'none';
            boss.style.transform = 'scale(1)';
        }, 200);
        
        // Boss defeated
        if (gameState.bossHealth <= 0) {
            setTimeout(() => {
                defeatBoss();
            }, 500);
        }
    }
}

// Defeat Boss
function defeatBoss() {
    gameState.score += 1000;
    updateScore();
    
    const boss = document.querySelector('.birthday-boss');
    boss.innerHTML = '<div style="font-size: 64px; animation: spin 1s linear infinite;">🎉</div>';
    
    // Victory sound
    playVictorySound();
    
    // Massive fireworks
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            spawnFireworks();
        }, i * 200);
    }
    
    // Show victory message
    setTimeout(() => {
        showVictoryAchievement();
    }, 1000);
}

// Update Score
function updateScore() {
    document.getElementById('score').textContent = gameState.score;
}

// Create Floating Score
function createFloatingScore(element, text) {
    const floatingText = document.createElement('div');
    floatingText.textContent = text;
    floatingText.style.position = 'absolute';
    floatingText.style.color = '#ffff00';
    floatingText.style.fontSize = '16px';
    floatingText.style.fontFamily = 'Press Start 2P';
    floatingText.style.pointerEvents = 'none';
    floatingText.style.zIndex = '100';
    floatingText.style.textShadow = '2px 2px 0px #000';
    
    const rect = element.getBoundingClientRect();
    floatingText.style.left = rect.left + 'px';
    floatingText.style.top = rect.top + 'px';
    
    document.body.appendChild(floatingText);
    
    // Animate floating text
    let yPos = rect.top;
    const animateFloat = () => {
        yPos -= 2;
        floatingText.style.top = yPos + 'px';
        floatingText.style.opacity = (yPos - rect.top + 100) / 100;
        
        if (yPos > rect.top - 100) {
            requestAnimationFrame(animateFloat);
        } else {
            document.body.removeChild(floatingText);
        }
    };
    requestAnimationFrame(animateFloat);
}

// Show Achievement
function showAchievement() {
    const achievement = document.getElementById('achievement');
    achievement.classList.remove('hidden');
    
    playAchievementSound();
    
    setTimeout(() => {
        achievement.classList.add('hidden');
    }, 3000);
}

// Show Special Achievement
function showSpecialAchievement() {
    const achievement = document.getElementById('achievement');
    const title = achievement.querySelector('.achievement-title');
    const desc = achievement.querySelector('.achievement-desc');
    
    title.textContent = 'POWER-UP MASTER!';
    desc.textContent = 'Collected All Power-ups';
    
    achievement.classList.remove('hidden');
    playAchievementSound();
    
    setTimeout(() => {
        achievement.classList.add('hidden');
        // Reset text
        title.textContent = 'ACHIEVEMENT UNLOCKED!';
        desc.textContent = 'Birthday Legend Status';
    }, 3000);
}

// Show Victory Achievement
function showVictoryAchievement() {
    const achievement = document.getElementById('achievement');
    const title = achievement.querySelector('.achievement-title');
    const desc = achievement.querySelector('.achievement-desc');
    const icon = achievement.querySelector('.achievement-icon');
    
    title.textContent = 'BIRTHDAY CHAMPION!';
    desc.textContent = 'Defeated the Cake Boss';
    icon.textContent = '👑';
    
    achievement.classList.remove('hidden');
    playVictorySound();
    
    setTimeout(() => {
        achievement.classList.add('hidden');
        // Reset
        title.textContent = 'ACHIEVEMENT UNLOCKED!';
        desc.textContent = 'Birthday Legend Status';
        icon.textContent = '🏆';
    }, 4000);
}

// Spawn Fireworks
function spawnFireworks() {
    const container = document.querySelector('.fireworks-container');
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.left = Math.random() * 100 + '%';
            firework.style.top = Math.random() * 100 + '%';
            firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            firework.style.boxShadow = `0 0 20px ${firework.style.backgroundColor}`;
            
            container.appendChild(firework);
            
            setTimeout(() => {
                if (firework.parentNode) {
                    firework.parentNode.removeChild(firework);
                }
            }, 1000);
        }, i * 100);
    }
    
    playFireworkSound();
}

// Show Message Modal
function showMessage() {
    const modal = document.getElementById('messageModal');
    modal.classList.remove('hidden');
    playMessageSound();
}

// Close Message Modal
function closeMessage() {
    const modal = document.getElementById('messageModal');
    modal.classList.add('hidden');
}

// Sound Effects
function playPowerOnSound() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.5);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

function playCollectSound() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function playAttackSound() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
}

function playAchievementSound() {
    if (!audioContext) return;
    
    const frequencies = [523, 659, 784, 1047];
    frequencies.forEach((freq, index) => {
        setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        }, index * 100);
    });
}

function playVictorySound() {
    if (!audioContext) return;
    
    const melody = [523, 659, 784, 1047, 1319];
    melody.forEach((freq, index) => {
        setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.4);
        }, index * 200);
    });
}

function playFireworkSound() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(2000, audioContext.currentTime + 0.1);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

function playMessageSound() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
}

function playBirthdaySound() {
    if (!audioContext) return;
    
    // Happy Birthday melody (simplified)
    const melody = [
        {freq: 523, duration: 0.3}, // C
        {freq: 523, duration: 0.3}, // C
        {freq: 587, duration: 0.6}, // D
        {freq: 523, duration: 0.6}, // C
        {freq: 698, duration: 0.6}, // F
        {freq: 659, duration: 1.2}  // E
    ];
    
    let currentTime = audioContext.currentTime;
    
    melody.forEach((note) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(note.freq, currentTime);
        gainNode.gain.setValueAtTime(0.3, currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);
        
        oscillator.start(currentTime);
        oscillator.stop(currentTime + note.duration);
        
        currentTime += note.duration;
    });
}

function playBackgroundMusic() {
    // Simple background ambient sound
    if (!audioContext) return;
    
    const playAmbient = () => {
        if (gameState.isGameActive) {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(100 + Math.random() * 50, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 2);
            
            setTimeout(playAmbient, 3000 + Math.random() * 2000);
        }
    };
    
    setTimeout(playAmbient, 1000);
}

// Keyboard Controls
document.addEventListener('keydown', (event) => {
    if (!gameState.isGameActive) return;
    
    switch(event.code) {
        case 'Space':
            event.preventDefault();
            spawnFireworks();
            break;
        case 'Enter':
            event.preventDefault();
            attackBoss();
            break;
        case 'KeyM':
            showMessage();
            break;
        case 'KeyB':
            playBirthdaySound();
            break;
    }
});

// Close modal on outside click
document.getElementById('messageModal').addEventListener('click', (event) => {
    if (event.target.id === 'messageModal') {
        closeMessage();
    }
});

// Prevent context menu
document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

// Easter Eggs
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', (event) => {
    konamiCode.push(event.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        // Easter egg activated!
        gameState.score += 9999;
        updateScore();
        
        // Rainbow effect
        document.body.style.animation = 'rainbow 0.5s linear infinite';
        
        // Show special message
        alert('🎮 KONAMI CODE ACTIVATED! 🎮\nBonus Score: +9999\nYou are a true gamer, Himanshu!');
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
        
        konamiCode = [];
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add some initial visual flair
    setTimeout(() => {
        const powerButton = document.querySelector('.power-button');
        if (powerButton) {
            powerButton.style.animation = 'pulse 1s infinite, rainbow 3s linear infinite';
        }
    }, 1000);
});