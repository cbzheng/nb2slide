import React from 'react';
import '../../style/slideview.css'

interface IProps {
    title: string,
    subtitle: string,
    points: Array<string>,
    select: boolean,
    handleClick: React.MouseEventHandler<HTMLDivElement>;
}

function Slide(props: IProps) {
    const pointsList = props.points.map(point => {
        return (<li className='slide-point'>{point}</li>)
    })

    return (
        <>
            <div
                id={'section-' + props.title + '-sub-' + props.subtitle}
                onClick={props.handleClick}
                className={props.select ? "sl-box sl-current-box" : "sl-box"}
            >
                <div className={"slide"}>
                    <h3>{props.title}</h3>
                    <h4>{props.subtitle}</h4>
                    <ul className='slide-point-list'>
                        {pointsList}
                    </ul>
                </div>
            </div>
        </>

    )
}

export default Slide;