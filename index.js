document.addEventListener("DOMContentLoaded", () => {
  // Implement next page button click event handler

  let currentPage = 1;
  // Load the first page of data
  loadPage(currentPage);

  const nextPageButton = document.getElementById("nextPageButton");
  nextPageButton.addEventListener("click", () => {
    let page = parseInt(nextPageButton.dataset.page);

    loadPage(page);
    // if (currentPage > 1) {
    //   currentPage++;
    //   loadPage(currentPage);
    // }
  });

  // Implement previous page button click event handler
  const prevPageButton = document.getElementById("prevPageButton");
  prevPageButton.addEventListener("click", () => {
    let page = parseInt(prevPageButton.dataset.page);
    loadPage(page);
    // if (currentPage > 1) {
    //   currentPage--;
    //   loadPage(currentPage);
    // }
  });
});

function loadPage(pageNumber) {
  const tableBody = document.getElementById("tableBody");

  const url = `https://dev-api-when-time-tracker.iplugx.ir/api/time_tracks?page=${pageNumber}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      tableBody.innerHTML = "";
      // Process the received data
      for (let i = 0; i < data["hydra:member"].length; i++) {
        const row = document.createElement("tr");
        const rowNumber = document.createElement("td");
        const date = document.createElement("td");
        const title = document.createElement("td");
        const alert_score = document.createElement("td");
        const energetic_score = document.createElement("td");

        rowNumber.textContent = (pageNumber - 1) * 30 + i + 1;
        date.textContent = data["hydra:member"][i].date;
        title.textContent = data["hydra:member"][i].title;
        alert_score.textContent = data["hydra:member"][i].alert_score;
        energetic_score.textContent = data["hydra:member"][i].energetic_score;

        row.appendChild(rowNumber);
        row.appendChild(date);
        row.appendChild(title);
        row.appendChild(alert_score);
        row.appendChild(energetic_score);

        tableBody.appendChild(row);
      }

      // Update the next page link based on the current page
      const nextPageLink = data["hydra:view"]["hydra:next"];
      const prevPageLink = data["hydra:view"]["hydra:previous"];

      const nextPageButton = document.getElementById("nextPageButton");
      if (nextPageLink) {
        // nextPageButton.href = nextPageLink;
        nextPageButton.dataset.page = pageNumber + 1;
        nextPageButton.disabled = false;
      } else {
        nextPageButton.disabled = true;
      }

      const prevPageButton = document.getElementById("prevPageButton");
      if (prevPageLink) {
        prevPageButton.dataset.page = pageNumber - 1;
        prevPageButton.disabled = false;
      } else {
        prevPageButton.disabled = true;
      }
    });
}
