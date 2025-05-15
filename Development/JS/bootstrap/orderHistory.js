import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
    getDatabase,
    ref,
    get,
    child
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import firebaseConfig from "./db_config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const userId = JSON.parse(localStorage.getItem("userId"));
const cartContainer = document.querySelector(".cart-container");

async function loadOrderHistory() {
    if (!userId) {
        cartContainer.innerHTML = "<div class='text-danger'>User not logged in.</div>";
        return;
    }

    try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `Orders/${userId}`));

        if (snapshot.exists()) {
            const orders = snapshot.val();
            let html = `<div class="cart-title">Order History</div>`;

            for (const orderId in orders) {
                const order = orders[orderId];
                html += `
                    <div class="client-info">
                        Order #: ${orderId} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Date: ${order.date || "N/A"}
                    </div>
                `;

                order.items.forEach((item) => {
                    html += `
                        <div class="product">
                            <img src="${item.image}" alt="${item.name}" />
                            <div class="product-details">
                                <strong>${item.name}</strong> $${item.price} <br/>
                                Qty: ${item.quantity} &nbsp;&nbsp; Total: $${(item.price * item.quantity).toFixed(2)} <br/>
                                Shipped to: ${order.address || "N/A"} <br/>
                                Status: ${order.status || "Pending"}
                            </div>
                        </div>
                    `;
                });
            }

            html += `
                <div class="back-btn">
                    <button onclick="history.back()" class="checkout-btn">Back</button>
                </div>
            `;

            cartContainer.innerHTML = html;
        } else {
            cartContainer.innerHTML = "<div class='text-warning'>No orders found.</div>";
        }
    } catch (error) {
        console.error("Error loading order history:", error);
        cartContainer.innerHTML = "<div class='text-danger'>Error loading orders.</div>";
    }
}

window.addEventListener("DOMContentLoaded", loadOrderHistory);
