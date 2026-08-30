// ========================================
// EXPENSEFLOW - MAIN JAVASCRIPT
// ========================================


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

const amountInput =
    document.querySelector("#amount");

const categorySelect =
    document.querySelector("#category");

const descriptionInput =
    document.querySelector("#description");

const typeButtons =
    document.querySelectorAll(".type-btn");


// ========================================
// EDITING STATE
// ========================================

// null = Add mode
// transaction ID = Edit mode

let editingTransactionId = null;


// ========================================
// MODAL TITLE / SUBMIT BUTTON
// ========================================

const modalTitle =
    document.querySelector("#modalTitle") ||
    document.querySelector(".modal-header h2") ||
    document.querySelector("#transactionModal h2");

const submitButton =
    transactionForm?.querySelector(
        'button[type="submit"]'
    );


// ========================================
// SET TODAY'S DATE
// ========================================

const setDefaultDate = () => {

    if (!dateInput) return;

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(today.getDate())
            .padStart(2, "0");

    dateInput.value =
        `${year}-${month}-${day}`;
};


// ========================================
// EXPENSE CATEGORIES
// ========================================

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


// ========================================
// INCOME CATEGORIES
// ========================================

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

    if (!categorySelect) return;

    const categories =
        type === "income"
            ? incomeCategories
            : expenseCategories;

    categorySelect.innerHTML =
        '<option value="">Select category</option>';

    categories.forEach((category) => {

        const option =
            document.createElement("option");

        option.value =
            category.toLowerCase();

        option.textContent =
            category;

        categorySelect.appendChild(option);

    });
};


// ========================================
// SELECT TRANSACTION TYPE
// ========================================

const setTransactionType = (type) => {

    typeButtons.forEach((button) => {

        button.classList.toggle(
            "active",
            button.dataset.type === type
        );

    });

    updateCategories(type);
};


// ========================================
// TYPE BUTTON CLICK
// ========================================

typeButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const selectedType =
            button.dataset.type;

        setTransactionType(selectedType);

    });

});


// ========================================
// RESET MODAL TO ADD MODE
// ========================================

const resetTransactionModal = () => {

    editingTransactionId = null;

    if (transactionForm) {
        transactionForm.reset();
    }

    setTransactionType("expense");

    setDefaultDate();

    if (modalTitle) {
        modalTitle.textContent =
            "Add Transaction";
    }

    if (submitButton) {
        submitButton.textContent =
            "Add Transaction";
    }

};


// ========================================
// OPEN ADD TRANSACTION MODAL
// ========================================

addBtn?.addEventListener("click", () => {

    resetTransactionModal();

    transactionModal?.classList.add("show");

});


// ========================================
// CLOSE MODAL
// ========================================

const closeModal = () => {

    transactionModal?.classList.remove("show");

    resetTransactionModal();

};


// ========================================
// CLOSE BUTTON
// ========================================

closeModalBtn?.addEventListener(
    "click",
    closeModal
);


// ========================================
// CLOSE BACKDROP
// ========================================

transactionModal?.addEventListener(
    "click",
    (event) => {

        if (
            event.target === transactionModal
        ) {
            closeModal();
        }

    }
);


// ========================================
// CLOSE WITH ESCAPE
// ========================================

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            transactionModal?.classList.contains("show")
        ) {
            closeModal();
        }

    }
);


// ========================================
// GET TRANSACTIONS
// ========================================

const getTransactions = () => {

    return JSON.parse(
        localStorage.getItem("transactions")
    ) || [];

};


// ========================================
// SAVE TRANSACTIONS
// ========================================

const saveTransactions = (transactions) => {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

};


// ========================================
// SAVE / UPDATE TRANSACTION
// ========================================

transactionForm?.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        // Selected type

        const activeType =
            document.querySelector(
                ".type-btn.active"
            );

        const type =
            activeType?.dataset.type || "expense";


        // Form values

        const amount =
            Number(amountInput?.value);

        const category =
            categorySelect?.value || "";

        const date =
            dateInput?.value || "";

        const description =
            descriptionInput?.value.trim() || "";


        // Basic validation

        if (
            !amount ||
            amount <= 0 ||
            !category ||
            !date
        ) {

            alert(
                "Please fill all required fields."
            );

            return;

        }


        let transactions =
            getTransactions();


        // ====================================
        // EDIT EXISTING TRANSACTION
        // ====================================

        if (editingTransactionId !== null) {

            transactions =
                transactions.map(
                    (transaction) => {

                        if (
                            transaction.id ===
                            editingTransactionId
                        ) {

                            return {

                                ...transaction,

                                type: type,

                                amount: amount,

                                category: category,

                                date: date,

                                description:
                                    description

                            };

                        }

                        return transaction;

                    }
                );


            saveTransactions(
                transactions
            );


            alert(
                "Transaction updated successfully!"
            );

        }


        // ====================================
        // ADD NEW TRANSACTION
        // ====================================

        else {

            const transaction = {

                id: Date.now(),

                type: type,

                amount: amount,

                category: category,

                date: date,

                description: description

            };


            transactions.push(
                transaction
            );


            saveTransactions(
                transactions
            );


            alert(
                "Transaction added successfully!"
            );

        }


        // Update everything

        closeModal();

        displayTransactions();

        displayAllTransactions();

        updateSummary();

    }
);


// ========================================
// FORMAT CATEGORY
// ========================================

const formatCategory = (category) => {

    if (!category) return "Other";

    return category
        .split(" ")
        .map(
            word =>
                word.charAt(0).toUpperCase() +
                word.slice(1)
        )
        .join(" ");

};


// ========================================
// DISPLAY RECENT TRANSACTIONS
// ========================================

const transactionsList =
    document.querySelector(
        "#transactionsList"
    );


const displayTransactions = () => {

    if (!transactionsList) return;


    const transactions =
        getTransactions();


    transactionsList.innerHTML = "";


    // No transactions

    if (transactions.length === 0) {

        transactionsList.innerHTML = `

            <p class="no-transactions">
                No transactions yet.
            </p>

        `;

        return;

    }


    // Latest 5

    const recentTransactions =
        transactions
            .slice()
            .reverse()
            .slice(0, 5);


    recentTransactions.forEach(
        (transaction) => {

            const transactionElement =
                document.createElement("div");


            transactionElement.classList.add(
                "transaction"
            );


            const isIncome =
                transaction.type === "income";


            const sign =
                isIncome ? "+" : "-";


            const amountClass =
                isIncome
                    ? "income"
                    : "expense";


            transactionElement.innerHTML = `

                <div class="transaction-icon">
                    ${isIncome ? "💰" : "💸"}
                </div>


                <div class="transaction-info">

                    <h3>
                        ${formatCategory(
                            transaction.category
                        )}
                    </h3>

                    <p>
                        ${
                            transaction.description ||
                            "No description"
                        }
                    </p>

                </div>


                <span
                    class="transaction-amount ${amountClass}"
                >
                    ${sign}₹${Number(
                        transaction.amount
                    ).toLocaleString("en-IN")}
                </span>


                <div class="transaction-actions">

                    <button
                        type="button"
                        class="edit-btn"
                        data-id="${transaction.id}"
                        title="Edit"
                    >
                        ✏️
                    </button>

                    <button
                        type="button"
                        class="delete-btn"
                        data-id="${transaction.id}"
                        title="Delete"
                    >
                        🗑️
                    </button>

                </div>

            `;


            transactionsList.appendChild(
                transactionElement
            );

        }
    );

};


// ========================================
// UPDATE MONTHLY SUMMARY
// ========================================

const updateSummary = () => {

    const transactions =
        getTransactions();


    const today =
        new Date();


    const currentMonth =
        today.getMonth();


    const currentYear =
        today.getFullYear();


    let totalIncome = 0;

    let totalExpenses = 0;


    transactions.forEach(
        (transaction) => {

            if (!transaction.date) return;


            // YYYY-MM-DD ko safely parse karna

            const parts =
                transaction.date.split("-");


            if (parts.length !== 3) return;


            const transactionYear =
                Number(parts[0]);


            const transactionMonth =
                Number(parts[1]) - 1;


            // Current month only

            if (
                transactionYear === currentYear &&
                transactionMonth === currentMonth
            ) {

                const amount =
                    Number(transaction.amount) || 0;


                if (
                    transaction.type ===
                    "income"
                ) {

                    totalIncome += amount;

                }


                if (
                    transaction.type ===
                    "expense"
                ) {

                    totalExpenses += amount;

                }

            }

        }
    );


    const totalBalance =
        totalIncome - totalExpenses;


    const balanceElement =
        document.querySelector(
            "#totalBalance"
        );


    const incomeElement =
        document.querySelector(
            "#totalIncome"
        );


    const expenseElement =
        document.querySelector(
            "#totalExpenses"
        );


    if (balanceElement) {

        balanceElement.textContent =
            `₹${totalBalance.toLocaleString(
                "en-IN"
            )}`;

    }


    if (incomeElement) {

        incomeElement.textContent =
            `₹${totalIncome.toLocaleString(
                "en-IN"
            )}`;

    }


    if (expenseElement) {

        expenseElement.textContent =
            `₹${totalExpenses.toLocaleString(
                "en-IN"
            )}`;

    }

};


// ========================================
// EDIT TRANSACTION
// ========================================

const editTransaction = (id) => {

    const transactions =
        getTransactions();


    const transaction =
        transactions.find(
            (item) =>
                item.id === id
        );


    if (!transaction) return;


    editingTransactionId =
        transaction.id;


    // Set transaction type

    setTransactionType(
        transaction.type
    );


    // Fill form

    if (amountInput) {

        amountInput.value =
            transaction.amount;

    }


    if (categorySelect) {

        categorySelect.value =
            transaction.category;

    }


    if (dateInput) {

        dateInput.value =
            transaction.date;

    }


    if (descriptionInput) {

        descriptionInput.value =
            transaction.description || "";

    }


    // Change modal text

    if (modalTitle) {

        modalTitle.textContent =
            "Edit Transaction";

    }


    if (submitButton) {

        submitButton.textContent =
            "Save Changes";

    }


    // Open modal

    transactionModal?.classList.add(
        "show"
    );

};


// ========================================
// DELETE TRANSACTION
// ========================================

const deleteTransaction = (id) => {

    const transactions =
        getTransactions();


    const transaction =
        transactions.find(
            (item) =>
                item.id === id
        );


    if (!transaction) return;


    const confirmed =
        confirm(
            "Are you sure you want to delete this transaction?"
        );


    if (!confirmed) return;


    const updatedTransactions =
        transactions.filter(
            (item) =>
                item.id !== id
        );


    saveTransactions(
        updatedTransactions
    );


    // Update UI

    displayTransactions();

    displayAllTransactions();

    updateSummary();

};


// ========================================
// EDIT / DELETE CLICK HANDLER
// ========================================

document.addEventListener(
    "click",
    (event) => {


        // Edit

        const editBtn =
            event.target.closest(
                ".edit-btn"
            );


        if (editBtn) {

            const id =
                Number(
                    editBtn.dataset.id
                );


            editTransaction(id);

            return;

        }


        // Delete

        const deleteBtn =
            event.target.closest(
                ".delete-btn"
            );


        if (deleteBtn) {

            const id =
                Number(
                    deleteBtn.dataset.id
                );


            deleteTransaction(id);

            return;

        }

    }
);


// ========================================
// VIEW ALL TRANSACTIONS
// ========================================

const viewAllBtn =
    document.querySelector(
        "#viewAllTransactions"
    );


const allTransactionsModal =
    document.querySelector(
        "#allTransactionsModal"
    );


const closeAllTransactions =
    document.querySelector(
        "#closeAllTransactions"
    );


const allTransactionsList =
    document.querySelector(
        "#allTransactionsList"
    );


// ========================================
// DISPLAY ALL TRANSACTIONS
// ========================================

const displayAllTransactions = () => {

    if (!allTransactionsList) return;


    const transactions =
        getTransactions();


    allTransactionsList.innerHTML = "";


    if (transactions.length === 0) {

        allTransactionsList.innerHTML = `

            <p class="no-transactions">
                No transactions yet.
            </p>

        `;

        return;

    }


    transactions
        .slice()
        .reverse()
        .forEach(
            (transaction) => {


                const isIncome =
                    transaction.type === "income";


                const sign =
                    isIncome ? "+" : "-";


                const amountClass =
                    isIncome
                        ? "income"
                        : "expense";


                const transactionElement =
                    document.createElement("div");


                transactionElement.classList.add(
                    "transaction"
                );


                transactionElement.innerHTML = `

                    <div class="transaction-icon">
                        ${isIncome ? "💰" : "💸"}
                    </div>


                    <div class="transaction-info">

                        <h3>
                            ${formatCategory(
                                transaction.category
                            )}
                        </h3>

                        <p>
                            ${
                                transaction.description ||
                                "No description"
                            }
                            • ${transaction.date}
                        </p>

                    </div>


                    <span
                        class="transaction-amount ${amountClass}"
                    >
                        ${sign}₹${Number(
                            transaction.amount
                        ).toLocaleString("en-IN")}
                    </span>


                    <div class="transaction-actions">

                        <button
                            type="button"
                            class="edit-btn"
                            data-id="${transaction.id}"
                            title="Edit"
                        >
                            ✏️
                        </button>

                        <button
                            type="button"
                            class="delete-btn"
                            data-id="${transaction.id}"
                            title="Delete"
                        >
                            🗑️
                        </button>

                    </div>

                `;


                allTransactionsList.appendChild(
                    transactionElement
                );

            }
        );

};


// ========================================
// OPEN VIEW ALL
// ========================================

viewAllBtn?.addEventListener(
    "click",
    (event) => {

        event.preventDefault();

        displayAllTransactions();

        allTransactionsModal?.classList.add(
            "show"
        );

    }
);


// ========================================
// CLOSE VIEW ALL
// ========================================

closeAllTransactions?.addEventListener(
    "click",
    () => {

        allTransactionsModal?.classList.remove(
            "show"
        );

    }
);


// ========================================
// CLOSE VIEW ALL BACKDROP
// ========================================

allTransactionsModal?.addEventListener(
    "click",
    (event) => {

        if (
            event.target ===
            allTransactionsModal
        ) {

            allTransactionsModal.classList.remove(
                "show"
            );

        }

    }
);


// ========================================
// INITIALIZE DASHBOARD
// ========================================

// Important:
// Page refresh ke baad bhi summary
// aur transactions immediately load honge.

displayTransactions();

updateSummary();


// ========================================
// DEFAULT EXPENSE CATEGORY
// ========================================

setTransactionType("expense");