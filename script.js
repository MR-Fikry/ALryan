import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDuwURf9DxvGlEIox6J92iPF9-lmnKETH8",
  authDomain: "login-employees1.firebaseapp.com",
  projectId: "login-employees1",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// تأثير ظهور الصفحة
window.onload = function(){
    document.getElementById("title").classList.add("show");
    setTimeout(()=> document.getElementById("form").classList.add("show"), 800);

    // دخول تلقائي
    if(localStorage.getItem("isLoggedIn") === "true"){
        window.location.href = "sales/";
    }
}

// تسجيل الدخول
window.loginEmployee = async function(){
    const employeeId = document.getElementById("employeeId").value.trim();
    const password = document.getElementById("password").value.trim();

    if(!employeeId || !password){
        alert("ادخل ID وكلمة السر");
        return;
    }

    try{
        const snapshot = await getDocs(collection(db,"employees"));
        let foundEmployee = null;

        snapshot.forEach(docSnap=>{
            const data = docSnap.data();
            if(data.employeeId === employeeId && data.password === password){
                foundEmployee = { id: docSnap.id, ...data };
            }
        });

        if(!foundEmployee){
            alert("البيانات غير صحيحة");
            return;
        }

        // حفظ البيانات
        localStorage.setItem("employeeData", JSON.stringify(foundEmployee));
        localStorage.setItem("isLoggedIn","true");

        alert("تم تسجيل الدخول بنجاح");
        window.location.href = "sales/";
    }catch(error){
        console.error(error);
        alert("حدث خطأ، حاول مرة اخرى");
    }
}