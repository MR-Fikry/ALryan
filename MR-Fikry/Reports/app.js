import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/* Firebase */
const firebaseConfig = {
  apiKey: "AIzaSyDuwURf9DxvGlEIox6J92iPF9-lmnKETH8",
  authDomain: "login-employees1.firebaseapp.com",
  projectId: "login-employees1",
};
initializeApp(firebaseConfig);
const db = getFirestore();

/* Elements */
const invoiceCountEl = document.getElementById("invoiceCount");
const totalSalesEl = document.getElementById("totalSales");
const totalProfitEl = document.getElementById("totalProfit");
const daysContainer = document.getElementById("daysContainer");
const invoicesContainer = document.getElementById("invoicesContainer");

/* Data */
let allInvoices = {};
let invoicesByDay = {};

async function init() {
  const snap = await getDocs(collection(db, "sales"));

  let totalSales = 0;
  let totalProfit = 0;

  snap.forEach(doc => {
    const data = doc.data();
    if (!data.createdAt) return;

    const day = data.createdAt.toDate().toLocaleDateString("ar-EG");

    allInvoices[doc.id] = { id: doc.id, ...data };

    totalSales += data.totalAmount || 0;

    data.items?.forEach(i => {
      totalProfit += (i.price - i.buyPrice) * i.quantity;
    });

    invoicesByDay[day] ??= [];
    invoicesByDay[day].push(doc.id);
  });

 totalProfitEl.textContent =
  totalProfit.toLocaleString("ar-EG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + " جنيه";


  renderDays();
}

function renderDays() {
  daysContainer.innerHTML = "";
  Object.keys(invoicesByDay).forEach(day => {
    const btn = document.createElement("button");
    btn.textContent = day;
    btn.onclick = () => renderInvoices(day);
    daysContainer.appendChild(btn);
  });
}

function renderInvoices(day) {
  invoicesContainer.innerHTML = "";

  invoicesByDay[day].forEach(id => {
    const inv = allInvoices[id];

    const card = document.createElement("div");
    card.className = "invoice-card";

    card.innerHTML = `
  <h4>فاتورة #${inv.invoiceNumber}</h4>
  <p>👤 البائع: <strong>${inv.seller?.name || "—"}</strong></p>
  <p>👤 المشتري: <strong>${inv.buyer?.name || "—"}</strong></p>
  <p>💰 الإجمالي: <strong>${inv.totalAmount} جنيه</strong></p>

  <div class="card-actions">
    <button class="view-btn" onclick="showInvoice('${id}')">
      👁 عرض الفاتورة
    </button>
    <button class="print-btn" onclick="printInvoice('${id}')">
      🖨 طباعة
    </button>
  </div>
`;

    invoicesContainer.appendChild(card);
  });
}

window.showInvoice = function (id) {
  const inv = allInvoices[id];
  if (!inv) {
    alert("الفاتورة غير موجودة");
    return;
  }

  const box = document.getElementById("invoicePrint");
  box.style.display = "block";

  document.getElementById("printInvoiceNumber").textContent = inv.invoiceNumber;
  document.getElementById("printSeller").textContent =
    inv.seller?.name || "—";

  // ✅ اسم المشتري
  document.getElementById("printBuyer").textContent =
    inv.buyer?.name || "—";

  document.getElementById("printDate").textContent = inv.date;
  document.getElementById("printTime").textContent = inv.time;

  const tbody = document.getElementById("printItems");
  tbody.innerHTML = "";

  inv.items.forEach((item, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${item.name}</td>
        <td>${item.serial}</td>
        <td>${item.quantity}</td>
        <td>${item.price} جنيه</td>
        <td>${item.total} جنيه</td>
      </tr>
    `;
  });

  document.getElementById("printTotalAmount").textContent =
    inv.totalAmount + " جنيه";

  box.scrollIntoView({ behavior: "smooth" });
};


window.printInvoice = function (id) {
  window.showInvoice(id);
  setTimeout(() => window.print(), 300);
};

init();

window.searchInvoices = function () {
  const text = document.getElementById("searchInput").value.trim().toLowerCase();
  const date = document.getElementById("searchDate").value;

  invoicesContainer.innerHTML = "";
  let count = 0;

  Object.keys(allInvoices).forEach(id => {
    const inv = allInvoices[id];

    let matchText = false;
    let matchDate = false;

    // بحث بالرقم أو اسم البائع
    if (text) {
      if (
        inv.invoiceNumber?.toString().includes(text) ||
        inv.seller?.name?.toLowerCase().includes(text)
      ) {
        matchText = true;
      }
    } else {
      matchText = true;
    }

    // بحث بالتاريخ
    if (date) {
      matchDate = inv.createdAt.toDate().toISOString().split("T")[0] === date;
    } else {
      matchDate = true;
    }

    if (matchText && matchDate) {
      count++;

      const card = document.createElement("div");
      card.className = "invoice-card";
      card.innerHTML = `
        <h4>فاتورة #${inv.invoiceNumber}</h4>
        <p>👤 البائع: ${inv.seller?.name || "—"}</p>
        <p>📅 ${inv.date}</p>
        <p>💰 ${inv.totalAmount} جنيه</p>

        <button onclick="showInvoice('${id}')">عرض</button>
        <button onclick="printInvoice('${id}')">طباعة</button>
      `;
      invoicesContainer.appendChild(card);
    }
  });

  document.getElementById("resultCount").textContent = count;
};

