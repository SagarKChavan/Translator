const fromText = document.querySelector(".from-text"),
  toText = document.querySelector(".to-text"),
  exchangeIcon = document.querySelector(".exchange"),
  selectTags = document.querySelectorAll("select"),
  icons = document.querySelectorAll(".row i"),
  translateBtn = document.querySelector("#translateButton");

// Populate language dropdowns
selectTags.forEach((selectTag, id) => {
  for (let countryCode in countries) {
    let selected =
      id === 0
        ? countryCode === "en" ? "selected" : ""
        : countryCode === "hi" ? "selected" : "";
    let option = `<option ${selected} value="${countryCode}">${countries[countryCode]}</option>`;
    selectTag.insertAdjacentHTML("beforeend", option);
  }
});

// Exchange languages and texts
exchangeIcon.addEventListener("click", () => {
  let tempText = fromText.value,
    tempLang = selectTags[0].value;
  fromText.value = toText.value;
  toText.value = tempText;
  selectTags[0].value = selectTags[1].value;
  selectTags[1].value = tempLang;
});

// Clear translation field when input is empty
fromText.addEventListener("keyup", () => {
  if (!fromText.value) {
    toText.value = "";
  }
});

// Perform translation
translateBtn.addEventListener("click", () => {
  let text = fromText.value.trim(),
    translateFrom = selectTags[0].value,
    translateTo = selectTags[1].value;

  if (!text) return;
  toText.setAttribute("placeholder", "Translating...");

  let apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${translateFrom}|${translateTo}`;

  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      if (data.responseData && data.responseData.translatedText) {
        toText.value = data.responseData.translatedText;
      } else {
        toText.value = "Translation not available.";
      }
      toText.setAttribute("placeholder", "Translation");
    })
    .catch(() => {
      toText.value = "Error in translation.";
      toText.setAttribute("placeholder", "Translation");
    });
});

// Copy and Speech functionality
icons.forEach((icon) => {
  icon.addEventListener("click", ({ target }) => {
    if (target.classList.contains("fa-copy")) {
      let textToCopy = target.closest(".row").classList.contains("from")
        ? fromText.value
        : toText.value;

      navigator.clipboard.writeText(textToCopy);
    } else if (target.classList.contains("fa-volume-up")) {
      let utterance = new SpeechSynthesisUtterance(
        target.closest(".row").classList.contains("from") ? fromText.value : toText.value
      );
      utterance.lang = target.closest(".row").classList.contains("from")
        ? selectTags[0].value
        : selectTags[1].value;
      speechSynthesis.speak(utterance);
    }
  });
});
