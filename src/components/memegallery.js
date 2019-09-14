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
            modalMemeTextBot: "",
            modalMemeTextTop: ""
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

        this.props.percentage(100)

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

    //DELETE meme handler
    handleMemeDel = (memeId, index) => {

        var alertbox = window.confirm("You Sure?");

        if (alertbox === true) {

            this.props.percentage(100)

            axios.delete('https://shrouded-journey-16316.herokuapp.com/api/memes/' + memeId)
                .then(response =>{

                    //remove deleted meme from state array
                    var memesStateArray = [...this.state.memes];
                    memesStateArray.splice(index, 1)

                    this.setState({memes: memesStateArray});

                    this.props.percentage(-100)
                })
                .catch(err => {

                    console.log(err)

                    this.props.percentage(-100)
                })

        }

    }

    //change modal meme url in state when adding text to a meme
    handleMemeCreation = (memeURL) => {

        this.setState({modalMeme: memeURL})

    }

    //State change handler
    handleStateChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }    

    render() {

        const {memes} = this.state;

        return (

            /*Main content container*/
            <div className="container mt-3">
            
                {/*maping through all memes in state and placing images into cards*/}
                    <div className="row justify-content-end">
                    {
                        memes.length

                            ? memes.map((meme, index) =>

                                <div key={index} className="col mb-4">
                                    <div className="card" style={{width: "18rem"}}>
                                        <img src={meme.url} className="card-img-top" alt="meme" height="200" style={{objectFit: "cover"}}/>
                                        <div className="card-body">
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <button className="btn btn-success" onClick={this.handleMemeCreation.bind(this, meme.url)}
                                                    style={{display: "block", margin: "0 auto"}}
                                                    data-toggle="modal" data-target="#memeCreationModal">
                                                        <i className="fas fa-pencil-alt"></i> Add Text
                                                    </button>
                                                </div>
                                                <div className="col">
                                                    <button className="btn btn-danger" onClick={this.handleMemeDel.bind(this, meme.id, index)} 
                                                    style={{display: "block", margin: "0 auto"}}>
                                                        <i className="fas fa-trash-alt"></i> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>)
                        
                            : null
                    }
                    </div>

                {/*Modal for meme saving*/}
                <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalCenterTitle">Save a New Meme!</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={this.handleMemeURLUpload}>

                                    <div className="form-row">
                                        <div className="col">
                                            <label htmlFor="memeURL">Please Enter a Valid Meme URL Below</label>   
                                        </div>
                                    </div>
                        
                                    <div className="form-row mt-2">
                                        <div className="col">
                                            <input name="newMemeURL" className="form-control" id="memeURL" type="url" onChange={this.handleStateChange} required></input>
                                        </div>
                                    </div>
                        
                                    <div className="modal-footer mt-3">
                                        <input type="submit" className="btn btn-success" value="Save"></input>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/*Modal for meme creation*/}
                <div className="modal fade" id="memeCreationModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="card">
                                    <img src={this.state.modalMeme} className="card-img-top" alt="meme" height="350" style={{objectFit: "cover"}}/>
                                    <div className="card-body">
                                        <div className="row align-items-center">
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default MemeGallery;