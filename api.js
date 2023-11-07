async function postJSON(data) {
  try {
    const response = await fetch(
      "https://dev-api-when-time-tracker.iplugx.ir/api/time_tracks",
      {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/ld+json",
        },
        body: JSON.stringify(data),
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

const data = { title: "example", alertScore: 8, energeticScore: 1 };

postJSON(data);
