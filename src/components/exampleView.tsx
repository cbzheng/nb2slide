import React from 'react';
import { Button, FormSelect, Tab } from 'react-bootstrap';
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
                <Tab eventKey='parameters' title='Parameters'>
                    <div style={{
                        padding: '1rem'
                    }}>
                        <div style={{
                            paddingBottom: '1rem'
                        }}>
                            Audience Type
                            <FormSelect>
                                <option>Technical</option>
                                <option>Non-Technical</option>
                            </FormSelect>
                        </div>
                        <div style={{
                            paddingBottom: '1rem'
                        }}>
                            Level of Details
                            <FormSelect>
                                <option>High</option>
                                <option>Low</option>
                            </FormSelect>
                        </div>
                        <div style={{
                            paddingBottom: '1rem'
                        }}>
                            Max Points Number(per Slides)
                            <FormSelect>
                                <option>5</option>
                                <option>3</option>
                            </FormSelect>
                        </div>
                        <Button variant='success'>Regenerate</Button>
                    </div>
                </Tab>
                <Tab eventKey='examples' title='Examples'>

                </Tab>
            </Tabs>
        </>

    )
}

export default ExampleView;