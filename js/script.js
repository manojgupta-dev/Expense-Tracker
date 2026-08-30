/**
 * ExpenseFlow – Smart Personal Expense & Income Tracker
 * Main Script Logic with Specific Month & Range Filters
 */

// Category Definitions
const CATEGORIES = {
    expense: ['Food', 'Transport', 'Bills', 'Shopping', 'Education', 'Entertainment', 'Health', 'Travel', 'Other'],
    income: ['Salary', 'Freelance', 'Business', 'Scholarship', 'Gift', 'Other Income']
};

// Global App State
let transactions = JSON.parse(localStorage.getItem('expenseFlowTransactions')) || [];
let currentType = 'expense';
let deleteTargetId = null;

// DOM Element References
const elements = {
    // Navigation
    hamburgerBtn: document.getElementById('hamburgerBtn'),
    navMenu: document.getElementById('navMenu'),
    navLinks: document.querySelectorAll('.nav-link'),
    
    // Header & Summary
    greetingMsg: document.getElementById('greetingMsg'),
    currentDateDisplay: document.getElementById('currentDateDisplay'),
    totalBalance: document.getElementById('totalBalance'),
    totalIncome: document.getElementById('totalIncome'),
    totalExpenses: document.getElementById('totalExpenses'),
    totalSavings: document.getElementById('totalSavings'),
    
    // Transaction Lists
    recentTransactionsList: document.getElementById('recentTransactionsList'),
    allTransactionsList: document.getElementById('allTransactionsList'),
    
    // Modal & Form
    openModalBtn: document.getElementById('openModalBtn'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    cancelModalBtn: document.getElementById('cancelModalBtn'),
    transactionModal: document.getElementById('transactionModal'),
    transactionForm: document.getElementById('transactionForm'),
    modalTitle: document.getElementById('modalTitle'),
    transactionId: document.getElementById('transactionId'),
    typeExpenseBtn: document.getElementById('typeExpenseBtn'),
    typeIncomeBtn: document.getElementById('typeIncomeBtn'),
    amountInput: document.getElementById('amountInput'),
    categoryInput: document.getElementById('categoryInput'),
    dateInput: document.getElementById('dateInput'),
    descriptionInput: document.getElementById('descriptionInput'),
    notesInput: document.getElementById('notesInput'),
    
    // Delete Modal
    deleteModal: document.getElementById('deleteModal'),
    closeDeleteModalBtn: document.getElementById('closeDeleteModalBtn'),
    cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),
    confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),
    
    // Filters & Search
    searchInput: document.getElementById('searchInput'),
    monthPickerInput: document.getElementById('monthPickerInput'),
    startDateInput: document.getElementById('startDateInput'),
    endDateInput: document.getElementById('endDateInput'),
    typeFilter: document.getElementById('typeFilter'),
    categoryFilter: document.getElementById('categoryFilter'),
    dateFilter: document.getElementById('dateFilter'),
    clearFiltersBtn: document.getElementById('clearFiltersBtn'),
    
    // Analytics
    analyticsTimeframe: document.getElementById('analyticsTimeframe'),
    categoryBreakdownContainer: document.getElementById('categoryBreakdownContainer'),
    visualIncomeVal: document.getElementById('visualIncomeVal'),
    visualExpenseVal: document.getElementById('visualExpenseVal'),
    visualIncomeBar: document.getElementById('visualIncomeBar'),
    visualExpenseBar: document.getElementById('visualExpenseBar'),
    dailySpendingContainer: document.getElementById('dailySpendingContainer'),
    smartInsightsContainer: document.getElementById('smartInsightsContainer'),
    
    // CSV Import / Export
    exportCsvBtn: document.getElementById('exportCsvBtn'),
    importCsvInput: document.getElementById('importCsvInput'),
    
    // Toast Container
    toastContainer: document.getElementById('toastContainer')
};

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    setupEventListeners();
    populateCategoryDropdown();
    populateFilterCategories();
    setDefaultDate();
    renderApp();
});

// INITIAL HEADER SETUP
function initHeader() {
    const now = new Date();
    const hours = now.getHours();
    let greeting = 'Good Evening';
    if (hours < 12) greeting = 'Good Morning';
    else if (hours < 18) greeting = 'Good Afternoon';
    
    elements.greetingMsg.textContent = `${greeting}, User!`;
    elements.currentDateDisplay.textContent = now.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
}

function setDefaultDate() {
    elements.dateInput.value = new Date().toISOString().split('T')[0];
}

// EVENT LISTENERS SETUP
function setupEventListeners() {
    // Mobile Hamburger Navigation
    elements.hamburgerBtn.addEventListener('click', () => {
        elements.navMenu.classList.toggle('active');
    });

    // Active Navigation State & Smooth Scrolling
    elements.navLinks.forEach(link => {
        link.addEventListener('click', () => {
            elements.navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            elements.navMenu.classList.remove('active');
        });
    });

    // Modal Control Events
    elements.openModalBtn.addEventListener('click', () => openModal());
    elements.closeModalBtn.addEventListener('click', closeModal);
    elements.cancelModalBtn.addEventListener('click', closeModal);
    elements.transactionModal.addEventListener('click', (e) => {
        if (e.target === elements.transactionModal) closeModal();
    });

    // Delete Modal Events
    elements.closeDeleteModalBtn.addEventListener('click', closeDeleteModal);
    elements.cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    elements.confirmDeleteBtn.addEventListener('click', handleConfirmDelete);
    elements.deleteModal.addEventListener('click', (e) => {
        if (e.target === elements.deleteModal) closeDeleteModal();
    });

    // Close Modals on Escape Key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeDeleteModal();
        }
    });

    // Type Selector Toggle inside Modal
    elements.typeExpenseBtn.addEventListener('click', () => setTransactionType('expense'));
    elements.typeIncomeBtn.addEventListener('click', () => setTransactionType('income'));

    // Form Submission
    elements.transactionForm.addEventListener('submit', handleFormSubmit);

    // Dynamic Filter Events
    elements.searchInput.addEventListener('input', renderAllTransactions);
    elements.typeFilter.addEventListener('change', renderAllTransactions);
    elements.categoryFilter.addEventListener('change', renderAllTransactions);
    
    // Date & Month Filters
    elements.monthPickerInput.addEventListener('change', () => {
        // Reset range and presets if month picker is selected
        elements.startDateInput.value = '';
        elements.endDateInput.value = '';
        elements.dateFilter.value = 'all';
        renderAllTransactions();
    });

    elements.startDateInput.addEventListener('change', () => {
        elements.monthPickerInput.value = '';
        elements.dateFilter.value = 'all';
        renderAllTransactions();
    });

    elements.endDateInput.addEventListener('change', () => {
        elements.monthPickerInput.value = '';
        elements.dateFilter.value = 'all';
        renderAllTransactions();
    });

    elements.dateFilter.addEventListener('change', () => {
        elements.monthPickerInput.value = '';
        elements.startDateInput.value = '';
        elements.endDateInput.value = '';
        renderAllTransactions();
    });

    elements.clearFiltersBtn.addEventListener('click', clearAllFilters);
    elements.analyticsTimeframe.addEventListener('change', renderAnalytics);

    // Data Import / Export
    elements.exportCsvBtn.addEventListener('click', exportToCSV);
    elements.importCsvInput.addEventListener('change', importFromCSV);
}

// CLEAR ALL FILTERS FUNCTION
function clearAllFilters() {
    elements.searchInput.value = '';
    elements.monthPickerInput.value = '';
    elements.startDateInput.value = '';
    elements.endDateInput.value = '';
    elements.typeFilter.value = 'all';
    elements.categoryFilter.value = 'all';
    elements.dateFilter.value = 'all';
    renderAllTransactions();
    showToast('Filters cleared', 'info');
}

// MODAL CONTROLS & FORM MANAGEMENT
function setTransactionType(type) {
    currentType = type;
    if (type === 'expense') {
        elements.typeExpenseBtn.className = 'type-btn active-expense';
        elements.typeIncomeBtn.className = 'type-btn';
    } else {
        elements.typeExpenseBtn.className = 'type-btn';
        elements.typeIncomeBtn.className = 'type-btn active-income';
    }
    populateCategoryDropdown();
}

function populateCategoryDropdown() {
    const opts = CATEGORIES[currentType];
    elements.categoryInput.innerHTML = opts.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

function populateFilterCategories() {
    const allCategories = [...CATEGORIES.expense, ...CATEGORIES.income];
    const uniqueCategories = [...new Set(allCategories)];
    elements.categoryFilter.innerHTML = `<option value="all">All Categories</option>` + 
        uniqueCategories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

function openModal(editMode = false) {
    if (!editMode) {
        elements.transactionForm.reset();
        elements.transactionId.value = '';
        elements.modalTitle.textContent = 'Add New Transaction';
        setTransactionType('expense');
        setDefaultDate();
    }
    elements.transactionModal.classList.add('active');
}

function closeModal() {
    elements.transactionModal.classList.remove('active');
}

function closeDeleteModal() {
    elements.deleteModal.classList.remove('active');
    deleteTargetId = null;
}

// LOCALSTORAGE CONTROLS
function saveToLocalStorage() {
    localStorage.setItem('expenseFlowTransactions', JSON.stringify(transactions));
}

// CORE APP RENDER ROUTINE
function renderApp() {
    renderSummaryCards();
    renderRecentTransactions();
    renderAllTransactions();
    renderAnalytics();
    renderSmartInsights();
}

// TRANSACTION FORM SUBMISSION
function handleFormSubmit(e) {
    e.preventDefault();

    const id = elements.transactionId.value;
    const amount = parseFloat(elements.amountInput.value);
    const category = elements.categoryInput.value;
    const date = elements.dateInput.value;
    const description = elements.descriptionInput.value.trim();
    const notes = elements.notesInput.value.trim();

    if (!amount || amount <= 0 || !category || !date || !description) {
        showToast('Please fill all required fields correctly', 'error');
        return;
    }

    if (id) {
        // Edit existing transaction
        const index = transactions.findIndex(t => t.id === id);
        if (index !== -1) {
            transactions[index] = {
                ...transactions[index],
                type: currentType,
                amount,
                category,
                date,
                description,
                notes
            };
            showToast('Transaction updated successfully!', 'success');
        }
    } else {
        // Add new transaction
        const newTransaction = {
            id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            type: currentType,
            amount,
            category,
            date,
            description,
            notes,
            createdAt: new Date().toISOString()
        };
        transactions.push(newTransaction);
        showToast('Transaction added successfully!', 'success');
    }

    saveToLocalStorage();
    closeModal();
    renderApp();
}

// RENDER SUMMARY CARDS
function renderSummaryCards() {
    let income = 0;
    let expense = 0;

    transactions.forEach(t => {
        if (t.type === 'income') income += t.amount;
        else if (t.type === 'expense') expense += t.amount;
    });

    const balance = income - expense;
    const savingsPercentage = income > 0 ? Math.max(0, ((income - expense) / income) * 100).toFixed(1) : 0;

    elements.totalBalance.textContent = `₹${balance.toFixed(2)}`;
    elements.totalIncome.textContent = `₹${income.toFixed(2)}`;
    elements.totalExpenses.textContent = `₹${expense.toFixed(2)}`;
    elements.totalSavings.textContent = `${savingsPercentage}%`;
}

// HELPER: BUILD TRANSACTION HTML ITEM
function createTransactionHTML(t) {
    const isIncome = t.type === 'income';
    const iconClass = isIncome ? 'income-icon' : 'expense-icon';
    const amountClass = isIncome ? 'amount-income' : 'amount-expense';
    const prefix = isIncome ? '+' : '-';
    
    // Formatting Creation Time
    const createdDate = new Date(t.createdAt || t.date);
    const timeFormatted = createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return `
        <li class="transaction-item">
            <div class="item-left">
                <div class="item-icon ${iconClass}">
                    <i class="fa-solid ${isIncome ? 'fa-wallet' : 'fa-receipt'}"></i>
                </div>
                <div class="item-details">
                    <h4>${escapeHTML(t.description)}</h4>
                    <p><span>${t.category}</span> • <span>${t.date} (${timeFormatted})</span></p>
                    ${t.notes ? `<p class="text-muted"><small>Note: ${escapeHTML(t.notes)}</small></p>` : ''}
                </div>
            </div>
            <div class="item-right">
                <span class="item-amount ${amountClass}">${prefix}₹${t.amount.toFixed(2)}</span>
                <div class="item-actions">
                    <button class="edit-btn" onclick="editTransaction('${t.id}')" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="delete-btn" onclick="openDeleteModal('${t.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        </li>
    `;
}

// RENDER RECENT TRANSACTIONS (LATEST 5)
function renderRecentTransactions() {
    const sorted = [...transactions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const recent = sorted.slice(0, 5);

    if (recent.length === 0) {
        elements.recentTransactionsList.innerHTML = `<div class="empty-state">No recent transactions found.</div>`;
        return;
    }

    elements.recentTransactionsList.innerHTML = recent.map(t => createTransactionHTML(t)).join('');
}

// RENDER ALL TRANSACTIONS WITH DYNAMIC MONTH & DATE FILTERS
function renderAllTransactions() {
    const searchVal = elements.searchInput.value.toLowerCase().trim();
    const selectedMonth = elements.monthPickerInput.value; // Format: "YYYY-MM"
    const startDate = elements.startDateInput.value;       // Format: "YYYY-MM-DD"
    const endDate = elements.endDateInput.value;         // Format: "YYYY-MM-DD"
    const typeVal = elements.typeFilter.value;
    const categoryVal = elements.categoryFilter.value;
    const datePreset = elements.dateFilter.value;

    const filtered = transactions.filter(t => {
        // Search Filter
        const matchesSearch = t.description.toLowerCase().includes(searchVal) || 
                              t.category.toLowerCase().includes(searchVal);
        
        // Type Filter
        const matchesType = typeVal === 'all' || t.type === typeVal;

        // Category Filter
        const matchesCategory = categoryVal === 'all' || t.category === categoryVal;

        // Date & Month Matching Logic
        let matchesDate = true;
        const txDateStr = t.date; // "YYYY-MM-DD"
        const txDate = new Date(t.date);
        const today = new Date();

        // 1. Month Picker Filter
        if (selectedMonth) {
            matchesDate = txDateStr.startsWith(selectedMonth);
        }
        // 2. Custom Date Range Filter
        else if (startDate || endDate) {
            if (startDate && endDate) {
                matchesDate = txDateStr >= startDate && txDateStr <= endDate;
            } else if (startDate) {
                matchesDate = txDateStr >= startDate;
            } else if (endDate) {
                matchesDate = txDateStr <= endDate;
            }
        }
        // 3. Quick Presets Filter
        else if (datePreset !== 'all') {
            if (datePreset === 'today') {
                matchesDate = txDate.toDateString() === today.toDateString();
            } else if (datePreset === 'week') {
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(today.getDate() - 7);
                matchesDate = txDate >= oneWeekAgo && txDate <= today;
            } else if (datePreset === 'month') {
                matchesDate = txDate.getMonth() === today.getMonth() && txDate.getFullYear() === today.getFullYear();
            } else if (datePreset === 'year') {
                matchesDate = txDate.getFullYear() === today.getFullYear();
            }
        }

        return matchesSearch && matchesType && matchesCategory && matchesDate;
    });

    const sorted = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (sorted.length === 0) {
        elements.allTransactionsList.innerHTML = `<div class="empty-state">No matching transactions found.</div>`;
        return;
    }

    elements.allTransactionsList.innerHTML = sorted.map(t => createTransactionHTML(t)).join('');
}

// EDIT TRANSACTION INITIALIZATION
window.editTransaction = function(id) {
    const item = transactions.find(t => t.id === id);
    if (!item) return;

    elements.transactionId.value = item.id;
    elements.amountInput.value = item.amount;
    elements.dateInput.value = item.date;
    elements.descriptionInput.value = item.description;
    elements.notesInput.value = item.notes || '';
    
    setTransactionType(item.type);
    elements.categoryInput.value = item.category;

    elements.modalTitle.textContent = 'Edit Transaction';
    openModal(true);
};

// DELETE TRANSACTION INITIALIZATION
window.openDeleteModal = function(id) {
    deleteTargetId = id;
    elements.deleteModal.classList.add('active');
};

function handleConfirmDelete() {
    if (!deleteTargetId) return;

    transactions = transactions.filter(t => t.id !== deleteTargetId);
    saveToLocalStorage();
    closeDeleteModal();
    renderApp();
    showToast('Transaction deleted successfully', 'info');
}

// RENDER ANALYTICS SECTION
function renderAnalytics() {
    const timeframe = elements.analyticsTimeframe.value;
    const today = new Date();

    const filtered = transactions.filter(t => {
        const txDate = new Date(t.date);
        if (timeframe === 'week') {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(today.getDate() - 7);
            return txDate >= oneWeekAgo;
        } else if (timeframe === 'month') {
            return txDate.getMonth() === today.getMonth() && txDate.getFullYear() === today.getFullYear();
        } else if (timeframe === 'year') {
            return txDate.getFullYear() === today.getFullYear();
        }
        return true;
    });

    // 1. Category-Wise Expense Totals & Progress Bars
    const categoryTotals = {};
    let totalPeriodExpense = 0;

    filtered.filter(t => t.type === 'expense').forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
        totalPeriodExpense += t.amount;
    });

    if (Object.keys(categoryTotals).length === 0) {
        elements.categoryBreakdownContainer.innerHTML = `<div class="empty-state">No expense data available.</div>`;
    } else {
        elements.categoryBreakdownContainer.innerHTML = Object.entries(categoryTotals)
            .map(([cat, amt]) => {
                const percentage = ((amt / totalPeriodExpense) * 100).toFixed(1);
                return `
                    <div class="progress-item">
                        <div class="progress-info">
                            <span>${cat}</span>
                            <span>₹${amt.toFixed(2)} (${percentage}%)</span>
                        </div>
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill expense-bg" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                `;
            }).join('');
    }

    // 2. Income vs Expense Ratio Visualizer
    let totalIncome = 0;
    let totalExpense = 0;

    filtered.forEach(t => {
        if (t.type === 'income') totalIncome += t.amount;
        if (t.type === 'expense') totalExpense += t.amount;
    });

    const maxVal = Math.max(totalIncome, totalExpense) || 1;
    const incomeWidth = ((totalIncome / maxVal) * 100).toFixed(1);
    const expenseWidth = ((totalExpense / maxVal) * 100).toFixed(1);

    elements.visualIncomeVal.textContent = `₹${totalIncome.toFixed(2)}`;
    elements.visualExpenseVal.textContent = `₹${totalExpense.toFixed(2)}`;
    elements.visualIncomeBar.style.width = `${incomeWidth}%`;
    elements.visualExpenseBar.style.width = `${expenseWidth}%`;

    // 3. Daily Spending Breakdown
    const dailyExpenses = {};
    filtered.filter(t => t.type === 'expense').forEach(t => {
        dailyExpenses[t.date] = (dailyExpenses[t.date] || 0) + t.amount;
    });

    const sortedDates = Object.keys(dailyExpenses).sort((a, b) => new Date(b) - new Date(a));

    if (sortedDates.length === 0) {
        elements.dailySpendingContainer.innerHTML = `<div class="empty-state">No daily expenses logged.</div>`;
    } else {
        elements.dailySpendingContainer.innerHTML = sortedDates.map(date => `
            <div class="daily-item">
                <span><strong>${date}</strong></span>
                <span class="amount-expense">₹${dailyExpenses[date].toFixed(2)}</span>
            </div>
        `).join('');
    }
}

// SMART INSIGHTS GENERATION
function renderSmartInsights() {
    let income = 0;
    let expense = 0;
    const catMap = {};

    transactions.forEach(t => {
        if (t.type === 'income') income += t.amount;
        if (t.type === 'expense') {
            expense += t.amount;
            catMap[t.category] = (catMap[t.category] || 0) + t.amount;
        }
    });

    let highestCat = 'N/A';
    let highestAmt = 0;
    for (const [cat, amt] of Object.entries(catMap)) {
        if (amt > highestAmt) {
            highestAmt = amt;
            highestCat = cat;
        }
    }

    const insights = [];

    if (expense > income && income > 0) {
        insights.push(`
            <div class="insight-card warning">
                <strong><i class="fa-solid fa-triangle-exclamation"></i> Expense Warning</strong>
                <p>Your expenses (₹${expense.toFixed(2)}) have exceeded your total income (₹${income.toFixed(2)})!</p>
            </div>
        `);
    } else if (income > 0) {
        const rate = (((income - expense) / income) * 100).toFixed(1);
        insights.push(`
            <div class="insight-card success">
                <strong><i class="fa-solid fa-circle-check"></i> Great Savings Rate</strong>
                <p>You have saved ${rate}% of your overall income so far!</p>
            </div>
        `);
    }

    if (highestAmt > 0) {
        insights.push(`
            <div class="insight-card">
                <strong><i class="fa-solid fa-chart-line"></i> Top Expense Category</strong>
                <p>Most of your money goes into <strong>${highestCat}</strong> (₹${highestAmt.toFixed(2)}).</p>
            </div>
        `);
    }

    insights.push(`
        <div class="insight-card">
            <strong><i class="fa-solid fa-list-ol"></i> Activity Volume</strong>
            <p>You have recorded <strong>${transactions.length} total transactions</strong> in ExpenseFlow.</p>
        </div>
    `);

    elements.smartInsightsContainer.innerHTML = insights.join('');
}

// CSV EXPORT FUNCTIONALITY
function exportToCSV() {
    if (transactions.length === 0) {
        showToast('No transactions available to export!', 'error');
        return;
    }

    const headers = ['ID', 'Type', 'Amount', 'Category', 'Date', 'Description', 'Notes', 'CreatedAt'];
    const csvRows = [headers.join(',')];

    transactions.forEach(t => {
        const row = [
            t.id,
            t.type,
            t.amount,
            `"${t.category}"`,
            t.date,
            `"${t.description.replace(/"/g, '""')}"`,
            `"${(t.notes || '').replace(/"/g, '""')}"`,
            t.createdAt
        ];
        csvRows.push(row.join(','));
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ExpenseFlow_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported CSV successfully!', 'success');
}

// CSV IMPORT FUNCTIONALITY
function importFromCSV(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
        try {
            const lines = evt.target.result.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            if (lines.length <= 1) {
                showToast('CSV file is empty or missing headers', 'error');
                return;
            }

            const importedTx = [];
            for (let i = 1; i < lines.length; i++) {
                const parts = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                if (parts.length >= 6) {
                    const type = parts[1].replace(/"/g, '').toLowerCase();
                    const amount = parseFloat(parts[2]);
                    
                    if ((type === 'income' || type === 'expense') && !isNaN(amount)) {
                        importedTx.push({
                            id: parts[0].replace(/"/g, '') || ('tx_' + Date.now() + '_' + i),
                            type: type,
                            amount: amount,
                            category: parts[3].replace(/"/g, ''),
                            date: parts[4].replace(/"/g, ''),
                            description: parts[5].replace(/"/g, ''),
                            notes: parts[6] ? parts[6].replace(/"/g, '') : '',
                            createdAt: parts[7] ? parts[7].replace(/"/g, '') : new Date().toISOString()
                        });
                    }
                }
            }

            if (importedTx.length > 0) {
                transactions = importedTx;
                saveToLocalStorage();
                renderApp();
                showToast(`Successfully imported ${importedTx.length} transactions!`, 'success');
            } else {
                showToast('Invalid CSV format. No transactions imported.', 'error');
            }
        } catch (err) {
            showToast('Failed to parse CSV file.', 'error');
        }
        elements.importCsvInput.value = '';
    };

    reader.readAsText(file);
}

// UI TOAST NOTIFICATION UTILITY
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// SECURITY HELPER TO PREVENT XSS
function escapeHTML(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}