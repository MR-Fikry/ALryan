import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// 1️⃣ إعداد Firebase
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

// 2️⃣ دالة حفظ الموظف
window.saveEmployee = async function () {
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

  // 3️⃣ تخزين محلي
  localStorage.setItem("currentEmployee", JSON.stringify(employee));
  localStorage.setItem("isLoggedIn", "true");

  // 4️⃣ إرسال البيانات للـ Firebase
  try {
    await addDoc(collection(db, "employees"), employee);
    console.log("تم حفظ الموظف في Firebase ✅");
  } catch (error) {
    console.error("حدث خطأ عند حفظ الموظف في Firebase:", error);
    alert("حصل خطأ أثناء إرسال البيانات للقاعدة!");
    return;
  }

  // 5️⃣ رسالة نجاح وتحويل
  alert("تم التسجيل بنجاح ✅");
  window.location.href = "sales/";
};

// 6️⃣ دخول تلقائي لو مسجّل قبل كده
if (localStorage.getItem("isLoggedIn") === "true") {
  window.location.href = "sales/";
}

// 7️⃣ تأثير ظهور الصفحة
window.onload = function () {
  const title = document.getElementById("title");
  const form = document.getElementById("form");

  setTimeout(() => {
    title.classList.add("show");
  }, 200);

  setTimeout(() => {
    form.classList.add("show");
  }, 2000);
};
