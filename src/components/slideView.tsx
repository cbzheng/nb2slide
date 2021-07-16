import React from 'react';
import '../../style/nbview.css'
import '../../style/slideview.css'
import { SlideReducerState } from "../types/slideTypes";

interface IProps {
    slides: SlideReducerState
}

function SlideViewer(props: IProps) {
    const slideDeck = props.slides.sectionTitles.map(title => {
        const points = props.slides.sectionPoints[title].map(point => {
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