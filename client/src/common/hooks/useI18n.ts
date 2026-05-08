import { useMemo } from "react";
import es from "@common/i18n/es.json";

type TranslationKey = string;

interface I18nContextType {
  t: (key: TranslationKey, defaultValue?: string) => string;
  language: "es";
}

const translations = {
  es: es,
};

function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((current, prop) => current?.[prop], obj);
}

export function useI18n(): I18nContextType {
  return useMemo(
    () => ({
      t: (key: TranslationKey, defaultValue?: string) => {
        const value = getNestedValue(translations.es, key);
        return typeof value === "string" ? value : defaultValue || key;
      },
      language: "es",
    }),
    []
  );
}
