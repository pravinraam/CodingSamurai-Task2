document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.querySelector('.todo-input');
    const todoButton = document.querySelector('.todo-button');
    const todoList = document.querySelector('.todo-list');
    const prevPageButton = document.querySelector('.prev-page');
    const nextPageButton = document.querySelector('.next-page');
    let currentPage = 1;
    const itemsPerPage = 5;

    const loadTodos = () => {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        return todos;
    };

    const saveTodos = (todos) => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    const addTodoToDOM = (todo) => {
        const todoItem = document.createElement('li');
        todoItem.classList.add('todo-item');
        todoItem.textContent = todo.text;

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            const todos = loadTodos().filter(t => t.id !== todo.id);
            saveTodos(todos);
            renderTodos(todos);
        });

        todoItem.appendChild(deleteButton);

        todoList.insertBefore(todoItem, todoList.firstChild);
    };

    const renderTodos = (todos) => {
        todoList.innerHTML = '';
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedTodos = todos.slice(start, end).reverse();
        paginatedTodos.forEach(todo => addTodoToDOM(todo));
        updatePagination(todos.length);
    };

    const addTodo = () => {
        const todoText = todoInput.value.trim();
        if (todoText !== '') {
            const todo = { id: Date.now(), text: todoText, created: new Date() };
            const todos = loadTodos();
            todos.unshift(todo); 
            saveTodos(todos);
            todoInput.value = '';
            renderTodos(todos);
        }
        else{
            alert('The Input Box is Empty');
        }
    };

    const updatePagination = (totalItems) => {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === totalPages;
    };

    const prevPage = () => {
        if (currentPage > 1) {
            currentPage--;
            const todos = loadTodos();
            renderTodos(todos);
        }
    };

    const nextPage = () => {
        const todos = loadTodos();
        const totalPages = Math.ceil(todos.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTodos(todos);
        }
    };

    renderTodos(loadTodos());

    todoButton.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    prevPageButton.addEventListener('click', prevPage);
    nextPageButton.addEventListener('click', nextPage);
});
