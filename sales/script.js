
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// تهيئة Firebase (نفس الإعدادات لديك)
const firebaseConfig = {
    apiKey: "AIzaSyDuwURf9DxvGlEIox6J92iPF9-lmnKETH8",
    authDomain: "login-employees1.firebaseapp.com",
    projectId: "login-employees1",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// دالة التحقق
export async function protectPage() {
    // التحقق من بيانات الموظف في localStorage
    const localEmployee = JSON.parse(localStorage.getItem('currentEmployee'));
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (!localEmployee || isLoggedIn !== 'true') {
        alert('❌ لم يتم تسجيل الدخول. الرجاء تسجيل الدخول أولاً.');
        window.location.href = "../"; // ارجع للصفحة الرئيسية
        return false;
    }

    try {
        // التحقق من وجود الموظف في قاعدة البيانات
        const snapshot = await getDocs(collection(db, 'employees'));
        const dbEmployee = snapshot.docs.find(doc => doc.id === localEmployee.id);

        if (!dbEmployee) {
            alert('⚠️ الموظف غير موجود في قاعدة البيانات. الرجاء تسجيل الدخول مجدداً.');
            localStorage.removeItem('currentEmployee');
            localStorage.removeItem('isLoggedIn');
            window.location.href = "../";
            return false;
        }

        // كل شيء تمام → تحديث currentEmployee
        window.currentEmployee = { id: dbEmployee.id, ...dbEmployee.data() };
        return true;

    } catch (error) {
        console.error('Error verifying employee:', error);
        alert('حدث خطأ أثناء التحقق من الموظف. تأكد من اتصال الإنترنت.');
        window.location.href = "../";
        return false;
    }
}

// تنفيذ التحقق فور تحميل الصفحة
protectPage();
