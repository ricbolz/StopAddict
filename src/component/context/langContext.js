import { createContext } from "react";
import { dictList } from "./langOptions";

export const LangContext = createContext({
    userLanguage : 'en',
    dictionary : dictList.en
});