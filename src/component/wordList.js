/*global chrome */
import styles from "../styles/Background.module.css"
import React, { useEffect, useState } from 'react';
import List from "./list";
import { TextField } from "@mui/material";

export default function WordList(){
    const [word, setWord] = useState('');
    const [error,setError] = useState(false);
    const [errorWarning, setErrorWarning] = useState('');
    //const [block, setBlock] = useState('');
    const [wordList, setWordList] = useState({});
    
    
    useEffect(() => {
        // const queryInfo = {active: true, lastFocusedWindow: true};

        // chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
        //     const word = tabs[0].word;
        //     let splitWORD = word.split("/")
        //     console.log(splitWORD[2]);
        //     setWord(splitWORD[2]);
        //     if(word2!==word) {
        //         if(word!==extensionID) {
        //             setWord2(word)
        //         }
                
        //     }
        // });

        

         chrome.runtime.sendMessage({
             action : "getWord"
         })

        chrome.runtime.onMessage.addListener( (msg={}, sender) => {
            if(msg.action === "sendWord") {
                    console.log("same");
                    setWordList(msg.obj);
                
                
                 
                
            }

            // if(msg.action === "addWord") {
            //     console.log("word added");
            //     setAddedWord(msg.added);
            // }

            // if(msg.action === "removeWord") {
            //     console.log("word removed");
            //     setAddedWord(msg.word);
            // }
        })

      

        

        
    });
    //chrome.runtime.onMessage.addListener(async (msg={}, sender) => {
    //    if(msg.status) {
    //        setBlock(msg.status);
    //    }
        
    //   });
       
    
    
    const handleChange = (event) => {
        if(setError) {
            setError(false);
        }
        setWord(event.target.value);
        
    }

    const validateWord = (data) => {
        //const regex = new RegExp(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
        let isNotWord = data === null || data.match(/^ *$/) !== null;
        if(!isNotWord) {
            let text = data.trim();
            if(text.length < 3) {
                isNotWord = true;
                setErrorWarning("Please input 3 or more characters");
            }
            if(wordList[data]) {
                isNotWord = true;
                setErrorWarning(`"${data}" is already added`);
            }
            
        } else {
            setErrorWarning("Not a word");
        }


        
        return isNotWord;
    }
    
    const handleSubmit = () => {
        setWord(word.trim());
        if(!validateWord(word)) {
             
            wordList[word] = "word";
            chrome.runtime.sendMessage({
                action: "addRule",
                type: "block",
                word:word
            })
            setWord('');
        
        } else {
            setError("true");
        }
        
        
    }
    

  
    return(
        <div className={styles.page}>
            <div>
                <TextField
                label="WORD"
                value={word}
                onChange={handleChange}
                onKeyUp={(event) => {
                    if (event.key === 'Enter') {
                        handleSubmit();
                    }
                }}/>
                {error ? <div>{errorWarning}</div> : ""}
            </div>
                <div>
                {Object.keys(wordList).map((keyName, i) => (
                    <div>
                        <List id={wordList[keyName]} url={keyName}/>
                    </div>
                ))}
                </div>
            
        </div>
    )
}