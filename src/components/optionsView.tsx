import React from 'react';
import '../../style/slideview.css'

interface IProps {
}

function OptionsView(props: IProps) {

    return (
        <>
            <div id={"optionsView"}>
                <ul id='nav-bar'>
                    <li className='nav-title' id='title'><a href="#home">NB2Slide</a></li>
                    <li className='nav-item'><a href="#news">Parameters</a></li>
                    <li className="nav-item nav-dropdown">
                        <a href="javascript:void(0)" className="dropbtn">Regeneration</a>
                        <div className="dropdown-content">
                            <a href="#">Regenerate current slide</a>
                            <a href="#">Regenerate all slides</a>
                        </div>
                    </li>
                    
                    <li className='nav-item'><a href="#news">Export</a></li>
                </ul>
            </div>
        </>
    )
}

export default OptionsView;