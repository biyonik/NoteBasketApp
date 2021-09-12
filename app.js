const newTask = document.querySelector('.input-task');
const taskAddButton = document.querySelector('.task-add-button');
const taskList = document.querySelector('.task-list');

document.addEventListener('DOMContentLoaded', function() {
    createTaskListFromLocalStorage();
});

taskAddButton.addEventListener('click', addTask);
taskList.addEventListener('click', deleteOrAddTask);

/**
 * Yeni bir görev ekleyen fonksiyon
 * @param {EventHandler} e 
 */
function addTask(e) {
    e.preventDefault();
    if(newTask.value.length > 0) {
        createTaskItemStruct(newTask.value);

        saveToLocalStorage(newTask.value);
        newTask.value = null;
    } else {
        alert('Görev içeriği boş olamaz!');
    }
    
}


/**
 * Tıklanılan butona göre ekleme veya silme aksiyonlarını işleten fonksiyon
 * @param {EventHandler} e 
 */
function deleteOrAddTask(e) {
    const clickedElement = e.target;
    if (clickedElement.classList.contains('task-completed-button')) {
        clickedElement.parentElement.classList.toggle('task-completed');
    } else if (clickedElement.classList.contains('task-delete-button')) {
        if(confirm('Görevi silmek istediğinize emin misiniz?')) {
            clickedElement.parentElement.classList.add('lost');
            const deletedTask = clickedElement.parentElement.children[0].innerText;
            deleteFromLocalStorage(deletedTask);
            clickedElement.parentElement.addEventListener('transitionend', () => {
                clickedElement.parentElement.remove();
            });
        }
    }
}

/**
 * Localstorage üzerinden tasks öğesinin içeriği okur ve dizi olarak döner
 * Bu liste yok ise localstorage üzerinde boş bir tasks dizisi oluşturur
 * @returns Array
 */
function getTasksFromLocalStorageByArray() {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    return tasks;
}

/**
 * Bir görevi localstorage üzerindeki tasks listesine ekler
 * @param {String} task 
 */
function saveToLocalStorage(task) {
    let tasks;
    tasks = getTasksFromLocalStorageByArray();

    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

/**
 * localstorage üzerindeki tasks listesini okur ve html elementlerine dönüştürerek görsel olarak ekrana çıktı verir
 */
function createTaskListFromLocalStorage() {
    let tasks = getTasksFromLocalStorageByArray();

    tasks.forEach((task) => {
        createTaskItemStruct(task);
    });
}

/**
 * localstorage üzerindeki task listesinden kendisine parametre olarak verilen elemanı siler ve localstorage üzerine yeni bir task listesi kaydeder
 * @param {String} task 
 */
function deleteFromLocalStorage(task) {
    let tasks = getTasksFromLocalStorageByArray();
    const deletedItemIndex = tasks.indexOf(task);
    tasks.splice(deletedItemIndex, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

/**
 * HTML elementlerini kullanarak bir görsel bileşen oluşturur
 * @param {String} task 
 */
function createTaskItemStruct(task) {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task-item');

    const taskListItem = document.createElement('li');
    taskListItem.classList.add('task-content');
    taskListItem.innerText = task;

    taskDiv.appendChild(taskListItem);

    const taskCompleteButtonCreator = document.createElement('button');
    taskCompleteButtonCreator.classList.add('task-button', 'task-completed-button');
    taskCompleteButtonCreator.innerHTML = '<i class="fa fa-check-square" aria-hidden="true"></i>';
    taskDiv.appendChild(taskCompleteButtonCreator);


    const taskDeleteButtonCreator = document.createElement('button');
    taskDeleteButtonCreator.classList.add('task-button', 'task-delete-button');
    taskDeleteButtonCreator.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
    taskDiv.appendChild(taskDeleteButtonCreator);

    taskList.appendChild(taskDiv);
}