document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");

  const token = localStorage.getItem("token");

  // Check if the token exists in local storage
  if (token && token !== "undefined") {
    // If the token exists, redirect to the index.html
    window.location.href = "./index.html";
  } else {
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
          const storedEmail = localStorage.getItem("userEmail");

          // Display the success message for 5 seconds then redirect to index.html
          const successMessageElement =
            document.getElementById("success-message");
          showAndHideMessage(successMessageElement);

          setTimeout(() => {
            window.location.href = "./index.html";
          }, 3000);
        } else {
          const result = await response.json();
          let errorMessage = result.detail;

          // Display the failure message
          const failureMessageElement =
            document.getElementById("failure-message");
          failureMessageElement.innerText = errorMessage;
          showAndHideMessage(failureMessageElement);
        }
      } catch (error) {
        console.log(error);
        failureMessage.textContent =
          "Something went wrong. Please try again later.";
        failureMessage.classList.remove("hidden");
      }
    });
  }

  function showAndHideMessage(element) {
    element.classList.remove("hidden");
    setTimeout(() => {
      element.classList.add("hidden");
    }, 2000);
  }
  document.getElementById("btn-register").addEventListener("click", () => {
    window.location.href = "./register.html"; // Redirect to register page
  });
});
