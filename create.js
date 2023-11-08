// const form = document.querySelector("form");
// form.addEventListener("submit", (e) => {
//   e.preventDefault();
//   const fd = new FormData(form);
//   const obj = Object.fromEntries(fd);

//   async function postJSON(obj) {
//     // Parse the alertScore field to an integer
//     obj.alertScore = parseInt(obj.alertScore);
//     obj.energeticScore = parseInt(obj.energeticScore);

//     try {
//       const response = await fetch(
//         "https://dev-api-when-time-tracker.iplugx.ir/api/time_tracks",
//         {
//           method: "POST", // or 'PUT'
//           headers: {
//             "Content-Type": "application/ld+json",
//           },

//           body: JSON.stringify(obj),
//         }
//       );

//       const result = await response.json();

//       if (response.ok) {
//         // Success!
//         // Show a success message to the user
//         console.log("Task successfully submitted!");
//       } else {
//         // Error!
//         // Show an error message to the user
//         console.log("Error submitting task:", response.statusText);
//       }

//       console.log("Success:", result);
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   }

//   postJSON(obj);
// });

// //Show succes or failure message
// const submitButton = form.querySelector("[data-button]");

// submitButton.addEventListener("click", (e) => {
//   // Prevent the form from submitting immediately.
//   e.preventDefault();

//   // Validate the form inputs.
//   if (validateForm()) {
//     // The form is valid, so submit it.
//     form.submit();

//     // Show a success message.
//     const successMessage = document.querySelector("[data-success]");
//     const showSuccess = function () {
//       successMessage.classList.remove("hidden");
//     };
//     showSuccess();
//   } else {
//     // Show a failure message.
//     const failureMessage = document.querySelector("[data-failure]");
//     const showFailure = function () {
//       failureMessage.classList.add("hidden");
//     };
//     showFailure();
//   }
// });

// function validateForm() {
//   // Check if all required form inputs are filled in.
//   const requiredInputs = form.querySelectorAll("input[required]");
//   for (const input of requiredInputs) {
//     if (input.value === "") {
//       return false;
//     }
//   }

//   // The form is valid.
//   return true;
// }

//The proble with the above code is: Firstly, the success message only appears momentarily on the browser when the submit button is clicked. The reason for this problem is because the success message is being displayed immediately after the form is submitted, and then the page is being reloaded. This causes the success message to be hidden again. To prevent this from happening, you can use a JavaScript library like jQuery to make an AJAX request to the server to submit the form data without reloading the page. This will allow you to keep the success message on the screen until the user closes it.
// and the second problem with the above code is: when the inputs are empty, and the submit button is clicked the success message (instead of the failure message) appears on the screen (But the inputs supposed to be required to be filled!) The reason for this problem is because the validation function is not being called before the success message is displayed. To fix this, you should call the validation function before the success message is displayed. This will ensure that the success message is only displayed if the form data is valid.
// To fix the two mentioned problems, the code should be written like below:
const form = document.querySelector("form");

// Add a hidden class to the success and failure messages
const successMessage = document.querySelector("[data-success]");
successMessage.classList.add("hidden");

const failureMessage = document.querySelector("[data-failure]");
failureMessage.classList.add("hidden");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Validate the form inputs.
  if (validateForm()) {
    // The form is valid, so submit it using AJAX
    const fd = new FormData(form);
    const obj = Object.fromEntries(fd);

    async function postJSON(obj) {
      // Parse the alertScore field to an integer
      obj.alertScore = parseInt(obj.alertScore);
      obj.energeticScore = parseInt(obj.energeticScore);

      try {
        const response = await fetch(
          "https://dev-api-when-time-tracker.iplugx.ir/api/time_tracks",
          {
            method: "POST", // or 'PUT'
            headers: {
              "Content-Type": "application/ld+json",
            },

            body: JSON.stringify(obj),
          }
        );

        const result = await response.json();

        if (response.ok) {
          // Success!
          // Show a success message to the user
          console.log("Task successfully submitted!");

          // Display the success message
          successMessage.classList.remove("hidden");
        } else {
          // Error!
          // Show an error message to the user
          console.log("Error submitting task:", response.statusText);

          // Display the failure message
          failureMessage.classList.remove("hidden");
        }

        console.log("Success:", result);
      } catch (error) {
        console.error("Error:", error);

        // Display the failure message
        failureMessage.classList.remove("hidden");
      }
    }

    postJSON(obj);
  } else {
    // Show a failure message
    failureMessage.classList.remove("hidden");
  }
});

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
