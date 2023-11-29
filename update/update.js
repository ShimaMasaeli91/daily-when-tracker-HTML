document.addEventListener("DOMContentLoaded", () => {
  const title = localStorage.getItem("title");
  const alertScore = localStorage.getItem("alert_score");
  const energeticScore = localStorage.getItem("energetic_score");

  const storedEmail = localStorage.getItem("userEmail");
  const welcomeElement = document.getElementById("welcome");
  welcomeElement.textContent = `Welcome, ${storedEmail}`;

  const token = localStorage.getItem("token");
  document.getElementById("btn-logout").addEventListener("click", () => {
    localStorage.removeItem("token"); // Remove token from local storage
    localStorage.removeItem("userEmail");
    window.location.href = "./login.html"; // Redirect to login page
  });

  // Display title in input
  const titleInput = document.getElementById("titleInput");
  titleInput.value = title;

  // Check and set selected option for alert score
  const alertSelect = document.getElementById("alertSelect");
  const alertOptions = alertSelect.querySelectorAll("option");

  for (const alertOption of alertOptions) {
    if (alertOption.value === alertScore) {
      alertOption.setAttribute("selected", true);
      break;
    }
  }

  // Check and set selected option for energetic score
  const energeticSelect = document.getElementById("energeticSelect");
  const energeticOptions = energeticSelect.querySelectorAll("option");

  for (const energeticOption of energeticOptions) {
    if (energeticOption.value === energeticScore) {
      energeticOption.setAttribute("selected", true);
      break;
    }
  }

  const updateForm = document.getElementById("update-form");
  updateForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const updatedTitle = document.getElementById("titleInput").value;
    const updatedAlertScore = parseInt(
      document.getElementById("alertSelect").value
    );
    const updatedEnergeticScore = parseInt(
      document.getElementById("energeticSelect").value
    );

    try {
      const recordId = localStorage.getItem("recordId");

      const endpointUrl = `https://dev-api-when-time-tracker.iplugx.ir/api/time_tracks/${recordId}`;
      const response = await fetch(endpointUrl, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/ld+json",
          "Content-Type": "application/merge-patch+json",
        },
        body: JSON.stringify({
          title: updatedTitle,
          alertScore: updatedAlertScore,
          energeticScore: updatedEnergeticScore,
        }),
      });

      // Check if the login was successful
      if (response.ok) {
        const data = await response.json();

        // Display the success message for 5 seconds then redirect to index.html
        const successMessageElement =
          document.getElementById("success-message");
        showMessage(successMessageElement, 3);

        setTimeout(() => {
          window.location.href = "./index.html";
        }, 2000);
      } else {
        const result = await response.json();
        let errorMessage = result.detail;
        console.log(errorMessage);

        const userFriendlyErrorMessage = {
          undefined: "Updating record is failed. Please try again.",
        };
        const failureMessageElement =
          document.getElementById("failure-message");
        document.getElementById("failure-message").innerText =
          userFriendlyErrorMessage[errorMessage] ||
          "Updating record is failed. Please fill all the required fields.";
        showMessage(failureMessageElement, 4);
        resetAllFields();
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
      document.getElementById("unexpected-message").innerText =
        userFriendlyErrorMessage[errorMessage] ||
        "An unexpected error occurred. Please try again later.";

      // Define the unexpectedError variable
      const unexpectedError = document.getElementById("unexpected-message");

      showMessage(unexpectedError, 4);

      resetAllFields();
    }
  });

  function showMessage(element, timeout) {
    element.classList.remove("hidden");
    setTimeout((timeout) => {
      element.classList.add("hidden");
    }, timeout * 1000);
  }

  function resetAllFields() {
    document.getElementById("titleInput").value = localStorage.getItem("title");
    document.getElementById("alertSelect").value =
      localStorage.getItem("alert_score");
    document.getElementById("energeticSelect").value =
      localStorage.getItem("energetic_score");
  }
});
