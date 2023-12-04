document.addEventListener("DOMContentLoaded", () => {
  // Retrieve the email from local storage
  const storedEmail = localStorage.getItem("userEmail");
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "./login.html";
  }

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
          const updateButtonCell = document.createElement("td");
          const updateButton = document.createElement("button");

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

          // JavaScript Code Only for Mobile version
          if (
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent
            )
          ) {
            addPadding(deleteButton);
          }

          updateButton.textContent = "Update";
          updateButton.classList.add("update-button");
          updateButton.addEventListener("click", function () {
            const recordId = data["hydra:member"][i].id;
            localStorage.setItem("recordId", recordId);
            localStorage.setItem("title", title.textContent);
            localStorage.setItem("alert_score", alert_score.textContent);
            localStorage.setItem(
              "energetic_score",
              energetic_score.textContent
            );
            window.location.href = "./update.html";
            return recordId;
          });

          if (
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent
            )
          ) {
            addPadding(updateButton);
          }

          row.appendChild(rowNumber);
          row.appendChild(date);
          row.appendChild(title);
          row.appendChild(alert_score);
          row.appendChild(energetic_score);
          deleteButtonCell.appendChild(deleteButton);
          row.appendChild(deleteButtonCell);
          updateButtonCell.appendChild(updateButton);
          row.appendChild(updateButtonCell);

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

  function addPadding(element) {
    element.style.paddingTop = "3%";
    element.style.paddingBottom = "3%";
    element.style.paddingLeft = "5%";
    element.style.paddingRight = "5%";
    return element;
  }
  document.getElementById("btn-logout").addEventListener("click", () => {
    localStorage.removeItem("token"); // Remove token from local storage
    localStorage.removeItem("userEmail");
    window.location.href = "./login.html"; // Redirect to login page
  });
});
