// initialize the empty array to store the expenses

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// function to save the espenses to localstorage
function saveToLocalStorage() {
    localStorage.setItem("expenses", JSON.stringify(expenses)); //convert expenses array to json and save
}

// function to add the new transaction

function addTask(taskname, amount, category, date) {
    // create a new expense object with the unique ID

    const expense = {
        id: Date.now().toString(),  //use the current timestamp (as ID)
        taskname: taskname,
        amount: parseFloat(amount.toFixed(2)),
        category: category,
        date: date
    };

    expenses.push(expense); //adding the tas to the expenses array
    saveToLocalStorage();
    renderTasks();
    updateTotalAmount();
}

// function to update the existing expense
function updateTask(id, taskname, amount, category, date) {

    // loop through the expense array
    for (let i = 0; i < expenses.length; i++) {
        // if the current expense ID matched with the given ID
        if (expenses[i].id === id) {
            expenses[i].taskname = taskname; //updating the title
            expenses[i].amount = amount;
            expenses[i].category = category; //updating the title
            expenses[i].date = date; //updating the author
            break;
        }
    }
    saveToLocalStorage();
    renderTasks();
}


// function to delete the expense
function deleteTask(id) {
    // filter the expense with the Given id
    expenses = expenses.filter(function (expense) {
        return expense.id !== id; //keep the expense that do not match the id
    })
    saveToLocalStorage();
    renderTasks();
    updateTotalAmount();
}

// function to render the list of expense

function renderTasks() {
    const tbody = document.getElementById("expense-tbody"); //get the table body element
    tbody.innerHTML = ''; //clear the existing rows 

    // loop through the expense array
    expenses.forEach(function (expense) {
        const row = document.createElement('tr'); //create the new table row

        // set the inner HTML for the row 

        row.innerHTML = `
        <td>${expense.taskname}</td>
        <td>${expense.amount.toFixed(2)}</td>
        <td>${expense.category}</td>
        <td>${expense.date}</td>
        <td>
            <button id="editbtn" onclick = "editTask('${expense.id}')">Edit</button>
            <button id="delbtn" class = "delete" onclick = "deleteTask('${expense.id}')">Delete</button>
        </td>
        
        `;
        tbody.appendChild(row);

    })

}

// function to handle the form submission

function handleFormSubmit(event) {
    event.preventDefault();


    const id = document.getElementById("task-id").value;
    const taskname = document.getElementById("taskname").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;


    if (id) {
        updateTask(id, taskname, amount, category, date)
        updateTotalAmount();

    } else {
        addTask(taskname, amount, category, date)
        updateTotalAmount();

    }

    document.getElementById("taskname").value = '';
    document.getElementById("amount").value = 0.00;
    document.getElementById("category").value = '';
    document.getElementById("date").value = '';
    document.getElementById('task-id').value = ''; //clear the expense id 

}

// function to populate the form for editing a expense

function editTask(id) {
    const expense = expenses.find(function (b) {
        return b.id === id; //we are going to find expense with the given ID
    })

    // populate the form fields with the expense data

    document.getElementById("task-id").value = expense.id;
    document.getElementById("taskname").value = expense.taskname;
    document.getElementById("amount").value = expense.amount;
    document.getElementById("category").value = expense.category;
    document.getElementById("date").value = expense.date;

}

function updateTotalAmount() {

    let totalExpense = 0;
    let totalIncome = 0;

    const tbody = document.getElementById("expense-tbody");
    const expenses = tbody.querySelectorAll('tr');

    expenses.forEach(function (expense) {

        const amount = parseFloat(expense.children[1].textContent);
        const category = expense.children[2].textContent;

        if (category === 'Income') {
            totalIncome += amount;
        } else {
            totalExpense += amount;
        }
    });

    document.getElementById("totalexpense").value = parseFloat(totalExpense).toFixed(2);
    document.getElementById("totalincome").value = parseFloat(totalIncome).toFixed(2);
    document.getElementById("netbalance").value = (totalIncome - totalExpense).toFixed(2);
}

function resetButton() {
    document.getElementById("task-id").value = '';
    document.getElementById("taskname").value = '';
    document.getElementById("amount").value = 0.00;
    document.getElementById("category").value = '';
    document.getElementById("date").value = '';

}

const btn = document.querySelector('#btn');
const radioButtons = document.querySelectorAll('input[name="filter"]');
let selectedSize;

btn.addEventListener("click", () => {

    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            selectedSize = radioButton.value;

            let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
            if (selectedSize === "All") {
                filterTasks(expenses);
            }
            else {
                const filteredExpenses = expenses.filter(expense => expense.category === selectedSize);

                filterTasks(filteredExpenses);
            }

        }

    }
});

// function to render the list of expense

function filterTasks(filteredExpenses) {
    const tbody = document.getElementById("expense-tbody"); //get the table body element
    tbody.innerHTML = ''; //clear the existing rows 

    // loop through the expense array
    filteredExpenses.forEach(function (filteredExpense) {
        const filterRow = document.createElement('tr'); //create the new table row

        // set the inner HTML for the row 

        filterRow.innerHTML = `
        <td>${filteredExpense.taskname}</td>
        <td>${filteredExpense.amount}</td>
        <td>${filteredExpense.category}</td>
        <td>${filteredExpense.date}</td>
        <td>
            <button id="editbtn" onclick = "editTask('${filteredExpense.id}')">Edit</button>
            <button id="delbtn" class = "delete" onclick = "deleteTask('${filteredExpense.id}')">Delete</button>
        </td>
        
        `;
        tbody.appendChild(filterRow);
    })

}


// attach event listener to the form 
document.getElementById("form").addEventListener("submit", handleFormSubmit)

renderTasks();
updateTotalAmount();