let display = document.getElementById("main-display");
let modeDisplay = document.getElementById("mode-display");
let memory = 0;
let isDegrees = true;
let currentMode = "Basic";

class Calculator {
    constructor() {
        this.history = [];
        this.currentInput = "";
    }

    updateHistoryDisplay() {
        let historyDiv = document.getElementById("history");
        if (!historyDiv) return;

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
            let expression = this.currentInput
                .replace(/÷/g, "/")
                .replace(/×/g, "*")
                .replace(/−/g, "-")
                .replace(/π/g, Math.PI)
                .replace(/e/g, Math.E);

            let result = eval(expression);
            if (!isFinite(result)) throw new Error("Math Error");

            this.history.push({ expression: this.currentInput, result });
            this.currentInput = result.toString();
            this.updateDisplay();
            this.updateHistoryDisplay();
        } catch {
            display.value = "Error";
            this.currentInput = "";
        }
    }
}

const calculator = new Calculator();

function appendToDisplay(value) {
    calculator.currentInput += value;
    calculator.updateDisplay();
}

function clearDisplay() {
    calculator.clear();
}

function deleteLast() {
    calculator.currentInput = calculator.currentInput.slice(0, -1);
    calculator.updateDisplay();
}

function calculateResult() {
    calculator.evaluate();
}

function handleFunction(func) {
    let value = parseFloat(calculator.currentInput) || 0;
    let radians = isDegrees ? value * (Math.PI / 180) : value;

    switch (func) {
        case "sqrt":
            calculator.currentInput = Math.sqrt(value).toString();
            break;
        case "log":
            calculator.currentInput = Math.log10(value).toString();
            break;
        case "ln":
            calculator.currentInput = Math.log(value).toString();
            break;
        case "exp":
            calculator.currentInput = Math.exp(value).toString();
            break;
        case "fact":
            calculator.currentInput = factorial(value).toString();
            break;
        case "sin":
            calculator.currentInput = Math.sin(radians).toFixed(10);
            break;
        case "cos":
            calculator.currentInput = Math.cos(radians).toFixed(10);
            break;
        case "tan":
            if (Math.abs(value % 180) === 90) {
                calculator.currentInput = "Infinity";
            } else {
                calculator.currentInput = Math.tan(radians).toFixed(10);
            }
            break;
        case "pi":
            calculator.currentInput += Math.PI.toString();
            break;
        case "mod":
            calculator.currentInput += "%";
            break;
    }
    calculator.updateDisplay();
}

function factorial(num) {
    if (num < 0) return "Error";
    let fact = 1;
    for (let i = 2; i <= num; i++) {
        fact *= i;
    }
    return fact;
}

function toggleDegreesRadians() {
    isDegrees = !isDegrees;
    alert(isDegrees ? "Mode: Degrees" : "Mode: Radians");
}

function memoryFunction(type) {
    let value = parseFloat(calculator.currentInput) || 0;
    switch (type) {
        case "M+":
            memory += value;
            break;
        case "M-":
            memory -= value;
            break;
        case "MR":
            calculator.currentInput = memory.toString();
            break;
        case "MC":
            memory = 0;
            break;
    }
    calculator.updateDisplay();
}

function decimalToFraction() {
    let value = parseFloat(calculator.currentInput);
    if (isNaN(value)) return;
    let fraction = approximateFraction(value);
    calculator.currentInput = fraction;
    calculator.updateDisplay();
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
    let historyDiv = document.getElementById("history");
    if (historyDiv) {
        historyDiv.style.display = historyDiv.style.display === "none" ? "block" : "none";
    }
}

function changeMode() {
    const modes = ["Basic", "Scientific", "Programming"];
    let index = modes.indexOf(currentMode);
    currentMode = modes[(index + 1) % modes.length];
    modeDisplay.innerText = "Mode: " + currentMode;

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

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("evaluate").addEventListener("click", () => calculator.evaluate());
    document.getElementById("clear").addEventListener("click", () => calculator.clear());
    changeMode();
});
class Block {
    constructor(index, timestamp, expression, result, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.expression = expression;
        this.result = result;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return btoa(this.index + this.timestamp + this.expression + this.result + this.previousHash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, Date.now(), "Genesis Block", "0", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(expression, result) {
        const previousBlock = this.getLatestBlock();
        const newBlock = new Block(this.chain.length, Date.now(), expression, result, previousBlock.hash);
        this.chain.push(newBlock);
    }

    displayHistory() {
        return this.chain.slice(1).map(block => `${block.expression} = ${block.result} [Hash: ${block.hash}]`).join('\n');
    }
}

const calculatorBlockchain = new Blockchain();

function calculateResult() {
    try {
        let expression = display.value.replace(/÷/g, "/").replace(/×/g, "*").replace(/−/g, "-");
        let result = eval(expression);
        if (!isFinite(result)) throw new Error("Math Error");
        
        calculatorBlockchain.addBlock(expression, result);
        display.value = result;
    } catch {
        display.value = "Error";
    }
}
function showHistory() {
    alert(calculatorBlockchain.displayHistory());
}






