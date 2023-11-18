document.addEventListener("DOMContentLoaded", () => {
  let chart;

  const filterButton = document.getElementById("filterButton");

  const now = new Date();
  const formattedDate = now.toISOString().slice(0, 10);
  loadChart(formattedDate);

  filterButton.addEventListener("click", () => {
    const selectedDate = document.getElementById("dateFilter").value;
    loadChart(selectedDate);
  });

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
                borderColor: "#cc5de8",
              },
              {
                label: "Energetic Score",
                data: energeticData,
                borderColor: "#5c7cfa",
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
                suggestedMin: 0,
                suggestedMax: 10,
                stepSize: 1,
                precision: 0,
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
                fontColor: "#343a40",
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
