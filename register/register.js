const registerForm = document.getElementById("register-form");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email-address").value;
  const password = document.getElementById("password").value;
  const confirmedPassword = document.getElementById(
    "password-confirmation"
  ).value;
  const messageContainer = document.getElementById("message-container");

  if (password !== confirmedPassword) {
    displayErrorMessage("Passwords do not match", messageContainer);
    resetPasswords();
    return;
  }

  try {
    const response = await fetch(
      "https://dev-api-when-time-tracker.iplugx.ir/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    // Check if the registration was successful
    if (response.ok) {
      displaySuccessMessage("Registration successful", messageContainer);
      setTimeout(() => {
        window.location.href = "./login.html";
      }, 3000);
    } else {
      const result = await response.json();
      const errorMessage = result.detail;

      // Display the failure message
      displayErrorMessage(errorMessage, messageContainer);
      resetAllFields();
    }
  } catch (error) {
    // Get the specific error message
    const errorMessage = error.message;

    // Translate the error message to a more user-friendly format
    const userFriendlyErrorMessage = {
      "net::ERR_CONNECTION_CLOSED":
        "Couldn't connect to the server. Please check your internet connection and try again.",
      // Other error messages
    };

    // Display the error message in the unexpected error div
    displayErrorMessage(
      userFriendlyErrorMessage[errorMessage] ||
        "An unexpected error occurred. Please try again later.",
      messageContainer
    );

    resetAllFields();
  }
});

function resetAllFields() {
  document.getElementById("email-address").value = "";
  document.getElementById("password").value = "";
  document.getElementById("password-confirmation").value = "";
}

function resetPasswords() {
  document.getElementById("password").value = "";
  document.getElementById("password-confirmation").value = "";
}

document.getElementById("btn-login").addEventListener("click", () => {
  localStorage.removeItem("token"); // Remove token from local storage
  localStorage.removeItem("userEmail");
  window.location.href = "./login.html"; // Redirect to login page
});

function displayErrorMessage(errorMessage, messageContainer) {
  messageContainer.innerHTML = `<p class="message error">${errorMessage}</p>`;
  messageContainer.style.display = "block";
  setTimeout(() => {
    messageContainer.style.display = "none";
  }, 4000);
}

function displaySuccessMessage(successMessage, messageContainer) {
  messageContainer.innerHTML = `<p class="message success">${successMessage}</p>`;
  messageContainer.style.display = "block";
  setTimeout(() => {
    messageContainer.style.display = "none";
  }, 4000);
}
