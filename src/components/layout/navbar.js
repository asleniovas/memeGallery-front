import React from 'react';

//navbar component
const NavBar = (props) => (
    
    <nav className="navbar fixed-top navbar-dark" style={NavBarStyle}>
        
        <button type="button" className="btn btn-success">
            <i className="fas fa-plus fa-lg"></i> Add Meme
        </button>

        <label className="navbar-brand ml-auto">powered by</label>
        <a className="navbar-brand" href="https://getbootstrap.com/">
             <i className="fab fa-bootstrap fa-lg"></i> 
        </a>
        <a className="navbar-brand" href="https://reactjs.org/">
            <i className="fab fa-react fa-lg"></i>
        </a>
        
    </nav>
)

//styling
const NavBarStyle = {
    backgroundColor: "#563d7c",
}

export default NavBar;