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

    //POST request for new meme URL storage
    handleMemeURLUpload = (event) => {

        event.preventDefault();

        axios.post('https://shrouded-journey-16316.herokuapp.com/api/memes/', 
            
            {memeURL: this.state.newMemeURL},

            {headers: {"content-type": "application/json"}})

            .then(response => {
                
                console.log(response)

                this.setState(prevState => ({
                    memes: [...prevState.memes, response.data[0] ]
                }))

                this.props.percentage(-100)

            })
            .catch(err => {

                console.log(err)

                this.props.percentage(-100)
            })
    }

    //State change handler
    handleStateChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }    

    render() {

        return (

            /*Modal for new meme URLs*/
            <div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalCenterTitle">Upload a New Meme!</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={this.handleMemeURLUpload}>

                        <div className="form-row">
                            <div className="col">
                                <label for="memeURL">Please Enter a Valid Meme URL Below</label>   
                            </div>
                        </div>
                        
                        <div className="form-row mt-2">
                            <div className="col">
                                <input name="newMemeURL" className="form-control" id="memeURL" type="url" onChange={this.handleStateChange} required></input>
                            </div>
                        </div>
                        
                        <div className="modal-footer mt-3">
                            <input type="submit" class="btn btn-success" value="Save"></input>
                        </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
        )
    }
}

export default MemeGallery;