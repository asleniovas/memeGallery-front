import React from 'react';

//individual components
import NavBar from "./components/layout/navbar";
import ProgressBarComponent from "./components/layout/progressComponent";
import MemeGallery from "./components/memegallery";


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      percentage: 0
    }
  }

  //progress bar state handling
  handleFillerState = (percentage) => {
        
    var currentPercentage = this.state.percentage;

    this.setState({ percentage: currentPercentage + percentage })

  }

  render() {

    return (

      <main>

        <NavBar/>
        <ProgressBarComponent percentage={this.state.percentage}/>
        <MemeGallery percentage={(percentage) => this.handleFillerState(percentage)}/>
        
      </main>

    )
  }
}

export default App;
