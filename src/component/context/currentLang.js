import { createContext, useContext } from 'react';
import en from './en-lang.json';
import jp from './jp-lang.json';
export const CurrentLangContext = createContext({
  userLanguage : 'jp',
  dict : jp
})