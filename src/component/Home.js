/*global chrome */
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Options from "./Options";
import React, { useEffect, useState } from 'react';
import Popup from "./popup/popup";

export default function Home() {
    return(
        
            <Tabs
                defaultActiveKey="Main"
                className="mb-3"
            >
                <Tab eventKey="Main" title="Main">
                    <Popup/>
                </Tab>
                <Tab eventKey="Options" title="Options">
                    <Options/>
                </Tab>
            </Tabs>
        
    )
}