let todoItemsContainer = document.getElementById("todoItemsContainer");
let todoUserInput = document.getElementById("todoUserInput");

// preloader
let preloader = document.getElementById("preloader");
window.addEventListener("load", function () {
    preloader.style.display = "none";
})

// toast constants
const addToast = document.getElementById('liveToast')
const deleteToast = document.getElementById('liveToast2')

//get todolist from local storage
function getTodoListFromLocalStorage() {
    let stringifiedTodoList = localStorage.getItem("todoList");
    let parsedTodoList = JSON.parse(stringifiedTodoList);
    if (parsedTodoList === null) {
        return [];
    } else {
        return parsedTodoList;
    }
}

//get count from local storage
function getCountFromLocalStorage() {
    let stringifiedCount = localStorage.getItem("count");
    let parsedCount = JSON.parse(stringifiedCount);
    if (parsedCount === null) {
        return 0;
    } else {
        return parsedCount;
    }
}

let todoList = getTodoListFromLocalStorage();
let count = getCountFromLocalStorage();

let addBtn = document.getElementById("addBtn");

function onStatusChange(todoId, checkboxId, labelId, listId) {
    let checkboxElement = document.getElementById(checkboxId);
    let labelElement = document.getElementById(labelId);
    let listElement = document.getElementById(listId);
    labelElement.classList.toggle("checked");
    listElement.classList.toggle("list-item-checked");

    let todoObjectIndex = todoList.findIndex(function (eachTodo) {
        let eachTodoId = "todo" + eachTodo.id;

        if (eachTodoId === todoId) {
            return true;
        } else {
            return false;
        }
    });

    let todoObject = todoList[todoObjectIndex];

    if (todoObject.status === true) {
        todoObject.status = false;
    } else {
        todoObject.status = true;
    }

    localStorage.setItem("todoList", JSON.stringify(todoList));
}

function onDeleteTodo(todoId) {
    let todoElement = document.getElementById(todoId);
    todoItemsContainer.removeChild(todoElement);

    let deleteElementIndex = todoList.findIndex(function (eachTodo) {
        let eachTodoId = "list" + eachTodo.id;
        if (eachTodoId === todoId) {
            return true;
        } else {
            return false;
        }
    });

    todoList.splice(deleteElementIndex, 1);
    localStorage.setItem("todoList", JSON.stringify(todoList)); 
}

function create(newTodo) {
    let todoId = "todo" + newTodo.id;
    let checkboxId = "checkbox" + newTodo.id;
    let labelId = "label" + newTodo.id;
    let listId = "list" + newTodo.id;

    let todoItemsContainer = document.getElementById("todoItemsContainer");
    let listItem = document.createElement("li");
    listItem.classList.add("d-flex", "flex-row", "list-item");
    let animationDuration = newTodo.task.length * 0.1;
    listItem.style.animation = `fadeup ${animationDuration}s ease`;
    listItem.id = listId;
    if (newTodo.status === true) {
        listItem.classList.add("list-item-checked");
    }
    else {
        listItem.classList.remove("list-item-checked");
    }

    // input container
    let checkboxContainer = document.createElement("div");
    let checkboxInput = document.createElement("input")
    checkboxInput.type = "checkbox";
    checkboxInput.id = checkboxId;
    checkboxInput.checked = newTodo.status;
    checkboxInput.classList.add("checkbox-style");
    checkboxContainer.appendChild(checkboxInput);

    checkboxInput.onclick = function () {
        onStatusChange(todoId, checkboxId, labelId, listId);
    }

    // label text container
    let todoTextContainer = document.createElement("div");
    todoTextContainer.classList.add("flex-grow-1");
    let todoText = document.createElement("label");
    todoText.setAttribute("for", checkboxId);
    todoText.id = labelId;
    todoText.classList.add("checkbox-label")
    todoText.textContent = newTodo.task;
    if (newTodo.status === true) {
        todoText.classList.add("checked");
    }
    else {
        todoText.classList.remove("checked");
    }
    todoTextContainer.appendChild(todoText);

    // delete icon container
    let deleteIconContainer = document.createElement("div");
    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash", "delete-icon");

    deleteIconContainer.onclick = function () {
        onDeleteTodo(listId);
        if (deleteIcon) {
            const deletetoastBootstrap = bootstrap.Toast.getOrCreateInstance(deleteToast);
            deletetoastBootstrap.show()
            console.log("delete")
        }
    };
    deleteIconContainer.appendChild(deleteIcon);

    if (newTodo.status) {
        todoItemsContainer.appendChild(listItem);
    }
    else {
        let firstCheckedItem = todoItemsContainer.querySelector('.list-item-checked');
        if (firstCheckedItem) {
            todoItemsContainer.insertBefore(listItem, firstCheckedItem);
        } else {
            todoItemsContainer.appendChild(listItem);
        }
    }

    // appending to list container
    listItem.appendChild(checkboxContainer);
    listItem.appendChild(todoTextContainer);
    listItem.appendChild(deleteIconContainer);
}

function onAddTodo() {
    let userInputElement = document.getElementById("todoUserInput");
    let userInputValue = userInputElement.value;

    if (userInputValue === "") {
        alert("Enter Valid Text");
        return;
    }

    count += 1;
    localStorage.setItem("count", count);
    let newTodo = {
        task: userInputValue,
        id: count,
        status: false
    };
    todoList.push(newTodo);
    create(newTodo);
    userInputElement.value = "";
    if (addBtn) {
        const addtoastBootstrap = bootstrap.Toast.getOrCreateInstance(addToast)
        addtoastBootstrap.show()
    }
    childHide();
    localStorage.setItem("todoList", JSON.stringify(todoList));
}

todoUserInput.addEventListener("keypress", function (event) {
    if (todoUserInput.value !== "" && event.key === "Enter") {
        onAddTodo();
    }
})

addBtn.addEventListener("click", function () {
    onAddTodo();
});

function clearTodoList() {
    let child = todoItemsContainer.lastElementChild;
    while(child) {
        todoItemsContainer.removeChild(child);
        child = todoItemsContainer.lastElementChild;
    }
    childShow();
    localStorage.clear();
}

let noTasksText= document.getElementById("noTasksText");

function childHide() {
    noTasksText.classList.remove("d-block");
    noTasksText.classList.add("d-none");
}
function childShow() {
    noTasksText.classList.remove("d-none");
    noTasksText.classList.add("d-block");
}

if (todoList.length === 0) {
    childShow();
}
else {
    childHide();
    for (let todo of todoList) {
        create(todo);
    }
}

// buttons
let timerContainer = document.getElementById("timerContainer");
let playBtn = document.getElementById("playBtn");
let closeBtn = document.getElementById("closeBtn");

// Modal
let modal = document.getElementById("modal");

// pause button
let pauseBtn = document.createElement("button");
pauseBtn.classList.add("pomo-btn", "play-reset-btn");
pauseBtn.id = "pauseBtn";
let pauseIcon = document.createElement("i")
pauseIcon.classList.add("fa-solid", "fa-pause", "fa-3x");
pauseIcon.style.color = "#45287d";
pauseBtn.appendChild(pauseIcon);
// reset button
let resetBtn = document.createElement("button");
resetBtn.classList.add("pomo-btn", "play-reset-btn");
resetBtn.id = "resetBtn";
let resetIcon = document.createElement("i")
resetIcon.classList.add("fa-solid", "fa-rotate-left", "fa-3x");
resetIcon.style.color = "#45287d";
resetBtn.appendChild(resetIcon);

// Function to play audio
function playMusic(audio) {
    audio.play();
    audio.loop = true;
}

// Function to pause audio
function pauseMusic(audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.loop = false;
}

// Function to show modal alert
function modalAlert(audio) {
    // modal alert
    modal.classList.add("show", "modal-custom");
    modal.style.display = "block";
    modal.setAttribute("aria-modal", true);
    modal.setAttribute("role", "dialog");
    closeBtn.onclick = function () {
        modal.classList.remove("show", "modal-custom");
        modal.style.display = "none";
        modal.removeAttribute("aria-modal");
        modal.removeAttribute("role");
        pauseMusic(audio);
        timerText.innerHTML = "25:00";
    }
}

// timer
let initialTime = 25 * 60; // 25 minutes in seconds
let time = initialTime;
let pausedTime = null;
let animationFrameId;
let start;
let elapsedPause = 0;

// Function to update timer
function updateTimer(timestamp) {
    if (!start) {
        start = timestamp;
    }

    let elapsed = timestamp - start - elapsedPause;
    time = initialTime - Math.floor(elapsed / 1000);

    if (time <= 0) {
        time = 0;
        cancelAnimationFrame(animationFrameId);
        let audio = new Audio("./Assets/alert.mp3");
        playMusic(audio);
        modalAlert(audio);

        timerContainer.removeChild(pauseBtn);
        timerContainer.removeChild(resetBtn);
        timerContainer.appendChild(playBtn);
        timerText.textContent = "00:00";
        start = null;
        elapsedPause = 0;
        pausedTime = null;
    } else {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;

        seconds = seconds < 10 ? '0' + seconds : seconds;

        timerText.innerHTML = `${minutes}:${seconds}`;

        animationFrameId = requestAnimationFrame(updateTimer);
    }
}

// pause button event listener
pauseBtn.onclick = function () {
    // Stop animation frame loop
    cancelAnimationFrame(animationFrameId);

    timerContainer.removeChild(pauseBtn);
    timerContainer.removeChild(resetBtn);
    timerContainer.appendChild(playBtn);

    pausedTime = performance.now(); // Store elapsed time
};

// reset button event listener
resetBtn.addEventListener("click", function () {
    // Stop animation frame loop
    cancelAnimationFrame(animationFrameId);

    timerContainer.removeChild(pauseBtn);
    timerContainer.removeChild(resetBtn);
    timerContainer.appendChild(playBtn);
    time = initialTime;
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    seconds = seconds < 10 ? '0' + seconds : seconds;

    timerText.innerHTML = `${minutes}:${seconds}`;

    start = null;
    pausedTime = null;
    elapsedPause = 0;
});

// play button event listener
playBtn.addEventListener("click", function () {
    // button changes
    timerContainer.removeChild(playBtn);
    timerContainer.appendChild(pauseBtn);
    timerContainer.appendChild(resetBtn);

    if (pausedTime) {
        elapsedPause += performance.now() - pausedTime;
        pausedTime = null;
    }

    animationFrameId = requestAnimationFrame(updateTimer);
});

// about modal display function
function aboutModalAlert() {
    // modal alert
    aboutModal.classList.add("show", "modal-custom");
    aboutModal.style.display = "block";
    aboutModal.setAttribute("aria-modal", true);
    aboutModal.setAttribute("role", "dialog");
    aboutModelCloseBtn.onclick = function () {
        aboutModal.classList.remove("show", "modal-custom");
        aboutModal.style.display = "none";
        aboutModal.removeAttribute("aria-modal");
        aboutModal.removeAttribute("role");
    }
}

//show about modal
function showAbout() {
    aboutModalAlert();
}
