import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getDatabase, ref, push, onValue, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAO06E97AUdDogUOFe2DlcsifTLqx_FSP0",
  authDomain: "share-expense-21c82.firebaseapp.com",
  projectId: "share-expense-21c82",
  storageBucket: "share-expense-21c82.firebasestorage.app",
  messagingSenderId: "204650203348",
  appId: "1:204650203348:web:49664f9aaba57ec71b5341",
  measurementId: "G-B16FPXY1PD"
};

// Initialize Firebase
const analytics = getAnalytics(app);

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