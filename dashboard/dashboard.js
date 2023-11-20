document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token"); // Retrieve the token from local storage

  if (token) {
    // Retrieve the email from local storage
    const storedEmail = localStorage.getItem("userEmail");

    // Update the HTML with the user's email
    const containerElement = document.querySelector(".container");
    containerElement.textContent = `Welcome, ${storedEmail}`;
  } else {
    // Redirect to the login page if no token is found
    window.location.href = "./login.html";
  }

  document.getElementById("btn-logout").addEventListener("click", () => {
    localStorage.removeItem("token"); // Remove token from local storage
    window.location.href = "./login.html"; // Redirect to login page
  });
});
