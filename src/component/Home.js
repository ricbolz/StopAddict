/*global chrome */
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Options from "./Options";
import React, { useEffect, useState } from 'react';
import Popup from "./popup/popup";
import Header from './Header';
import WordList from './wordList';

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
                    <Popup/>
                </Tab>
                <Tab eventKey="Options" title="URL">
                    <Options/>
                </Tab>
                <Tab eventKey="Word" title="Word">
                    <WordList/>
                </Tab>
            </Tabs>
        </div>
            
        
    )
}