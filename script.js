const fromText = document.querySelector(".from-text"),
  toText = document.querySelector(".to-text"),
  exchangeIcon = document.querySelector(".exchange"),
  selectTags = document.querySelectorAll("select"),
  icons = document.querySelectorAll(".icons i"),
  translateBtn = document.querySelector("#translateButton");

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

exchangeIcon.addEventListener("click", () => {
  let tempText = fromText.value,
    tempLang = selectTags[0].value;
  fromText.value = toText.value;
  toText.value = tempText;
  selectTags[0].value = selectTags[1].value;
  selectTags[1].value = tempLang;
});

fromText.addEventListener("keyup", () => {
  if (!fromText.value) {
    toText.value = "";
  }
});

translateBtn.addEventListener("click", () => {
  let text = fromText.value.trim(),
    translateFrom = selectTags[0].value.split("-")[0], // Extract base language (en, hi, etc.)
    translateTo = selectTags[1].value.split("-")[0];

  if (!text) return;
  toText.setAttribute("placeholder", "Translating...");

  let apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${translateFrom}|${translateTo}`;

  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      if (data.responseData && data.responseData.translatedText) {
        toText.value = data.responseData.translatedText;
      } else if (data.matches.length > 0) {
        toText.value = data.matches[0].translation;
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

// Handle Copy and Speech synthesis for both text areas
icons.forEach((icon) => {
  icon.addEventListener("click", ({ target }) => {
    let isFromText = target.closest(".row").classList.contains("from");
    let text = isFromText ? fromText.value : toText.value;
    let lang = isFromText ? selectTags[0].value.split("-")[0] : selectTags[1].value.split("-")[0];

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
