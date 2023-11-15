document.addEventListener("DOMContentLoaded", () => {
  let currentPage = 1; //to keep track of the current page number for pagination. It is initially set to 1, indicating the first page
  let chart; // it is declared as a global variable outside the event listener function because we want to initialize the chart variable outside of any specific event and be able to access it in both the loadPage and loadChart functions

  const nextPageButton = document.getElementById("nextPageButton");
  const prevPageButton = document.getElementById("prevPageButton");
  const filterButton = document.getElementById("filterButton");

  // Load the first page of data
  loadPage(currentPage);

  nextPageButton.addEventListener("click", () => {
    currentPage++;
    loadPage(currentPage);
  });

  prevPageButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      loadPage(currentPage);
    }
  });

  filterButton.addEventListener("click", () => {
    const selectedDate = document.getElementById("dateFilter").value;
    loadChart(selectedDate);
  });

  function loadPage(pageNumber) {
    const tableBody = document.getElementById("tableBody");
    const chartCanvas = document.getElementById("chart");

    const tableUrl = `https://dev-api-when-time-tracker.iplugx.ir/api/time_tracks?page=${pageNumber}`;

    fetch(tableUrl)
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

        // Update the data-page attribute of next and previous buttons
        nextPageButton.dataset.page = pageNumber + 1;
        prevPageButton.dataset.page = pageNumber - 1;
      })
      .catch((error) => {
        console.log("Error loading table data:", error);
      });
  }

  function loadChart(selectedDate) {
    const chartCanvas = document.getElementById("chart");

    // Destroy the previous chart if it exists
    if (chart) {
      chart.destroy();
    }

    fetch(
      `https://dev-api-when-time-tracker.iplugx.ir/api/time_tracks_date_filter/${selectedDate}`
    )
      .then((response) => response.json())
      .then((chartData) => {
        const labels = [];
        const alertData = [];
        const energeticData = [];

        for (let i = 0; i < chartData.length; i++) {
          labels.push(chartData[i].date);
          alertData.push(chartData[i].alert_score);
          energeticData.push(chartData[i].energetic_score);
        }

        chart = new Chart(chartCanvas, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Alert Score",
                data: alertData,
                borderColor: "blue",
              },
              {
                label: "Energetic Score",
                data: energeticData,
                borderColor: "green",
              },
            ],
          },
          options: {
            scales: {
              x: {
                display: true,
                title: {
                  display: true,
                  text: "Date",
                },
              },
              y: {
                display: true,
                title: {
                  display: true,
                  text: "Energy and Alert Scores",
                },
              },
            },
            tooltips: {
              enabled: true,
              mode: "index",
              intersect: false,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              titleFontColor: "#ffffff",
              bodyFontColor: "#ffffff",
            },
            legend: {
              display: true,
              position: "top",
              labels: {
                fontColor: "#000000",
              },
            },
          },
        });
      })
      .catch((error) => {
        console.log("Error loading chart data:", error);
      });
  }
});
