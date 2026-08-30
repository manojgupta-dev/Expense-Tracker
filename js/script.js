// ========================================
// EXPENSEFLOW - FINAL JAVASCRIPT
// ========================================


// ========================================
// 1. SELECT ELEMENTS
// ========================================

const menuBtn = document.querySelector("#menuBtn");
const navMenu = document.querySelector("#navMenu");

const greeting = document.querySelector("#greeting");
const currentDate = document.querySelector("#currentDate");

const addTransactionBtn =
    document.querySelector("#addTransactionBtn");

const transactionModal =
    document.querySelector("#transactionModal");

const closeModal =
    document.querySelector("#closeModal");

const cancelModal =
    document.querySelector("#cancelModal");

const transactionForm =
    document.querySelector("#transactionForm");

const transactionType =
    document.querySelector("#transactionType");

const typeButtons =
    document.querySelectorAll(".type-btn");

const amountInput =
    document.querySelector("#amount");

const categoryInput =
    document.querySelector("#category");

const dateInput =
    document.querySelector("#date");

const descriptionInput =
    document.querySelector("#description");

const notesInput =
    document.querySelector("#notes");

const totalBalance =
    document.querySelector("#totalBalance");

const totalIncome =
    document.querySelector("#totalIncome");

const totalExpense =
    document.querySelector("#totalExpense");

const totalSavings =
    document.querySelector("#totalSavings");

const recentTransactions =
    document.querySelector("#recentTransactions");

const allTransactions =
    document.querySelector("#allTransactions");

const viewAllBtn =
    document.querySelector("#viewAllBtn");

const allTransactionsSection =
    document.querySelector("#allTransactionsSection");

const searchTransaction =
    document.querySelector("#searchTransaction");

const typeFilter =
    document.querySelector("#typeFilter");

const categoryFilter =
    document.querySelector("#categoryFilter");

const dateFilter =
    document.querySelector("#dateFilter");

const overviewFilter =
    document.querySelector("#overviewFilter");

const categoryOverview =
    document.querySelector("#categoryOverview");


// Reports

const reportFilter =
    document.querySelector("#reportFilter");

const monthFilter =
    document.querySelector("#monthFilter");

const yearFilter =
    document.querySelector("#yearFilter");

const reportIncome =
    document.querySelector("#reportIncome");

const reportExpense =
    document.querySelector("#reportExpense");

const reportSavings =
    document.querySelector("#reportSavings");

const reportTransactionCount =
    document.querySelector("#reportTransactionCount");

const chartIncome =
    document.querySelector("#chartIncome");

const chartExpense =
    document.querySelector("#chartExpense");

const incomeBar =
    document.querySelector("#incomeBar");

const expenseBar =
    document.querySelector("#expenseBar");

const dailySpending =
    document.querySelector("#dailySpending");

const insightsList =
    document.querySelector("#insightsList");


// Delete Modal

const deleteModal =
    document.querySelector("#deleteModal");

const cancelDelete =
    document.querySelector("#cancelDelete");

const confirmDelete =
    document.querySelector("#confirmDelete");


// Toast

const toast =
    document.querySelector("#toast");

const toastMessage =
    document.querySelector("#toastMessage");


// ========================================
// 2. APPLICATION STATE
// ========================================

let transactions = [];

let editingTransactionId = null;

let deletingTransactionId = null;


// ========================================
// 3. LOAD DATA FROM LOCAL STORAGE
// ========================================

function loadTransactions() {

    const savedTransactions =
        localStorage.getItem("expenseflow_transactions");

    if (savedTransactions) {

        try {

            transactions =
                JSON.parse(savedTransactions);

        } catch (error) {

            console.error(
                "Could not load transactions:",
                error
            );

            transactions = [];
        }

    } else {

        transactions = [];

    }
}


// ========================================
// 4. SAVE DATA
// ========================================

function saveTransactions() {

    localStorage.setItem(
        "expenseflow_transactions",
        JSON.stringify(transactions)
    );
}


// ========================================
// 5. FORMAT MONEY
// ========================================

function formatMoney(amount) {

    return new Intl.NumberFormat("en-IN", {

        style: "currency",

        currency: "INR",

        maximumFractionDigits: 0

    }).format(amount);

}


// ========================================
// 6. FORMAT DATE
// ========================================

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-IN", {

        day: "2-digit",

        month: "short",

        year: "numeric"

    });

}


// ========================================
// 7. GET TODAY DATE
// ========================================

function getTodayString() {

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(today.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// ========================================
// 8. DEFAULT DATE
// ========================================

function setDefaultDate() {

    if (dateInput) {

        dateInput.value =
            getTodayString();

    }
}


// ========================================
// 9. GREETING
// ========================================

function updateGreeting() {

    if (!greeting) {
        return;
    }

    const hour =
        new Date().getHours();

    if (hour < 12) {

        greeting.textContent =
            "Good Morning 👋";

    } else if (hour < 17) {

        greeting.textContent =
            "Good Afternoon ☀️";

    } else {

        greeting.textContent =
            "Good Evening 🌙";

    }
}


// ========================================
// 10. CURRENT DATE
// ========================================

function updateCurrentDate() {

    if (!currentDate) {
        return;
    }

    const today = new Date();

    currentDate.textContent =
        today.toLocaleDateString("en-IN", {

            weekday: "long",

            day: "numeric",

            month: "long",

            year: "numeric"

        });
}


// ========================================
// 11. MOBILE MENU
// ========================================

menuBtn?.addEventListener("click", () => {

    navMenu?.classList.toggle("menu-open");

    menuBtn?.classList.toggle("menu-open");

    const isOpen =
        navMenu?.classList.contains("menu-open");

    menuBtn?.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
    );

});


// Close mobile menu after clicking link

document
    .querySelectorAll(".nav-links a")
    .forEach(link => {

        link.addEventListener("click", () => {

            navMenu?.classList.remove("menu-open");

            menuBtn?.classList.remove("menu-open");

            menuBtn?.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });


// ========================================
// 12. OPEN MODAL
// ========================================

function openTransactionModal(transaction = null) {

    if (!transactionModal) {
        return;
    }

    transactionModal.classList.add("show");

    transactionModal.setAttribute(
        "aria-hidden",
        "false"
    );


    if (transaction) {

        // EDIT MODE

        editingTransactionId =
            transaction.id;

        document.querySelector("#modalTitle")
            .textContent =
            "Edit Transaction";

        amountInput.value =
            transaction.amount;

        dateInput.value =
            transaction.date;

        descriptionInput.value =
            transaction.description || "";

        notesInput.value =
            transaction.notes || "";

        setTransactionType(
            transaction.type
        );

        setCategoryForType(
            transaction.type,
            transaction.category
        );

    } else {

        // ADD MODE

        editingTransactionId = null;

        document.querySelector("#modalTitle")
            .textContent =
            "Add Transaction";

        transactionForm?.reset();

        setTransactionType("expense");

        setDefaultDate();

    }

}


// ========================================
// 13. CLOSE MODAL
// ========================================

function closeTransactionModal() {

    transactionModal?.classList.remove("show");

    transactionModal?.setAttribute(
        "aria-hidden",
        "true"
    );

    transactionForm?.reset();

    editingTransactionId = null;

    setTransactionType("expense");

    setDefaultDate();

}


// Add button

addTransactionBtn?.addEventListener(
    "click",
    () => {

        openTransactionModal();

    }
);


// Close button

closeModal?.addEventListener(
    "click",
    closeTransactionModal
);


// Cancel button

cancelModal?.addEventListener(
    "click",
    closeTransactionModal
);


// Click outside modal

transactionModal?.addEventListener(
    "click",
    event => {

        if (
            event.target === transactionModal
        ) {

            closeTransactionModal();

        }

    }
);


// ========================================
// 14. ESCAPE KEY
// ========================================

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }

        if (
            transactionModal?.classList
                .contains("show")
        ) {

            closeTransactionModal();

        }

        if (
            deleteModal?.classList
                .contains("show")
        ) {

            closeDeleteModal();

        }

    }
);


// ========================================
// 15. TRANSACTION TYPE
// ========================================

function setTransactionType(type) {

    transactionType.value = type;


    typeButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.type === type
        );

    });


    setCategoryForType(type);

}


// Type button click

typeButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const type =
                button.dataset.type;

            setTransactionType(type);

        }
    );

});


// ========================================
// 16. CATEGORY MANAGEMENT
// ========================================

const expenseCategories = [

    "Food",
    "Transport",
    "Bills",
    "Shopping",
    "Education",
    "Entertainment",
    "Health",
    "Travel",
    "Other"

];

const incomeCategories = [

    "Salary",
    "Freelance",
    "Business",
    "Scholarship",
    "Gift",
    "Other Income"

];


function setCategoryForType(
    type,
    selectedCategory = null
) {

    if (!categoryInput) {
        return;
    }

    categoryInput.innerHTML = "";


    const categories =
        type === "income"
            ? incomeCategories
            : expenseCategories;


    categories.forEach(category => {

        const option =
            document.createElement("option");

        option.value = category;

        option.textContent = category;

        categoryInput.appendChild(option);

    });


    if (selectedCategory) {

        categoryInput.value =
            selectedCategory;

    }

}


// ========================================
// 17. CREATE TRANSACTION
// ========================================

function createTransaction() {

    const amount =
        Number(amountInput.value);

    const type =
        transactionType.value;

    const category =
        categoryInput.value;

    const date =
        dateInput.value;

    const description =
        descriptionInput.value.trim();

    const notes =
        notesInput.value.trim();


    if (!amount || amount <= 0) {

        showToast(
            "Please enter a valid amount.",
            "error"
        );

        return null;
    }


    if (!category) {

        showToast(
            "Please select a category.",
            "error"
        );

        return null;
    }


    if (!date) {

        showToast(
            "Please select a date.",
            "error"
        );

        return null;
    }


    return {

        id:
            Date.now().toString(),

        type,

        amount,

        category,

        date,

        description:
            description ||
            category,

        notes,

        createdAt:
            new Date().toISOString()

    };

}


// ========================================
// 18. FORM SUBMIT
// ========================================

transactionForm?.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        // EDIT

        if (editingTransactionId) {

            const index =
                transactions.findIndex(
                    transaction =>
                        transaction.id ===
                        editingTransactionId
                );


            if (index !== -1) {

                const updatedTransaction = {

                    ...transactions[index],

                    type:
                        transactionType.value,

                    amount:
                        Number(amountInput.value),

                    category:
                        categoryInput.value,

                    date:
                        dateInput.value,

                    description:
                        descriptionInput.value.trim() ||
                        categoryInput.value,

                    notes:
                        notesInput.value.trim()

                };


                transactions[index] =
                    updatedTransaction;


                saveTransactions();

                renderEverything();

                closeTransactionModal();

                showToast(
                    "Transaction updated successfully."
                );

            }

            return;
        }


        // ADD

        const transaction =
            createTransaction();


        if (!transaction) {
            return;
        }


        transactions.push(transaction);

        saveTransactions();

        renderEverything();

        closeTransactionModal();

        showToast(
            "Transaction added successfully."
        );

    }
);


// ========================================
// 19. CALCULATE SUMMARY
// ========================================

function calculateSummary(
    transactionList = transactions
) {

    let income = 0;

    let expense = 0;


    transactionList.forEach(transaction => {

        if (transaction.type === "income") {

            income += Number(transaction.amount);

        } else {

            expense += Number(transaction.amount);

        }

    });


    return {

        income,

        expense,

        balance:
            income - expense,

        savings:
            income - expense

    };

}


// ========================================
// 20. UPDATE DASHBOARD SUMMARY
// ========================================

function updateDashboardSummary() {

    const currentMonth =
        new Date().getMonth();

    const currentYear =
        new Date().getFullYear();


    const monthlyTransactions =
        transactions.filter(transaction => {

            const date =
                new Date(
                    transaction.date + "T00:00:00"
                );

            return (

                date.getMonth() === currentMonth &&

                date.getFullYear() === currentYear

            );

        });


    const summary =
        calculateSummary(
            monthlyTransactions
        );


    if (totalIncome) {

        totalIncome.textContent =
            formatMoney(summary.income);

    }


    if (totalExpense) {

        totalExpense.textContent =
            formatMoney(summary.expense);

    }


    if (totalSavings) {

        totalSavings.textContent =
            formatMoney(summary.savings);

    }


    // Balance = all-time balance

    const allSummary =
        calculateSummary(transactions);


    if (totalBalance) {

        totalBalance.textContent =
            formatMoney(allSummary.balance);

    }

}


// ========================================
// 21. TRANSACTION ICON
// ========================================

function getCategoryIcon(category) {

    const icons = {

        Food: "🍔",

        Transport: "🚗",

        Bills: "🧾",

        Shopping: "🛍️",

        Education: "📚",

        Entertainment: "🎬",

        Health: "❤️",

        Travel: "✈️",

        Salary: "💼",

        Freelance: "💻",

        Business: "🏢",

        Scholarship: "🎓",

        Gift: "🎁",

        "Other Income": "💰",

        Other: "📦"

    };


    return icons[category] || "💰";

}


// ========================================
// 22. CREATE TRANSACTION HTML
// ========================================

function createTransactionHTML(
    transaction,
    showActions = false
) {

    const amount =
        Number(transaction.amount);


    const sign =
        transaction.type === "income"
            ? "+"
            : "-";


    const amountClass =
        transaction.type === "income"
            ? "income"
            : "expense";


    return `

        <div
            class="transaction"
            data-id="${transaction.id}"
        >

            <div class="transaction-icon">

                ${getCategoryIcon(
                    transaction.category
                )}

            </div>


            <div class="transaction-info">

                <h3>
                    ${escapeHTML(
                        transaction.description ||
                        transaction.category
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        transaction.category
                    )}
                    •
                    ${formatDate(
                        transaction.date
                    )}
                </p>

            </div>


            <span
                class="transaction-amount ${amountClass}"
            >

                ${sign}${formatMoney(amount)}

            </span>


            ${
                showActions
                    ? `

                    <div class="transaction-actions">

                        <button
                            class="edit-btn"
                            onclick="editTransaction('${transaction.id}')"
                        >
                            ✏️
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteTransaction('${transaction.id}')"
                        >
                            🗑️
                        </button>

                    </div>

                    `
                    : ""
            }

        </div>

    `;

}


// ========================================
// 23. ESCAPE HTML
// ========================================

function escapeHTML(value) {

    return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// ========================================
// 24. SORT TRANSACTIONS
// ========================================

function sortTransactions(list) {

    return [...list].sort(
        (a, b) => {

            const dateDifference =
                new Date(b.date) -
                new Date(a.date);


            if (dateDifference !== 0) {

                return dateDifference;

            }


            return (
                Number(b.createdAt || 0) -
                Number(a.createdAt || 0)
            );

        }
    );

}


// ========================================
// 25. RECENT TRANSACTIONS
// ========================================

function renderRecentTransactions() {

    if (!recentTransactions) {
        return;
    }


    const sorted =
        sortTransactions(transactions);


    const recent =
        sorted.slice(0, 5);


    if (recent.length === 0) {

        recentTransactions.innerHTML = `

            <div class="empty-state">

                <span>🧾</span>

                <p>
                    No transactions yet.
                </p>

                <small>
                    Add your first transaction.
                </small>

            </div>

        `;

        return;

    }


    recentTransactions.innerHTML =
        recent
            .map(transaction =>
                createTransactionHTML(
                    transaction,
                    false
                )
            )
            .join("");

}


// ========================================
// 26. FILTER TRANSACTIONS
// ========================================

function getFilteredTransactions() {

    let filtered =
        [...transactions];


    // Search

    const search =
        searchTransaction?.value
            .trim()
            .toLowerCase();


    if (search) {

        filtered =
            filtered.filter(transaction => {

                return (

                    transaction.description
                        ?.toLowerCase()
                        .includes(search)

                    ||

                    transaction.category
                        ?.toLowerCase()
                        .includes(search)

                    ||

                    transaction.notes
                        ?.toLowerCase()
                        .includes(search)

                );

            });

    }


    // Type

    const selectedType =
        typeFilter?.value;


    if (
        selectedType &&
        selectedType !== "all"
    ) {

        filtered =
            filtered.filter(
                transaction =>
                    transaction.type ===
                    selectedType
            );

    }


    // Category

    const selectedCategory =
        categoryFilter?.value;


    if (
        selectedCategory &&
        selectedCategory !== "all"
    ) {

        filtered =
            filtered.filter(
                transaction =>
                    transaction.category ===
                    selectedCategory
            );

    }


    // Date

    const selectedDate =
        dateFilter?.value;


    if (
        selectedDate &&
        selectedDate !== "all"
    ) {

        filtered =
            filtered.filter(
                transaction =>
                    matchesDateFilter(
                        transaction.date,
                        selectedDate
                    )
            );

    }


    return sortTransactions(filtered);

}


// ========================================
// 27. DATE FILTER
// ========================================

function matchesDateFilter(
    dateString,
    filter
) {

    const transactionDate =
        new Date(
            dateString + "T00:00:00"
        );


    const now =
        new Date();


    if (filter === "today") {

        return (
            transactionDate.toDateString() ===
            now.toDateString()
        );

    }


    if (filter === "week") {

        const day =
            now.getDay();

        const diff =
            day === 0 ? 6 : day - 1;

        const start =
            new Date(now);

        start.setHours(0, 0, 0, 0);

        start.setDate(
            now.getDate() - diff
        );


        return transactionDate >= start;

    }


    if (filter === "month") {

        return (

            transactionDate.getMonth() ===
            now.getMonth()

            &&

            transactionDate.getFullYear() ===
            now.getFullYear()

        );

    }


    if (filter === "year") {

        return (
            transactionDate.getFullYear() ===
            now.getFullYear()
        );

    }


    return true;

}


// ========================================
// 28. CATEGORY FILTER OPTIONS
// ========================================

function updateCategoryFilter() {

    if (!categoryFilter) {
        return;
    }


    const currentValue =
        categoryFilter.value;


    const categories =
        [...new Set(
            transactions.map(
                transaction =>
                    transaction.category
            )
        )]
        .sort();


    categoryFilter.innerHTML = `

        <option value="all">
            All Categories
        </option>

    `;


    categories.forEach(category => {

        const option =
            document.createElement("option");

        option.value = category;

        option.textContent = category;

        categoryFilter.appendChild(option);

    });


    if (
        categories.includes(currentValue)
    ) {

        categoryFilter.value =
            currentValue;

    }

}


// ========================================
// 29. RENDER ALL TRANSACTIONS
// ========================================

function renderAllTransactions() {

    if (!allTransactions) {
        return;
    }


    const filtered =
        getFilteredTransactions();


    if (filtered.length === 0) {

        allTransactions.innerHTML = `

            <div class="empty-state">

                <span>🔍</span>

                <p>
                    No transactions found.
                </p>

            </div>

        `;

        return;

    }


    allTransactions.innerHTML =
        filtered
            .map(transaction =>
                createTransactionHTML(
                    transaction,
                    true
                )
            )
            .join("");

}


// ========================================
// 30. EDIT TRANSACTION
// ========================================

function editTransaction(id) {

    const transaction =
        transactions.find(
            item => item.id === id
        );


    if (!transaction) {
        return;
    }


    openTransactionModal(transaction);

}


// Make function available to inline HTML

window.editTransaction =
    editTransaction;


// ========================================
// 31. DELETE TRANSACTION
// ========================================

function deleteTransaction(id) {

    deletingTransactionId = id;

    deleteModal?.classList.add("show");

    deleteModal?.setAttribute(
        "aria-hidden",
        "false"
    );

}


window.deleteTransaction =
    deleteTransaction;


// ========================================
// 32. CLOSE DELETE MODAL
// ========================================

function closeDeleteModal() {

    deleteModal?.classList.remove("show");

    deleteModal?.setAttribute(
        "aria-hidden",
        "true"
    );

    deletingTransactionId = null;

}


cancelDelete?.addEventListener(
    "click",
    closeDeleteModal
);


// ========================================
// 33. CONFIRM DELETE
// ========================================

confirmDelete?.addEventListener(
    "click",
    () => {

        if (!deletingTransactionId) {
            return;
        }


        transactions =
            transactions.filter(
                transaction =>
                    transaction.id !==
                    deletingTransactionId
            );


        saveTransactions();

        renderEverything();

        closeDeleteModal();

        showToast(
            "Transaction deleted successfully."
        );

    }
);


// Click outside delete modal

deleteModal?.addEventListener(
    "click",
    event => {

        if (
            event.target === deleteModal
        ) {

            closeDeleteModal();

        }

    }
);


// ========================================
// 34. REPORT PERIOD
// ========================================

function getReportTransactions() {

    const period =
        reportFilter?.value || "month";


    const selectedMonth =
        Number(monthFilter?.value);


    const selectedYear =
        Number(yearFilter?.value);


    return transactions.filter(
        transaction => {

            const date =
                new Date(
                    transaction.date +
                    "T00:00:00"
                );


            if (period === "year") {

                return (
                    date.getFullYear() ===
                    selectedYear
                );

            }


            if (period === "month") {

                return (

                    date.getMonth() ===
                    selectedMonth

                    &&

                    date.getFullYear() ===
                    selectedYear

                );

            }


            if (period === "week") {

                return matchesDateFilter(
                    transaction.date,
                    "week"
                );

            }


            return true;

        }
    );

}


// ========================================
// 35. POPULATE MONTH FILTER
// ========================================

function populateMonthFilter() {

    if (!monthFilter) {
        return;
    }


    const months = [

        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"

    ];


    const currentMonth =
        new Date().getMonth();


    monthFilter.innerHTML = "";


    months.forEach(
        (month, index) => {

            const option =
                document.createElement("option");

            option.value = index;

            option.textContent = month;

            if (index === currentMonth) {

                option.selected = true;

            }

            monthFilter.appendChild(option);

        }
    );

}


// ========================================
// 36. POPULATE YEAR FILTER
// ========================================

function populateYearFilter() {

    if (!yearFilter) {
        return;
    }


    const currentYear =
        new Date().getFullYear();


    yearFilter.innerHTML = "";


    for (
        let year = currentYear;
        year >= currentYear - 5;
        year--
    ) {

        const option =
            document.createElement("option");

        option.value = year;

        option.textContent = year;

        yearFilter.appendChild(option);

    }

}


// ========================================
// 37. REPORT FILTER
// ========================================

function updateReportFilters() {

    const period =
        reportFilter?.value;


    if (!monthFilter || !yearFilter) {
        return;
    }


    if (period === "year") {

        monthFilter.style.display =
            "none";

    } else {

        monthFilter.style.display =
            "";

    }


    if (period === "week") {

        monthFilter.style.display =
            "none";

        yearFilter.style.display =
            "none";

    } else {

        yearFilter.style.display =
            "";

    }

}


// ========================================
// 38. RENDER REPORT
// ========================================

function renderReport() {

    const reportTransactions =
        getReportTransactions();


    const summary =
        calculateSummary(
            reportTransactions
        );


    if (reportIncome) {

        reportIncome.textContent =
            formatMoney(summary.income);

    }


    if (reportExpense) {

        reportExpense.textContent =
            formatMoney(summary.expense);

    }


    if (reportSavings) {

        reportSavings.textContent =
            formatMoney(summary.savings);

    }


    if (reportTransactionCount) {

        reportTransactionCount.textContent =
            reportTransactions.length;

    }


    updateIncomeExpenseChart(
        summary.income,
        summary.expense
    );


    renderDailySpending(
        reportTransactions
    );


    renderInsights(
        reportTransactions
    );

}


// ========================================
// 39. INCOME VS EXPENSE CHART
// ========================================

function updateIncomeExpenseChart(
    income,
    expense
) {

    const max =
        Math.max(income, expense, 1);


    const incomePercentage =
        (income / max) * 100;


    const expensePercentage =
        (expense / max) * 100;


    if (chartIncome) {

        chartIncome.textContent =
            formatMoney(income);

    }


    if (chartExpense) {

        chartExpense.textContent =
            formatMoney(expense);

    }


    if (incomeBar) {

        incomeBar.style.width =
            `${incomePercentage}%`;

    }


    if (expenseBar) {

        expenseBar.style.width =
            `${expensePercentage}%`;

    }

}


// ========================================
// 40. EXPENSE OVERVIEW
// ========================================

function getOverviewTransactions() {

    const filter =
        overviewFilter?.value ||
        "month";


    return transactions.filter(
        transaction => {

            if (transaction.type !== "expense") {

                return false;

            }


            return matchesDateFilter(
                transaction.date,
                filter
            );

        }
    );

}


function renderExpenseOverview() {

    if (!categoryOverview) {
        return;
    }


    const expenses =
        getOverviewTransactions();


    if (expenses.length === 0) {

        categoryOverview.innerHTML = `

            <div class="empty-state">

                <span>📊</span>

                <p>
                    No expense data available.
                </p>

            </div>

        `;

        return;

    }


    const categoryTotals = {};


    expenses.forEach(transaction => {

        const category =
            transaction.category;


        categoryTotals[category] =
            (categoryTotals[category] || 0)
            +
            Number(transaction.amount);

    });


    const sorted =
        Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1]);


    const total =
        expenses.reduce(
            (sum, transaction) =>
                sum +
                Number(transaction.amount),
            0
        );


    categoryOverview.innerHTML =
        sorted
            .map(
                ([category, amount]) => {

                    const percentage =
                        (amount / total) * 100;


                    return `

                        <div class="category-item">

                            <div class="category-header">

                                <span>
                                    ${getCategoryIcon(category)}
                                    ${escapeHTML(category)}
                                </span>

                                <strong>
                                    ${formatMoney(amount)}
                                </strong>

                            </div>


                            <div class="category-track">

                                <div
                                    class="category-bar"
                                    style="width:${percentage}%"
                                >
                                </div>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}


// ========================================
// 41. DAILY SPENDING
// ========================================

function renderDailySpending(
    reportTransactions
) {

    if (!dailySpending) {
        return;
    }


    const expenses =
        reportTransactions.filter(
            transaction =>
                transaction.type ===
                "expense"
        );


    if (expenses.length === 0) {

        dailySpending.innerHTML = `

            <div class="empty-state">

                <span>📅</span>

                <p>
                    No spending data available.
                </p>

            </div>

        `;

        return;

    }


    const dailyTotals = {};


    expenses.forEach(transaction => {

        dailyTotals[transaction.date] =
            (dailyTotals[transaction.date] || 0)
            +
            Number(transaction.amount);

    });


    const sortedDates =
        Object.keys(dailyTotals)
            .sort()
            .reverse()
            .slice(0, 7);


    dailySpending.innerHTML =
        sortedDates
            .map(date => {

                return `

                    <div class="daily-item">

                        <span>
                            ${formatDate(date)}
                        </span>

                        <strong>
                            ${formatMoney(
                                dailyTotals[date]
                            )}
                        </strong>

                    </div>

                `;

            })
            .join("");

}


// ========================================
// 42. SMART INSIGHTS
// ========================================

function renderInsights(
    reportTransactions
) {

    if (!insightsList) {
        return;
    }


    if (reportTransactions.length === 0) {

        insightsList.innerHTML = `

            <div class="insight-item">

                <span>💡</span>

                <p>
                    Add some transactions to generate
                    personalized insights.
                </p>

            </div>

        `;

        return;

    }


    const summary =
        calculateSummary(
            reportTransactions
        );


    const insights = [];


    // Expense insight

    if (summary.expense > 0) {

        insights.push({

            icon: "💸",

            text:
                `You spent ${formatMoney(
                    summary.expense
                )} during this period.`

        });

    }


    // Savings insight

    if (summary.income > 0) {

        const savingsRate =
            (
                summary.savings /
                summary.income
            ) * 100;


        if (savingsRate >= 20) {

            insights.push({

                icon: "🎯",

                text:
                    `Great! Your savings rate is about ${Math.round(
                        savingsRate
                    )}%.`

            });

        } else if (savingsRate >= 0) {

            insights.push({

                icon: "💡",

                text:
                    `Your savings rate is about ${Math.round(
                        savingsRate
                    )}%. Try to increase it gradually.`

            });

        } else {

            insights.push({

                icon: "⚠️",

                text:
                    "Your expenses are higher than your income in this period."

            });

        }

    }


    // Highest category

    const categories = {};


    reportTransactions
        .filter(
            transaction =>
                transaction.type ===
                "expense"
        )
        .forEach(transaction => {

            categories[transaction.category] =
                (
                    categories[
                        transaction.category
                    ] || 0
                )
                +
                Number(transaction.amount);

        });


    const highestCategory =
        Object.entries(categories)
            .sort((a, b) => b[1] - a[1])[0];


    if (highestCategory) {

        insights.push({

            icon: getCategoryIcon(
                highestCategory[0]
            ),

            text:
                `${highestCategory[0]} is your highest expense category with ${formatMoney(
                    highestCategory[1]
                )} spent.`

        });

    }


    insightsList.innerHTML =
        insights
            .map(insight => {

                return `

                    <div class="insight-item">

                        <span>
                            ${insight.icon}
                        </span>

                        <p>
                            ${escapeHTML(
                                insight.text
                            )}
                        </p>

                    </div>

                `;

            })
            .join("");

}


// ========================================
// 43. REPORT EVENTS
// ========================================

reportFilter?.addEventListener(
    "change",
    () => {

        updateReportFilters();

        renderReport();

    }
);


monthFilter?.addEventListener(
    "change",
    renderReport
);


yearFilter?.addEventListener(
    "change",
    renderReport
);


// ========================================
// 44. OVERVIEW FILTER
// ========================================

overviewFilter?.addEventListener(
    "change",
    renderExpenseOverview
);


// ========================================
// 45. TRANSACTION FILTER EVENTS
// ========================================

searchTransaction?.addEventListener(
    "input",
    renderAllTransactions
);


typeFilter?.addEventListener(
    "change",
    renderAllTransactions
);


categoryFilter?.addEventListener(
    "change",
    renderAllTransactions
);


dateFilter?.addEventListener(
    "change",
    renderAllTransactions
);


// ========================================
// 46. VIEW ALL BUTTON
// ========================================

viewAllBtn?.addEventListener(
    "click",
    () => {

        allTransactionsSection?.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }
);


// ========================================
// 47. TOAST
// ========================================

let toastTimer;


function showToast(
    message,
    type = "success"
) {

    if (!toast) {
        return;
    }


    toastMessage.textContent =
        message;


    const icon =
        document.querySelector("#toastIcon");


    if (icon) {

        icon.textContent =
            type === "error"
                ? "!"
                : "✓";

        icon.style.color =
            type === "error"
                ? "var(--expense)"
                : "var(--income)";

    }


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove("show");

            },
            3000
        );

}


// ========================================
// 48. MAIN RENDER FUNCTION
// ========================================

function renderEverything() {

    updateDashboardSummary();

    updateCategoryFilter();

    renderRecentTransactions();

    renderAllTransactions();

    renderExpenseOverview();

    renderReport();

}


// ========================================
// 49. INITIALIZE APP
// ========================================

function initializeApp() {

    loadTransactions();

    updateGreeting();

    updateCurrentDate();

    populateMonthFilter();

    populateYearFilter();

    updateReportFilters();

    setDefaultDate();

    setTransactionType("expense");

    renderEverything();

}


// ========================================
// 50. START APP
// ========================================

initializeApp();