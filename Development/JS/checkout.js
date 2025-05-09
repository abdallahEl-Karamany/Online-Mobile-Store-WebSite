import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
    getDatabase,
    ref,
    get,
    query,
    orderByChild,
    equalTo,
    set,
    push,
    remove,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import firebaseConfig from "./db_config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
// ensure user is logged in
const userId = JSON.parse(localStorage.getItem("userId"));
if (!userId) window.location = "../index.html";

const priceDetails = document.querySelector(".price-details");
const totalEl = priceDetails.querySelector(".total"); // Ensure totalEl is within priceDetails
let total = 0;
let items = [];
let products = {};

async function loadCheckout() {
    // fetch products
    const prodSnap = await get(ref(db, "Product"));
    products = prodSnap.exists() ? prodSnap.val() : {};

    // fetch cart for this user
    const cartQ = query(
        ref(db, "Cart"),
        orderByChild("client_id"),
        equalTo(userId)
    );
    const cartSnap = await get(cartQ);

    if (cartSnap.exists()) {
        cartSnap.forEach((s) => {
            const data = s.val();
            items = Array.isArray(data.items)
                ? data.items
                : Object.values(data.items || {});
        });
    }
    else {
        window.location.href='client_home.html'
    }

    items.forEach((item) => {
        const p = products[item.product_id];
        if (!p) return;

        const qty = item.quantity;
        const subtotal = p.product_price * qty;
        total += subtotal;

        const el = document.createElement("div");
        el.innerHTML = `<span>${p.product_name} ($${p.product_price}x${qty})</span><span>$${subtotal.toFixed(2)}</span>`;
        priceDetails.insertBefore(el, totalEl); // Insert before totalEl
    });

    totalEl.querySelector("strong:last-child").innerText = `$${total.toFixed(2)}`;
}

loadCheckout();


document.getElementById("place-order").addEventListener("click", async () => {
    try {

        // Create order
        const order = {
            client_id: userId,
            total,
            items,
            created_at: serverTimestamp()
        };
        await push(ref(db, "Order"), order);

        // Remove cart
        const cartRef = query(
            ref(db, "Cart"),
            orderByChild("client_id"),
            equalTo(userId)
        );
        const cartToRemove = await get(cartRef);
        if (cartToRemove.exists()) {
            cartToRemove.forEach(async (s) => {
                await remove(ref(db, `Cart/${s.key}`));
            });
        }

        // Show confirmation message
        const msg = document.getElementById("confirmation-msg");
        msg.textContent = "Your order is placed successfully.";

        setTimeout(() => {
            window.location.href = "client_home.html"; // Redirect to client home page
        }, 1500);
    } catch (err) {
        console.error("Order placement failed:", err);
    }
});
