import styles from '../../styles/Background.module.css';
export default function List(props){
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
                ><div className={styles.buttontext}>Remove</div></button>
            </div>
        </div>
    )
}