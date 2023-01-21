import { createContext, useContext } from 'react';
import en from './en-lang.json';
import jp from './jp-lang.json';
//import { dictList } from './langOptions';
export const CurrentLangContext = createContext({
  userLanguage : 'en',
  dict : en,
  setLanguage : () => {}
})