import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faHome, faTicketAlt, faClock, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { NavLink } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import './CustomModal.css';
import './Layout.css';

library.add(faSearch, faHome, faTicketAlt, faClock, faMapMarkerAlt, fab);

const mapBoxToken = process.env.REACT_APP_MAPBOX_TOKEN;
const bandsintownID = process.env.REACT_APP_BANDSINTOWN_ID;
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
    facebookURL: undefined,
    events: undefined,
    currentEvent: undefined,
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
      imageURL: artistData.image_url,
      facebookURL: artistData.facebook_page_url
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

  openModal = (long, lat, currentEvent) => {
    // Center and zoom into the event location and assign active event
    this.setState({
      center: [long, lat],
      zoom: [15],
      currentEvent,
      modalOpen: true
    })
  }

  closeModal = () => {
    this.setState({
      modalOpen: false
    })
  }

  constructDate = () => {
    if (this.state.currentEvent) {
      let eventTime = new Date(this.state.currentEvent.datetime);

      let dayOfWeek = days[eventTime.getDay()];
      let month = months[eventTime.getMonth()];
      let date = eventTime.getDate();
      let year = eventTime.getFullYear();

      return (dayOfWeek + ', ' + month + ' ' + date + ', ' + year);
    }
  }

  constructTime = () => {
    if (this.state.currentEvent) {
      let eventTime = new Date(this.state.currentEvent.datetime);
      let hours = eventTime.getUTCHours();
      console.log(hours);
      let minutes = eventTime.getUTCMinutes();

      if (minutes < 10) {
        minutes = '0' + minutes;
      }

      let ampm;
      if (hours < 12) {
        ampm = 'AM';
      }
      else {
        ampm = 'PM';
        hours -= 12;
      }

      return (hours + ':' + minutes + ' ' + ampm);
    }
  }

  getVenueLocation = () => {
    if (this.state.currentEvent) {
      let venue = this.state.currentEvent.venue;
      return (venue.city + ', ' + venue.region + ', ' + venue.country);
    }
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
        <div className="map-container">
          <Mapbox
            // eslint-disable-next-line
            style="mapbox://styles/ericong18/cjkrdhft55uy52tmt3562gjqe"
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
                    "icon-allow-overlap": true,
                    "icon-image": "circle-15"
                  }}>
                { this.state.events.map(artistEvent => {
                  return (
                    <Feature
                      key={artistEvent.id}
                      coordinates={[artistEvent.venue.longitude, artistEvent.venue.latitude]}
                      onClick={() => {this.openModal(artistEvent.venue.longitude, artistEvent.venue.latitude, artistEvent)}}/>
                  )  
                })}
              </Layer>
            )}
          </Mapbox>
        </div>
        <div className="modal-container">
          <Modal open={open} onClose={this.closeModal} showCloseIcon={false} classNames={{ modal: 'custom-modal', overlay: 'custom-overlay' }}center>
              <div className="row">
                <div className="col-md-6 image-modal-container">
                  <img src={this.state.imageURL} alt="" className="image-modal"/>
                </div>
                <div className="col-md-6">
                  <div className="row justify-content-center">
                    <p id="artist-name">{this.state.name}</p>
                  </div>
                  <div className="box">
                    <div className="row justify-content-center">
                      <div className="col-md-3 col-sm-3 col-3 event-icon-container">
                        <FontAwesomeIcon icon="clock" size="lg" className="event-icon"/>
                      </div>
                      <div className="col-md-9 col-sm-9 col-9 event-container">
                        <p className="event-date">{this.constructDate()} </p>
                        {this.state.currentEvent && <p className="event-time">{this.constructTime()} </p>}
                      </div>
                    </div>
                    <div className="row justify-content-center">
                      <div className="col-md-3 col-sm-3 col-3 event-icon-container">
                        <FontAwesomeIcon icon="map-marker-alt" size="lg" className="event-icon"/>
                      </div>
                      <div className="col-md-9 col-sm-9 col-9 event-container">
                        {this.state.currentEvent && <p className="venue-name">{this.state.currentEvent.venue.name}</p>}
                        {this.state.currentEvent && <p className="venue-location">{this.getVenueLocation()}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="row justify-content-center modal-link-container">
                    <div className="col-md-3 col-3">
                      {this.state.currentEvent && <a href={this.state.currentEvent.url} target="_blank" className="modal-link"><FontAwesomeIcon icon="ticket-alt" size="2x" className="modal-icon"/></a>}
                    </div>
                    <div className="col-md-3 col-3">
                      {this.state.facebookURL && <a href={this.state.facebookURL} target="_blank" className="modal-link"><FontAwesomeIcon icon={['fab', 'facebook']} size="2x" className="modal-icon"/></a>}
                    </div>
                  </div>
                </div>
              </div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default Layout;