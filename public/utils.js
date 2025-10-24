// Format currency amount
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Calculate balance from transactions with 50/50 split
export const calculateBalance = (transactions) => {
  let youPaid = 0;
  let friendPaid = 0;

  transactions.forEach(tx => {
    if (tx.payer === 'Nay') {
      youPaid += tx.amount;
    } else {
      friendPaid += tx.amount;
    }
  });

  const totalExpenses = youPaid + friendPaid;
  const splitAmount = totalExpenses / 2;
  const difference = youPaid - splitAmount;
  
  if (difference > 0) {
    return `Naing owes Nay ${formatCurrency(difference)} (Nay's share: ${formatCurrency(splitAmount)})`;
  } else if (difference < 0) {
    return `Nay owes Naing ${formatCurrency(Math.abs(difference))} (Nay's share: ${formatCurrency(splitAmount)})`;
  }
  return 'All settled up!'
};

// Format date from Firebase timestamp
export const formatDate = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Create transaction element
export const createTransactionElement = (expense) => {
  const isNay = expense.payer === 'Nay';
  const transactionDiv = document.createElement('div');
  transactionDiv.className = `flex justify-between items-center p-3 rounded-lg ${
    isNay ? 'bg-blue-50' : 'bg-green-50'
  }`;

  transactionDiv.innerHTML = `
    <div class="flex-grow">
      <p class="font-semibold">${expense.description}</p>
      <p class="text-sm text-gray-600">Paid by ${expense.payer}</p>
    </div>
    <div class="text-right">
      <p class="font-bold text-lg">${expense.amount.toFixed(2)}</p>
      <p class="text-xs text-gray-500">${new Date(expense.createdAt?.seconds * 1000).toLocaleDateString()}</p>
    </div>
    <button data-id="${expense.id}" class="delete-btn text-red-500 hover:text-red-700 hover:underline ml-4">Delete</button>
  `;

  return transactionDiv;
};