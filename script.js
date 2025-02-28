const fromText = document.querySelector(".from-text"),
    toText = document.querySelector(".to-text"),
    exchangeIcon = document.querySelector(".exchange"),
    selectTags = document.querySelectorAll("select"),
    icons = document.querySelectorAll(".icons i"),
    translateBtn = document.querySelector("#translateButton");

const countries = {
    "en-US": "English",
    "hi-IN": "Hindi",
    "kn-IN": "Kannada",
    "fr-FR": "French",
    "es-ES": "Spanish",
    "de-DE": "German"
};

// Populate dropdowns with languages
selectTags.forEach((selectTag, index) => {
    for (let countryCode in countries) {
        let selected = (index === 0 && countryCode === "en-US") || (index === 1 && countryCode === "hi-IN") ? "selected" : "";
        let option = `<option ${selected} value="${countryCode}">${countries[countryCode]}</option>`;
        selectTag.insertAdjacentHTML("beforeend", option);
    }
});

// Swap text and languages
exchangeIcon.addEventListener("click", () => {
    [fromText.value, toText.value] = [toText.value, fromText.value];
    [selectTags[0].value, selectTags[1].value] = [selectTags[1].value, selectTags[0].value];
});

// Clear output if input is empty
fromText.addEventListener("input", () => {
    if (!fromText.value.trim()) {
        toText.value = "";
    }
});

// Translate function
translateBtn.addEventListener("click", async () => {
    let text = fromText.value.trim();
    let translateFrom = selectTags[0].value.split("-")[0]; 
    let translateTo = selectTags[1].value.split("-")[0];

    if (!text) return;
    
    toText.setAttribute("placeholder", "Translating...");

    let apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${translateFrom}|${translateTo}`;

    try {
        let response = await fetch(apiUrl);
        let data = await response.json();

        if (data.responseData && data.responseData.translatedText) {
            toText.value = data.responseData.translatedText;
        } else if (data.matches?.length) {
            let bestMatch = data.matches.find(match => match.translation);
            toText.value = bestMatch ? bestMatch.translation : "Translation not available.";
        } else {
            toText.value = "Translation not available.";
        }
    } catch (error) {
        console.error("Translation Error:", error);
        toText.value = "Error in translation.";
    }

    toText.setAttribute("placeholder", "Translation");
});

// Copy & Speech functionality
icons.forEach((icon) => {
    icon.addEventListener("click", ({ target }) => {
        let isFromText = target.closest(".row").classList.contains("from");
        let text = isFromText ? fromText.value : toText.value;
        let lang = isFromText ? selectTags[0].value.split("-")[0] : selectTags[1].value.split("-")[0];

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
