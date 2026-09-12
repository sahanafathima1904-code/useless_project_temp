let keys = [
    "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P",
    "A", "S", "D", "F", "G", "H", "J", "K", "L",
    "Z", "X", "C", "V", "B", "N", "M"
];

let originalKeys = [...keys];
let locked = false;
let chaos = 0;
let currentQuestion = 0;
let realAnswer = "";
let gifTimer;

const questions = [
    {
        question: "What is the primary function of a keyboard?",
        answer: "typing"
    },
    {
        question: "Which device is used to enter text into a computer?",
        answer: "keyboard"
    },
    {
        question: "What is the opposite of LOCK?",
        answer: "unlock"
    }
];


// GIF + AUDIO + MALAYALAM VOICE

function showFunnyGif() {
    const gif = document.getElementById("funnyGif");
    const audio = document.getElementById("funnyAudio");

    // Show GIF and keep the reaction sound attached to that visible GIF window
    if (gif) {
        gif.style.display = "block";

        clearTimeout(gifTimer);

        gifTimer = setTimeout(function () {
            gif.style.display = "none";

            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        }, 1800);
    }

    // Play uploaded audio while the GIF is visible
    if (audio) {
        audio.pause();
        audio.currentTime = 0;

        audio.play().catch(function (error) {
            console.log("Audio play error:", error);
        });
    }

    // Malayalam voice
    const voice = new SpeechSynthesisUtterance(
        "അയ്യേ, പറ്റിച്ചേയ്!"
    );

    voice.lang = "ml-IN";
    voice.rate = 1.1;
    voice.pitch = 1.3;
    voice.volume = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(voice);
}


// DISPLAY KEYBOARD

function displayKeyboard() {
    const keyboard = document.getElementById("keyboard");
    keyboard.innerHTML = "";

    keys.forEach(function (key) {
        const keyElement = document.createElement("div");

        keyElement.className = "key";
        keyElement.innerText = key;

        keyElement.onclick = function () {
            if (locked) {
                document.getElementById("message").innerText =
                    "🚨 Keyboard locked! Complete security verification first.";
            } else {
                document.getElementById("message").innerText =
                    "You pressed the " + key + " key.";
            }
        };

        keyboard.appendChild(keyElement);
    });
}


// LOCK KEYBOARD

function lockKeyboard() {
    if (locked) {
        document.getElementById("message").innerText =
            "⚠️ Keyboard is already locked!";
        return;
    }

    locked = true;

    document.getElementById("status").innerHTML =
        'Keyboard Status: <span class="locked">🔴 LOCKED</span>';

    document.getElementById("threat").innerText = "CRITICAL";
    document.getElementById("chaosLevel").innerText = "100%";

    document.getElementById("message").innerText =
        "🚨 Keyboard locked. Security verification required.";

    shuffleKeys();
}


// SHUFFLE KEYS

function shuffleKeys() {
    for (let i = keys.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));

        let temp = keys[i];
        keys[i] = keys[j];
        keys[j] = temp;
    }

    chaos = Math.floor(Math.random() * 31) + 70;

    document.getElementById("chaosLevel").innerText =
        chaos + "%";

    displayKeyboard();
}


// UNLOCK KEYBOARD

function unlockKeyboard() {
    if (!locked) {
        document.getElementById("message").innerText =
            "Keyboard is already unlocked.";
        return;
    }

    shuffleKeys();

    currentQuestion = 0;
    showQuestion();
}


// SHOW QUESTION

function showQuestion() {
    realAnswer = "";

    const modal = document.getElementById("securityModal");
    const answerBox = document.getElementById("securityAnswer");
    const gif = document.getElementById("funnyGif");

    document.getElementById("questionNumber").innerText =
        "Question " + (currentQuestion + 1) + " of 3";

    document.getElementById("securityQuestion").innerText =
        questions[currentQuestion].question;

    answerBox.value = "";

    if (gif) {
        gif.style.display = "none";
    }

    modal.classList.remove("hidden");

    setTimeout(function () {
        answerBox.focus();
    }, 100);
}


// RANDOM LETTER

function randomLetter() {
    const letters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    return letters[Math.floor(Math.random() * letters.length)];
}


// TYPING INTERFERENCE

document.getElementById("securityAnswer").addEventListener(
    "keydown",
    function (event) {
        event.preventDefault();

        if (event.key === "Backspace") {
            realAnswer = realAnswer.slice(0, -1);
            this.value = this.value.slice(0, -1);
            return;
        }

        if (event.key === "Enter") {
            submitAnswer();
            return;
        }

        if (event.key.length === 1) {
            realAnswer += event.key;

            // Random letters display
            this.value += randomLetter();

            // GIF + AUDIO + VOICE
            showFunnyGif();
        }
    }
);


// SUBMIT ANSWER

function submitAnswer() {
    const correctAnswer = questions[currentQuestion].answer;

    if (
        realAnswer.toLowerCase().trim() === correctAnswer.toLowerCase()
    ) {
        currentQuestion++;

        if (currentQuestion < questions.length) {
            shuffleKeys();

            document.getElementById("message").innerText =
                "✅ Verification passed! Next question loading...";

            showQuestion();
        } else {
            completeUnlock();
        }

    } else {
        verificationFailed();
    }
}


// WRONG ANSWER

function verificationFailed() {
    document.getElementById("securityModal").classList.add("hidden");

    document.getElementById("message").innerText =
        "❌ Verification failed! Keyboard remains locked.";

    shuffleKeys();

    setTimeout(function () {
        alert(
            "❌ ACCESS DENIED!\n\n" +
            "Wrong answer! Keyboard is still in lockdown mode. 🔒"
        );
    }, 300);
}


// SUCCESSFUL UNLOCK

function completeUnlock() {
    locked = false;

    document.getElementById("securityModal").classList.add("hidden");

    keys = [...originalKeys];
    chaos = 0;

    document.getElementById("status").innerHTML =
        'Keyboard Status: <span class="unlocked">🟢 NORMAL</span>';

    document.getElementById("chaosLevel").innerText = "0%";
    document.getElementById("threat").innerText = "LOW";

    document.getElementById("message").innerText =
        "🔓 Verification successful! Keyboard unlocked.";

    displayKeyboard();

    setTimeout(function () {
        alert(
            "🎉 Congratulations!\n\n" +
            "You unlocked the completely useless keyboard security system!"
        );
    }, 500);
}


// INITIAL DISPLAY

displayKeyboard();