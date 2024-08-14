let currentNote = null;
let currentEditingNote = null;

document.getElementById('addNoteButton').addEventListener('click', () => {
    createNote();
});

document.getElementById('corkboard').addEventListener('click', (event) => {
    if (currentNote && !event.target.classList.contains('move-button')) {
        placeNoteAt(event.clientX, event.clientY);
    }
});

document.querySelector('.close').onclick = function() {
    document.getElementById('editModal').style.display = 'none';
};

document.getElementById('saveChanges').addEventListener('click', saveChanges);

function createNote() {
    const corkboard = document.getElementById('corkboard');
    const note = document.createElement('div');
    note.classList.add('note');

    const header = document.createElement('div');
    header.classList.add('note-header');

    const moveButton = document.createElement('button');
    moveButton.innerText = '☰';
    moveButton.classList.add('move-button');
    moveButton.onmousedown = function(event) {
        currentNote = note; // Set the note as the currentNote
        document.addEventListener('mousemove', followMouse);
        event.stopPropagation(); // Prevent triggering corkboard click
    };

    const deleteButton = document.createElement('button');
    deleteButton.innerText = '✖';
    deleteButton.classList.add('delete-button');
    deleteButton.onclick = function() {
        corkboard.removeChild(note); // Remove the note
    };

    header.appendChild(moveButton);
    header.appendChild(deleteButton);
    note.appendChild(header);

    const title = document.createElement('div');
    title.classList.add('note-title');
    title.innerText = 'Title';
    note.appendChild(title);

    const content = document.createElement('div');
    content.classList.add('note-content');
    content.innerText = 'Paragraph';
    note.appendChild(content);

    const editButton = document.createElement('button');
    editButton.innerText = '✎ Edit';
    editButton.classList.add('edit-button');
    editButton.onclick = function() {
        openEditModal(note, title, content);
    };

    note.appendChild(editButton);

    currentNote = note;
    corkboard.appendChild(note);

    document.addEventListener('mousemove', followMouse);
}

function followMouse(event) {
    if (currentNote) {
        const rect = document.getElementById('corkboard').getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        currentNote.style.left = `${Math.min(Math.max(0, x - 75), rect.width - 150)}px`;
        currentNote.style.top = `${Math.min(Math.max(0, y - 50), rect.height - 100)}px`;
    }
}

function placeNoteAt(x, y) {
    const rect = document.getElementById('corkboard').getBoundingClientRect();
    const top = y - rect.top;
    const left = x - rect.left;

    currentNote.style.left = `${Math.min(left, rect.width - 150)}px`;
    currentNote.style.top = `${Math.min(top, rect.height - 100)}px`;

    document.removeEventListener('mousemove', followMouse);
    currentNote = null;
}

function openEditModal(note, title, content) {
    currentEditingNote = { note, title, content };

    document.getElementById('noteTitle').value = title.innerText;
    document.getElementById('noteContent').value = content.innerText;

    document.getElementById('editModal').style.display = 'block';
}

function saveChanges() {
    const titleText = document.getElementById('noteTitle').value;
    const contentText = document.getElementById('noteContent').value;

    const titleFontStyle = document.getElementById('titleFontStyle').value;
    const titleFontSize = document.getElementById('titleFontSize').value;
    const titleFontColor = document.getElementById('titleFontColor').value;
    const contentFontStyle = document.getElementById('contentFontStyle').value;
    const contentFontSize = document.getElementById('contentFontSize').value;
    const contentFontColor = document.getElementById('contentFontColor').value;

    currentEditingNote.title.innerText = titleText;
    currentEditingNote.content.innerText = contentText;

    currentEditingNote.title.style.fontFamily = titleFontStyle;
    currentEditingNote.title.style.fontSize = `${titleFontSize}px`;
    currentEditingNote.title.style.color = titleFontColor;
    currentEditingNote.title.style.fontWeight = document.getElementById('titleBold').classList.contains('active') ? 'bold' : 'normal';
    currentEditingNote.title.style.fontStyle = document.getElementById('titleItalic').classList.contains('active') ? 'italic' : 'normal';
    currentEditingNote.title.style.textDecoration = document.getElementById('titleUnderline').classList.contains('active') ? 'underline' : 'none';

    currentEditingNote.content.style.fontFamily = contentFontStyle;
    currentEditingNote.content.style.fontSize = `${contentFontSize}px`;
    currentEditingNote.content.style.color = contentFontColor;
    currentEditingNote.content.style.fontWeight = document.getElementById('contentBold').classList.contains('active') ? 'bold' : 'normal';
    currentEditingNote.content.style.fontStyle = document.getElementById('contentItalic').classList.contains('active') ? 'italic' : 'normal';
    currentEditingNote.content.style.textDecoration = document.getElementById('contentUnderline').classList.contains('active') ? 'underline' : 'none';

    document.getElementById('editModal').style.display = 'none';
}
