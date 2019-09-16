import React from "react";

//HTTP request library
import axios from "axios";

//meme modal width
const width = 600;

//Meme Gallery component with associated handlings
class MemeGallery extends React.Component {
    constructor(props) {
        super(props)

        //state declarations
        this.state = {

            memes: [],
            currentMeme : 0,
            ratio: undefined,
            newMemeURL: "",
            modalMemeTextBot: "",
            modalMemeTextTop: "",
            currentImagebase64: null,
            topY: "10%",
            topX: "50%",
            bottomX: "50%",
            bottomY: "90%"
        }

        this.image = new Image();
    }

    //fetch all Memes when comp mounts
    async componentDidMount() {

        this.props.percentage(100)

        await axios.get('https://shrouded-journey-16316.herokuapp.com/api/memes')
            .then(response => {

                console.log(response)
                this.setState({memes: response.data} , () => {
                    this.setState({currentMeme: 0}, () => {

                        //set initial size of initial meme in modal
                        this.image.onload = () => {
                            this.setState({
                              ratio: this.image.naturalWidth / this.image.naturalHeight  
                            });
                        };

                        this.image.src = this.state.memes[this.state.currentMeme].url;
                    })
                })

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

                //add new meme to the beginning of gallery
                this.setState(prevState => ({
                    memes: [response.data[0], ...prevState.memes]
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

                    //set new memes state and assign 1st in arr as current meme to avoid DELETE errors ->
                    //if a current meme is deleted
                    this.setState({memes: memesStateArray}, () => {
                        this.setState({currentMeme: 0})
                    });

                    this.props.percentage(-100)
                })
                .catch(err => {

                    console.log(err)

                    this.props.percentage(-100)
                })

        }

    }

    //State change handler
    handleStateChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }

    //onClick handler that loads the clicked meme on to a canvas and sets base64 state
    openImage = (memeURL, index) => {

        this.setState({currentMeme: index}, () => {
            
            const base_image = new Image();
            base_image.crossOrigin = "anonymous";
            base_image.onload = () => {

                //change aspect ratio and set state to fit meme into modal
                this.setState({ratio: base_image.naturalWidth / base_image.naturalHeight}, () => {

                    const base64 = this.getBase64Image(base_image);
                    this.setState({currentImagebase64: base64});

                });
            }
            base_image.src = memeURL;
            

        })
        

    }

    //handler that draws the image on the canvas and returns a base64 URL
    getBase64Image(img) {

        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");
        return dataURL;
    }

    //Meme conversion and download
    convertSvgToImage = () => {

        const svg = this.svgRef;
        let svgData = new XMLSerializer().serializeToString(svg);

        const canvas = document.createElement("canvas");
        canvas.setAttribute("id", "canvas");
        const svgSize = svg.getBoundingClientRect();
        canvas.width = svgSize.width;
        canvas.height = svgSize.height;

        const img = document.createElement("img");
        img.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));
        img.onload = function() {

            canvas.getContext("2d").drawImage(img, 0, 0);
            const canvasdata = canvas.toDataURL("image/png");
            const a = document.createElement("a");
            a.download = "meme.png";
            a.href = canvasdata;
            document.body.appendChild(a);
            a.click();

        };
    }

    render() {

        const {memes} = this.state;
        const {ratio} = this.state;

        //meme text style
        const textStyle = {

            fontFamily: "Impact",
            fontSize: "50px",
            textTransform: "uppercase",
            fill: "#FFF",
            stroke: "#000",
            userSelect: "none"
        }
        

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
                                                    <button className="btn btn-success" onClick={this.openImage.bind(this, meme.url, index)}
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
                                            <label htmlFor="memeURL">
                                                Please Enter a Valid Meme URL Below (Preferably From Imgur as They Allow CORS) 
                                                <i className="fas fa-grin-beam-sweat fa-lg ml-2"></i>
                                            </label>   
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

                                    {/*The Meme*/}
                                    {ratio &&
                                    <svg className="card-img-top"
                                            id="svg_ref"
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                            width={width}
                                            height={width/ratio}
                                            ref={el => { this.svgRef = el }}>
                                        <image
                                        
                                            ref={el => { this.imageRef = el }}
                                            xlinkHref={this.state.currentImagebase64}
                                            height={width/ratio}
                                            width={width}

                                        />
                                        <text
                                            style={textStyle}
                                            x={this.state.topX}
                                            y={this.state.topY}
                                            dominantBaseline="middle"
                                            textAnchor="middle"
                                        >
                                            {this.state.modalMemeTextTop}
                                        </text>
                                        <text
                                            style={textStyle}
                                            dominantBaseline="middle"
                                            textAnchor="middle"
                                            x={this.state.bottomX}
                                            y={this.state.bottomY}
                                        >
                                            {this.state.modalMemeTextBot}
                                        </text>
                                    </svg>
                                    }
                                    <div className="card-body">
                                        <div className="form-row mb-1">
                                            <label>Top Text:</label> 
                                        </div>
                                        <div className="form-row mb-3">
                                            <input type="text" name="modalMemeTextTop" className="form-control" onChange={this.handleStateChange}></input>
                                        </div>
                                        <div className="form-row mb-1">
                                            <label>Bottom Text:</label>
                                        </div>
                                        <div className="form-row mb-3">
                                            <input type="text" name="modalMemeTextBot" className="form-control" onChange={this.handleStateChange}></input>
                                        </div>
                                        <div className="form-row">
                                            <button onClick={() => this.convertSvgToImage()} className="btn btn-success"><i className="fas fa-cloud-download-alt mr-2"></i>
                                                Download Meme!
                                            </button>
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