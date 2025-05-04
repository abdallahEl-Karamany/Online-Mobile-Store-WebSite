var productList = [];

if (localStorage.getItem("productcontainer") !== null) {
    productList = JSON.parse(localStorage.getItem("productcontainer"));
    displayData();
}
console.log(productList);

function displayData() {
    var cartona = "";
    for (i = 0; i < productList.length; i++) {
        cartona += `<div class="col-2">
            <div class="card text-dark  mb-3 mb-3 w-100">
                <div class="card-body">
                    <div class="card-img ">
                        <img class="w-100" src="${productList[i].image}" alt="Iphone">
                    </div>
                    <div class="card-text text-center">${productList[i].name} </div>
                    <div class="card-text text-center">${productList[i].price} &#36; </div>
                </div>
            </div>
        </div>`;
    }
    document.getElementById("messoex").innerHTML = cartona;
}
