import React from "react";

import ProgressBar from "./progressBar"

import "./progressBarStyle.css"

//ProgressBar comp that contains the progress bar and filler
class ProgressBarComponent extends React.Component {

    render () {
        return (
            <div>
                <ProgressBar percentage={this.props.percentage}/>
            </div>
        )
    }
}

export default ProgressBarComponent;