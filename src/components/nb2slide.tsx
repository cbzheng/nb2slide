import React, { useState, useEffect } from 'react';
import '../../style/slideview.css'
import { StaticNotebookCell } from '../notebookUtils';
import { SlideAPIInfo } from '../types/slideTypes';
import { requestAPI } from "../handler";
import SlideViewer from './slideView';
import ParameterView from './parameterView';
// import { mock, mock1 } from '../mockdata';

interface IProps {
    notebookCells: Array<StaticNotebookCell>
    navNBCb: Function
    getNBCell: Function
    clipboard: string
    bindCellIdx: number
}

export type LogItem = {
    actionName: string,
    timestamp: string,
    oldValue: string,
    newValue: string
}

class Logger {
    logStore: Array<LogItem>
    currentLogStore: Array<LogItem>
    AddLogItem: Function
    SendLogs: Function

    constructor() {
        this.logStore = []
        this.currentLogStore = []
        this.AddLogItem = (item: LogItem) => {
            this.logStore.push(item)
            this.currentLogStore.push(item)
        }

        this.SendLogs = () => {
            setInterval(() => {
                if (this.currentLogStore.length > 0) {
                    console.log(this.currentLogStore)
                    requestAPI<any>('log', {
                        body: JSON.stringify(this.currentLogStore),
                        method: "POST"
                    })
                        .catch(reason => {
                            console.error(
                                `The nb2slide server extension appears to be missing.\n${reason}`
                            );
                        });
                    this.currentLogStore = []
                }
            }, 10000)
        }
    }

}

function NB2Slide(props: IProps) {
    const [slides, setSlides] = useState({} as SlideAPIInfo)
    const [title, setTitle] = useState('')
    const [mode, setMode] = useState('parameter')
    const logger = new Logger()
    logger.SendLogs()

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

        // if (audience === 0) {
        //     setSlides(JSON.parse(mock))
        // } else {
        //     setSlides(JSON.parse(mock1))
        // }
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

    useEffect(() => {
        logger.AddLogItem({
            actionName: 'copy-output',
            timestamp: new Date().toUTCString(),
            oldValue: '',
            newValue: ''
        })
    }, [props.clipboard])

    return (
        <>
            {
                mode === 'parameter' ?
                    <div id='nb2slide'>
                        <ParameterView
                            generateSlides={updateNotebookInfo}
                            afterGenerate={afterGenerate}
                            log={logger.AddLogItem}
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
                            log={logger.AddLogItem}
                        />
                    </div>
            }
        </>
    )
}

export default NB2Slide;