const fromText = document.querySelector(".from-text"),
    toText = document.querySelector(".to-text"),
    exchangeIcon = document.querySelector(".exchange"),
    selectTags = document.querySelectorAll("select"),
    icons = document.querySelectorAll(".icons i"),
    translateBtn = document.querySelector("#translateButton");

const languages = {
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

// Populate dropdowns
selectTags.forEach((select, index) => {
    for (let code in languages) {
        let selected = (index === 0 && code === "en") || (index === 1 && code === "hi") ? "selected" : "";
        let option = `<option value="${code}" ${selected}>${languages[code]}</option>`;
        select.insertAdjacentHTML("beforeend", option);
    }
});

// Swap text and language
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

// Translate text with proper error handling
translateBtn.addEventListener("click", async () => {
    let text = fromText.value.trim();
    let fromLang = selectTags[0].value;
    let toLang = selectTags[1].value;

    if (!text) {
        toText.value = "";
        return;
    }

    toText.setAttribute("placeholder", "Translating...");

    let apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`;

    try {
        let response = await fetch(apiUrl);
        let data = await response.json();

        console.log("Translation API Response:", data);

        if (data.responseData && data.responseData.translatedText) {
            let translatedText = data.responseData.translatedText;

            // Check for incorrect translations (API sometimes returns the same input)
            if (translatedText.toLowerCase() === text.toLowerCase()) {
                console.warn("Warning: Possible incorrect translation, retrying...");
                translatedText = await fetchAlternativeTranslation(text, fromLang, toLang);
            }

            toText.value = translatedText;
        } else {
            throw new Error("Invalid translation received.");
        }
    } catch (error) {
        console.error("Translation Error:", error);
        toText.value = "Error: Translation failed.";
    }

    toText.setAttribute("placeholder", "Translation");
});

// Alternative translation function for better results
async function fetchAlternativeTranslation(text, fromLang, toLang) {
    let altApiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${encodeURIComponent(text)}`;

    try {
        let response = await fetch(altApiUrl);
        let data = await response.json();
        
        if (Array.isArray(data) && data[0]) {
            return data[0].map(item => item[0]).join("");
        }
    } catch (error) {
        console.error("Alternative Translation Failed:", error);
    }

    return "Translation unavailable.";
}

// Copy & Speech functionality
icons.forEach((icon) => {
    icon.addEventListener("click", ({ target }) => {
        let isFrom = target.closest(".row").classList.contains("from");
        let text = isFrom ? fromText.value : toText.value;
        let lang = isFrom ? selectTags[0].value : selectTags[1].value;

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
