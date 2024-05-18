const form = {
    aadharCardNumber: document.querySelector("#aadharCardNumber-field"),
    password: document.querySelector("#password-field"),
    submit: document.querySelector("#login-form-submit"),
    messages:document.getElementById("error-msg-second-line")
};

let button = form.submit.addEventListener("click", (e)=> {
    e.preventDefault();
    const login = 'http://localhost:3000/user/login';
    window.location.replace("www.google.com")
    fetch(login, {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            aadharCardNumber: form.aadharCardNumber.value,
            password: form.password.value,
          }),
        })
          .then((response) => response.json())
          .then((data) => console.log(data))
          .catch((err) => {
            console.log(err);
           });
});

