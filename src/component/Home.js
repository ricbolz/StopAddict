
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import UrlList from "./urlList";
import React, { useContext } from 'react';
import Main from "./main";
import Header from './Header';
import WordList from './wordList';
import WhiteList from './whiteList';
import BlockList from './BlockList';
import InputTime from './timer/inputTime';
import styles from '../styles/Background.module.css';
import { CurrentLangContext } from './context/currentLang';

export default function Home() {

    const {dict} = useContext(CurrentLangContext);
    return(
        <div style={{justifyContent: 'center', textAlign: 'center'}}>

        <Header/>
            <Tabs
                defaultActiveKey="Main"
                className="mb-3"
                justify
                mountOnEnter={true}
                unmountOnExit={true}
            >
                <Tab eventKey="Main" title={dict.Home.main_tab}>
                    <Main/>
                </Tab>
                <Tab eventKey="BlockList" title={dict.Home.block_list_tab}>
                    <BlockList/>
                </Tab>
                <Tab eventKey="WhiteList" title={dict.Home.white_list_tab}>
                    <WhiteList/>
                </Tab>
                <Tab eventKey="Timer" title={dict.Home.focus_mode_tab} >
                    <div className={styles.page}>
                        <InputTime/>
                    </div>
                    
                </Tab>
            </Tabs>
        </div>
            
        
    )
}