import React from "react";

//Progress bar filler
const Filler = (props) => {
    return <div className="filler" style={{width: `${props.percentage}%`}}/>
}

export default Filler;