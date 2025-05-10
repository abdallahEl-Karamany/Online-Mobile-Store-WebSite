import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
    getDatabase,
    ref,
    get,
    query,
    orderByChild,
    equalTo,
    update,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import firebaseConfig from "./db_config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
var signOut = document.getElementById("signoutbtn");

// ensure user is logged in
const userId = JSON.parse(localStorage.getItem("userId"));
if (!userId) window.location = "../index.html";

const cartContainer = document.getElementById("cart-items");
const totalEl = document.getElementById("totalAmount");

async function loadCart() {
    // fetch products
    const prodSnap = await get(ref(db, "Product"));
    const products = prodSnap.exists() ? prodSnap.val() : {};

    // fetch cart for this user
    const cartQ = query(
        ref(db, "Cart"),
        orderByChild("client_id"),
        equalTo(userId)
    );
    const cartSnap = await get(cartQ);

    let items = [];
    if (cartSnap.exists()) {
        cartSnap.forEach((s) => {
            const data = s.val();
            items = Array.isArray(data.items)
                ? data.items
                : Object.values(data.items || {});
        });
    }

    // render
    cartContainer.innerHTML = "";
    let total = 0;

    items.forEach((item) => {
        const p = products[item.product_id];
        if (!p) return;

        const qty = item.quantity;
        const subtotal = p.product_price * qty;
        total += subtotal;

        const el = document.createElement("div");
        el.className = "cart-item";
        el.innerHTML = `
      <img src="../${p.product_photo}" alt="${p.product_name}" />
      <div class="item-details">
        <p class="product-name">${p.product_name}</p>
        <div class="quantity-selector">
          <select class="quantity-select" data-id="${item.product_id}">
            ${[...Array(10).keys()]
                .map((n) => n + 1)
                .map(
                    (i) =>
                        `<option value="${i}" ${
                            i === qty ? "selected" : ""
                        }>${i}</option>`
                )
                .join("")}
          </select>
        </div>
        <p class="subtotal">Subtotal: $${subtotal.toFixed(2)}</p>
      </div>
    `;
        cartContainer.appendChild(el);

        // wire quantity change
        el.querySelector(".quantity-select").addEventListener(
            "change",
            async (e) => {
                const newQty = +e.target.value;
                await updateQuantity(item.product_id, newQty);
                loadCart();
            }
        );
    });

    totalEl.innerText = total.toFixed(2);
}

async function updateQuantity(productId, newQty) {
    const cartQ = query(
        ref(db, "Cart"),
        orderByChild("client_id"),
        equalTo(userId)
    );
    const snap = await get(cartQ);
    if (!snap.exists()) return;

    snap.forEach(async (c) => {
        const cartId = c.key;
        const data = c.val();
        const items = data.items || [];
        const idx = items.findIndex((i) => i.product_id === productId);
        if (idx < 0) return;

        items[idx].quantity = newQty;
        await update(ref(db, `Cart/${cartId}`), { items });
    });
}

loadCart();

signOut.addEventListener("click", () => {
    localStorage.removeItem("userId");
    location.reload();
});
