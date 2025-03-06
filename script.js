let display = document.getElementById("main-display");
let modeDisplay = document.getElementById("mode-display");
let memory = 0;
let isDegrees = true;
let currentMode = "Basic";

function appendToDisplay(value) {
    display.value += value;
}

function clearDisplay() {
    display.value = "";
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

function calculateResult() {
    try {
        display.value = eval(display.value);
    } catch {
        display.value = "Error";
    }
}

function handleFunction(func) {
    let value = parseFloat(display.value) || 0;
    switch (func) {
        case "sqrt":
            display.value = Math.sqrt(value);
            break;
        case "log":
            display.value = Math.log10(value);
            break;
        case "ln":
            display.value = Math.log(value);
            break;
        case "exp":
            display.value = Math.exp(value);
            break;
        case "fact":
            display.value = factorial(value);
            break;
        case "sin":
            display.value = isDegrees ? Math.sin(value * Math.PI / 180) : Math.sin(value);
            break;
        case "cos":
            display.value = isDegrees ? Math.cos(value * Math.PI / 180) : Math.cos(value);
            break;
        case "tan":
            display.value = isDegrees ? Math.tan(value * Math.PI / 180) : Math.tan(value);
            break;
        case "pi":
            display.value += Math.PI;
            break;
        case "mod":
            display.value += "%";
            break;
    }
}

function factorial(num) {
    if (num < 0) return "Error";
    return num === 0 ? 1 : num * factorial(num - 1);
}

function toggleDegreesRadians() {
    isDegrees = !isDegrees;
    alert(isDegrees ? "Mode: Degrees" : "Mode: Radians");
}

function memoryFunction(type) {
    let value = parseFloat(display.value) || 0;
    switch (type) {
        case "M+":
            memory += value;
            break;
        case "M-":
            memory -= value;
            break;
        case "MR":
            display.value = memory;
            break;
        case "MC":
            memory = 0;
            break;
    }
}

function decimalToFraction() {
    let value = parseFloat(display.value);
    if (isNaN(value)) return;
    let fraction = approximateFraction(value);
    display.value = fraction;
}

function approximateFraction(decimal) {
    let tolerance = 1.0E-6;
    let numerator = 1, denominator = 1, lower_n = 0, lower_d = 1, upper_n = 1, upper_d = 0;
    while (true) {
        let mediant_n = lower_n + upper_n;
        let mediant_d = lower_d + upper_d;
        if (Math.abs(decimal - mediant_n / mediant_d) < tolerance) {
            return `${mediant_n}/${mediant_d}`;
        } else if (decimal > mediant_n / mediant_d) {
            lower_n = mediant_n;
            lower_d = mediant_d;
        } else {
            upper_n = mediant_n;
            upper_d = mediant_d;
        }
    }
}

function showHistory() {
    historyDiv.style.display = historyDiv.style.display === "none" ? "block" : "none";
}

class Calculator {
    constructor() {
        this.history = [];
        this.currentInput = "";
    }

    updateHistoryDisplay() {
        let historyDiv = document.getElementById("history");
        historyDiv.innerHTML = "";
        this.history.slice(-10).forEach(entry => {
            let historyItem = document.createElement("div");
            historyItem.innerText = `${entry.expression} = ${entry.result}`;
            historyItem.onclick = () => this.reuseHistory(entry.result);
            historyDiv.appendChild(historyItem);
        });
    }

    reuseHistory(value) {
        this.currentInput = value.toString();
        this.updateDisplay();
    }

    clear() {
        this.currentInput = "";
        this.updateDisplay();
    }

    updateDisplay() {
        display.value = this.currentInput;
    }

    evaluate() {
        try {
            this.currentInput = eval(this.currentInput).toString();
            this.history.push({ expression: display.value, result: this.currentInput });
            this.updateDisplay();
            this.updateHistoryDisplay();
        } catch {
            display.value = "Error";
        }
    }
}

const calculator = new Calculator();

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("evaluate").addEventListener("click", () => calculator.evaluate());
    document.getElementById("clear").addEventListener("click", () => calculator.clear());
});
// Mode Switching Function
function changeMode() {
    const modes = ["Basic", "Scientific", "Programming"];
    let index = modes.indexOf(currentMode);
    currentMode = modes[(index + 1) % modes.length];
    modeDisplay.innerText = "Mode: " + currentMode;
    
    // Toggle Button Visibility Based on Mode
    const scientificButtons = ["sqrt", "log", "ln", "exp", "fact", "sin", "cos", "tan", "pi"];
    const programmingButtons = ["mod", "bin", "hex", "oct"];

    document.querySelectorAll("button").forEach(button => {
        let text = button.innerText;

        if (currentMode === "Basic" && (scientificButtons.includes(text) || programmingButtons.includes(text))) {
            button.style.display = "none";
        } else if (currentMode === "Scientific" && programmingButtons.includes(text)) {
            button.style.display = "none";
        } else {
            button.style.display = "inline-block";
        }
    });
}

// Initialize Calculator in Basic Mode
document.addEventListener("DOMContentLoaded", () => {
    changeMode();
});



