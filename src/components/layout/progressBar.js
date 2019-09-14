import React from "react";

import Filler from "./progressFiller";

//Custom progress/loading bar
const ProgressBar = (props) => {
    return (
        <div className="custom-progress-bar fixed-top">
            <Filler percentage={props.percentage}/>
        </div>
    )
}

export default ProgressBar;