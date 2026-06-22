let allTasks  = [];
let editingId = null;   

function showToast(msg, type = 'ok'){
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className   = `show ${type}`;
    setTimeout(() => { t.className = ''; }, 2500);
}

async function loadTasks() {
    try {
        const res = await fetch('/tasks');
        allTasks  = await res.json();
        renderTable(allTasks);
    } catch (err) {
        console.error("Error loading tasks:", err);
        showToast('Failed to load tasks', 'err');
    }
}

function renderTable(tasks) {
    const tbody = document.getElementById('taskTableBody');
    document.getElementById('taskCount').textContent =
        `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`;

    if (tasks.length === 0) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="4">No tasks found.</td></tr>`;
        return;
    }

    tbody.innerHTML = tasks.map((t,index )=> `
        <tr data-id="${t.id}">
            <td>${index +1 }</td>
            <td class="task-name ${t.completed ? 'done' : ''}">${t.task}</td>
            <td>
                <span class="badge ${t.completed ? 'done' : 'pending'}">
                    ${t.completed ? 'Done' : 'Pending'}
                </span>
            </td>
            <td class="actions">
                <button class="btn btn-toggle" onclick="toggleTask('${t.id}', ${!t.completed})">
                    ${t.completed ? 'Undo' : 'Done'}
                </button>
                <button class="btn btn-edit"   onclick="openEditModal('${t.id}')">Edit</button>
                <button class="btn btn-delete" onclick="deleteTask('${t.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function filterTable() {
    const query    = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allTasks.filter(t => t.task.toLowerCase().includes(query));
    renderTable(filtered);
}

async function toggleTask(id, completed) {
    try {
        await fetch(`/tasks/${id}`, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ completed })
        });
        showToast(completed ? 'Task marked done!' : 'Task re-opened');
        loadTasks();
    } catch (err) {
        console.error(err);
        showToast('Could not update task', 'err');
    }
}

async function deleteTask(id) {
    if (!confirm('Delete this task?')) return;
    try {
        const res = await fetch(`/tasks/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error();
        showToast('Task deleted!');
        loadTasks();
    } catch (err) {
        console.error(err);
        showToast('Could not delete task', 'err');
    }
}

function openAddModal() {
    editingId = null;
    document.getElementById('modalTitle').textContent  = 'Add Task';
    document.getElementById('modalSubmit').textContent = 'Add';
    document.getElementById('modalInput').value        = '';
    document.getElementById('modalOverlay').classList.add('open');
    document.getElementById('modalInput').focus();
}

function openEditModal(id) {
    const task = allTasks.find(t => t.id === id);
    if (!task) return;
    editingId = id;
    document.getElementById('modalTitle').textContent  = 'Edit Task';
    document.getElementById('modalSubmit').textContent = 'Save';
    document.getElementById('modalInput').value        = task.task;
    document.getElementById('modalOverlay').classList.add('open');
    document.getElementById('modalInput').focus();
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('open');
}

async function submitModal() {
    const input = document.getElementById('modalInput').value.trim();
    if (!input) {
        document.getElementById('modalInput').focus();
        return;
    }

    try {
        if (editingId === null) {
            await fetch('/tasks', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ task: input })
            });
            showToast('Task added!');
        } else {
            await fetch(`/tasks/${editingId}`, {
                method:  'PUT',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ task: input })
            });
            showToast('Task updated!');
        }
        closeModal();
        loadTasks();
    } catch (err) {
        console.error(err);
        showToast('Could not save task', 'err');
    }
}

document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
});

document.getElementById('modalInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitModal();
});

loadTasks();