import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDuwURf9DxvGlEIox6J92iPF9-lmnKETH8",
  authDomain: "login-employees1.firebaseapp.com",
  projectId: "login-employees1",
  storageBucket: "login-employees1.firebasestorage.app",
  messagingSenderId: "907414298566",
  appId: "1:907414298566:web:0141762effe0e9ff289cc7",
  measurementId: "G-Q6XWR5X38W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Save product function
window.saveProduct = async function() {
  const name = document.getElementById("productName").value.trim();
  const serial = document.getElementById("serial").value.trim();
  const quantity = document.getElementById("quantity").value.trim();
  const buyPrice = document.getElementById("buyPrice").value.trim();
  const sellPrice = document.getElementById("sellPrice").value.trim();

  if (!name || !serial || !quantity || !buyPrice || !sellPrice) {
    alert("املأ كل البيانات!");
    return;
  }

  const product = {
    name,
    serial,
    quantity: Number(quantity),
    buyPrice: Number(buyPrice),
    sellPrice: Number(sellPrice),
    createdAt: new Date().toLocaleString()
  };

  try {
    await addDoc(collection(db, "products"), product);
    alert("تم حفظ المنتج في Firebase ✅");

    // تفريغ الحقول
    document.getElementById("productName").value = "";
    document.getElementById("serial").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("buyPrice").value = "";
    document.getElementById("sellPrice").value = "";

  } catch (error) {
    console.error("حدث خطأ عند الحفظ: ", error);
    alert("حصل خطأ أثناء حفظ المنتج!");
  }
};
