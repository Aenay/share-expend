import { addExpense, onExpensesChange } from './firebase.js';
import { calculateBalance, createTransactionElement } from './utils.js';

// DOM Elements
const expenseForm = document.getElementById('expenseForm');
const payerSelect = document.getElementById('payer');
const amountInput = document.getElementById('amount');
const descriptionInput = document.getElementById('description');
const balanceElement = document.getElementById('balance');
const transactionsContainer = document.getElementById('transactions');

// Handle form submission
expenseForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const payer = payerSelect.value;
  const amount = parseFloat(amountInput.value);
  const description = descriptionInput.value;

  if (amount <= 0) {
    alert('Please enter a valid amount');
    return;
  }

  const submitButton = expenseForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Adding...';

  try {
    const success = await addExpense(payer, amount, description);
    if (success) {
      expenseForm.reset();
    } else {
      alert('Failed to add expense. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Add Transaction';
  }
});

// Listen to expenses changes
onExpensesChange((expenses) => {
  // Update balance
  balanceElement.textContent = calculateBalance(expenses);

  // Update transaction history
  transactionsContainer.innerHTML = '';
  if (expenses.length === 0) {
    transactionsContainer.innerHTML = '
      <p class="text-gray-500 text-center">No transactions yet</p>
    ';
    return;
  }

  expenses.forEach(expense => {
    const transactionElement = createTransactionElement(expense);
    transactionsContainer.appendChild(transactionElement);
  });
});

// Handle offline/online status
window.addEventListener('online', () => {
  document.body.classList.remove('offline');
});

window.addEventListener('offline', () => {
  document.body.classList.add('offline');
});