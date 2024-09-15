// List of symbols to display on the reels
const symbols = ['🍒', '🍋', '🍊', '🍇', '🔔', '💎', '7️⃣'];

// Maximum spins allowed and cooldown period in milliseconds
const maxSpins = 10;
const spinCooldownHours = 2 * 60 * 60 * 1000; // 4 hours in milliseconds

// Get button element
const spinButton = document.getElementById('spinButton');
const slotMachine = document.querySelector('.slot-machine'); // Slot machine element

// Sound effects
const spinSound = new Audio('AUDIO-2024-09-09-18-31-36.m4a');
const winSound = new Audio('AUDIO-2024-09-09-18-37-11.m4a');

// Function to check and update spins in local storage
function updateSpinCount() {
    const spinData = JSON.parse(localStorage.getItem('spinData')) || { count: 10, lastSpin: 0 };
    const currentTime = new Date().getTime();

    // Check if cooldown period has passed
    if (currentTime - spinData.lastSpin > spinCooldownHours) {
        spinData.count = maxSpins; // Reset spins to 10
    }

    // Update spin count or start countdown if spins are zero
    if (spinData.count > 0) {
        document.getElementById('total-spins').textContent = `${spinData.count} Spins Left`;
        enableSpinButton(); // Enable the spin button
    } else {
        startCountdown(spinData.lastSpin + spinCooldownHours - currentTime);
        disableSpinButton(); // Disable the spin button
    }

    return spinData;
}

// Function to handle the spin action
function handleSpin() {
    const spinData = updateSpinCount();

    if (spinData.count > 0) {
        spinSound.play(); // Play spin sound effect
        spinReels(); // Spin the reels if there are spins left
        spinData.count -= 1; // Decrement the spin count
        spinData.lastSpin = new Date().getTime(); // Update the last spin time

        // Update spins left on the page
        document.getElementById('total-spins').textContent = `${spinData.count} Spins Left`;
        localStorage.setItem('spinData', JSON.stringify(spinData)); // Save updated spin data

        // Disable button if spins reach 0 after this spin
        if (spinData.count === 0) {
            disableSpinButton();
            startCountdown(spinCooldownHours);
        }
    } else {
        alert('You have reached the spin limit. Please wait to spin again.');
        startCountdown(spinData.lastSpin + spinCooldownHours - new Date().getTime());
    }
}

// Function to generate a random symbol
function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

// Function to determine if the spin should be a winning spin
function isWinningSpin() {
    return Math.random() < 0.5; // 50% chance of winning spin
}

// Function to spin the reels
function spinReels() {
    const reel1 = document.getElementById('reel1');
    const reel2 = document.getElementById('reel2');
    const reel3 = document.getElementById('reel3');

    // Set intervals to show the spinning effect
    const spinDuration = 1000; // 1 second

    const interval1 = setInterval(() => {
        reel1.textContent = getRandomSymbol();
    }, 100);

    const interval2 = setInterval(() => {
        reel2.textContent = getRandomSymbol();
    }, 100);

    const interval3 = setInterval(() => {
        reel3.textContent = getRandomSymbol();
    }, 100);

    // Stop the spinning after the specified duration
    setTimeout(() => {
        clearInterval(interval1);
        clearInterval(interval2);
        clearInterval(interval3);

        if (isWinningSpin()) {
            // Ensure the reels show the same symbol if it's a winning spin
            const winningSymbol = getRandomSymbol();
            reel1.textContent = winningSymbol;
            reel2.textContent = winningSymbol;
            reel3.textContent = winningSymbol;
        }

        checkForWin(); // Check if the user won after spinning
    }, spinDuration + 400);
}

// Function to check if the reels match and trigger the winning effect
function checkForWin() {
    const reel1 = document.getElementById('reel1').textContent;
    const reel2 = document.getElementById('reel2').textContent;
    const reel3 = document.getElementById('reel3').textContent;

    // Check if all three reels match
    if (reel1 === reel2 && reel2 === reel3) {
        winSound.play(); // Play win sound effect
        slotMachine.classList.add('winning'); // Add winning class for animation
        setTimeout(() => {
            slotMachine.classList.remove('winning'); // Remove class after animation ends
        }, 3000); // Duration should match the CSS animation timing
        alert('Congratulations! You hit the jackpot! 🎉');
    }
}

// Function to start the countdown timer
function startCountdown(remainingTime) {
    const totalSpinsElement = document.getElementById('total-spins');

    // Clear any previous interval
    clearInterval(totalSpinsElement.timer);

    // Start a new interval to update the countdown every second
    totalSpinsElement.timer = setInterval(() => {
        if (remainingTime <= 0) {
            clearInterval(totalSpinsElement.timer);
            const spinData = { count: maxSpins, lastSpin: new Date().getTime() };
            localStorage.setItem('spinData', JSON.stringify(spinData));
            updateSpinCount(); // Reset and update spin count
        } else {
            remainingTime -= 1000;
            const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
            totalSpinsElement.textContent = `Next spins in ${hours}h ${minutes}m ${seconds}s`;
        }
    }, 1000);
}

// Function to disable the spin button
function disableSpinButton() {
    spinButton.disabled = true;
    spinButton.style.backgroundColor = '#7d7d7d'; // Change color to grey
    spinButton.style.opacity = '0.5'; // Reduce opacity to indicate it's disabled
    spinButton.style.cursor = 'not-allowed'; // Change cursor to indicate it's non-clickable
    spinButton.style.animation = 'none';
    spinButton.style.border = 'none';
}

// Function to enable the spin button
function enableSpinButton() {
    spinButton.disabled = false;
    spinButton.style.backgroundColor = 'orange'; // Revert to original color
    spinButton.style.opacity = '1'; // Restore full opacity
    spinButton.style.cursor = 'pointer'; // Restore pointer cursor
}

// Initialize spin count display on page load
document.addEventListener('DOMContentLoaded', () => {
    updateSpinCount();
});

// Attach the spin function to the button
spinButton.addEventListener('click', handleSpin);
