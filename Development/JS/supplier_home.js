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
    equalTo,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import firebaseConfig from "./db_config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

var userId = null;

if (localStorage.getItem("userId") !== null) {
    userId = JSON.parse(localStorage.getItem("userId"));
    console.log(userId);
    displayData();
} else {
    window.location = "../index.html";
}

async function displayData() {
    var cartona = "";

    try {
        const q = query(
            ref(db, "Product"),
            orderByChild("supplier_id"),
            equalTo(userId)
        );
        const snap = await get(q);
        const data = snap.val();
        if (data) {
            for (let i = 0; i < Object.keys(data).length; i++) {
                cartona += `<div class="col-2">
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
                            <div class="card-text text-center">${
                                data[Object.keys(data)[i]].product_price
                            } &#36; </div>
                        </div>
                    </div>
                </div>`;
            }
            document.getElementById("messoex").innerHTML = cartona;
        }
    } catch (err) {
        console.error("Firebase read error:", err);
    }
}
