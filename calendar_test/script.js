document.addEventListener('DOMContentLoaded', () => {
    const weekRangeElement = document.getElementById('week-range');
    const calendarGridElement = document.querySelector('.grid-body');
    const prevWeekButton = document.getElementById('prev-week');
    const nextWeekButton = document.getElementById('next-week');
    const eventForm = document.getElementById('event-form');

    let currentDate = new Date();
    let events = {};

    function renderCalendar(date) {
        calendarGridElement.innerHTML = '';

        const startOfWeek = getStartOfWeek(date);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);

        weekRangeElement.textContent = `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;

        const dateElements = [
            document.getElementById('date-sun'),
            document.getElementById('date-mon'),
            document.getElementById('date-tue'),
            document.getElementById('date-wed'),
            document.getElementById('date-thu'),
            document.getElementById('date-fri'),
            document.getElementById('date-sat')
        ];

        for (let day = 0; day < 7; day++) {
            const currentDate = new Date(startOfWeek);
            currentDate.setDate(currentDate.getDate() + day);
            dateElements[day].textContent = currentDate.getDate();
        }

        for (let hour = 0; hour < 24; hour++) {
            const hourCell = document.createElement('div');
            hourCell.className = 'grid-hour';
            hourCell.textContent = `${hour}:00`;
            calendarGridElement.appendChild(hourCell);

            for (let day = 0; day < 7; day++) {
                const dateCell = document.createElement('div');
                dateCell.className = 'grid-cell';
                dateCell.dataset.date = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + day, hour).toISOString();

                calendarGridElement.appendChild(dateCell);
            }
        }

        renderEvents();
    }

    function getStartOfWeek(date) {
        const start = new Date(date);
        const day = start.getDay();
        const diff = start.getDate() - day;
        start.setDate(diff);
        start.setHours(0, 0, 0, 0);
        return start;
    }

    function addEvent(e) {
        e.preventDefault();
        const eventDate = document.getElementById('event-date').value;
        const startTime = document.getElementById('event-start-time').value;
        const endTime = document.getElementById('event-end-time').value;
        const title = document.getElementById('event-title').value;
        const color = document.getElementById('event-color').value;

        if (!eventDate || !startTime || !endTime || !title) {
            alert('Please fill in all fields.');
            return;
        }

        const startDateTime = new Date(`${eventDate}T${startTime}`);
        const endDateTime = new Date(`${eventDate}T${endTime}`);

        if (startDateTime >= endDateTime) {
            alert('End time must be after start time.');
            return;
        }

        const dateKey = eventDate;
        if (!events[dateKey]) {
            events[dateKey] = [];
        }

        events[dateKey].push({
            startDateTime,
            endDateTime,
            title,
            color,
            notes: [] // Initialize notes array
        });

        renderEvents();

        eventForm.reset();
    }

    function renderEvents() {
        calendarGridElement.querySelectorAll('.event-box').forEach(box => box.remove()); // Remove existing events

        for (const [dateKey, eventList] of Object.entries(events)) {
            eventList.forEach(event => {
                const startHour = event.startDateTime.getHours();
                const endHour = event.endDateTime.getHours();
                const dayIndex = event.startDateTime.getDay();

                for (let hour = startHour; hour < endHour; hour++) {
                    const cellSelector = `.grid-cell[data-date="${event.startDateTime.toISOString().split('T')[0]}T${hour.toString().padStart(2, '0')}:00:00.000Z"]`;
                    const cell = document.querySelector(cellSelector);
                    if (cell) {
                        const eventBox = document.createElement('div');
                        eventBox.className = 'event-box';
                        eventBox.style.top = `${(event.startDateTime.getMinutes() / 60) * 100}%`;
                        eventBox.style.height = `${((event.endDateTime - event.startDateTime) / 3600000) * 100}%`;
                        eventBox.style.backgroundColor = event.color;

                        const eventContent = document.createElement('div');
                        eventContent.className = 'event-content';

                        const eventTitle = document.createElement('div');
                        eventTitle.className = 'event-title';
                        eventTitle.textContent = event.title;
                        eventContent.appendChild(eventTitle);

                        if (event.notes.length > 0) {
                            const notesList = document.createElement('ul');
                            notesList.className = 'event-notes';
                            event.notes.forEach(note => {
                                const noteItem = document.createElement('li');
                                noteItem.textContent = note;
                                notesList.appendChild(noteItem);
                            });
                            eventContent.appendChild(notesList);
                        }

                        cell.appendChild(eventBox);
                        eventBox.appendChild(eventContent);

                        // Add event listeners for edit and delete
                        eventBox.addEventListener('dblclick', () => editEvent(event, dateKey));
                        eventBox.addEventListener('contextmenu', (e) => {
                            e.preventDefault(); // Prevent default right-click menu
                            deleteEvent(event, dateKey);
                        });
                    }
                }
            });
        }
    }

    function editEvent(event, dateKey) {
        const { startDateTime, endDateTime, title, color, notes } = event;

        // Assuming you have input fields in your form to edit event details
        document.getElementById('event-date').value = dateKey;
        document.getElementById('event-start-time').value = startDateTime.toTimeString().slice(0, 5); // Format time as hh:mm
        document.getElementById('event-end-time').value = endDateTime.toTimeString().slice(0, 5); // Format time as hh:mm
        document.getElementById('event-title').value = title;
        document.getElementById('event-color').value = color;

        // Populate notes if any
        const notesInput = document.getElementById('event-notes');
        notesInput.value = notes.join('\n');

        // Remove the edited event from events array
        const index = events[dateKey].findIndex(e => e === event);
        events[dateKey].splice(index, 1);

        renderEvents(); // Update calendar display after edit
    }

    function deleteEvent(event, dateKey) {
        const index = events[dateKey].findIndex(e => e === event);
        events[dateKey].splice(index, 1);

        renderEvents(); // Update calendar display after delete
    }

    prevWeekButton.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 7);
        renderCalendar(currentDate);
    });

    nextWeekButton.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 7);
        renderCalendar(currentDate);
    });

    eventForm.addEventListener('submit', addEvent);

    renderCalendar(currentDate);
});
