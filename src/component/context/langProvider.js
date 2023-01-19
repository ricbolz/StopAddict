/* global chrome */
import { useState, createContext } from "react";
import { dictList, LangOptions } from "./langOptions";


export const LangContext = createContext({
    userLanguage : 'en',
    dictionary : dictList.en
});
// it provides the language context to app
export function LangProvider({ children }) {
    const defaultLanguage = chrome.storage.local.get('rcml-lang');
    const [userLanguage, setUserLanguage] = useState(defaultLanguage || 'en');
    const provider = {
      userLanguage,
      dictionary: dictList[userLanguage],
      userLanguageChange: selected => {
        const newLanguage = LangOptions[selected] ? selected : 'en'
        setUserLanguage(newLanguage);
        chrome.storage.local.set({'rcml-lang' : newLanguage});
      }
    };
    return (
      <LangContext.Provider value={provider}>
        {children}
      </LangContext.Provider>
    );
};