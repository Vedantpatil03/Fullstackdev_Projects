const loginForm = document.getElementById('loginForm');
const taskForm = document.getElementById('taskForm');
const todoContainer = document.getElementById('todoContainer');
const authCard = document.getElementById('authCard');
const logoutBtn = document.getElementById('logoutBtn');
const taskList = document.getElementById('taskList');
const taskInput = document.getElementById('newTask');

const showTasks = () => {
    authCard.classList.add('hidden');
    todoContainer.classList.remove('hidden');
    taskInput.focus();
};

const showLogin = () => {
    todoContainer.classList.add('hidden');
    authCard.classList.remove('hidden');
    loginForm.reset();
};

const createTaskItem = (text) => {
    const li = document.createElement('li');
    li.className = 'task';

    const label = document.createElement('label');
    label.className = 'task__body';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task__check';

    const span = document.createElement('span');
    span.className = 'task__text';
    span.textContent = text;

    checkbox.addEventListener('change', () => {
        li.classList.toggle('done', checkbox.checked);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'icon-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => li.remove());

    label.append(checkbox, span);
    li.append(label, deleteBtn);
    return li;
};

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    showTasks();
});

logoutBtn.addEventListener('click', showLogin);

taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = taskInput.value.trim();
    if (!text) {
        return;
    }
    const item = createTaskItem(text);
    taskList.appendChild(item);
    taskInput.value = '';
    taskInput.focus();
});