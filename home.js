let signup = document.querySelector(".signup");
let login = document.querySelector(".login");
let slider = document.querySelector(".slider");
let formSection = document.querySelector(".form-section");

signup.addEventListener("click", () => {
	slider.classList.add("moveslider");
	formSection.classList.add("form-section-move");
});

const form2 = {
	name: document.querySelector(".name"),
	email1: document.querySelector("#email"),
	pass1:document.querySelector("#password"),
	role: document.querySelector(".role"),
	register: document.querySelector("#register")
};

form2.register.addEventListener("click", (e)=> {
	e.preventDefault();
	const signup = 'https://blockchain-based-docvault.netlify.app/user/signup';
	//window.location.replace("www.google.com")
	fetch(signup, {
		  method: "POST",
		  headers: {
			Accept: "application/json, text/plain, */*",
			"Content-Type": "application/json",
		  },
		  body: JSON.stringify({
			name: form2.name.value,
			email: form2.email1.value,
			password: form2.pass1.value,
			role: form2.role.value
		  }),
		})
		  .then((response) => response.json())
		  .then((data) => console.log(data))
		  .catch((err) => {
			console.log(err);
		   });
});

login.addEventListener("click", () => {
	slider.classList.remove("moveslider");
	formSection.classList.remove("form-section-move");
});
const form = {
	email: document.querySelector(".email"),
	password: document.querySelector(".password"),
	submit: document.querySelector("#submit")
};

form.submit.addEventListener("click", (e)=> {
	e.preventDefault();
	const login = 'https://blockchain-based-docvault.netlify.app/user/login';
	//window.location.replace("www.google.com")
	fetch(login, {
		  method: "POST",
		  headers: {
			Accept: "application/json, text/plain, */*",
			"Content-Type": "application/json",
		  },
		  body: JSON.stringify({
			email: form.email.value,
			password: form.password.value,
		  }),
		})
		  .then((response) => {
			if(!response.ok){
				throw new Error('Login failed')}
			return response.json()})
		  .then((data) => {console.log(data)
			const token = data.token;
			localStorage.setItem('token', token);
			window.location.href = '/profile.html';
})
		  .catch((err) => 
			console.log(err))
});








