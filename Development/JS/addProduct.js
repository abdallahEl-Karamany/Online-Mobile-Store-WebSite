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

var productName = document.getElementById("productName");
var productPrice = document.getElementById("productPrice");
var productVersion = document.getElementById("productVersion");
var productImage = document.getElementById("productImage");
var productPlatform = document.getElementById("productPlatform");
var addProduct = document.getElementById("btnAdd");
var cancel = document.getElementById("btnCancel");
var success = document.getElementById("success");
var error = document.getElementById("error");
var signOut = document.getElementById("signoutbtn");
var userId = null;

if (localStorage.getItem("userId") !== null) {
    userId = JSON.parse(localStorage.getItem("userId"));
} else {
    window.location = "../index.html";
}
addProduct.addEventListener("click", async () => {
    if (!validateForm()) {
        success.classList.add("d-none");
        error.classList.remove("d-none");
    } else {
        productImage = `Images/${productImage.files[0].name}`;
        try {
            await get(
                query(
                    ref(db, "Product"),
                    orderByChild("product_name"),
                    equalTo(productName.value)
                )
            ).then(async (snapshot) => {
                if (snapshot.exists()) {
                    error.classList.remove("d-none");
                    success.classList.add("d-none");
                    return;
                }
                await set(push(ref(db, `Product`)), {
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
            });
        } catch (error) {
            console.error("Error saving data: ", error);
        }
    }
});
cancel.addEventListener("click", () => {
    clearForm();
    window.location = "../Pages/supplier_home.html";
});

function clearForm() {
    document.getElementById("productName").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productVersion").value = "";
    document.getElementById("productImage").value = "";
    document.getElementById("productPlatform").value = "";
}

function validateForm() {
    var nameRegx = /^[A-Z][a-zA-Z]*_[A-Z][a-zA-Z]*_(\d+|\d+(\.\d+){2})*$/;
    var priceRegx = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
    var versionRegx = /^(\d+(\.\d+){2})*$/;
    var size = 300 * 1024;
    productImage = document.getElementById("productImage");
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
    } else if (imageValidation[0].size > size) {
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
