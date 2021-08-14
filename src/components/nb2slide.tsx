import React, { useState, useEffect } from 'react';
import '../../style/slideview.css'
import { StaticNotebookCell } from '../notebookUtils';
import { SlideAPIInfo } from '../types/slideTypes';
import { requestAPI } from "../handler";
import SlideViewer from './slideView';
import ParameterView from './parameterView';
// import { mock } from '../mockdata';

interface IProps {
    notebookCells: Array<StaticNotebookCell>
    navNBCb: Function
    getNBCell: Function
    clipboard: string
    bindCellIdx: number
}

function NB2Slide(props: IProps) {
    const [slides, setSlides] = useState({} as SlideAPIInfo)
    const [title, setTitle] = useState('')
    const [mode, setMode] = useState('parameter')

    const updateNotebookInfo = async (
        audience: number,
        detailLevel: number,
        title: string
    ) => {
        setTitle(title)
        const data = JSON.stringify({ 
            "notebook": props.notebookCells,
            "audience": audience,
            "detailLevel": detailLevel
         })
    
        // test mock data
        // setSlides(JSON.parse(mock))
        // return
        await requestAPI<any>('get_slides', {
            body: data,
            method: "POST"
        })
            .then(data => {
                console.log(data)
                setSlides(JSON.parse(data))
            })
            .catch(reason => {
                console.error(
                    `The nb2slide server extension appears to be missing.\n${reason}`
                );
            });
    }

    const afterGenerate = () => {
        setMode('slides')
    }

    useEffect(()=>{
        console.log(props.clipboard)
    }, [props.clipboard])

    return (
        <>
            {
                mode === 'parameter' ?
                    <div id='nb2slide'>
                        <ParameterView
                            generateSlides={updateNotebookInfo}
                            afterGenerate={afterGenerate}
                        ></ParameterView>
                    </div> :
                    <div id={'slides-deck-widget'}>
                        <SlideViewer
                            slides={slides}
                            cells={props.notebookCells}
                            navNBCb={props.navNBCb}
                            getNBCell={props.getNBCell}
                            title={title}
                            clipboard={props.clipboard}
                            bindCellIdx={props.bindCellIdx}
                        />
                    </div>
            }
        </>
    )
}

export default NB2Slide;