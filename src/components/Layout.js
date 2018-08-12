import React, { Component } from 'react';
import ReactMapboxGl from "react-mapbox-gl";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faHome } from '@fortawesome/free-solid-svg-icons';
import { library } from '../../node_modules/@fortawesome/fontawesome-svg-core';
import { NavLink } from 'react-router-dom';
import './Layout.css';

library.add(faSearch, faHome);

const Map = ReactMapboxGl({
  accessToken: process.env.REACT_APP_MAPBOX_TOKEN
});

class Layout extends Component {

  state = {
    center: [-122.431297, 37.773972] // [longitude, latitude]
  }

  handleSubmit = async e => {
    e.preventDefault();
    alert(e.target.elements.searchbox.value);
  }

  componentDidMount = () => {
    navigator.geolocation.getCurrentPosition(location => {
      this.setState({
        center: [location.coords.longitude, location.coords.latitude]
      })
    });
  }

  render() {
    return (
      <div className="wrapper">
        <div className="row justify-content-center">
          <div className="form-container">
            <form onSubmit={ this.handleSubmit }>
              <div class="input-group">
                <span class="input-group-prepend">
                  <NavLink to="/" id="home-link">
                    <button class="btn btn-outline-secondary border" id="home-button" type="button">
                      <FontAwesomeIcon icon="home" size="sm" id="home"/>
                    </button>
                  </NavLink>
                </span>
                <input class="form-control py-2 border-right-0 border col-md-12" name="searchbox" placeholder="Search for an artist" type="search" id="example-search-input" size="50"/>
                <span class="input-group-append">
                  <button class="btn btn-outline-secondary border-left-0 border" id="search-button" type="submit">
                    <FontAwesomeIcon icon="search" size="sm" id="magnifying-glass"/>
                  </button>
                </span>
              </div>
            </form>
          </div>
        </div>
        <div className="map-container">
          <Map
            style="mapbox://styles/mapbox/streets-v9"
            center={this.state.center}
            containerStyle={{
              height: "100vh",
              width: "100vw"
            }}
          />
        </div>
      </div>
    );
  }
}

export default Layout;