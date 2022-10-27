/*global chrome */
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Options from "./Options";
import React, { useEffect, useState } from 'react';
import Popup from "./popup/popup";
import Header from './Header';

export default function Home() {
    return(
        <div style={{justifyContent: 'center', textAlign: 'center'}}>
            <Header/>
            <Tabs
                defaultActiveKey="Main"
                className="mb-3"
                justify
            >
                <Tab eventKey="Main" title="Main">
                    <Popup/>
                </Tab>
                <Tab eventKey="Options" title="Options">
                    <Options/>
                </Tab>
            </Tabs>
        </div>
            
        
    )
}