document.addEventListener("DOMContentLoaded", function () {
  function Survey(survey) {
    if (!survey) {
      throw new Error("No Survey Form found!");
    }

    // select the elements
    const progressbar = survey.querySelector(".progressbar");
    const surveyPanels = survey.querySelectorAll(".survey__panel");
    const question1Radios = survey.querySelectorAll("[name='question_1']");
    const question2Radios = survey.querySelectorAll("[name='question_2']");
    const question3Radios = survey.querySelectorAll("[name='question_3']");
    const question4Radios = survey.querySelectorAll("[name='question_4']");
    const question5Radios = survey.querySelectorAll("[name='question_5']");
    const allRadios = survey.querySelectorAll("input[type='radio']");
    const allPanels = Array.from(survey.querySelectorAll(".survey__panel"));
    let progressbarStep = Array.from(
      progressbar.querySelectorAll(".progressbar__step ")
    );
    const mainElement = document.querySelector("main");
    const prevButton = survey.querySelector("[name='prev']");
    const nextButton = survey.querySelector("[name='next']");
    const submitButton = survey.querySelector("[name='submit']");
    let currentPanel = Array.from(surveyPanels).filter((panel) =>
      panel.classList.contains("survey__panel--current")
    )[0];
    const formData = {};
    const options = {
      question1Radios,
      question2Radios,
      question3Radios,
      question4Radios,
      question5Radios,
    };
    let dontSubmit = false;

    function updateRadioBorderColors() {
      allRadios.forEach((radio) => {
        radio.closest(".form-group").style.borderColor = "rgb(150, 139, 248)"; // Reset to default color
      });
      const checkedRadio = currentPanel.querySelector(
        "input[type='radio']:checked"
      );
      if (checkedRadio) {
        checkedRadio.closest(".form-group").style.borderColor = "green"; // Change color for checked radio
      }
    }

    updateRadioBorderColors(); // Initially set border colors

    function storeInitialData() {
      allPanels.map((panel) => {
        let index = panel.dataset.index;
        let panelName = panel.dataset.panel;
        let question = panel
          .querySelector(".survey__panel__question")
          .textContent.trim();
        formData[index] = {
          panelName: panelName,
          question: question,
        };
      });
    }

    function updateProgressbar() {
      let index = currentPanel.dataset.index;
      let currentQuestion = formData[`${parseFloat(index)}`].question;
      progressbar.setAttribute("aria-valuenow", index);
      progressbar.setAttribute("aria-valuetext", currentQuestion);
      progressbarStep[index - 1].classList.add("active");
    }

    function updateFormData({ target }) {
      const index = +currentPanel.dataset.index;
      const { name, type, value } = target;
      if (type === "radio") {
        formData[index].answer = {
          [name]: value,
        };
      }
      updateRadioBorderColors(); // Initially set border colors
    }

    function noErrors(input) {
      if (!input) {
        const errorElement = currentPanel.querySelector(".error-message");
        errorElement.textContent = "";
        errorElement.removeAttribute("role");
        survey.classList.remove("form-error");
        return;
      }
      const formControl = input.parentElement;
      const errorElement = formControl.querySelector(".error-message");
      errorElement.innerText = "";
      errorElement.removeAttribute("role");
    }

    function checkRequirements() {
      const index = currentPanel.dataset.index;
      const errorElement = currentPanel.querySelector(".error-message");

      if (!formData[index].hasOwnProperty("answer")) {
        errorElement.textContent = "Please select an option to continue.";
        errorElement.setAttribute("role", "alert");
        survey.classList.add("form-error");
      } else {
        errorElement.textContent = ""; // Clear error message if an option is selected
        errorElement.removeAttribute("role");
        survey.classList.remove("form-error");
        dontSubmit = true;
      }
    }

    function displayNextPanel() {
      currentPanel.classList.remove("survey__panel--current");
      currentPanel.setAttribute("aria-hidden", true);
      currentPanel = currentPanel.nextElementSibling;
      currentPanel.classList.add("survey__panel--current");
      currentPanel.setAttribute("aria-hidden", false);
      updateProgressbar();
      // Update border color for the selected radio button in the new panel
      updateRadioBorderColors();
      if (+currentPanel.dataset.index > 1) {
        prevButton.disabled = false;
        prevButton.setAttribute("aria-hidden", false);
      }
      if (+currentPanel.dataset.index === 5) {
        nextButton.setAttribute("disabled", "disabled");
        nextButton.style.display = "none";
        submitButton.disabled = false;
        submitButton.setAttribute("aria-hidden", false);
      }
    }

    function displayPrevPanel() {
      currentPanel.classList.remove("survey__panel--current");
      currentPanel.setAttribute("aria-hidden", true);
      currentPanel = currentPanel.previousElementSibling;
      currentPanel.classList.add("survey__panel--current");
      currentPanel.setAttribute("aria-hidden", false);
      // Update border color for the selected radio button in the new panel
      updateRadioBorderColors();
      if (+currentPanel.dataset.index === 1) {
        prevButton.disabled = true;
        prevButton.setAttribute("aria-hidden", true);
      }
      if (+currentPanel.dataset.index < 5) {
        nextButton.removeAttribute("disabled");
        nextButton.style.display = "block";
        submitButton.disabled = true;
        submitButton.setAttribute("aria-hidden", true);
      }
    }

    function handlePrevButton() {
      displayPrevPanel();
      updateRadioBorderColors(); // Initially set border colors
    }

    function handleNextButton() {
      const index = currentPanel.dataset.index;
      if (!formData[index].hasOwnProperty("answer")) {
        checkRequirements();
      } else {
        noErrors();
        displayNextPanel();
      }
      updateRadioBorderColors(); // Initially set border colors
    }

    storeInitialData();

    // Add event listeners
    function addListenersTo({
      question1Radios,
      question2Radios,
      question3Radios,
      question4Radios,
      question5Radios,
      ...inputs
    }) {
      question1Radios.forEach((elem) =>
        elem.addEventListener("change", updateFormData)
      );
      question2Radios.forEach((elem) =>
        elem.addEventListener("change", updateFormData)
      );
      question3Radios.forEach((elem) =>
        elem.addEventListener("change", updateFormData)
      );
      question4Radios.forEach((elem) =>
        elem.addEventListener("change", updateFormData)
      );
      question5Radios.forEach((elem) =>
        elem.addEventListener("change", updateFormData)
      );
    }

    function handleNextButton() {
      const index = currentPanel.dataset.index;
      if (!formData[index].hasOwnProperty("answer")) {
        checkRequirements();
      } else {
        noErrors();
        displayNextPanel();
      }
    }

    function handlePrevButton() {
      displayPrevPanel();
    }

    function handleFormSubmit(e) {
      e.preventDefault(); // Prevent the form from submitting by default

      // Check if all form requirements are met
      const index = currentPanel.dataset.index;
      if (!formData[index].hasOwnProperty("answer")) {
        checkRequirements(); // If not, display an error message
      } else {
        // If requirements are met, proceed with form submission
        noErrors(); // Clear any existing error messages
        handleSurveyData(formData); // Submit the form data

        // Update the main element to display submission message
        mainElement.classList.add("submission");
        mainElement.setAttribute("role", "alert");
        mainElement.innerHTML = `
          <svg width="126" height="118" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 126 118" aria-hidden="true" style="transform: translateX(50%)"><path d="M52.5 118c28.995 0 52.5-23.729 52.5-53S81.495 12 52.5 12 0 35.729 0 65s23.505 53 52.5 53z" fill="#B9CCED"/><path d="M45.726 87L23 56.877l8.186-6.105 15.647 20.74L118.766 0 126 7.192 45.726 87z" fill="#A7E9AF"/></svg>
          <h2 class="submission">Thanks for your time</h2>
          <p>The form was successfully submitted`;
      }
    }


    async function handleSurveyData(data) {
      // Send a POST request to the server for signup
      const surveyUrl = "http://localhost:3000/surveyForm"; // replace with your actual survey URL
      const surveyResponse = await fetch(surveyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Handle the server response (you can customize this based on your server's response format)
      if (surveyResponse.ok) {
        const surveyResult = await surveyResponse.json();
        alert(surveyResult.message);
      } else {
        const surveyError = await surveyResponse.json();
        alert(`Signup failed: ${surveyError.message}`);
      }
    }

    // Add event listeners for next and previous buttons

    nextButton.addEventListener("click", handleNextButton);

    prevButton.addEventListener("click", handlePrevButton);
    addListenersTo(options);

    survey.addEventListener("submit", handleFormSubmit);
  }

  Survey(document.querySelector(".survey"));
});
