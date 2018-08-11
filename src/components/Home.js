import React from 'react';
import { NavLink } from 'react-router-dom';
import './Home.css';

const logo = require('../assets/imgs/bom logo.png');
const searchIcon = require('../assets/imgs/search.png');
const interactIcon = require('../assets/imgs/click.png');
const supportIcon = require('../assets/imgs/like.png');

const Home = () => {
  return (
    <div className="container-fluid">
      <div className="row justify-content-center home-container">
        <div className="title-container">
          <img src={ logo } alt="bandsonmap logo" id="logo"/>
          <h2 id="subtitle"><strong>Your artists, one map.</strong></h2>
          <NavLink to="/map" id="go-link"><button type="button" id="go-button" className="btn btn-light">GO</button></NavLink>
        </div>
      </div>
      <div className="row justify-content-center info-container">
        <div className="col-md-4">
          <p className="info-item">Search</p>
          <div className="icon-container">
            <img src={ searchIcon } alt="Search Icon" className="info-item-icon"/>
          </div>
          <p className="item-desc">Type in your favorite artist and see where they’ll be visiting on the map. The data you see is all powered by <a className="link" href="https://www.bandsintown.com/" target="_blank" rel="noopener noreferrer">bandsintown!</a></p>
        </div>
        <div className="col-md-4">
          <p className="info-item">Interact</p>
          <div className="icon-container">
            <img src={ interactIcon } alt="Interact Icon" className="info-item-icon"/>
          </div>
          <p className="item-desc">Explore what’s on the map by clicking and dragging, all thanks to <a className="link" href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer">Mapbox!</a></p>
        </div>
        <div className="col-md-4">
          <p className="info-item">Support</p>
          <div className="icon-container">
            <img src={ supportIcon } alt="Support Icon" className="info-item-icon"/>
          </div>
          <p className="item-desc">Like what you see? Share it with your friends and give it a star on our <a className="link" href="https://github.com/ericong18/bandsonmap" target="_blank" rel="noopener noreferrer">GitHub repo!</a></p>
        </div>
      </div>
    </div>
  )
}

export default Home;