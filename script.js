function submitForm(event) {
    event.preventDefault(); // Prevent form from refreshing

    const taskData = {

        taskOwner: document.getElementById("taskOwner").value,
        taskName: document.getElementById("taskName").value,
        description: document.getElementById("description").value,
        startDate: document.getElementById("startDate").value,
        dueDate: document.getElementById("dueDate").value,
        reminder_date: document.getElementById("reminderDate").value, 
        priority: document.getElementById("priority").value,
        taskId: document.getElementById("taskId").value,
        status: document.getElementById("status").value


    };

    fetch("http://localhost:5000/api/task", { 
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(taskData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); 
        })
        .then(data => {
             alert("Task added successfully!");
            document.getElementById("taskForm").reset();
        })
        .catch(error => console.error("Error:", error));

        validateStartDate();
        validateDueDate();
        validateReminderDate();
        checkFormValidity(); // Re-check before submitting
    
        if (!document.getElementById("submitBtn").disabled) {
            alert("Form submitted successfully!"); 
    
            // Simulate form submission and reload the page after 1 second
            setTimeout(() => {
                location.reload();
            }, 10);
        }
}


// **********************************data Retrive ************************************//
let currentTaskId = null; 
// Fetch all tasks 

document.addEventListener("DOMContentLoaded", function () {
    fetchTasks(); 
});
function fetchTasks() {
    fetch("http://localhost:5000/api/task")
        .then(response => response.json())
        .then(tasks => {
            console.log("Fetched Tasks:", tasks);
            displayTasks(tasks);
        })
        .catch(error => console.error("Error fetching tasks:", error));
}

function displayTasks(tasks) {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // Clear previous tasks

   
    const tableContainer = document.createElement("div");
    tableContainer.className = "table-responsive"; // Enables scrolling on small screens

    
    const table = document.createElement("table");
    table.className = "table table-hover align-middle"; // Clean look

   
    table.innerHTML = `
        <thead class="table-secondary">
            <tr>
                <th class="py-2">Task & Owner</th>
                <th class="py-2">Start Date</th>
                <th class="py-2">Due Date</th>
                <th class="py-2">Description</th>
                <th class="py-2">Priority</th>
                <th class="py-2">Status</th>
                <th class="py-2">Actions</th>
            </tr>
        </thead>
        <tbody class="bg-white">
    `;

  
    tasks.forEach(task => {
        table.innerHTML += `
            <tr id="taskRow-${task.id}">
                <td>
                    <div class="d-flex align-items-center">
                        <img src="user.png" width="40" height="40" class="me-2 rounded-circle">
                        <div>
                            <p class="mb-0 fw-bold">${task.task_name}</p>
                            <p class="mb-0 text-muted">${task.task_owner}</p>
                        </div>
                    </div>
                </td>

                <td>${formatDate(task.start_date)}</td>
                  <td>${formatDate(task.due_date)}</td>
                <td>${task.description}</td>
                <td class="fw-bold">${task.priority}</td>
                <td>${task.status}</td>

                <td>
                   
    <div class="icons d-flex jus">
<!-- Edit Icon -->
         <div class="icon-hover me-5" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Edit">
            <img class="default-icon" src="edit.svg" alt="Edit" onclick="editTask(${task.id})">
            <img class="hover-icon" src="edit-blue.svg" alt="Edit" onclick="editTask(${task.id})">
        </div>

        
                <!-- Delete Icon -->
         <div class="icon-hover" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Delete ">
            <img class="default-icon" src="delete.png" alt="Delete"  onclick="deleteTask(${task.id})">
            <img class="hover-icon" src="delete-blue.svg" alt="Delete" onclick="deleteTask(${task.id})">
        </div>
    </div>
</td>

                </td>
                
            </tr>
        `;
    });

    table.innerHTML += `</tbody>`;
    tableContainer.appendChild(table);
    taskList.appendChild(tableContainer);
}





function formatDate(dateString) {
    // if (!dateString) return ""; 
    // const date = new Date(dateString);
    // return date.toISOString().split("T")[0]; 
    if (!dateString) return "N/A"; // Handle null or undefined dates

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date"; // Handle incorrect formats

    // Fix time zone shift by forcing UTC midnight
    date.setUTCHours(12); 

    return date.toISOString().split("T")[0]; // Return YYYY-MM-DD format
}


// Edit task - Open form and fill data
function editTask(taskId) {
    fetch(`http://localhost:5000/api/task/${taskId}`)
        .then(response => response.json())
        .then(task => {
            console.log("Editing Task:", task);
            currentTaskId = task.id; // Store current task ID

            
            document.getElementById("taskOwner").value = task.task_owner;
            document.getElementById("taskName").value = task.task_name;
            document.getElementById("description").value = task.description;
           document.getElementById("reminderDate").value=task.reminder_date, 
            document.getElementById("priority").value = task.priority;
            document.getElementById("status").value = task.status;
            document.getElementById("startDate").value = formatDate(task.start_date);
            document.getElementById("dueDate").value = formatDate(task.due_date);

            function formatDate(dateString) {
                if (!dateString) return ""; 
                const date = new Date(dateString);
                return date.toISOString().split("T")[0];
            }
            // Show the form
            document.getElementById("taskFormContainer").style.display = "block";
        })
        .catch(error => console.error("Error fetching task details:", error));
}

// Update task when form is submitted
function updateTask(event) {
    event.preventDefault(); 

    if (!currentTaskId) {
        console.error("Error: No task selected for update.");
        return;
    }

    const updatedTaskData = {
        taskOwner: document.getElementById("taskOwner").value,
        taskName: document.getElementById("taskName").value,
        description: document.getElementById("description").value,
        startDate: document.getElementById("startDate").value,
        dueDate: document.getElementById("dueDate").value,
        priority: document.getElementById("priority").value,
        status: document.getElementById("status").value,
        reminder_date: document.getElementById("reminderDate").value, 
    };

    fetch(`http://localhost:5000/api/task/${currentTaskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTaskData)
    })
    .then(response => response.json())
    .then(data => {
        alert("Task updated successfully!");

        
        closePopup(); 

       
        fetchTasks();
    })
    .catch(error => console.error("Error updating task:", error));

    validateStartDate();
        validateDueDate();
        validateReminderDate();
        checkFormValidity(); // Re-check before submitting
    
        if (!document.getElementById("submitBtn").disabled) {
           // alert("Form submitted successfully!"); 
    
            // Simulate form submission and reload the page after 1 second
            setTimeout(() => {
                location.reload();
            }, 10);
        }

        if (!checkFormValidity()) {
            alert("Please fix the errors before updating the task.");
            return;
        }
    
        //alert("Task updated successfully!"); // Replace this with your actual update function
    
}

//delete task
function deleteTask(taskId) {
    if (!confirm("Are you sure you want to delete this task?")) return; 
    fetch(`http://localhost:5000/api/task/${taskId}`, { method: "DELETE" })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Deleted Task:", data);

           
            const taskRow = document.getElementById(`taskRow-${taskId}`);
            if (taskRow) {
                taskRow.remove();
                console.log("Task removed from UI.");
            }

            alert("Task deleted successfully!");

           
            setTimeout(() => {
                location.reload();
            }, 1000);
        })
        .catch(error => console.error("Error deleting task:", error));
}

//pop up form
function editTask(taskId) {
    fetch(`http://localhost:5000/api/task/${taskId}`)
        .then(response => response.json())
        .then(task => {
            console.log("Editing Task:", task);
            currentTaskId = task.id; // Store current task ID

            // Fill the form with task details
            document.getElementById("taskOwner").value = task.task_owner;
            document.getElementById("taskName").value = task.task_name;
            document.getElementById("description").value = task.description;
            document.getElementById("priority").value = task.priority;
            document.getElementById("status").value = task.status;
            document.getElementById("startDate").value = formatDate(task.start_date);
            document.getElementById("dueDate").value = formatDate(task.due_date);

            function formatDate(dateString) {
                if (!dateString) return ""; // Handle empty values
                const date = new Date(dateString);
                return date.toISOString().split("T")[0]; // Convert to "YYYY-MM-DD"
            }

            // Show overlay and form smoothly
            document.getElementById("overlay").style.display = "block";
            document.getElementById("taskFormContainer").style.display = "block";
            setTimeout(() => {
                document.getElementById("taskFormContainer").classList.add("popup-show");
            }, 10);
        })
        .catch(error => console.error("Error fetching task details:", error));
}

// Close form and overlay
function closePopup() {
    document.getElementById("taskFormContainer").classList.remove("popup-show");
    setTimeout(() => {
        document.getElementById("taskFormContainer").style.display = "none";
        document.getElementById("overlay").style.display = "none";
    }, 300); 
}


function resetForm() {
    document.getElementById("taskForm").reset(); 
}
//validation pattern
// function validateTaskOwner() {
//     const taskOwnerInput = document.getElementById("taskOwner");
//     const errorDiv = document.getElementById("taskOwnerError");

//     const regex = /^[A-Za-z\s]+$/;
//     if (!regex.test(taskOwnerInput.value.trim())) {
//         errorDiv.style.display = "block";
//         taskOwnerInput.classList.add("is-invalid");
//         return false;
//     } else {
//         errorDiv.style.display = "none";
//         taskOwnerInput.classList.remove("is-invalid");
//         return true;
//     }
// }

// function validateStartDate() {
//     const startDateInput = document.getElementById("startDate");
//     const startDateError = document.getElementById("startDateError");
//     const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

//     if (startDateInput.value < today) {
//         startDateError.style.display = "block";
//         startDateInput.classList.add("is-invalid");
//         return false;
//     } else {
//         startDateError.style.display = "none";
//         startDateInput.classList.remove("is-invalid");
//         return true;
//     }
// }

// function validateDueDate() {
//     const startDate = document.getElementById("startDate").value;
//     const dueDateInput = document.getElementById("dueDate");
//     const dueDateError = document.getElementById("dueDateError");

//     if (dueDateInput.value <= startDate) {
//         dueDateError.style.display = "block";
//         dueDateInput.classList.add("is-invalid");
//         return false;
//     } else {
//         dueDateError.style.display = "none";
//         dueDateInput.classList.remove("is-invalid");
//         return true;
//     }
// }

// function validateReminderDate() {
//     const startDate = document.getElementById("startDate").value;
//     const dueDate = document.getElementById("dueDate").value;
//     const reminderDateInput = document.getElementById("reminderDate");
//     const reminderError = document.getElementById("remainderError");

//     if (reminderDateInput.value < startDate || reminderDateInput.value > dueDate) {
//         reminderError.style.display = "block";
//         reminderDateInput.classList.add("is-invalid");
//         return false;
//     } else {
//         reminderError.style.display = "none";
//         reminderDateInput.classList.remove("is-invalid");
//         return true;
//     }
// }

// function checkFormValidity() {
//     let isValid = true;

//     if (!validateTaskOwner()) isValid = false;
//     if (!validateStartDate()) isValid = false;
//     if (!validateDueDate()) isValid = false;
//     if (!validateReminderDate()) isValid = false;

//     return isValid;
// }


document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("taskForm");
    const submitButton = document.getElementById("submitBtn");

    // Validation for Task Owner (Only letters & spaces)
    function validateTaskOwner() {
        const taskOwnerInput = document.getElementById("taskOwner");
        const errorDiv = document.getElementById("taskOwnerError");
        const regex = /^[A-Za-z\s]+$/;

        if (!regex.test(taskOwnerInput.value.trim())) {
            errorDiv.style.display = "block";
            taskOwnerInput.classList.add("is-invalid");
            return false;
        } else {
            errorDiv.style.display = "none";
            taskOwnerInput.classList.remove("is-invalid");
            return true;
        }
    }

    // Validation for Start Date (Must be today or future)
    function validateStartDate() {
        const startDateInput = document.getElementById("startDate");
        const startDateError = document.getElementById("startDateError");
        const today = new Date().toISOString().split("T")[0];
    
        if (startDateInput.value < today) {
            startDateError.style.display = "block";
            startDateInput.classList.add("is-invalid");
            startDateInput.classList.remove("is-valid"); // Remove green outline
            return false;
        } else {
            startDateError.style.display = "none";
            startDateInput.classList.remove("is-invalid");
            startDateInput.classList.add("is-valid"); // Add green outline only if valid
            return true;
        }
    }
    
    function validateDueDate() {
        const startDate = document.getElementById("startDate").value;
        const dueDateInput = document.getElementById("dueDate");
        const dueDateError = document.getElementById("dueDateError");
    
        if (!dueDateInput.value || dueDateInput.value <= startDate) {
            dueDateError.style.display = "block";
            dueDateInput.classList.add("is-invalid");
            dueDateInput.classList.remove("is-valid"); // Remove green outline
            return false;
        } else {
            dueDateError.style.display = "none";
            dueDateInput.classList.remove("is-invalid");
            dueDateInput.classList.add("is-valid"); // Add green outline only if valid
            return true;
        }
    }
    
    function validateReminderDate() {
        const startDate = document.getElementById("startDate").value;
        const dueDate = document.getElementById("dueDate").value;
        const reminderDateInput = document.getElementById("reminderDate");
        const reminderError = document.getElementById("remainderError");
    
        if (!reminderDateInput.value || reminderDateInput.value < startDate || reminderDateInput.value > dueDate) {
            reminderError.style.display = "block";
            reminderDateInput.classList.add("is-invalid");
            reminderDateInput.classList.remove("is-valid"); // Remove green outline
            return false;
        } else {
            reminderError.style.display = "none";
            reminderDateInput.classList.remove("is-invalid");
            reminderDateInput.classList.add("is-valid"); // Add green outline only if valid
            return true;
        }
    }
    
    // Check full form validity
    function checkFormValidity() {
        let isValid = true;

        if (!validateTaskOwner()) isValid = false;
        if (!validateStartDate()) isValid = false;
        if (!validateDueDate()) isValid = false;
        if (!validateReminderDate()) isValid = false;

        if (!form.checkValidity()) isValid = false;

        if (!isValid) {
            submitButton.setAttribute("disabled", "true"); // Disable button if form is invalid
        } else {
            submitButton.removeAttribute("disabled"); // Enable button if form is valid
        }
    }

    // Handle form submission
    form.addEventListener("submit", function (event) {
        if (!form.checkValidity() || !checkFormValidity()) {
            event.preventDefault();
            event.stopPropagation();
            form.classList.add("was-validated");
            submitButton.setAttribute("disabled", "true"); // Disable button if form is invalid
        } else {
            alert("Form submitted successfully!"); // Simulate form submission
        }
    });

    // Re-enable button when user starts correcting errors
    form.querySelectorAll("input, textarea, select").forEach((field) => {
        field.addEventListener("input", function () {
            checkFormValidity();
        });
    });

    // Reset form and validation
    document.querySelector(".btn-outline-secondary").addEventListener("click", function () {
        form.reset();
        form.classList.remove("was-validated");
        submitButton.removeAttribute("disabled"); // Keep submit button enabled
    });
});

