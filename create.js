const form = document.getElementById("create-form");
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

// We check with required attributes
/*
function validateForm() {
  // Check if all required form inputs are filled in.
  const requiredInputs = form.querySelectorAll("input[required]");
  for (const input of requiredInputs) {
    if (input.value === "") {
      return false;
    }
  }

  // The form is valid.
  return true;
}
*/

async function callCreateApi(stringObject) {
  try {
    const response = await fetch(
      "https://dev-api-when-time-tracker.iplugx.ir/api/time_tracks",
      {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/ld+json",
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
