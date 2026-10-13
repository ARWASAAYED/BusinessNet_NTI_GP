import i18next from "i18next";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";

type NestedObject = { [key: string]: string | NestedObject };

const flattenMessages = (
  object: NestedObject,
  prefix = "",
): Record<string, string> => {
  return Object.keys(object).reduce<Record<string, string>>((messages, key) => {
    const value = object[key];
    const translationKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "string") {
      messages[translationKey] = value;
    } else {
      Object.assign(messages, flattenMessages(value, translationKey));
    }

    return messages;
  }, {});
};

const resources = {
  en: { translation: flattenMessages(en as NestedObject) },
  ar: { translation: flattenMessages(ar as NestedObject) },
};

i18next.init({
  resources,
  lng: "en",
  fallbackLng: "en",
  supportedLngs: ["en", "ar"],
  keySeparator: false,
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
