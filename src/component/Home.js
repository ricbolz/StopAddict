
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import UrlList from "./urlList";
import React from 'react';
import Main from "./main";
import Header from './Header';
import WordList from './wordList';
import WhiteList from './whiteList';
import BlockList from './BlockList';

export default function Home() {
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
                <Tab eventKey="Main" title="Main">
                    <Main/>
                </Tab>
                <Tab eventKey="BlockList" title="Block List">
                    <BlockList/>
                </Tab>
                <Tab eventKey="WhiteList" title="White List">
                    <WhiteList/>
                </Tab>
            </Tabs>
        </div>
            
        
    )
}