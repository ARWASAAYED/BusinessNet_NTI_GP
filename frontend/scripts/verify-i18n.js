const fs = require("fs");
const i18next = require("i18next");
const en = JSON.parse(fs.readFileSync("src/locales/en.json", "utf8"));
const ar = JSON.parse(fs.readFileSync("src/locales/ar.json", "utf8"));

const flatten = (object, prefix = "") =>
  Object.entries(object).reduce((messages, [key, value]) => {
    const translationKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      messages[translationKey] = value;
    } else {
      Object.assign(messages, flatten(value, translationKey));
    }
    return messages;
  }, {});

const resources = {
  en: { translation: flatten(en) },
  ar: { translation: flatten(ar) },
};

i18next
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    supportedLngs: ["en", "ar"],
    keySeparator: false,
    interpolation: { escapeValue: false },
  })
  .then(async () => {
    const english = i18next.t("nav.feed");
    await i18next.changeLanguage("ar");
    const arabic = i18next.t("nav.feed");
    console.log(
      JSON.stringify({
        english,
        arabic,
        resources: {
          english: Object.keys(resources.en.translation).length,
          arabic: Object.keys(resources.ar.translation).length,
        },
      }),
    );
  });
