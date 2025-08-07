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
export const createTransactionElement = (transaction) => {
  const { payer, amount, description, timestamp } = transaction;
  const formattedAmount = formatCurrency(amount);
  const formattedDate = formatDate(timestamp);
  const splitAmount = amount / 2;
  const formattedSplitAmount = formatCurrency(splitAmount);
  
  const element = document.createElement('div');
  element.className = 'p-4 border rounded-lg ' + 
    (payer === 'Nay' ? 'bg-green-50' : 'bg-blue-50');
  
  const otherPerson = payer === 'Nay' ? 'Naing' : 'Nay';
  
  element.innerHTML = `
    <div class="flex justify-between items-start">
      <div class="flex-grow">
        <div class="flex justify-between items-center mb-1">
          <p class="font-semibold ${payer === 'Nay' ? 'text-green-600' : 'text-blue-600'}">
            ${payer} paid ${formattedAmount}
          </p>
          <span class="text-xs text-gray-500">${formattedDate}</span>
        </div>
        <p class="text-gray-600 text-sm mb-1">${description}</p>
        <p class="text-sm text-gray-700">
          Split: ${formattedSplitAmount} each
          <span class="block text-xs ${payer === 'Nay' ? 'text-green-600' : 'text-blue-600'}">
            ${otherPerson} needs to pay ${payer} ${formattedSplitAmount}
          </span>
        </p>
      </div>
    </div>
  `;
  
  return element;
};