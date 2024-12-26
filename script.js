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
canvas.width = window.innerWidth - 40;
canvas.height = 400; // Fixed height for the canvas

// Default tool properties
let isDrawing = false;
let currentTool = 'pencil'; 
let currentColor = '#000000'; 
let currentLineWidth = 5; 

// Set initial drawing properties
ctx.lineWidth = currentLineWidth;
ctx.lineCap = 'round';
ctx.strokeStyle = currentColor; // Default stroke color is black


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

// Handle mouse up event (stop drawing)
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});


pencilButton.addEventListener('click', () => {
    currentTool = 'pencil';
    canvas.style.cursor = 'url(https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/svgs/solid/pencil-alt.svg), auto';
    ctx.strokeStyle = currentColor; // Ensure pencil uses selected color
    ctx.lineWidth = currentLineWidth; // Ensure pencil uses selected thickness
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
        ctx.strokeStyle = currentColor; // Apply selected color to pencil
    } else if (currentTool === 'eraser') {
        ctx.strokeStyle = '#ffffff'; // Ensure eraser is white
    }
});

lineThickness.addEventListener('input', (e) => {
    currentLineWidth = e.target.value;
    if (currentTool === 'pencil') {
        ctx.lineWidth = currentLineWidth; // Apply selected thickness to pencil
    } else if (currentTool === 'eraser') {
        ctx.lineWidth = 80; // Set a larger size for the eraser (no effect on pencil)
    }
});

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


const voiceNoteButton = document.getElementById('voiceNote');
const textArea = document.createElement('textarea');
document.body.appendChild(textArea); // Optionally place the textArea somewhere in your UI


const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US'; // Language can be changed as needed
recognition.continuous = true; // Continuously capture speech (doesn't stop automatically)
recognition.interimResults = true; // Allow for interim results (partial recognition)

let isRecording = false;


function toggleVoiceRecognition() {
    if (isRecording) {
        recognition.stop(); // Stop if already recording
        isRecording = false;
        voiceNoteButton.textContent = 'Start Voice Note';
    } else {
        recognition.start(); // Start recording if not already started
        isRecording = true;
        voiceNoteButton.textContent = 'Stop Voice Note';
    }
}

// Handle speech result event (called when the speech is recognized)
recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    
    // If interimResults is true, the recognition might send partial data
    // So we only want to update when a final result is received
    if (event.results[event.results.length - 1].isFinal) {
        textArea.value += transcript + ' '; // Append the recognized text to the textarea
    }
};


recognition.onend = () => {
    if (isRecording) {
        recognition.start(); // Keep listening continuously
    }
};

// Handle errors (optional, for debugging)
recognition.onerror = (event) => {
    console.error("Speech recognition error", event.error);
};


voiceNoteButton.addEventListener('click', toggleVoiceRecognition);


window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 100;
});

