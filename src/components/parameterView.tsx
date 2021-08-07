import React, { useState } from 'react';
import '../../style/slideview.css'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Button, Spinner, Card, Row, FormLabel, Col } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';

interface IProps {
    generateSlides: Function
    afterGenerate: Function
}

function ParameterView(props: IProps) {
    const [audience, setAudience] = useState(0)
    const [detailLevel, setDetailLevel] = useState(0)
    const [problem, setProblem] = useState('')
    const [background, setBackground] = useState('')
    const [submit, setSubmit] = useState(false)

    const generate = () => {
        props.generateSlides(audience, detailLevel, problem, background).then(() => {
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
                    <Card.Header>User Preset</Card.Header>
                    <Card.Body
                        style={{
                            marginLeft: '1rem',
                            padding: '1rem',
                        }}
                    >
                        <Row>
                            <FormLabel column lg={2}>
                                Problem Definition
                            </FormLabel>
                            <Col>
                                <FormControl type="text" value={problem} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setProblem(e.target.value) }} placeholder="what is the solved problem?" />
                            </Col>
                        </Row>
                        <Row>
                            <FormLabel column lg={2}>
                                Background
                            </FormLabel>
                            <Col>
                                <FormControl type="text" value={background} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setBackground(e.target.value) }} placeholder="what is the background of the problem?" />
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
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