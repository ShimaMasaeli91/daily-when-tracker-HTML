document.addEventListener("DOMContentLoaded", () => {
  // Retrieve the email from local storage
  const storedEmail = localStorage.getItem("userEmail");
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "./login.html";
  }
  document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");

    const token = localStorage.getItem("token");

    // Check if the token exists in local storage
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
          const successMessageElement =
            document.getElementById("success-message");
          showAndHideMessage(successMessageElement, 4);

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
          document.getElementById("failure-message").innerText =
            userFriendlyErrorMessage[errorMessage] ||
            "Tou are not registered. Please register first.";
          showAndHideMessage(failureMessageElement, 4);
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
        document.getElementById("Unexpected-error").innerText =
          userFriendlyErrorMessage[errorMessage] ||
          "An unexpected error occurred. Please try again later.";

        // Define the unexpectedError variable
        const unexpectedError = document.getElementById("Unexpected-error");

        showAndHideMessage(unexpectedError, 4);

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

  // Update the HTML with the user's email
  const welcomeElement = document.getElementById("welcome");
  welcomeElement.textContent = `Welcome, ${storedEmail}`;
  let currentPage = 1;
  let totalPageCount = 0;

  const nextPageButton = document.getElementById("nextPageButton");
  const prevPageButton = document.getElementById("prevPageButton");
  const successMessage = document.getElementById("successMessage");

  loadPage(currentPage);

  nextPageButton.addEventListener("click", () => {
    if (currentPage < totalPageCount) {
      currentPage++;
      loadPage(currentPage);
    }
  });

  prevPageButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      loadPage(currentPage);
    }
  });

  function loadPage(pageNumber) {
    const tableBody = document.getElementById("tableBody");

    const tableUrl = `https://dev-api-when-time-tracker.iplugx.ir/api/time_tracks?page=${pageNumber}`;

    fetch(tableUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/ld+json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        tableBody.innerHTML = "";

        for (let i = 0; i < data["hydra:member"].length; i++) {
          const row = document.createElement("tr");
          const rowNumber = document.createElement("td");
          const date = document.createElement("td");
          const title = document.createElement("td");
          const alert_score = document.createElement("td");
          const energetic_score = document.createElement("td");
          const deleteButtonCell = document.createElement("td");
          const deleteButton = document.createElement("button");

          rowNumber.textContent = (pageNumber - 1) * 30 + i + 1;

          date.textContent = data["hydra:member"][i].date;
          title.textContent = data["hydra:member"][i].title;
          alert_score.textContent = data["hydra:member"][i].alert_score;
          energetic_score.textContent = data["hydra:member"][i].energetic_score;

          deleteButton.textContent = "Delete";
          deleteButton.classList.add("delete-button");
          deleteButton.addEventListener("click", () => {
            const recordId = data["hydra:member"][i].id;
            const confirmed = confirm(
              "Are you sure you want to delete this record?"
            );
            if (confirmed) {
              deleteRecord(recordId, row);
            }
          });

          row.appendChild(rowNumber);
          row.appendChild(date);
          row.appendChild(title);
          row.appendChild(alert_score);
          row.appendChild(energetic_score);
          deleteButtonCell.appendChild(deleteButton);
          row.appendChild(deleteButtonCell);

          tableBody.appendChild(row);
        }

        totalPageCount = Math.ceil(data["hydra:totalItems"] / 30);

        if (currentPage === totalPageCount) {
          nextPageButton.disabled = true;
        } else {
          nextPageButton.disabled = false;
        }

        nextPageButton.dataset.page = pageNumber + 1;
        prevPageButton.dataset.page = pageNumber - 1;
      })
      .catch((error) => {
        console.log("Error loading table data:", error);
      });
  }

  function deleteRecord(recordId, row) {
    const deleteUrl = `https://dev-api-when-time-tracker.iplugx.ir/api/time_tracks/${recordId}`;

    fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          row.remove();
          showSuccessMessage("Your record is deleted successfully!");
        } else {
          throw new Error("Error deleting record");
        }
      })
      .catch((error) => {
        console.log("Error deleting record:", error);
      });
  }

  function showSuccessMessage(message) {
    successMessage.textContent = message;
    successMessage.style.display = "block";

    // Hide the success message after a certain duration
    setTimeout(() => {
      successMessage.style.display = "none";
    }, 3000);
  }
  document.getElementById("btn-logout").addEventListener("click", () => {
    localStorage.removeItem("token"); // Remove token from local storage
    localStorage.removeItem("userEmail");
    window.location.href = "./login.html"; // Redirect to login page
  });
});
