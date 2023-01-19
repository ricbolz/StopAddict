import React, { useContext } from 'react';
import { LangContext } from "./langProvider";
import { LangOptions } from "./langOptions";

export default function LangSelector() {
    const { userLanguage, userLanguageChange } = useContext(LangContext);
    // set selected language by calling context method
    const handleLanguageChange = e => userLanguageChange(e.target.value);
    return (
      <select
        onChange={handleLanguageChange}
        value={userLanguage}
      >
        {Object.entries(LangOptions).map(([id, name]) => (
          <option key={id} value={id}>{name}</option>
        ))}
      </select>
    );
  };