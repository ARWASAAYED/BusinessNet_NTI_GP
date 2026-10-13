import { useTranslation } from "react-i18next";

export const useI18n = () => {
  const { t, i18n } = useTranslation("translation");
  return { t, i18n };
};
