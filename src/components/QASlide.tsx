import React from 'react';
import '../../style/slideview.css'
import EditPanel from './slideComponents/editPanel';

interface IProps {
    select: boolean,
    exportSlides: Function,
    removeSlide: Function,
    addSlide: Function,
    handleClick: React.MouseEventHandler<HTMLDivElement>,
    log: Function
}

function QASlide(props: IProps) {
    return (
        <>
            <div
                onClick={props.handleClick}
                className={props.select ? "sl-box sl-current-box" : "sl-box"}
            >
                <div className={"slide"}>
                    <div style={{padding: '2rem'}}>
                        <h1>Thank you!</h1>
                        <h4>Welcome for questions</h4>
                    </div>
                    <EditPanel
                        addSlide={props.addSlide}
                        removeSlide={props.removeSlide}
                        title={null}
                        subtitles={null}
                        getWhy={null}
                        getHow={null}
                        exportSlides={props.exportSlides}
                        paste={() => {}}
                        log={props.log}
                    ></EditPanel>
                </div>
            </div>
        </>

    )
}

export default QASlide;