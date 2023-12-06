
// Dom references elements
const usernameOrEmail = document.querySelector(".usernameOrEmail");
const password = document.querySelector(".password");

// Button reference
const loginBtn = document.querySelector(".loginBtn");

// Message reference
const message = document.querySelector(".message");

// Events
loginBtn.addEventListener("click", () => {
    const user = {
        usernameOrEmail: usernameOrEmail.value,
        password: password.value
    };

    const login = () => {
        const url = "http://localhost:3014/api/login/user";
        return axios.post(url, user);
    };

    login().then(result => {
        // get the error
        const { error } = result.data;

        if (error) {
            message.innerHTML = error;
            // add danger later on
            message.classList.add("danger");

            // Set values to ""
            usernameOrEmail.value = "";
            password.value = "";

            setTimeout(() => {
                message.innerHTML = "";
            }, 3000);

            return;
        };

        const token = result.data.token;
        const userId = result.data.loggedUserId;

        // Set values to ""
        usernameOrEmail.value = "";
        password.value = "";

        localStorage.setItem("data", JSON.stringify({token: token, userId: userId}));
    });

});