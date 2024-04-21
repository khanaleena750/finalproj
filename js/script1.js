document.addEventListener('DOMContentLoaded', () => {
  // Check if the DOMContentLoaded event is firing
  console.log('DOMContentLoaded event fired');

  // Check if the "home" element exists
  const home = document.querySelector('.home');

  if (!home) {
    console.error('Element with class "home" not found.');
    return; // Exit the function if "home" is not found
  }

  console.log('Element with class "home" found:', home);

  const navbar = document.querySelector('.header .navbar');
  const menuButton = document.querySelector('.header .menu');
  const formContainer = document.querySelector("#form-container");

  if (!formContainer) {
    console.error('Element with id "form-container" not found.');
    return; // Exit the function if "formContainer" is not found
  }

  const formOpenBtn = document.querySelector("#form-open");
  const formCloseBtn = document.querySelector(".form_close");
  const signupBtn = document.querySelector("#signup");
  const loginBtn = document.querySelector("#login");
  const pwShowHide = document.querySelectorAll(".pw_hide");

  menuButton.addEventListener('click', () => {
    navbar.classList.toggle('show');
    menuButton.classList.toggle('rotate');
  });

  function removeClass() {
    menuButton.classList.remove('rotate');
  }

  document.onscroll = () => {
    navbar.classList.remove('show');
    menuButton.classList.remove('rotate');

    if (window.scrollY > 0) {
      document.querySelector('.header').classList.add('active');
    } else {
      document.querySelector('.header').classList.remove('active');
    }
  };

  window.onload = () => {
    if (window.scrollY > 0) {
      document.querySelector('.header').classList.add('active');
    } else {
      document.querySelector('.header').classList.remove('active');
    }
  };

  // Add event listener only if signupBtn exists
  if (signupBtn) {
    signupBtn.addEventListener("click", (e) => {
      e.preventDefault();
      formContainer.classList.add("active");
    });
  }

  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    formContainer.classList.remove("active");
  });

  pwShowHide.forEach((icon) => {
    icon.addEventListener("click", () => {
      let getPwInput = icon.parentElement.querySelector("input");
      if (getPwInput.type === "password") {
        getPwInput.type = "text";
        icon.classList.replace("uil-eye-slash", "uil-eye");
      } else {
        getPwInput.type = "password";
        icon.classList.replace("uil-eye", "uil-eye-slash");
      }
    });
  });
});
