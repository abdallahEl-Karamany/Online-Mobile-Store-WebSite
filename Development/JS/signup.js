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

var userName = document.getElementById("userName");
var email = document.getElementById("userEmail");
var password = document.getElementById("userPassword");
var confirmPassword = document.getElementById("userConfirmPassword");
var address = document.getElementById("userAddress");
var phoneNumber = document.getElementById("phoneNumber");
var nationalId = document.getElementById("userNationalId");
var userType = document.getElementById("userType");
var success = document.getElementById("success");
var error = document.getElementById("error");
var signUp = document.getElementById("signUpBtn");

if (signUp) {
    signUp.addEventListener("click", async () => {
        if (
            !validateUserName() ||
            !validateEmail() ||
            !validatePassword() ||
            !validateConfirmPassword() ||
            !validateAddress() ||
            !validatePhoneNumber() ||
            !validateNationalId() ||
            !validateUserType()
        ) {
            success.classList.add("d-none");
            error.classList.remove("d-none");
            return;
        }
        try {
            await get(
                query(
                    ref(db, "Users"),
                    orderByChild("userName"),
                    equalTo(userName.value)
                )
            ).then(async (snapshot) => {
                if (snapshot.exists()) {
                    error.classList.remove("d-none");
                    success.classList.add("d-none");
                    return;
                }
                await set(push(ref(db, `Users`)), {
                    userName: userName.value,
                    email: email.value,
                    password: password.value,
                    address: address.value,
                    phone_number: phoneNumber.value,
                    national_id: nationalId.value,
                    user_type: userType.value,
                });
                success.classList.remove("d-none");
                error.classList.add("d-none");
                setTimeout(() => {
                    window.location = "../index.html";
                }, 1500);
            });
        } catch (error) {
            console.error("Error saving data: ", error);
        }
    });
}

function validateUserName() {
    var test = userName.value;
    var regex = /^[A-Za-z]{1,}$/;

    if (regex.test(test) == true) {
        userName.classList.remove("is-invalid");
        return true;
    } else {
        userName.classList.add("is-invalid");
        return false;
    }
}
function validateEmail() {
    var test = email.value;
    var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/;
    if (regex.test(test) == true) {
        email.classList.remove("is-invalid");

        return true;
    } else {
        email.classList.add("is-invalid");

        return false;
    }
}
function validatePassword() {
    var test = password.value;
    var regex = /^[A-Za-z0-9@#$%^&+=!]{8,}$/;
    if (regex.test(test) == true) {
        password.classList.remove("is-invalid");

        return true;
    } else {
        password.classList.add("is-invalid");

        return false;
    }
}
function validateConfirmPassword() {
    if (password.value === confirmPassword.value) {
        confirmPassword.classList.remove("is-invalid");

        return true;
    } else {
        confirmPassword.classList.add("is-invalid");

        return false;
    }
}
function validateAddress() {
    var test = address.value;
    var regex = /^[a-zA-Z0-9]{5,40}$/;

    if (regex.test(test) == true) {
        address.classList.remove("is-invalid");

        return true;
    } else {
        address.classList.add("is-invalid");

        return false;
    }
}
function validatePhoneNumber() {
    var test = phoneNumber.value;
    var regex = /^\+201[0125][0-9]{8}$/;
    if (regex.test(test) == true) {
        phoneNumber.classList.remove("is-invalid");

        return true;
    } else {
        phoneNumber.classList.add("is-invalid");
        return false;
    }
}
function validateNationalId() {
    var test = nationalId.value;
    var regex = /^([2-3])(\d{2})([01]\d)([0-3]\d)(\d{2})(\d{5})$/;
    if (regex.test(test) == true) {
        nationalId.classList.remove("is-invalid");

        return true;
    } else {
        nationalId.classList.add("is-invalid");

        return false;
    }
}
function validateUserType() {
    if (userType.value !== 0) {
        userType.classList.remove("is-invalid");
        return true;
    } else {
        userType.classList.add("is-invalid");
        return false;
    }
}
