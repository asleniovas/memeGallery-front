import React from "react";

//HTTP request library
import axios from "axios";

//for easy nested state updates
import update from 'immutability-helper';

class MemeGallery extends React.Component {
    constructor(props) {
        super(props)

        //state declarations
        this.state = {

            memes: [],
            newMemeURL: "",
            modalMeme: "",
            modalMemeText: "",
        }
    }

    //fetch all Memes when comp mounts
    componentDidMount() {

        this.props.percentage(100)

        axios.get('https://shrouded-journey-16316.herokuapp.com/api/memes')
            .then(response => {

                console.log(response)
                this.setState({memes: response.data})

                this.props.percentage(-100)

            })
            .catch(error => {
            
                console.log(error)
                console.log("Couldn't fetch the memes.")

                this.props.percentage(-100)
   
            })
    }

    render() {

        return (

            <div>Hi</div>
        )
    }
}

export default MemeGallery;