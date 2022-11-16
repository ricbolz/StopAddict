/*global chrome */
import styles from '../styles/Background.module.css';
export default function List(props){
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
                flex: 3
                
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
                >Remove</div></button>
            </div>
        </div>
    )
}