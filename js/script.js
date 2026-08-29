// ========================================
// NAVBAR MOBILE MENU
// ========================================

const menuBtn = document.querySelector(".menu-btn");
const navMenu = document.querySelector(".nav-menu");

menuBtn?.addEventListener("click", () => {

    navMenu?.classList.toggle("menu-open");

    menuBtn?.classList.toggle("menu-open");

});


// ========================================
// DYNAMIC GREETING
// ========================================

const greeting = document.querySelector("#greeting");

if (greeting) {

    const hour = new Date().getHours();

    if (hour < 12) {

        greeting.textContent = "Good Morning 👋";

    } else if (hour < 17) {

        greeting.textContent = "Good Afternoon ☀️";

    } else {

        greeting.textContent = "Good Evening 🌙";

    }

}


// ========================================
// TRANSACTION MODAL
// ========================================

const transactionModal =
    document.querySelector("#transactionModal");

const addBtn =
    document.querySelector(".add-btn");

const closeModalBtn =
    document.querySelector("#closeModal");

const transactionForm =
    document.querySelector("#transactionForm");

const dateInput =
    document.querySelector("#date");


// ========================================
// SET TODAY'S DATE
// ========================================

const setDefaultDate = () => {

    if (dateInput) {

        const today =
            new Date().toISOString().split("T")[0];

        dateInput.value = today;

    }

};


// ========================================
// OPEN MODAL
// ========================================

addBtn?.addEventListener("click", () => {

    transactionModal?.classList.add("show");

    setDefaultDate();

});


// ========================================
// CLOSE MODAL FUNCTION
// ========================================

const closeModal = () => {

    transactionModal?.classList.remove("show");

    transactionForm?.reset();

};


// ========================================
// CLOSE WITH X BUTTON
// ========================================

closeModalBtn?.addEventListener("click", closeModal);


// ========================================
// CLOSE WITH BACKDROP
// ========================================

transactionModal?.addEventListener("click", (event) => {

    if (event.target === transactionModal) {

        closeModal();

    }

});


// ========================================
// CLOSE WITH ESCAPE KEY
// ========================================

document.addEventListener("keydown", (event) => {

    if (
        event.key === "Escape" &&
        transactionModal?.classList.contains("show")
    ) {

        closeModal();

    }

});



// ========================================
// EXPENSE / INCOME TOGGLE
// ========================================

const typeButtons = document.querySelectorAll(".type-btn");
const categorySelect = document.querySelector("#category");


// Expense Categories

const expenseCategories = [
    "Food",
    "Shopping",
    "Transport",
    "Bills & Utilities",
    "Health",
    "Education",
    "Entertainment",
    "Travel",
    "Rent",
    "Other"
];


// Income Categories

const incomeCategories = [
    "Salary",
    "Freelance",
    "Business",
    "Investment",
    "Bonus",
    "Gift",
    "Interest",
    "Other"
];


// ========================================
// UPDATE CATEGORIES
// ========================================

const updateCategories = (type) => {

    const categories =
        type === "income"
            ? incomeCategories
            : expenseCategories;


    categorySelect.innerHTML =
        '<option value="">Select category</option>';


    categories.forEach((category) => {

        const option = document.createElement("option");

        option.value = category.toLowerCase();

        option.textContent = category;

        categorySelect.appendChild(option);

    });

};


// ========================================
// TYPE BUTTON CLICK
// ========================================

typeButtons.forEach((button) => {

    button.addEventListener("click", () => {

        // Remove active class

        typeButtons.forEach((btn) => {
            btn.classList.remove("active");
        });


        // Add active class

        button.classList.add("active");


        // Get selected type

        const selectedType =
            button.dataset.type;


        // Update categories

        updateCategories(selectedType);

    });

});


// ========================================
// DEFAULT CATEGORY
// ========================================

updateCategories("expense");
// ========================================
// SAVE TRANSACTION
// ========================================

transactionForm?.addEventListener("submit", (event) => {

    // Page reload ko rokna
    event.preventDefault();


    // Selected transaction type
    const activeType =
        document.querySelector(".type-btn.active");


    const type =
        activeType.dataset.type;


    // Form values
    const amount =
        Number(document.querySelector("#amount").value);

    const category =
        document.querySelector("#category").value;

    const date =
        document.querySelector("#date").value;

    const description =
        document.querySelector("#description").value.trim();


    // Create transaction object
    const transaction = {

        id: Date.now(),

        type: type,

        amount: amount,

        category: category,

        date: date,

        description: description

    };


    // Get old transactions
    const transactions =
        JSON.parse(
            localStorage.getItem("transactions")
        ) || [];


    // Add new transaction
    transactions.push(transaction);


    // Save updated transactions
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );


    // Success message
    alert("Transaction added successfully!");


    // Close modal
    closeModal();

});