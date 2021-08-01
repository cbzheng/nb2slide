import React from 'react';
import { Tab } from 'react-bootstrap';
import { Tabs } from 'react-bootstrap';
import '../../style/slideview.css'

interface IProps {
    currentTitle: string
    currentSubTitle: string
}

function ExampleView(props: IProps) {

    return (
        <>
            <Tabs>
                <Tab eventKey='examples' title='Examples'>

                </Tab>
            </Tabs>
        </>

    )
}

export default ExampleView;