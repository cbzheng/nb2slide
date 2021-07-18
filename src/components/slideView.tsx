import React, { useEffect, useState } from 'react';
import '../../style/nbview.css'
import '../../style/slideview.css'
import { slideReducerInitialState } from '../reducer/slidesReducer';
import { SlideAPIInfo, SlideSection } from "../types/slideTypes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faPlusSquare, faMinusSquare } from '@fortawesome/free-solid-svg-icons'

interface IProps {
    slides: SlideAPIInfo
}

function SlideViewer(props: IProps) {
    const [slideState, setSlideState] = useState(slideReducerInitialState)
    const [slideDeck, setSlideDeck] = useState(<></>)

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
            }
        })
        setSlideState(state)

        console.log("upload slides", slideState)

        //@ts-ignore
        setSlideDeck(slideState.sectionTitles.map(title => {
            return slideState.sectionSubtitles[title].map(subtitle => {
                const points = slideState.sectionPoints[title][subtitle].map(point => {
                    return (<li>{point}</li>)
                })
                return (
                    <div className={"sl-box"}>
                        <h3>{title}</h3>
                        <h4>{subtitle}</h4>
                        <ul>
                            {points}
                        </ul>
                        <div className={'edit-icon-list'}>
                            <FontAwesomeIcon className={"edit-icon icon-edit"} icon={faEdit} size="2x" />
                            <FontAwesomeIcon className={"edit-icon icon-add"} icon={faPlusSquare} size="2x"/>
                            <FontAwesomeIcon className={"edit-icon icon-minus"} icon={faMinusSquare} size="2x"/>
                        </div>
                    </div>
                )
            })
        })
        )
    }, [props.slides])

    return (
        <>
            <div id={"slideview"}>
                <div id={"slide-deck"}>
                    {slideDeck}
                </div>
            </div>
        </>
    )
}

export default SlideViewer;