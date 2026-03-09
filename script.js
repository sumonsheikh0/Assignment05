const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = usernameInput.value;
  const password = passwordInput.value;


  if (username === "admin" && password === "admin123") {
    window.location.href = "home.html";

  } else {
    alert("Wrong username or password");
  }

});

