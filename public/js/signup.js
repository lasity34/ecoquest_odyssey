
// Dom references elements
const username = document.querySelector(".username");
const email = document.querySelector(".email");
const password = document.querySelector(".password");

// Button reference
const signupBtn = document.querySelector(".signupBtn");

// Message reference
const message = document.querySelector(".message");

// Events
signupBtn.addEventListener("click", () => {
    const user = {
        name: username.value,
        email: email.value,
        password: password.value
    };

    const signup = () => {
        const url = "http://localhost:3014/api/signup/user";
        return axios.post(url, user);
    };

    signup().then(result => {
        // get the error
        const { error } = result.data;

        if (error) {
            message.innerHTML = error;
            // add danger later on
            message.classList.add("danger");

            // Set values to ""
            username.value = "";
            email.value = "";
            password.value = "";

            setTimeout(() => {
                message.innerHTML = "";
            }, 3000);

            return;
        };

        window.location.href = "login.html";
    });

});