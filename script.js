const fromText = document.querySelector(".from-text"),
    toText = document.querySelector(".to-text"),
    exchangeIcon = document.querySelector(".exchange"),
    selectTags = document.querySelectorAll("select"),
    icons = document.querySelectorAll(".icons i"),
    translateBtn = document.querySelector("#translateButton");

const countries = {
    "en": "English",
    "hi": "Hindi",
    "kn": "Kannada",
    "fr": "French",
    "es": "Spanish",
    "de": "German",
    "zh": "Chinese",
    "ja": "Japanese",
    "ru": "Russian",
    "ar": "Arabic",
    "it": "Italian",
    "pt": "Portuguese"
};

// Populate language dropdowns
selectTags.forEach((selectTag, index) => {
    for (let langCode in countries) {
        let selected =
            (index === 0 && langCode === "en") || (index === 1 && langCode === "hi") ? "selected" : "";
        let option = `<option ${selected} value="${langCode}">${countries[langCode]}</option>`;
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
fromText.addEventListener("input", () => {
    if (!fromText.value.trim()) {
        toText.value = "";
    }
});

// Translate text using MyMemory API with proper error handling
translateBtn.addEventListener("click", async () => {
    let text = fromText.value.trim();
    let translateFrom = selectTags[0].value;
    let translateTo = selectTags[1].value;

    if (!text) {
        toText.value = "";
        return;
    }

    toText.setAttribute("placeholder", "Translating...");

    let apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${translateFrom}|${translateTo}`;

    try {
        let response = await fetch(apiUrl);
        let data = await response.json();

        console.log("API Response:", data);

        if (data.responseData && data.responseData.translatedText) {
            toText.value = data.responseData.translatedText;
        } else if (data.matches?.length) {
            let bestMatch = data.matches.find(match => match.translation);
            toText.value = bestMatch ? bestMatch.translation : "Translation unavailable.";
        } else {
            throw new Error("No translation available.");
        }
    } catch (error) {
        console.error("Translation Error:", error);
        toText.value = "Error: Translation failed.";
    }

    toText.setAttribute("placeholder", "Translation");
});

// Handle Copy & Speech functions
icons.forEach((icon) => {
    icon.addEventListener("click", ({ target }) => {
        let isFromText = target.closest(".row").classList.contains("from");
        let text = isFromText ? fromText.value : toText.value;
        let lang = isFromText ? selectTags[0].value : selectTags[1].value;

        if (!text) return;

        if (target.classList.contains("fa-copy")) {
            navigator.clipboard.writeText(text);
            alert("Copied to clipboard!");
        } else if (target.classList.contains("fa-volume-up")) {
            let utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            speechSynthesis.speak(utterance);
        }
    });
});
