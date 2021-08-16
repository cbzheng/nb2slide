import React from 'react';
import '../../style/slideview.css'
import EditPanel from './slideComponents/editPanel';

interface IProps {
    select: boolean,
    exportSlides: Function,
    removeSlide: Function,
    addSlide: Function,
    handleClick: React.MouseEventHandler<HTMLDivElement>,
    title: string,
}

function TitleSlide(props: IProps) {
    return (
        <>
            <div
                onClick={props.handleClick}
                className={props.select ? "sl-box sl-current-box" : "sl-box"}
            >
                <div className={"slide"}>
                    <div style={{padding: '2rem'}}>
                        <h1>{
                            props.title.length > 0 ?
                                props.title :
                                "Data Science Work for xxx"
                        }</h1>
                        <div
                            style={{
                                position: 'relative',
                                top: '5rem'
                            }}
                        >
                            <div>Author:
                            </div>
                            <div>Date:</div>
                        </div>
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
                    ></EditPanel>
                </div>
            </div>
        </>

    )
}

export default TitleSlide;