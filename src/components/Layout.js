import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faHome } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { NavLink } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import './CustomModal.css';
import './Layout.css';

library.add(faSearch, faHome);

const mapBoxToken = process.env.REACT_APP_MAPBOX_TOKEN;
const bandsintownID = process.env.REACT_APP_BANDSINTOWN_ID;

const Mapbox = ReactMapboxGl({
  accessToken: mapBoxToken
});

class Layout extends Component {

  state = {
    center: [-122.431297, 37.773972], // [longitude, latitude] of SF (default)
    zoom: [11],
    name: undefined,
    id: undefined,
    imageURL: undefined, 
    events: undefined,
    modalOpen: false
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

    // Make sure states are cleared (except center) during each new search
    this.resetState();
    
    let artistName = e.target.elements.searchbox.value;
    if (!artistName) {
      return;
    }

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
    let eventList = [];
    const artistEvent_API_CALL = await fetch(`https://rest.bandsintown.com/artists/${artistName}/events?app_id=${bandsintownID}`);
    const artistEventData = await artistEvent_API_CALL.json();
    console.log(artistEventData);
    for (let i = 0; i < artistEventData.length; ++i) {
      eventList.push(artistEventData[i]);
    }

    // Store all events in state and zoom out to see all venue locations
    this.setState({
      events: eventList,
      zoom: [0]
    });
  }

  openModal = (long, lat) => {
    // Center and zoom into the event location
    this.setState({
      center: [long, lat],
      zoom: [15],
      modalOpen: true
    })
    console.log("Open modal");
  }

  closeModal = () => {
    this.setState({
      modalOpen: false
    })
  }

  componentDidMount = () => {
    // Ask user permission for browser location when after component mounts
    // navigator.geolocation.getCurrentPosition(location => {
    //   this.setState({
    //     center: [location.coords.longitude, location.coords.latitude]
    //   })
    // });
  }

  render() {
    const open = this.state.modalOpen;
    return (
      <div className="wrapper">
        <div className="row justify-content-center">
          <div className="form-container">
            <form onSubmit={this.handleSubmit}>
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
        <div className="modal-container">
          <Modal open={open} onClose={this.closeModal} showCloseIcon={false} classNames={{ modal: 'custom-modal', overlay: 'custom-overlay' }}center>
              <div className="row">
                <div className="col-md-6">
                  <img src={this.state.imageURL} alt="" className="image-modal"/>
                </div>
                <div className="col-md-6">
                  <p id="artist-name">{this.state.name}</p>
                </div>
              </div>
          </Modal>
        </div>
        <div className="map-container">
          <Mapbox
            style="mapbox://styles/ericong18/cjkhgo9ti2o5z2so5c0s0gng8"
            zoom={this.state.zoom}
            center={this.state.center}
            containerStyle={{
              height: "100vh",
              width: "100vw"
            }}>
            { this.state.events && (
              <Layer
                type="symbol" 
                id="marker"
                layout={{
                    "icon-image": "circle-15"
                  }}>
                { this.state.events.map(artistEvent => {
                  return (
                    <Feature
                      key={artistEvent.id}
                      coordinates={[artistEvent.venue.longitude, artistEvent.venue.latitude]}
                      onClick={() => {this.openModal(artistEvent.venue.longitude, artistEvent.venue.latitude)}}/>
                  )  
                })}
              </Layer>
            )}
          </Mapbox>
        </div>
      </div>
    );
  }
}

export default Layout;