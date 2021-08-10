import React from 'react';
import '../../style/slideview.css'

interface IProps {
    points: Array<string>
}

function ExamplePrompt(props: IProps) {

    const pointsList = props.points.map((p) => {
        return (
            <li className='slide-point'>
                {p}
            </li>
        )
    })

    return (
        <>
            <div className='example-prompt'
                style={{
                    color: 'grey',
                    paddingTop: '1rem',
                    paddingLeft: '1rem',
                    border: '2px dashed #bdbdbd',
                }}
            >
                <h5><b>Example: </b></h5>
                <ul
                    style={{fontStyle: 'italic'}}
                    className='slide-point-list'
                >
                    {pointsList}
                </ul>
            </div>
        </>
    )
}

export default ExamplePrompt;