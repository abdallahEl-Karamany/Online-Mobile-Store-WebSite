var search = document.getElementById("search");
var productList = [];
var index;
if (localStorage.getItem("productcontainer") !== null) {
    productList = JSON.parse(localStorage.getItem("productcontainer"));
    displayData();
}
function cancelUpdate() {
    search.value = "";

    displayData();
}
function updateItem(indexItem) {
    index = indexItem;
    console.log(indexItem);

    document.getElementById("updateForm").classList.remove("d-none");
    document.getElementById("productName").value = productList[indexItem].name;

    document.getElementById("productPrice").value =
        productList[indexItem].price;

    document.getElementById("productVersion").value =
        productList[indexItem].version;
    document.getElementById("productPlatform").value =
        productList[indexItem].platform;
}
function updateProduct() {
    var productName = document.getElementById("productName");
    var productPrice = document.getElementById("productPrice");

    var productVersion = document.getElementById("productVersion");
    var productImage = document.getElementById("productImage");
    var productPlatform = document.getElementById("productPlatform");
    if (validateForm() == true) {
        productList[index].name = productName.value;
        productList[index].price = productPrice.value;
        productList[index].platform = productPlatform.value;
        productList[index].version = productVersion.value;
        if (productImage.files.length !== 0) {
            productList[index].image = `Images/${productImage.files[0].name}`;
        }
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
function deleteItem(indexItem) {
    productList.splice(indexItem, 1);
    localStorage.setItem("productcontainer", JSON.stringify(productList));
    displayData();
}

function displayData() {
    var term = search.value;
    var cartona = "";
    for (i = 0; i < productList.length; i++) {
        if (
            productList[i].name.toLowerCase() == term.toLowerCase() &&
            term.length > 0
        ) {
            cartona += `<div class="card bg-light border-0 shadow-sm mb-4 " >
                        <div class="card-body p-4">
                        <img src="../${productList[i].image}" class="img-fluid rounded mb-3" alt="Product Image">
                        <div class="text-center">
                            <div class="d-flex justify-content-center gap-2 mb-3">
                    <button onclick="updateItem(${i})" class="btn btn-dark rounded-5">Update</button>
                    <button onclick="deleteItem(${i})" class="btn btn-dark rounded-5">Delete</button></div>
                            </div>
                            <div class="text-center">
                            <h5 class="mb-0">${productList[i].name} </h5>
                            <p class="text-muted">${productList[i].price}</p>
                        </div>
                        </div>
                        </div>`;
        } else if (term.length == 0) {
            document.getElementById("updateForm").classList.add("d-none");
            cartona += `<div class="card bg-light border-0 shadow-sm mb-4 " >
                    <div class="card-body p-4">
                        <img src="../${productList[i].image}" class="img-fluid rounded mb-3" alt="Product Image">
                        <div class="text-center">
                            <h5 class="mb-0">${productList[i].name} </h5>
                            <p class="text-muted">${productList[i].price}</p>
                        </div>
                        </div>`;
        } else if (
            productList[i].name.toLowerCase().includes(term.toLowerCase())
        ) {
            document.getElementById("updateForm").classList.add("d-none");
            cartona += `<div class="card bg-light border-0 shadow-sm mb-4 " >
                            <div class="card-body p-4">
                                <img src="../${productList[i].image}" class="img-fluid rounded mb-3" alt="Product Image">
                                <div class="text-center">
                                    <div class="text-center">
                                    <h5 class="mb-0">${productList[i].name} </h5>
                                    <p class="text-muted">${productList[i].price}</p>
                                </div>
                            </div>
                        </div>`;
        }
    }
    document.getElementById("messoex").innerHTML = cartona;
}

function validateForm() {
    var x = "";
    for (let i = 0; i < productList.length; i++) {
        if (productList[i].name === productName.value && index !== i) {
            x = false;
        } else {
            x = true;
        }
    }
    console.log(x);

    var nameRegx = /^[A-Z][a-zA-Z]*_[A-Z][a-zA-Z]*_(\d+|\d+(\.\d+){2})*$/;
    var priceRegx = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
    var versionRegx = /^(\d+(\.\d+){2})*$/;
    var imageValidation = productImage.files;
    if (nameRegx.test(productName.value) == false || x === false) {
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
    } else if (productImage.files.length !== 0) {
        if (imageValidation[0].size > 300 * 1024) {
            document.getElementById("productImage").classList.add("is-invalid");
            document
                .getElementById("productName")
                .classList.remove("is-invalid");
            document
                .getElementById("productVersion")
                .classList.remove("is-invalid");
            document
                .getElementById("productPlatform")
                .classList.remove("is-invalid");
            document
                .getElementById("productPrice")
                .classList.remove("is-invalid");

            return false;
        }
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
