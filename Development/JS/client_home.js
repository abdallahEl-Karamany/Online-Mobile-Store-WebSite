import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    get,
    child,
    remove,
    push,
    query,
    orderByChild,
    update,
    equalTo,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import firebaseConfig from "./db_config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
var cartItem = [];
var userId = null;
var success = document.getElementById("success");
var cartCount = document.getElementById("cartCount");
var product_id;
var xname = [];
if (localStorage.getItem("userId") !== null) {
    userId = JSON.parse(localStorage.getItem("userId"));

    displayData();
} else {
    window.location = "../index.html";
}

async function displayData() {
    var cartona = "";

    try {
        const q = query(ref(db, "Product"));
        const snaps = await get(q);
        const data = snaps.val();
        const snap = await get(
            query(ref(db, "Cart"), orderByChild("client_id"), equalTo(userId))
        );
        if (snap.exists()) {
            snap.forEach((child) => {
                var data = child.val();
                if (data.items) {
                    for (let i = 0; i < data.items.length; i++) {
                        xname.push(data.items[i].product_id);
                    }
                }
                cartCount.innerText = `(${data.items.length})`;
            });
        } else {
            cartCount.innerText = `(0)`;
        }

        for (let i = 0; i < Object.keys(data).length; i++) {
            if (xname.includes(Object.keys(data)[i])) {
                cartona += `<div class="col-3">
                <div class="card text-dark  mb-3 mb-3 w-100">
                    <div class="card-body">
                        <div class="card-img ">
                            <img class="w-100" src="../${
                                data[Object.keys(data)[i]].product_photo
                            }" alt="Iphone">
                        </div>
                        <div class="card-text text-center">${
                            data[Object.keys(data)[i]].product_name
                        } </div>
                        <div class="card-text text-center">
                            <div class="d-flex justify-content-evenly mt-3 mb-2">
                                <button id="removeFromCart/${i}" class="btn shadow-sm w-50 rounded-5">
                                    Remove
                                </button>
                                ${
                                    data[Object.keys(data)[i]].product_price
                                } &#36; 
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
            } else {
                cartona += `<div class="col-3">
                <div class="card text-dark  mb-3 mb-3 w-100">
                    <div class="card-body">
                        <div class="card-img ">
                            <img class="w-100" src="../${
                                data[Object.keys(data)[i]].product_photo
                            }" alt="Iphone">
                        </div>
                        <div class="card-text text-center">${
                            data[Object.keys(data)[i]].product_name
                        } </div>
                        <div class="card-text text-center">
                            <div class="d-flex justify-content-evenly mt-3 mb-2">
                                <button id="addToCart/${i}" class="btn btn-dark w-50 rounded-5">
                                    Add To Cart
                                </button>
                                ${
                                    data[Object.keys(data)[i]].product_price
                                } &#36; 
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
            }
        }
        document.getElementById("messoex").innerHTML = cartona;
        document.addEventListener("click", (e) => {
            var btnId = e.target.id;
            var rev = document.getElementById(`${btnId}`);

            if (btnId.includes("addToCart")) {
                var id = btnId.split("/");

                product_id = Object.keys(data)[id[1]];

                addToCart();
                async function addToCart() {
                    try {
                        if (snap.exists()) {
                            snap.forEach(async (child) => {
                                var oldData = child.val();
                                if (!oldData.items) {
                                    cartItem = [];
                                    cartItem.push({
                                        product_id: product_id,
                                        quantity: 1,
                                    });
                                } else {
                                    cartItem = oldData.items;
                                    cartItem.push({
                                        product_id: product_id,
                                        quantity: 1,
                                    });
                                }
                                var cartId = child.key;

                                await update(ref(db, `Cart/${cartId}`), {
                                    items: cartItem,
                                    client_id: userId,
                                });
                            });
                        } else {
                            cartItem.push({
                                product_id: product_id,
                                quantity: 1,
                            });
                            await set(push(ref(db, `Cart`)), {
                                items: cartItem,
                                client_id: userId,
                            });
                        }
                        success.classList.remove("d-none");

                        setTimeout(() => {
                            window.location = "../Pages/client_home.html";
                        }, 1500);
                    } catch (error) {
                        console.log(error);
                    }
                }
            } else if (btnId.includes("removeFromCart")) {
                try {
                    var id = btnId.split("/");

                    product_id = Object.keys(data)[id[1]];

                    snap.forEach(async (child) => {
                        var oldData = child.val();
                        var cartId = child.key;
                        cartItem = oldData.items;
                        console.log(cartItem.length);

                        var index = cartItem.findIndex(
                            (items) => items.product_id === product_id
                        );
                        if (cartItem.length === 1) {
                            await remove(ref(db, `Cart/${cartId}`));
                        } else {
                            cartItem.splice(index, 1);
                            await update(ref(db, `Cart/${cartId}`), {
                                items: cartItem,
                                client_id: userId,
                            });
                        }

                        setTimeout(() => {
                            window.location = "../Pages/client_home.html";
                        }, 1500);
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        });
    } catch (err) {
        console.error("Firebase read error:", err);
    }
}
