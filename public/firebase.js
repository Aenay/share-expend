// Import the Firebase SDK modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  serverTimestamp, 
  query, 
  orderBy 
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js';

// 🔥 Your Firebase configuration
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);
const expensesRef = collection(db, "expenses");

// ➕ Add a new expense
export const addExpense = async (payer, amount, description) => {
  try {
    await addDoc(expensesRef, {
      payer,
      amount: parseFloat(amount),
      description,
      createdAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error adding expense:", error);
    return false;
  }
};

// 🔁 Listen for expense changes in real time
export const onExpensesChange = (callback) => {
  const q = query(expensesRef, orderBy("createdAt", "desc"));
  onSnapshot(q, (snapshot) => {
    const expenses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(expenses);
  });
};
