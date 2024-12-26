// Get references to the canvas and controls
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const pencilButton = document.getElementById('pencil');
const eraserButton = document.getElementById('eraser');
const colorPicker = document.getElementById('colorPicker');
const lineThickness = document.getElementById('lineThickness');
const saveBtn = document.getElementById('save');
const exportBtn = document.getElementById('export');
const voiceNoteBtn = document.getElementById('voiceNote');

// Set the canvas size
function setCanvasSize() {
    const containerWidth = window.innerWidth - 20;
    canvas.width = containerWidth;
    canvas.height = Math.min(400, window.innerHeight - 100);
    
    // Restore context settings
    ctx.lineWidth = currentLineWidth;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : currentColor;
}

setCanvasSize();

// Default tool properties
let isDrawing = false;
let currentTool = 'pencil'; 
let currentColor = '#000000'; 
let currentLineWidth = 5; 

// Set initial drawing properties
ctx.lineWidth = currentLineWidth;
ctx.lineCap = 'round';
ctx.strokeStyle = currentColor;

// Mouse event handlers
canvas.addEventListener('mousedown', (e) => {
    if (currentTool === 'pencil' || currentTool === 'eraser') {
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (isDrawing && (currentTool === 'pencil' || currentTool === 'eraser')) {
        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.stroke();
    }
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});


canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (currentTool === 'pencil' || currentTool === 'eraser') {
        isDrawing = true;
        const touch = e.touches[0];
        ctx.beginPath();
        ctx.moveTo(
            touch.clientX - canvas.offsetLeft,
            touch.clientY - canvas.offsetTop
        );
    }
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (isDrawing && (currentTool === 'pencil' || currentTool === 'eraser')) {
        const touch = e.touches[0];
        ctx.lineTo(
            touch.clientX - canvas.offsetLeft,
            touch.clientY - canvas.offsetTop
        );
        ctx.stroke();
    }
});

canvas.addEventListener('touchend', () => {
    isDrawing = false;
});

// Tool handlers
pencilButton.addEventListener('click', () => {
    currentTool = 'pencil';
    canvas.style.cursor = 'url(https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/svgs/solid/pencil-alt.svg), auto';
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentLineWidth;
});

eraserButton.addEventListener('click', () => {
    currentTool = 'eraser';
    canvas.style.cursor = 'crosshair'; 
    ctx.strokeStyle = '#ffffff'; 
    ctx.lineWidth = 20; 
});

colorPicker.addEventListener('input', (e) => {
    currentColor = e.target.value;
    if (currentTool === 'pencil') {
        ctx.strokeStyle = currentColor;
    } else if (currentTool === 'eraser') {
        ctx.strokeStyle = '#ffffff';
    }
});

lineThickness.addEventListener('input', (e) => {
    currentLineWidth = e.target.value;
    if (currentTool === 'pencil') {
        ctx.lineWidth = currentLineWidth;
    } else if (currentTool === 'eraser') {
        ctx.lineWidth = 80;
    }
});

// Save and export handlers
saveBtn.addEventListener('click', () => {
    const dataUrl = canvas.toDataURL();
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'drawing.png';
    link.click();
});

exportBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.addImage(canvas.toDataURL(), 'PNG', 10, 10, 180, 160);
    doc.save('drawing.pdf');
});

// Voice recognition setup
const voiceNoteButton = document.getElementById('voiceNote');
const textArea = document.createElement('textarea');
document.body.appendChild(textArea);

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US'; 
recognition.continuous = true; 
recognition.interimResults = true; 

let isRecording = false;

function toggleVoiceRecognition() {
    if (isRecording) {
        recognition.stop();
        isRecording = false;
        voiceNoteButton.textContent = 'Start Voice Note';
    } else {
        recognition.start();
        isRecording = true;
        voiceNoteButton.textContent = 'Stop Voice Note';
    }
}

recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    if (event.results[event.results.length - 1].isFinal) {
        textArea.value += transcript + ' ';
    }
};

recognition.onend = () => {
    if (isRecording) {
        recognition.start();
    }
};

recognition.onerror = (event) => {
    console.error("Speech recognition error", event.error);
};

voiceNoteButton.addEventListener('click', toggleVoiceRecognition);

// Window resize handler
window.addEventListener('resize', setCanvasSize);
