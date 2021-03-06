import React, { useState } from 'react';
import '../../style/slideview.css'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Button, Spinner, Card, Row, FormLabel, Col } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';

interface IProps {
    generateSlides: Function
    afterGenerate: Function
    log: Function
}

function ParameterView(props: IProps) {
    const [audience, setAudience] = useState(0)
    const [detailLevel, setDetailLevel] = useState(0)
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [submit, setSubmit] = useState(false)

    const generate = () => {
        props.log({
            actionName: 'set-audience',
            timestamp: new Date().toUTCString(),
            oldValue: '',
            newValue: audience.toString()
        })

        props.log({
            actionName: 'set-LOD',
            timestamp: new Date().toUTCString(),
            oldValue: '',
            newValue: detailLevel.toString()
        })

        props.log({
            actionName: 'set-title',
            timestamp: new Date().toUTCString(),
            oldValue: '',
            newValue: title
        })

        props.generateSlides(audience, detailLevel, author, title).then(() => {
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
                        <Row className='parameter-row'>
                            <FormLabel column lg={4}>
                                Slides Title
                            </FormLabel>
                            <Col>
                                <FormControl
                                    type="text"
                                    value={title}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setTitle(e.target.value) }}
                                    placeholder=""
                                />
                            </Col>
                        </Row>
                        <Row className='parameter-row'>
                            <FormLabel column lg={4}>
                                Author
                            </FormLabel>
                            <Col>
                                <FormControl
                                    type="text"
                                    value={author}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setAuthor(e.target.value) }}
                                    placeholder=""
                                />
                            </Col>
                        </Row>
                        <Row className='parameter-row'>
                            <FormLabel column lg={4}>
                                Audience Background
                            </FormLabel>
                            <Col>
                                <div style={{display: 'flex', flexDirection: 'row'}}>
                                    <span className='slider-label-left'>Less Technical</span>
                                    <Slider
                                        step={1}
                                        min={0} max={1}
                                        value={audience}
                                        onChange={(v) => {
                                            setAudience(v)
                                        }}
                                        style={{
                                            width: '4rem',
                                            paddingTop: '1rem'
                                        }}
                                    />
                                    <span className='slider-label-right'>More Technical</span>
                                </div>
                            </Col>
                        </Row>
                        <Row className='parameter-row'>
                            <FormLabel column lg={4}>
                                Level of Details
                            </FormLabel>
                            <Col>
                                <div style={{display: 'flex', flexDirection: 'row'}}>
                                    <span className='slider-label-left'>Low</span>
                                    <Slider
                                        step={1}
                                        min={0} max={1}
                                        value={detailLevel}
                                        onChange={(v) => {
                                            setDetailLevel(v)
                                        }}
                                        style={{
                                            width: '4rem',
                                            paddingTop: '1rem'
                                        }}
                                    />
                                    <span className='slider-label-right'>High</span>
                                </div>
                            </Col>
                        </Row>
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