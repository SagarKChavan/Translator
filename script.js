let apiUrl = `https://libretranslate.com/translate`;
let response = await fetch(apiUrl, {
  method: "POST",
  body: JSON.stringify({
    q: text,
    source: translateFrom,
    target: translateTo,
  }),
  headers: { "Content-Type": "application/json" },
});
