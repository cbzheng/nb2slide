import React, { useReducer, useEffect, useState } from 'react';
import '../../style/nbview.css'
import '../../style/slideview.css'
import slideReducer, { slideReducerInitialState } from '../reducer/slidesReducer';
import { SlideAPIInfo } from "../types/slideTypes";

interface IProps {
    slides: SlideAPIInfo
}

function SlideViewer(props: IProps) {
    const [slideState, slideInfoDispatch] = useReducer(slideReducer, slideReducerInitialState)
    const [slideDeck, setSlideDeck] = useState(<></>)

    useEffect(() => {
        slideInfoDispatch({ type: "updateSlides", payload: props.slides })

        //@ts-ignore
        setSlideDeck(slideState.sectionTitles.map(title => {
            const points = slideState.sectionPoints[title].map(point => {
                return (<li>{point}</li>)
            })

            return (
                <div className={"slide-box"}>
                    <h6>{title}</h6>
                    <ul>
                        {points}
                    </ul>
                </div>
            )
        })
        )
    }, [props.slides])

    return (
        <>
            <div id={"slide-view"}>
                <div id={"slide-deck"}>
                    {slideDeck}
                </div>
            </div>
        </>
    )
}

export default SlideViewer;