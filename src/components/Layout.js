import React, { Component } from 'react';
import ReactMapboxGl, { Marker } from "react-mapbox-gl";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faHome } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { NavLink } from 'react-router-dom';
import Marks from './Marks';
import './Layout.css';

library.add(faSearch, faHome);

const musicIcon = require('../assets/imgs/music-player.png');
const mapBoxToken = process.env.REACT_APP_MAPBOX_TOKEN;
const bandsintownID = process.env.REACT_APP_BANDSINTOWN_ID;

const Mapbox = ReactMapboxGl({
  accessToken: mapBoxToken
});

class Layout extends Component {

  state = {
    center: [-122.431297, 37.773972], // [longitude, latitude] of SF (default)
    name: undefined,
    id: undefined,
    imageURL: undefined, 
    events: undefined
  }

  resetState = () => {
    this.setState({
      name: undefined,
      id: undefined,
      imageURL: undefined,
      events: undefined
    })
  }

  handleSubmit = async e => {
    e.preventDefault();

    this.resetState();

    let artistName = e.target.elements.searchbox.value;
    let eventList = [];

    // Fetch artist data
    const artist_API_CALL = await fetch(`https://rest.bandsintown.com/artists/${artistName}?app_id=${bandsintownID}`);
    const artistData = await artist_API_CALL.json();
    console.log(artistData);
    this.setState({
      name: artistData.name,
      id: artistData.id,
      imageURL: artistData.image_url
    })

    // Fetch artist event data
    const artistEvent_API_CALL = await fetch(`https://rest.bandsintown.com/artists/${artistName}/events?app_id=${bandsintownID}`);
    const artistEventData = await artistEvent_API_CALL.json();
    console.log(artistEventData);
    for (let i = 0; i < artistEventData.length; ++i) {
      eventList.push(artistEventData[i]);
    }
    this.setState({events: eventList});
  }

  componentWillMount = () => {
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
              <div className="input-group">
                <span className="input-group-prepend">
                  <NavLink to="/" id="home-link">
                    <button className="btn btn-outline-secondary border" id="home-button" type="button">
                      <FontAwesomeIcon icon="home" size="sm" id="home"/>
                    </button>
                  </NavLink>
                </span>
                <input className="form-control py-2 border-right-0 border col-md-12" name="searchbox" placeholder="Search for an artist" type="search" id="example-search-input" size="50"/>
                <span className="input-group-append">
                  <button className="btn btn-outline-secondary border-left-0 border" id="search-button" type="submit">
                    <FontAwesomeIcon icon="search" size="sm" id="magnifying-glass"/>
                  </button>
                </span>
              </div>
            </form>
          </div>
        </div>
        <div className="map-container">
          <Mapbox
            style="mapbox://styles/ericong18/cjkhgo9ti2o5z2so5c0s0gng8"
            center={this.state.center}
            containerStyle={{
              height: "100vh",
              width: "100vw"
            }}
          >
            { this.state.events && this.state.events.map(artistEvent => {
              return (
                <Marker coordinates={[artistEvent.venue.longitude, artistEvent.venue.latitude]} key={artistEvent.id}>
                  <img src={ musicIcon } alt=""/>
                </Marker>
              )}) 
            }
          </Mapbox>
        </div>
      </div>
    );
  }
}

export default Layout;