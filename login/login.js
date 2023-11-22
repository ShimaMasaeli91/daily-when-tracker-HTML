document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");

  // Check if the token exists in local storage
  const token = localStorage.getItem("token");

  if (token && token !== "undefined") {
    // If the token exists, redirect to the index.html
    window.location.href = "./index.html";
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email-address").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(
        "https://dev-api-when-time-tracker.iplugx.ir/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      // Check if the login was successful
      if (response.ok) {
        const data = await response.json();

        const token = data.token;

        // Store the token in local storage
        localStorage.setItem("token", token);
        // Store the email address regardless of login success or failure
        localStorage.setItem("userEmail", email);

        // Display the success message for 5 seconds then redirect to index.html
        showMessage(document.getElementById("success-message"), 5);

        setTimeout(() => {
          window.location.href = "./index.html";
        }, 3000);
      } else {
        const result = await response.json();
        let errorMessage = result.detail;
        console.log(errorMessage);

        const userFriendlyErrorMessage = {
          undefined: "Your email or password is wrong. Please try again.",
        };
        const failureMessageElement =
          document.getElementById("failure-message");
        failureMessageElement.textContent =
          userFriendlyErrorMessage[errorMessage] ||
          "You are not registered. Please register first.";
        showMessage(failureMessageElement, 5);
        document.getElementById("password").value = "";
      }
    } catch (error) {
      // Get the specific error message
      const errorMessage = error.message;
      console.log(errorMessage);

      // Translate the error message to a more user-friendly format
      const userFriendlyErrorMessage = {
        network_error:
          "We couldn't connect to the server. Please check your internet connection and try again.",
        // Other error messages
      };

      // Display the error message in the unexpected error div
      document.getElementById("unexpected-error").textContent =
        userFriendlyErrorMessage[errorMessage] ||
        "An unexpected error occurred. Please try again later.";

      // Define the unexpectedError variable
      const unexpectedError = document.getElementById("unexpected-error");

      showMessage(unexpectedError, 5);

      resetAllFields();
    }
  });

  function resetAllFields() {
    document.getElementById("email-address").value = "";
    document.getElementById("password").value = "";
  }

  document.getElementById("btn-register").addEventListener("click", () => {
    window.location.href = "./register.html"; // Redirect to register page
  });
});
