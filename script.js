const fromText = document.querySelector(".from-text"),
  toText = document.querySelector(".to-text"),
  exchangeIcon = document.querySelector(".exchange"),
  selectTags = document.querySelectorAll("select"),
  icons = document.querySelectorAll(".icons i"),
  translateBtn = document.querySelector("#translateButton");

// Populate language dropdowns
selectTags.forEach((selectTag, id) => {
  for (let countryCode in countries) {
    let selected =
      id === 0
        ? countryCode === "en-GB" ? "selected" : ""
        : countryCode === "hi-IN" ? "selected" : "";
    let option = `<option ${selected} value="${countryCode}">${countries[countryCode]}</option>`;
    selectTag.insertAdjacentHTML("beforeend", option);
  }
});

// Swap input and output languages
exchangeIcon.addEventListener("click", () => {
  let tempText = fromText.value,
    tempLang = selectTags[0].value;
  fromText.value = toText.value;
  toText.value = tempText;
  selectTags[0].value = selectTags[1].value;
  selectTags[1].value = tempLang;
});

// Clear output when input is empty
fromText.addEventListener("keyup", () => {
  if (!fromText.value) {
    toText.value = "";
  }
});

// Function to translate text using MyMemory API (No API Key Required)
translateBtn.addEventListener("click", async () => {
  let text = fromText.value.trim();
  let translateFrom = selectTags[0].value.split("-")[0]; // Extract language code (e.g., "en")
  let translateTo = selectTags[1].value.split("-")[0]; // Extract language code (e.g., "hi")

  if (!text) return;
  toText.setAttribute("placeholder", "Translating...");

  let apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    text
  )}&langpair=${translateFrom}|${translateTo}`;

  try {
    let response = await fetch(apiUrl);
    let data = await response.json();

    // Check if the response has the translated text
    if (data.responseData && data.responseData.translatedText) {
      toText.value = data.responseData.translatedText;
    } else if (data.matches && data.matches.length > 0) {
      toText.value = data.matches[0].translation; // Use best match if available
    } else {
      toText.value = "Translation not available.";
    }
  } catch (error) {
    console.error("Translation Error:", error);
    toText.value = "Error in translation.";
  }

  toText.setAttribute("placeholder", "Translation");
});

// Handle Copy & Speech functions
icons.forEach((icon) => {
  icon.addEventListener("click", ({ target }) => {
    let isFromText = target.closest(".row").classList.contains("from");
    let text = isFromText ? fromText.value : toText.value;
    let lang = isFromText
      ? selectTags[0].value.split("-")[0]
      : selectTags[1].value.split("-")[0];

    if (!text) return;

    if (target.classList.contains("fa-copy")) {
      navigator.clipboard.writeText(text);
    } else if (target.classList.contains("fa-volume-up")) {
      let utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    }
  });
});
