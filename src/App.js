import './App.css';
import Home from './component/Home';
import { LangProvider } from './component/context/langProvider';

import { createContext, useContext } from 'react';
import { CurrentLangContext } from './component/context/currentLang';

function App() {
  const lang = useContext(CurrentLangContext);
  return (
    <CurrentLangContext.Provider value={lang}>
      <div>
      <Home/> 
      </div>
    </CurrentLangContext.Provider>
      
      
   
     
  );
}

export default App;
