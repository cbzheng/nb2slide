import React, { useState } from 'react';
import '../../style/slideview.css'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Button, Spinner, Card } from 'react-bootstrap';

interface IProps {
    generateSlides: Function
    afterGenerate: Function
}

function ParameterView(props: IProps) {
    const [audience, setAudience] = useState(0)
    const [detailLevel, setDetailLevel] = useState(0)
    const [submit, setSubmit] = useState(false)

    const generate = () => {
        props.generateSlides(audience, detailLevel).then(() => {
            props.afterGenerate()
        })
        setSubmit(true)
    }

    return (
        <>
            <div
                id={"parameter-view"}
                style={{
                    margin: '2rem'
                }}
            >
                <h3>Notebook to Slides</h3>
                <Card
                    style={{
                        marginTop: '2rem',
                        marginBottom: '1rem',
                        width: '75%'
                    }}
                >
                    <Card.Header>Parameters</Card.Header>
                    <Card.Body
                        style={{
                            marginLeft: '1rem',
                            padding: '1rem',
                        }}
                    >
                        <div className='slider-question-lable'>Audience Background</div>
                        <div className='slider-question'>
                            <span className='slider-label-left'>Less Technical</span>
                            <Slider
                                step={1}
                                min={0} max={2}
                                value={audience}
                                onChange={(v) => {
                                    setAudience(v)
                                }}
                                style={{
                                    width: '40%',
                                    paddingTop: '1rem'
                                }}
                            />
                            <span className='slider-label-right'>More Technical</span>
                        </div>
                        <div className='slider-question-lable'>Level of Details</div>
                        <div className='slider-question'>
                            <span className='slider-label-left'>Low</span>
                            <Slider
                                step={1}
                                min={0} max={2}
                                value={detailLevel}
                                onChange={(v) => {
                                    setDetailLevel(v)
                                }}
                                style={{
                                    width: '40%',
                                    paddingTop: '1rem'
                                }}
                            />
                            <span className='slider-label-right'>High</span>
                        </div>
                    </Card.Body>
                </Card>
                <Button onClick={generate} >
                    {
                        submit ?
                            (<>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                /> Processing...
                            </>)
                            :
                            'Generate Slides'
                    }
                </Button>
            </div>
        </>
    )
}

export default ParameterView;