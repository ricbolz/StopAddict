/*global chrome */
import { fontWeight } from '@mui/system';
import { useContext } from 'react';
import styles from '../styles/Background.module.css';
import { CurrentLangContext } from './context/currentLang';
export default function List(props){
    const {dict} = useContext(CurrentLangContext);
    function removeRule(url) {
        chrome.runtime.sendMessage({
         action: 'remove',
         url: url
        }); 
     }
    return(
        <div className={styles.list} 
            
        >
            <div 
            style={{
                flex: 3,
                fontWeight: 'bold'
            }}>
                {props.url}
            </div>
            <div>
                <button
                id={props.id}
                className={styles.remove}
                ><div className={styles.buttontext}
                onClick={() => {
                    removeRule(props.url)
                }}
                >{dict.List.remove}</div></button>
            </div>
        </div>
    )
}