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
var password = document.getElementById("userpassword");
var success = document.getElementById("success");
var error = document.getElementById("error");
var login = document.getElementById("logInBtn");

login.addEventListener("click", async () => {
    if (!validatePassword() && !validateUserName()) {
        password.classList.add("is-invalid");
        userName.classList.add("is-invalid");
        error.classList.remove("d-none");
        error.textContent = "username Or password is requird";
        return;
    } else if (!validateUserName()) {
        password.classList.remove("is-invalid");
        userName.classList.add("is-invalid");
        error.classList.remove("d-none");
        error.textContent = "username Or password is requird";
        return;
    } else if (!validatePassword()) {
        password.classList.add("is-invalid");
        userName.classList.remove("is-invalid");
        error.classList.remove("d-none");
        error.textContent = "username Or password is requird";
        return;
    } else {
        password.classList.remove("is-invalid");
        userName.classList.remove("is-invalid");
        error.classList.add("d-none");
        error.textContent = "Please enter valid username or password";

        const q = query(
            ref(db, "Users"),
            orderByChild("userName"),
            equalTo(userName.value)
        );

        try {
            const snap = await get(q);

            if (!snap.exists()) {
                success.classList.add("d-none");
                error.classList.remove("d-none");
                return;
            }

            let matched = false;

            snap.forEach((child) => {
                const userData = child.val();

                if (userData.password === password.value) {
                    matched = true;
                    success.classList.remove("d-none");
                    error.classList.add("d-none");

                    localStorage.setItem("userId", JSON.stringify(child.key));
                    console.log(userData.user_type);

                    if (userData.user_type === "supplier") {
                        setTimeout(() => {
                            window.location = "../Pages/supplier_home.html";
                        }, 1500);
                    } else {
                        setTimeout(() => {
                            window.location = "../Pages/client_home.html";
                        }, 1500);
                    }
                }
            });

            if (!matched) {
                success.classList.add("d-none");
                error.classList.remove("d-none");
                return;
            }
        } catch (err) {
            console.error("Firebase read error:", err);
        }
    }
});

function validateUserName() {
    var test = userName.value;

    if (test) {
        return true;
    } else {
        return false;
    }
}
function validatePassword() {
    var test = password.value;
    if (test) {
        return true;
    } else {
        return false;
    }
}
