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
                    color: 'red',
                    fontWeight: "bold"
                }}
            >
                <h4>Example: </h4>
                <ul
                    className='slide-point-list'
                >
                    {pointsList}
                </ul>
            </div>
        </>
    )
}

export default ExamplePrompt;