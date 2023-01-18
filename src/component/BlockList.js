
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import UrlList from "./urlList";
import React from 'react';
import Main from "./main";
import Header from './Header';
import WordList from './wordList';
import WhiteList from './whiteList';

export default function BlockList() {
    return(
        <div style={{justifyContent: 'center', textAlign: 'center'}}>
            <Tabs
                defaultActiveKey="UrlList"
                className="mb-3"
                justify
                mountOnEnter={true}
                unmountOnExit={true}
            >
                <Tab eventKey="UrlList" title="URL">
                    <UrlList/>
                </Tab>
                <Tab eventKey="Word" title="Word">
                    <WordList/>
                </Tab>
            </Tabs>
        </div>
            
        
    )
}