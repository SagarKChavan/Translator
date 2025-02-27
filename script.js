const fromText = document.querySelector(".from-text"),
  toText = document.querySelector(".to-text"),
  exchangeIcon = document.querySelector(".exchange"),
  selectTags = document.querySelectorAll("select"),
  icons = document.querySelectorAll(".icons i"),
  translateBtn = document.querySelector("#translateButton");

// Google Translate API Key (Replace with your key if needed)
const GOOGLE_API_KEY = "YOUR_GOOGLE_TRANSLATE_API_KEY";

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

translateBtn.addEventListener("click", async () => {
  let text = fromText.value.trim(),
    translateFrom = selectTags[0].value.split("-")[0], // Extract base language (en, hi, etc.)
    translateTo = selectTags[1].value.split("-")[0];

  if (!text) return;
  toText.setAttribute("placeholder", "Translating...");

  let apiUrl = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}&q=${encodeURIComponent(
    text
  )}&source=${translateFrom}&target=${translateTo}`;

  try {
    let res = await fetch(apiUrl);
    let data = await res.json();
    if (data.data && data.data.translations.length > 0) {
      toText.value = data.data.translations[0].translatedText;
    } else {
      toText.value = "Translation not available.";
    }
  } catch (error) {
    toText.value = "Error in translation.";
  }

  toText.setAttribute("placeholder", "Translation");
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
