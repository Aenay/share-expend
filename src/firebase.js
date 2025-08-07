import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getDatabase, ref, push, onValue, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  // TODO: Replace with your Firebase config
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const expensesRef = ref(db, 'expenses');

// Add new expense
export const addExpense = async (payer, amount, description) => {
  try {
    await push(expensesRef, {
      payer,
      amount: parseFloat(amount),
      description,
      timestamp: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error adding expense:', error);
    return false;
  }
};

// Listen to expenses
export const onExpensesChange = (callback) => {
  onValue(expensesRef, (snapshot) => {
    const expenses = [];
    snapshot.forEach((childSnapshot) => {
      expenses.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    // Sort by timestamp in descending order
    expenses.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    callback(expenses);
  });
};