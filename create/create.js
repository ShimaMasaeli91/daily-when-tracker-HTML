const form = document.getElementById("create-form");
// Retrieve the email from local storage
const storedEmail = localStorage.getItem("userEmail");
const token = localStorage.getItem("token");

// Update the HTML with the user's email
const welcomeElement = document.getElementById("welcome");
welcomeElement.textContent = `Welcome, ${storedEmail}`;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // The form is valid, so submit it using AJAX
  const formData = new FormData(form);
  const objectData = Object.fromEntries(formData);

  // Parse the alertScore field to an integer
  objectData.alertScore = parseInt(objectData.alertScore);
  objectData.energeticScore = parseInt(objectData.energeticScore);
  let stringObject = JSON.stringify(objectData);

  callCreateApi(stringObject);
});

async function callCreateApi(stringObject) {
  try {
    const response = await fetch(
      "https://dev-api-when-time-tracker.iplugx.ir/api/time_tracks",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/ld+json",
          Authorization: `Bearer ${token}`,
        },

        body: stringObject,
      }
    );

    if (response.ok) {
      // Success!

      // Display the success message
      const successMessageElement = document.getElementById("success-message");

      showAndHideMessage(successMessageElement);
    } else {
      // Error!
      const result = await response.json();
      let errorMessage = result.detail; // | "You have error from server";

      // Display the failure message
      const failureMessageElement = document.getElementById("failure-message");

      failureMessageElement.innerText = errorMessage;
      showAndHideMessage(failureMessageElement);
    }
  } catch (error) {
    console.log(error);
    const unexpectedMessageElement =
      document.getElementById("unexpected-message");
    showAndHideMessage(unexpectedMessageElement);
  }
}

function hideElement(element) {
  element.classList.add("hidden");
}

function showAndHideMessage(element) {
  element.classList.remove("hidden");

  setTimeout(hideElement, 5000, element);
}
document.getElementById("btn-logout").addEventListener("click", () => {
  localStorage.removeItem("token"); // Remove token from local storage
  localStorage.removeItem("userEmail");
  window.location.href = "./login.html"; // Redirect to login page
});
