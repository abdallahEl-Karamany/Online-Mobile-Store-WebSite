var productName = document.getElementById("productName");
var productPrice = document.getElementById("productPrice");

var productVersion = document.getElementById("productVersion");
var productImage = document.getElementById("productImage");
var productPlatform = document.getElementById("productPlatform");

var productList = [];
if (localStorage.getItem("productcontainer") !== null) {
    productList = JSON.parse(localStorage.getItem("productcontainer"));
}
function addProduct() {
    if (validateForm() == true) {
        productImage = `Images/${productImage.files[0].name}`;
        var proudct = {
            name: productName.value,
            price: productPrice.value,
            version: productVersion.value,
            image: productImage,
            platform: productPlatform.value,
        };
        productList.push(proudct);
        localStorage.setItem("productcontainer", JSON.stringify(productList));
        document.getElementById("error").classList.add("d-none");
        document.getElementById("success").classList.remove("d-none");
        setTimeout(() => {
            window.location = "../index.html";
        }, 1500);
    } else {
        document.getElementById("success").classList.add("d-none");
        document.getElementById("error").classList.remove("d-none");
    }
}
function cancel() {
    clearForm();
    window.location = "../index.html";
}
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
    var imageValidation = productImage.files;
    if (
        nameRegx.test(productName.value) == false ||
        productList.some(
            (productList) => productList.name === productName.value
        )
    ) {
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
    } else if (productImage.files.length === 0) {
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
