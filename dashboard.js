document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token"); // Retrieve the token from local storage

  if (token) {
    try {
      const response = await fetch(
        "https://dev-api-when-time-tracker.iplugx.ir/api/user/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const email = data.email;

        // Update the HTML with the user's email
        const containerElement = document.querySelector(".container");
        containerElement.textContent = `Welcome, ${email}`;
      } else {
        console.error("Error fetching user data:", response.status);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  } else {
    // Redirect to the login page if no token is found
    window.location.href = "./login.html";
  }
});
