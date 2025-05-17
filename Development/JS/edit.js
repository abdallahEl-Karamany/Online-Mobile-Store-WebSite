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
    update,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import firebaseConfig from "./db_config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
var search = document.getElementById("search");
var enableHide = document.getElementById("updateForm");
var productName = document.getElementById("productName");
var productPrice = document.getElementById("productPrice");
var design = null;
var productVersion = document.getElementById("productVersion");
var productImage = document.getElementById("productImage");
var productPlatform = document.getElementById("productPlatform");
var cancel = document.getElementById("btnCancel");
var updateProduct = document.getElementById("updateProduct");
var success = document.getElementById("success");
var error = document.getElementById("error");
var deleted = document.getElementById("deleted");
var signOut = document.getElementById("signoutbtn");

search.addEventListener("input", displayData);
var product_id = null;
var index = null;
var userId = null;
deleted.classList.add("d-none");

if (localStorage.getItem("userId") !== null) {
    userId = JSON.parse(localStorage.getItem("userId"));
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
        var term = search.value;
        var cartona = "";
        for (let i = 0; i < Object.keys(data).length; i++) {
            if (
                data[Object.keys(data)[i]].product_name ==
                    term &&
                term.length > 0
            ) {
                product_id = Object.keys(data)[i];
                index = i;
                design = "with";
                document.getElementById("with").classList.remove("d-none");
                document.getElementById("without").classList.add("d-none");
                cartona += `
                        <div class="card text-dark  mb-3 mb-3 w-100">
                            <div class="card-body">
                                <div class="card-img ">
                                    <img class="w-100" src="../${
                                        data[Object.keys(data)[i]].product_photo
                                    }" alt="Iphone">
                                </div>
                                <div class="text-center">
                                    <div class="d-flex justify-content-center gap-2 mb-3">
                            <button id="updateItem" class="btn btn-dark rounded-5">Update</button>
                            <button id="deleteItem" class="btn btn-dark rounded-5">Delete</button></div>
                                    </div>
                                <div class="card-text text-center">${
                                    data[Object.keys(data)[i]].product_name
                                } </div>
                                <div class="card-text text-center">${
                                    data[Object.keys(data)[i]].product_price
                                } &#36; </div>
                            </div>
                        </div>
                    `;
                setTimeout(() => {
                    var updateItem = document.getElementById("updateItem");
                    updateItem.addEventListener("click", () => {
                        enableHide.classList.remove("d-none");
                        productName.value =
                            data[Object.keys(data)[i]].product_name;

                        productPrice.value =
                            data[Object.keys(data)[i]].product_price;

                        productVersion.value =
                            data[Object.keys(data)[i]].product_version;

                        productPlatform.value =
                            data[Object.keys(data)[i]].product_platform;
                    });
                }, 0);
                setTimeout(() => {
                    var deleteItem = document.getElementById("deleteItem");
                    deleteItem.addEventListener("click", async () => {
                        const snap = await get(query(ref(db, "Cart")));
                        snap.forEach(async (child) => {
                            var oldData = child.val();
                            var cartId = child.key;
                            var cartItem = [];
                            cartItem = oldData.items;
                            console.log(product_id);

                            var index = cartItem.findIndex(
                                (items) => items.product_id === product_id
                            );
                            console.log(index);

                            if (cartItem.length === 1) {
                                await remove(ref(db, `Cart/${cartId}`));
                            } else {
                                cartItem.splice(index, 1);
                                await update(ref(db, `Cart/${cartId}`), {
                                    items: cartItem,
                                });
                            }
                        });
                        await remove(ref(db, `Product/${product_id}`));
                        deleted.classList.remove("d-none");
                        setTimeout(() => {
                            search.value = "";
                            window.location = "../Pages/edit.html";
                        }, 1500);
                    });
                }, 0);
            } else if (term.length == 0) {
                document.getElementById("with").classList.add("d-none");
                document.getElementById("without").classList.remove("d-none");
                design = "without";
                enableHide.classList.add("d-none");
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
            } else if (
                data[Object.keys(data)[i]].product_name
                    .includes(term)
            ) {
                enableHide.classList.add("d-none");
                document.getElementById("with").classList.add("d-none");
                document.getElementById("without").classList.remove("d-none");
                design = "without";
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
        }

        document.getElementById(`${design}`).innerHTML = cartona;
    } catch (err) {
        console.error("Firebase read error:", err);
    }
}
cancel.addEventListener("click", () => {
    search.value = "";

    displayData();
});

updateProduct.addEventListener("click", async (id) => {
    id = product_id;
    if (!validateForm()) {
        success.classList.add("d-none");
        error.classList.remove("d-none");
    } else {
        var productImage = document.getElementById("productImage");

        productImage = `Images/${productImage.files[0].name}`;
        try {
            const x = query(
                ref(db, "Product"),
                orderByChild("product_name"),
                equalTo(productName.value)
            );
            const snap = await get(x);
            const olddata = snap.val();
            if (olddata) {
                if (id !== Object.keys(olddata)[0]) {
                    error.classList.remove("d-none");
                    success.classList.add("d-none");
                    return;
                }
            }

            await update(ref(db, `Product/${product_id}`), {
                product_name: productName.value,
                product_photo: productImage,
                product_price: productPrice.value,
                product_version: productVersion.value,
                product_platform: productPlatform.value,
                supplier_id: userId,
            });
            success.classList.remove("d-none");
            error.classList.add("d-none");
            setTimeout(() => {
                window.location = "../Pages/supplier_home.html";
            }, 1500);
        } catch (error) {
            console.error("Error saving data: ", error);
        }
    }
});

function validateForm() {
    var productVersion = document.getElementById("productVersion");
    var productImage = document.getElementById("productImage");
    var productPlatform = document.getElementById("productPlatform");
    var productName = document.getElementById("productName");
    var productPrice = document.getElementById("productPrice");
    var nameRegx = /^[A-Z][a-zA-Z]*_[A-Z][a-zA-Z]*_(\d+|\d+(\.\d+){2})*$/;
    var priceRegx = /^([1-9]\d*)(\.\d{1,2})?$/;
    var versionRegx = /^(\d+(\.\d+){2})*$/;
    var imageValidation = productImage.files;

    if (nameRegx.test(productName.value) == false) {
        document.getElementById("productName").classList.add("is-invalid");
        document
            .getElementById("productPlatform")
            .classList.remove("is-invalid");
        document.getElementById("productPrice").classList.remove("is-invalid");
        document.getElementById("productImage").classList.remove("is-invalid");
        document
            .getElementById("productVersion")
            .classList.remove("is-invalid");
        return false;
    } else if (imageValidation.length === 0) {
        document.getElementById("productImage").classList.add("is-invalid");
        document.getElementById("productName").classList.remove("is-invalid");
        document
            .getElementById("productVersion")
            .classList.remove("is-invalid");
        document
            .getElementById("productPlatform")
            .classList.remove("is-invalid");
        document.getElementById("productPrice").classList.remove("is-invalid");
        return false;
    } else if (imageValidation[0].size > 300 * 1024) {
        document.getElementById("productImage").classList.add("is-invalid");
        document.getElementById("productName").classList.remove("is-invalid");
        document
            .getElementById("productVersion")
            .classList.remove("is-invalid");
        document
            .getElementById("productPlatform")
            .classList.remove("is-invalid");
        document.getElementById("productPrice").classList.remove("is-invalid");

        return false;
    } else if (priceRegx.test(productPrice.value) == false) {
        document.getElementById("productPrice").classList.add("is-invalid");
        document.getElementById("productName").classList.remove("is-invalid");
        document.getElementById("productImage").classList.remove("is-invalid");
        document
            .getElementById("productVersion")
            .classList.remove("is-invalid");
        document
            .getElementById("productPlatform")
            .classList.remove("is-invalid");

        return false;
    } else if (versionRegx.test(productVersion.value) == false) {
        document.getElementById("productPrice").classList.remove("is-invalid");
        document.getElementById("productImage").classList.remove("is-invalid");
        document.getElementById("productName").classList.remove("is-invalid");
        document.getElementById("productVersion").classList.add("is-invalid");
        document
            .getElementById("productPlatform")
            .classList.remove("is-invalid");

        return false;
    } else if (productPlatform.value == "0") {
        document.getElementById("productPlatform").classList.add("is-invalid");
        document.getElementById("productPrice").classList.remove("is-invalid");
        document.getElementById("productImage").classList.remove("is-invalid");
        document.getElementById("productName").classList.remove("is-invalid");
        document
            .getElementById("productVersion")
            .classList.remove("is-invalid");
        return false;
    } else {
        document
            .getElementById("productPlatform")
            .classList.remove("is-invalid");
        document.getElementById("productPrice").classList.remove("is-invalid");
        document.getElementById("productImage").classList.remove("is-invalid");
        document.getElementById("productName").classList.remove("is-invalid");
        document
            .getElementById("productVersion")
            .classList.remove("is-invalid");
        return true;
    }
}
signOut.addEventListener("click", () => {
    localStorage.removeItem("userId");
    location.reload();
});
