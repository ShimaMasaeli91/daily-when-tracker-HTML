document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector(".email-address").value;
    const password = document.querySelector(".password").value;

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
        const successMessageElement =
          document.getElementById("success-message");
        showAndHideMessage(successMessageElement);
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
    }
  });

  function showAndHideMessage(element) {
    element.classList.remove("hidden");
    setTimeout(() => {
      element.classList.add("hidden");
    }, 4000);
  }
});
