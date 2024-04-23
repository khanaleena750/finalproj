document.addEventListener('DOMContentLoaded', () => {
  const loginLink = document.getElementById('login-now-link');
  const signupLink = document.getElementById('signup-now-link');
  const loginSection = document.getElementById('login');
  const signupSection = document.getElementById('signup');
  const nextButton = document.querySelector('button[name="next"]');
  const logoutButton = document.getElementById('logout-button');
  const surveyContainer = document.getElementById('survey_container');

  // Function to show login section and hide signup section
  function showLoginSection() {
    loginSection.style.display = 'block';
    signupSection.style.display = 'none';
    toggleNextButtonVisibility(false);
    toggleLogoutButtonVisibility(false);
  }

  // Function to show signup section and hide login section
  function showSignupSection() {
    loginSection.style.display = 'none';
    signupSection.style.display = 'block';
    toggleNextButtonVisibility(false);
    toggleLogoutButtonVisibility(false);
  }

  // Event listener for login link
  loginLink.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default link behavior
    showLoginSection();
  });

  // Event listener for signup link
  signupLink.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default link behavior
    showSignupSection();
  });

  // Function to toggle the visibility of the "Next" button
  function toggleNextButtonVisibility(isLoggedIn) {
    if (nextButton && surveyContainer) {
      nextButton.style.display = isLoggedIn ? 'block' : 'none'; // Show if logged in and survey container is present, hide otherwise
    }
  }

  // Function to toggle the visibility of the logout button
  function toggleLogoutButtonVisibility(isLoggedIn) {
    if (logoutButton) {
      logoutButton.style.display = isLoggedIn ? 'block' : 'none'; // Show if logged in, hide otherwise
    }
  }

  // Initial setup based on login status
  const isLoggedIn = localStorage.getItem('userToken') !== null;
  toggleNextButtonVisibility(isLoggedIn);
  toggleLogoutButtonVisibility(isLoggedIn);
});
