import React, { useEffect, useState } from 'react';
import '../../style/nbview.css'
import '../../style/slideview.css'
import { slideReducerInitialState } from '../reducer/slidesReducer';
import { SlideAPIInfo, SlideSection } from "../types/slideTypes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faPlusSquare, faMinusSquare } from '@fortawesome/free-solid-svg-icons'
import OptionsView from './optionsView';
import ListGroup from 'react-bootstrap/ListGroup'

interface IProps {
    slides: SlideAPIInfo
}

function SlideViewer(props: IProps) {
    const [slideState, setSlideState] = useState(slideReducerInitialState)
    const [slideHierarchy, setSlideHierarchy] = useState(<></>)
    const [slideDeck, setSlideDeck] = useState(<></>)
    const [subtitleVisible, setSubtitleVisible] = useState({})

    useEffect(() => {
        // slideInfoDispatch({ type: "updateSlides", payload: props.slides })
        let state = slideReducerInitialState
        state.sectionTitles = []
        state.templateSectionTitles.forEach((section: SlideSection) => {
            if (section.title in props.slides) {
                state.sectionSubtitles[section.title] = section.subtitles
                state.sectionTitles.push(section.title)
                state.sectionPoints[section.title] = props.slides[section.title].points
                state.sectionCodeCells[section.title] = props.slides[section.title].cells
                setSubtitleVisible({
                    ...subtitleVisible,
                    [section.title]: false
                })
            }
        })     
         
        setSlideState(state)

        console.log("upload slides", slideState)

        // slide structure
        const strucutreItems = slideState.sectionTitles.map(title => {
            const subtitles = slideState.sectionSubtitles[title]
            console.log(subtitles)
            const subtitleList = subtitles.map(subtitle => {
                <ListGroup.Item>
                    {subtitle}
                </ListGroup.Item>
            })

            return (
                <ListGroup.Item action onClick={() => {
                    console.log("set visibility")
                    setSubtitleVisible({
                        ...subtitleVisible,
                        // @ts-ignore
                        [title]: !subtitleVisible[title]
                    });
                    console.log(subtitleVisible)
                }}>
                    {title}
                    {
                        // @ts-ignore
                        subtitleVisible[title] ?
                            <ListGroup variant='flush'>
                                {subtitleList}
                            </ListGroup> : null
                    }
                </ListGroup.Item>
            )
        })
        setSlideHierarchy(
            <ListGroup variant='flush'>
                {strucutreItems}
            </ListGroup>
        )

        // slides
        //@ts-ignore
        setSlideDeck(slideState.sectionTitles.map(title => {
            return slideState.sectionSubtitles[title].map(subtitle => {
                const points = slideState.sectionPoints[title][subtitle].map(point => {
                    return (<li>{point}</li>)
                })
                return (
                    <div className={"sl-box"}>
                        <div className={"slide"}>
                            <h3>{title}</h3>
                            <h4>{subtitle}</h4>
                            <ul>
                                {points}
                            </ul>
                        </div>
                    </div>
                )
            })
        })
        )
    }, [props.slides])

    return (
        <>
            <div id='main-body'>
                <OptionsView></OptionsView>
                <div id='main-panel'>
                    <div id='explore-view'>
                        <div id='vis-panel'>

                        </div>
                        <div id='hierarchy-panel'>
                            {slideHierarchy}
                        </div>
                    </div>
                    <div id={"slideview"}>
                        <div id={"slide-deck"}>
                            {slideDeck}
                            <div className={'edit-icon-list'}>
                                <div id='edit-panel'>
                                    <FontAwesomeIcon className={"edit-icon icon-edit"} icon={faEdit} size="2x" />
                                    <FontAwesomeIcon className={"edit-icon icon-add"} icon={faPlusSquare} size="2x" />
                                    <FontAwesomeIcon className={"edit-icon icon-minus"} icon={faMinusSquare} size="2x" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SlideViewer;