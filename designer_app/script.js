const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const addRectangleButton = document.getElementById('addRectangle');
const addTextButton = document.getElementById('addText');
const deleteBoxButton = document.getElementById('deleteBox');
const clearCanvasButton = document.getElementById('clearCanvas');
const downloadCanvasButton = document.getElementById('downloadCanvas');
const textInput = document.getElementById('textInput');
const colorPicker = document.getElementById('colorPicker');
const snapToGridCheckbox = document.getElementById('snapToGrid');

let isDragging = false;
let isResizing = false;
let dragTarget = null;
let resizeTarget = null;
let selectedObject = null;
let snapToGrid = true; // Default to snap to grid

const gridSpacing = 20; // Grid spacing in pixels

const objects = [];

// Draw all objects on the canvas
function drawObjects() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    objects.forEach(obj => {
        if (snapToGrid) {
            // Snap object coordinates to grid
            obj.x = Math.round(obj.x / gridSpacing) * gridSpacing;
            obj.y = Math.round(obj.y / gridSpacing) * gridSpacing;
            obj.width = Math.round(obj.width / gridSpacing) * gridSpacing;
            obj.height = Math.round(obj.height / gridSpacing) * gridSpacing;
        }

        ctx.fillStyle = obj.color;
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);

        // Draw resize handle (bottom-right corner)
        ctx.fillStyle = 'black';
        ctx.fillRect(obj.x + obj.width - 10, obj.y + obj.height - 10, 10, 10);

        // Draw text inside the box
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.fillText(obj.text, obj.x + 10, obj.y + 25);
    });
}

// Check if a point (mouse click) is inside an object
function isInsideObject(x, y, obj) {
    return x > obj.x && x < obj.x + obj.width && y > obj.y && y < obj.y + obj.height;
}

// Check if a point (mouse click) is inside the resize handle of an object
function isInsideResizeHandle(x, y, obj) {
    return x > obj.x + obj.width - 10 && x < obj.x + obj.width && y > obj.y + obj.height - 10 && y < obj.y + obj.height;
}

// Event listener for mouse down
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    selectedObject = null;
    let objectSelected = false;

    // Iterate objects in reverse order (from topmost to bottommost)
    for (let i = objects.length - 1; i >= 0; i--) {
        const obj = objects[i];
        if (!objectSelected && isInsideResizeHandle(mouseX, mouseY, obj)) {
            isResizing = true;
            resizeTarget = obj;
            objectSelected = true;
        } else if (!objectSelected && isInsideObject(mouseX, mouseY, obj)) {
            isDragging = true;
            dragTarget = obj;
            selectedObject = obj;
            objectSelected = true;
        }
    }
});

// Event listener for mouse move
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (isDragging && dragTarget) {
        dragTarget.x = mouseX - dragTarget.width / 2;
        dragTarget.y = mouseY - dragTarget.height / 2;
        drawObjects();
    }

    if (isResizing && resizeTarget) {
        let newWidth = mouseX - resizeTarget.x;
        let newHeight = mouseY - resizeTarget.y;

        if (snapToGrid) {
            // Snap width and height to grid
            newWidth = Math.round(newWidth / gridSpacing) * gridSpacing;
            newHeight = Math.round(newHeight / gridSpacing) * gridSpacing;
        }

        resizeTarget.width = newWidth;
        resizeTarget.height = newHeight;
        drawObjects();
    }
});

// Event listener for mouse up
canvas.addEventListener('mouseup', () => {
    isDragging = false;
    isResizing = false;
    dragTarget = null;
    resizeTarget = null;
});

// Add new rectangle object
addRectangleButton.addEventListener('click', () => {
    const newObject = {
        x: snapToGrid ? Math.round((canvas.width / 2) / gridSpacing) * gridSpacing : canvas.width / 2,
        y: snapToGrid ? Math.round((canvas.height / 2) / gridSpacing) * gridSpacing : canvas.height / 2,
        width: 100,
        height: 100,
        color: colorPicker.value, // Get selected color from color picker
        text: ''
    };
    objects.push(newObject);
    drawObjects();
});

// Add text to the selected object
addTextButton.addEventListener('click', () => {
    if (selectedObject) {
        selectedObject.text = textInput.value;
        drawObjects();
    }
});

// Delete the selected object
deleteBoxButton.addEventListener('click', () => {
    if (selectedObject) {
        const index = objects.indexOf(selectedObject);
        if (index > -1) {
            objects.splice(index, 1);
            selectedObject = null;
            drawObjects();
        }
    }
});

// Clear the canvas
clearCanvasButton.addEventListener('click', () => {
    objects.length = 0;
    selectedObject = null;
    drawObjects();
});

// Download canvas as JPG
downloadCanvasButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'canvas_image.jpg';
    link.href = canvas.toDataURL('image/jpeg');
    link.click();
});

// Toggle snap to grid
snapToGridCheckbox.addEventListener('change', () => {
    snapToGrid = snapToGridCheckbox.checked;
    drawObjects(); // Redraw objects to snap to grid if enabled
});

// Initial draw
drawObjects();
