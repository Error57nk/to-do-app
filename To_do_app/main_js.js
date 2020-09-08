const listWraper = document.querySelector('[data-lists]')
const ListForm = document.querySelector('[data-new-list-form]')
const ListInput = document.querySelector('[data-new-list-input]')
const deleteListBtn = document.querySelector('[data-delete-list-btn]')

// tasks
const listDisplayContainer = document.querySelector('[data-list-display-container]')
const listTitleElements = document.querySelector('[data-list-title]')
const listCounterElements = document.querySelector('[data-task-count]')
const taskContainer = document.querySelector('[data-tasks]')
const taskTemplate = document.getElementById('task-template')

const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')
const clearCompleteBtn = document.querySelector('[data-clear-complete-task]')


// Keys
const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []

let SelectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)
// Store data locally in Browser


// main list listen
listWraper.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        SelectedListId = e.target.dataset.listId
        save_render()
    }
})

// task listner
taskContainer.addEventListener('click', e => {
    var seleted_item_id = e.target.id
    if (e.target.tagName.toLowerCase() === 'input') {
        const selectedList = lists.find(list => list.id === SelectedListId)
        console.log(e.target.id)
        const selectedTask = selectedList.task.find(task => task.id === e.target.id)
        selectedTask.complete = e.target.checked
        save_list()
        renderTaskCount(selectedList)
    }

    if (e.target.tagName.toLowerCase() === 'button') {
        // alert('Delete tag clicked')
        console.log(e.target.id)
        const selectedList = lists.find(list => list.id === SelectedListId)
        selectedList.task = selectedList.task.filter(task => task.id !== e.target.id)
        save_render()


    }

    if (e.target.tagName.toLowerCase() === 'a') {
        // alert('Delete tag clicked')
        const selectedList = lists.find(list => list.id === SelectedListId)
        // console.log(e.target.id)
        const selectedTask = selectedList.task.find(task => task.id === e.target.id)
        var newData = prompt("Rename This Task", selectedTask.name);
        if (newData == null || newData == "") {

        } else {

            selectedTask.name = newData
            save_render()
        }

        console.log(e.target.id)


    }



})




// delete list()
deleteListBtn.addEventListener('click', e => {
    if (confirm("Are You Sure Want To Delete ?")) {
        lists = lists.filter(list => list.id !== SelectedListId)
        SelectedListId = null
        save_render()
    }

})
clearCompleteBtn.addEventListener('click', e => {
    const selectedList = lists.find(list => list.id === SelectedListId)
    selectedList.task = selectedList.task.filter(task => !task.complete)
    save_render()
})

// add to main list
ListForm.addEventListener('submit', e => {
    e.preventDefault()
    const listName = ListInput.value
    // checking for empty list
    if (listName == null || listName == '') return
    const list = createList(listName)
    // clear input field
    ListInput.value = null
    lists.push(list)
    save_render()

})

newTaskForm.addEventListener('submit', e => {
    e.preventDefault()
    const taskName = newTaskInput.value
    // checking for empty list
    if (taskName == null || taskName == '') return
    const task = createTask(taskName)
    // clear input field
    newTaskInput.value = null
    const taskList = lists.find(list => list.id === SelectedListId)
    taskList.task.push(task)
    save_render()

})

function createTask(name) {
    return {
        id: Date.now().toString(), name: name, complete: false, delete: false
    }
}


function createList(name) {
    return {
        id: Date.now().toString(), name: name, task: []
    }
}


function save_list() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, SelectedListId)
}

function save_render() {
    save_list()
    render()
}




function render() {

    clear_Elements(listWraper)
    render_list()
    const selectedList = lists.find(list => list.id === SelectedListId)
    if (SelectedListId == null) {
        listDisplayContainer.style.display = 'none'

    } else {

        listDisplayContainer.style.display = ''
        listTitleElements.innerText = selectedList.name
        renderTaskCount(selectedList)
        clear_Elements(taskContainer)
        renderTasks(selectedList)
    }


}

function renderTasks(selectedList) {
    selectedList.task.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true)

        const checkbox = taskElement.querySelector('input')
        const button = taskElement.querySelector('button')
        const a = taskElement.querySelector('a')
        checkbox.id = task.id
        checkbox.checked = task.complete
        const label = taskElement.querySelector('label')
        label.htmlFor = task.id
        label.append(task.name)
        button.setAttribute("id", task.id);
        a.setAttribute("id", task.id);


        taskContainer.appendChild(taskElement)
    })

}


function renderTaskCount(selectedList) {
    // alert("counter")
    const incompleteTaskCount = selectedList.task.filter(task => !task.complete).length
    const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
    listCounterElements.innerText = `${incompleteTaskCount} ${taskString} remaining`
}
function render_list() {
    lists.forEach(list => {
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add("list-name")
        listElement.innerText = list.name

        // Check for selected
        if (list.id === SelectedListId) { listElement.classList.add('active-list') }

        listWraper.appendChild(listElement)
    })
}
function clear_Elements(element) {

    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }


}

render();