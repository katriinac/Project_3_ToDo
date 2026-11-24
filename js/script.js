import '../css/styles.css';

//Creating needed variables
const inputTask = document.getElementById("inputTask");
const addButton = document.getElementById("addButton");
const taskList = document.querySelector("#taskList");
const showAll = document.querySelector("#showAll");
const activeButton = document.querySelector("#active");
const completedButton = document.querySelector("#completed");
const charcount = document.querySelector("#charcount");
const inputError = document.querySelector("#inputError");
const emptyMessage = document.querySelector("#emptyMessage");

let deleteButtonId = 1;

//Updating a charcount under the input
inputTask.addEventListener("input", function(){
    const task = inputTask.value;
    charcount.textContent = task.length + " / 100";

//Making the red border disappear
    if(task.trim().length >= 3 && task.trim().length <= 100){
        inputTask.style.border = "";
        inputError.textContent = "";
    }
});

//Validtaing the input before the task is created
function validate(){
    const task = inputTask.value.trim();
    if(task.length < 3 || task.length > 100){
        inputTask.style.border = "2px solid red";
        inputError.textContent = "The task needs to be 3-100 characters long!";
        return false;
    }
    inputTask.style.border = "";
    inputError.textContent ="";
    return true;
}

//Function to create checkboxes
function createCheckbox(taskText){
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

//Adding tailwindcss for checkboxes
    checkbox.className = "w-5 h-5 shrink-0 cursor-pointer accent-purple-500";

//Adding classes for checked/unchecked boxes
    checkbox.addEventListener("change", function(){
        if(checkbox.checked){
            taskText.classList.add("checked");
        }
        else{
            taskText.classList.remove("checked");
        }
        taskDone();
        saveTask();
    });
    return checkbox;
}

//Creating the delete button to delete the tasks
function createDeleteButton(newTask){
    const deleteButton = document.createElement("button");

//Adding tailwindcss for the delete button
    deleteButton.type = "button";
    deleteButton.className = "ml-auto w-6 h-6 shrink-0 rounded-md bg-[#e9cafd] hover:bg-[#d5b4f2] shadow-sm cursor-pointer";
    deleteButton.textContent = "×";
    deleteButton.id = "btn" + deleteButtonId;
    deleteButtonId++;
    deleteButton.addEventListener("click", function(){
        newTask.remove();
        taskDone();
        saveTask();
        showList();
    });
    return deleteButton;
}

//Function to create a task. New task is unchecked by default
function createTasks(task, completed = false){
    const newTask = document.createElement("li");

//Adding tailwindcss and animate for the tasks
    newTask.className = "flex items-center gap-3 rounded-xl border border-[#b2a2de] bg-white/60 p-3 font-mono text-slate-700 transition-colors hover:bg-[#f5eafa] animate__animated animate__fadeInUp";
    newTask.dataset.task = task;
    const taskText = document.createElement("span");
    taskText.textContent = task;
    const checkbox = createCheckbox(taskText);
    const deleteButton = createDeleteButton(newTask);
    checkbox.checked = completed;
    if(completed){
        taskText.classList.add("checked");
    }
    newTask.appendChild(checkbox);
    newTask.appendChild(taskText);
    newTask.appendChild(deleteButton);
    taskList.appendChild(newTask);
}

//Clearing the input
function clearInput(){
    inputTask.value = "";
    inputTask.style.border = "";
    charcount.textContent = "0 / 100";
}

//Function to add the tasks
function addTask(){
    if(validate()){
        const task = inputTask.value.trim();
        createTasks(task);
        saveTask();
        clearInput();
        taskDone();
        showList();
    }
}

//Adding needed variables and functions for tasks
addButton.addEventListener("click",function(event){
    event.preventDefault();
    addTask();
});

//Function to check how many tasks are done and display the number under the tasks
function taskDone() {
    const checkboxes = document.querySelectorAll('#taskList input[type="checkbox"]');
    let tasksDone = 0;
    for (let checkbox of checkboxes) {
        if(checkbox.checked){
            tasksDone = tasksDone + 1;
        }
    }
    const allTasks = checkboxes.length;
    document.getElementById("taskDone").textContent = tasksDone + "/" + allTasks;
}

//Function to show all tasks
function showList(){
    const tasks = document.querySelectorAll("#taskList li");
    for (let task of tasks){
        task.hidden = false;
    }
    if(tasks.length === 0){
        emptyMessage.textContent = "No tasks";
        emptyMessage.classList.remove("hidden");
    }
    else{
        emptyMessage.classList.add("hidden");
    }
}

//Show the whole list when All button is presseed
showAll.addEventListener("click", function(){
    showList();
});

//Show only tasks that that are not done when "Active" button is pressed
activeButton.addEventListener("click", function(){
    const checkboxes = document.querySelectorAll('#taskList input[type="checkbox"]:checked');
    showList();

    for (let checkbox of checkboxes){
        checkbox.parentElement.hidden = true;
    }

//Showing the no tasks message if empty
    const activeTasks = document.querySelectorAll('#taskList input[type="checkbox"]:not(:checked)');
    if(activeTasks.length === 0){
        emptyMessage.textContent = "No active tasks";
        emptyMessage.classList.remove("hidden");
    }
});

//Show only tasks that are done when "Completed" button is pressed
completedButton.addEventListener("click", function(){
    const checkboxes = document.querySelectorAll('#taskList input[type="checkbox"]:not(:checked)');
    showList();
    for (let checkbox of checkboxes){
        checkbox.parentElement.hidden = true;
    }

//Showing the no tasks message if empty
    const completedTasks = document.querySelectorAll('#taskList input[type="checkbox"]:checked');
    if(completedTasks.length === 0){
        emptyMessage.textContent = "No completed tasks";
        emptyMessage.classList.remove("hidden");
    }
});

//Saving the tasks with localstorage
function saveTask(){
    const tasks = document.querySelectorAll("#taskList li");
    let saved = [];
    for(let task of tasks){
        const checkbox = task.querySelector("input[type='checkbox']");
        const taskInfo = {task: task.dataset.task, completed: checkbox.checked};
        saved.push(taskInfo);
    }
    localStorage.setItem("ToDo", JSON.stringify(saved));
}

//Loading the tasks from localstorage
function loadTasks(){
    const saved = localStorage.getItem("ToDo");
    if(saved){
        const tasks = JSON.parse(saved);
        for(let task of tasks){
            createTasks(task.task, task.completed);
        }
    }
    taskDone();
}

//To load all the data
loadTasks();
showList();

// Vanta fog background effect
const vantaEffect = VANTA.FOG({
    el: ".content",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    highlightColor: 0xf2b6e6,
    midtoneColor: 0xd6a4e8,
    lowlightColor: 0xb99adf,
    baseColor: 0xfcd6f0,
    blurFactor: 0.8,
    zoom: 0.7,
    speed: 2
});

//Making the vanta.js background to resize with the body so it doesn't randomly crop
const content = document.querySelector(".content");
const resizeObserver = new ResizeObserver(function(){
    vantaEffect.resize();
});
resizeObserver.observe(content);