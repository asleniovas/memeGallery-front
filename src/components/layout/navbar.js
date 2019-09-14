import React from 'react';

const NavBar = (props) => (
    
    <nav className="navbar fixed-top navbar-light bg-light">
        
        <i class="fas fa-plus fa-lg"></i> Add Meme
        

        <a className="navbar-brand ml-auto" href="https://getbootstrap.com/">
             <i class="fab fa-bootstrap fa-lg"></i> 
        </a>
        <a className="navbar-brand" href="https://reactjs.org/">
            <i class="fab fa-react fa-lg"></i>
        </a>
        
    </nav>
)

export default NavBar;