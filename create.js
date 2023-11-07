const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
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
      } else {
        // Error!
        // Show an error message to the user
        console.log("Error submitting task:", response.statusText);
      }

      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  postJSON(obj);
});
