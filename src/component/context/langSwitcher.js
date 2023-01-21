import { useContext } from "react"
import { CurrentLangContext } from "./currentLang"
import { LangOptions } from "./langOptions";

export const LangSwitcher = () => {
    const {useLanguage, setLanguage} = useContext(CurrentLangContext);

    const handleChange = e => setLanguage(e.target.value);
    return(
        <select
        onChange={handleChange}
        value={useLanguage}
      >
        {Object.entries(LangOptions).map(([id, name]) => (
          <option key={id} value={id}>{name}</option>
        ))}
      </select>
    )
}