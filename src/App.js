/*global chrome */
import './App.css';
import Home from './component/Home';

import { createContext, useContext, useState } from 'react';
import { CurrentLangContext } from './component/context/currentLang';

import { dictList, LangOptions } from './component/context/langOptions';

function App() {
  var defaultLanguage;
  const [useLanguage, setLanguage] = useState("en");
  chrome.storage.local.get("rl", function (result) {
    setLanguage(result.rl);
  });
  
  const dict = dictList[useLanguage];
  const lang = {useLanguage,dict, 
    setLanguage : selected => {
      const newLanguage = LangOptions[selected] ? selected : 'en'
      setLanguage(newLanguage);
      chrome.runtime.sendMessage({
        action : "changeLanguage",
        lang : selected
      })
      chrome.storage.local.set({'rl' : newLanguage});
    }};
  return (
    <CurrentLangContext.Provider value={lang}>
      <div>
      <Home/> 
      </div>
    </CurrentLangContext.Provider>
      
      
   
     
  );
}

export default App;
