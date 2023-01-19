
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import UrlList from "./urlList";
import React, { useContext } from 'react';
import Main from "./main";
import Header from './Header';
import WordList from './wordList';
import WhiteList from './whiteList';
import { CurrentLangContext } from './context/currentLang';
export default function BlockList() {
    const {dict} = useContext(CurrentLangContext);
    return(
        <div style={{justifyContent: 'center', textAlign: 'center'}}>
            <Tabs
                defaultActiveKey="UrlList"
                className="mb-3"
                justify
                mountOnEnter={true}
                unmountOnExit={true}
            >
                <Tab eventKey="UrlList" title={dict.BlockList.url}>
                    <UrlList/>
                </Tab>
                <Tab eventKey="Word" title={dict.BlockList.word}>
                    <WordList/>
                </Tab>
            </Tabs>
        </div>
            
        
    )
}