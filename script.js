const fromText = document.querySelector(".from-text"),
  toText = document.querySelector(".to-text"),
  exchangeIcon = document.querySelector(".exchange"),
  selectTags = document.querySelectorAll("select"),
  icons = document.querySelectorAll(".icons i"),
  translateBtn = document.querySelector("#translateButton");

// Populate language selection dropdowns
selectTags.forEach((selectTag, id) => {
  for (let countries_code in countries) {
    let selected =
      id === 0
        ? countries_code === "en-US" ? "selected" : ""
        : countries_code === "hi-IN" ? "selected" : "";
    let option = `<option ${selected} value="${countries_code}">${countries[countries_code]}</option>`;
    selectTag.insertAdjacentHTML("beforeend", option);
  }
});

// Swap languages and text
exchangeIcon.addEventListener("click", () => {
  let tempText = fromText.value,
    tempLang = selectTags[0].value;
  fromText.value = toText.value;
  toText.value = tempText;
  selectTags[0].value = selectTags[1].value;
  selectTags[1].value = tempLang;
});

// Clear translation if input is empty
fromText.addEventListener("keyup", () => {
  if (!fromText.value.trim()) {
    toText.value = "";
  }
});

// Handle translation
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
      toText.value = data.responseData.translatedText;
      data.matches.forEach((match) => {
        if (match.id === 0) {
          toText.value = match.translation;
        }
      });
      toText.setAttribute("placeholder", "Translation");
    })
    .catch(() => {
      toText.value = "Translation error!";
    });
});

// Handle copy and speech actions
icons.forEach((icon) => {
  icon.addEventListener("click", ({ target }) => {
    if (!fromText.value.trim() && !toText.value.trim()) return;

    let isFromText = target.closest(".from") !== null;
    let textToProcess = isFromText ? fromText.value : toText.value;
    let lang = isFromText ? selectTags[0].value : selectTags[1].value;

    if (target.classList.contains("fa-copy")) {
      navigator.clipboard.writeText(textToProcess);
      target.classList.add("copied");
      setTimeout(() => target.classList.remove("copied"), 800);
    } else if (target.classList.contains("fa-volume-up")) {
      let utterance = new SpeechSynthesisUtterance(textToProcess);
      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    }
  });
});

