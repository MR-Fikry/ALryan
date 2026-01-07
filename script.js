import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDuwURf9DxvGlEIox6J92iPF9-lmnKETH8",
  authDomain: "login-employees1.firebaseapp.com",
  projectId: "login-employees1",
  storageBucket: "login-employees1.firebasestorage.app",
  messagingSenderId: "907414298566",
  appId: "1:907414298566:web:0141762effe0e9ff289cc7",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.saveEmployee = function () {

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const genderInput = document.querySelector('input[name="gender"]:checked');

  if (!name || !phone || !genderInput) {
    alert("املأ كل البيانات");
    return;
  }

  const employee = {
    name: name,
    phone: phone,
    gender: genderInput.value,
    createdAt: new Date().toLocaleString()
  };

  // نخزن الموظف الحالي
  localStorage.setItem("currentEmployee", JSON.stringify(employee));

  // علامة إنه اتسجل
  localStorage.setItem("isLoggedIn", "true");

  alert("تم التسجيل بنجاح ✅");

  // تحويل مباشر
  window.location.href = "sales/";
};

// لو مسجّل قبل كده → دخله على طول
if (localStorage.getItem("isLoggedIn") === "true") {
  window.location.href = "sales/";
}



window.onload = function () {
  const title = document.getElementById("title");
  const form = document.getElementById("form");

  // العنوان يظهر الأول
  setTimeout(() => {
    title.classList.add("show");
  }, 200);

  // الفورم يظهر بعد العنوان
  setTimeout(() => {
    form.classList.add("show");
  }, 2000);
};

