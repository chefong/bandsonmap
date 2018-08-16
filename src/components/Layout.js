import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature, ZoomControl, RotationControl, ScaleControl } from "react-mapbox-gl";
import Form from './Form';
import Message from './Message';
import Content from './Content';
import { faSearch, faHome, faTicketAlt, faClock, faMapMarkerAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import Modal from 'react-responsive-modal';
import './CustomModal.css';
import './Layout.css';

library.add(faSearch, faHome, faTicketAlt, faClock, faMapMarkerAlt, faTimes, fab);

const mapBoxToken = process.env.REACT_APP_MAPBOX_TOKEN;
const bandsintownID = process.env.REACT_APP_BANDSINTOWN_ID;
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const Mapbox = ReactMapboxGl({
  accessToken: mapBoxToken
});

class Layout extends Component {

  state = {
    center: [98.5795, 39.8283], // [longitude, latitude] of SF (default)
    zoom: [1],
    name: undefined,
    id: undefined,
    imageURL: undefined,
    facebookURL: undefined,
    events: undefined,
    currentEvent: undefined,
    modalOpen: false,
    empty: false,
    error: false,
    loading: false,
    none: false
  }

  handleSubmit = async e => {
    e.preventDefault();
    let artistName = e.target.elements.searchbox.value;

    // Check if input is empty
    if (!artistName) {
      this.setState({
        empty: true,
        error: false
      })
      return;
    }
    this.setState({
      error: false,
      empty: false,
      none: false
    })

    // Fetch artist and event data and handle errors
    let eventList = [];
    let artist_API_CALL, artistData, artistEvent_API_CALL, artistEventData;
    this.setState({
      loading: true
    })
    try {
      artist_API_CALL = await fetch(`https://rest.bandsintown.com/artists/${artistName}?app_id=${bandsintownID}`);
      artistData = await artist_API_CALL.json();

      artistEvent_API_CALL = await fetch(`https://rest.bandsintown.com/artists/${artistName}/events?app_id=${bandsintownID}`);
      artistEventData = await artistEvent_API_CALL.json();

      // Check if artist event information doesn't exist
      if (artistEventData.length === 0) {
        this.setState({
          none: true,
          loading: false
        })
        return;
      }
    }
    catch(err) {
      console.log(err);
      this.setState({
        error: true,
        loading: false
      })
      return;
    }

    // Store all events in an array
    for (let i = 0; i < artistEventData.length; ++i) {
      eventList.push(artistEventData[i]);
    }
    
    this.setState({
      name: artistData.name,
      id: artistData.id,
      events: eventList,
      zoom: [1],
      imageURL: artistData.image_url,
      facebookURL: artistData.facebook_page_url,
      error: false,
      loading: false,
      none: false
    })
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
      let hours = eventTime.getHours();
      let minutes = eventTime.getMinutes();

      if (minutes < 10) {
        minutes = '0' + minutes;
      }

      let ampm;
      if (hours < 12) {
        if (hours === 0) {
          hours = 12;
        }
        ampm = 'AM';
      }
      else {
        ampm = 'PM';
        if (hours >= 13) {
          hours -= 12;
        }
      }

      return (hours + ':' + minutes + ' ' + ampm);
    }
  }

  parseLocation = () => {
    if (this.state.currentEvent) {
      let venue = this.state.currentEvent.venue;
      let city = venue.city + ', ';

      let region = venue.region;
      region ?
        region += ', ' : region = '';

      return (city + region + venue.country);
    }
  }

  componentDidMount = () => {
    this.setState({
      name: JSON.parse(localStorage.getItem("name")),
      id: JSON.parse(localStorage.getItem("id")),
      imageURL: JSON.parse(localStorage.getItem("imageURL")),
      facebookURL: JSON.parse(localStorage.getItem("facebookURL")),
      events: JSON.parse(localStorage.getItem("events")),
      currentEvent: JSON.parse(localStorage.getItem("currentEvent"))
    })
  }

  componentDidUpdate = () => {
    localStorage.setItem("name", JSON.stringify(this.state.name));
    localStorage.setItem("id", JSON.stringify(this.state.id));
    localStorage.setItem("imageURL", JSON.stringify(this.state.imageURL));
    localStorage.setItem("facebookURL", JSON.stringify(this.state.facebookURL));
    localStorage.setItem("events", JSON.stringify(this.state.events));
    localStorage.setItem("currentEvent", JSON.stringify(this.state.currentEvent));
  }

  render() {
    const open = this.state.modalOpen;
    return (
      <div className="wrapper">
        <div className="row justify-content-center">
          <div className="form-container">
            <Form submit={this.handleSubmit}/>
            <div className="message-container row justify-content-center">
              <Message empty={this.state.empty} error={this.state.error} none={this.state.none} loading={this.state.loading}/>
            </div>
          </div>
        </div>
        <div className="map-container">
          <Mapbox
            // eslint-disable-next-line
            style="mapbox://styles/ericong18/cjkrdhft55uy52tmt3562gjqe"
            animationOptions={{
              duration: "6000"
            }}
            zoom={this.state.zoom}
            center={this.state.center}
            containerStyle={{
              height: "100vh",
              width: "100vw"
            }}>
            <ScaleControl style={{ bottom: 30 }}/>
            <ZoomControl />
            <RotationControl style={{ top: 80 }} />
            { this.state.events && (
              <Layer
                type="symbol" 
                id="marker"
                layout={{
                    "icon-image": "music-round-15"
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
            <Content
              imageURL={this.state.imageURL}
              name={this.state.name}
              currentEvent={this.state.currentEvent}
              date={this.constructDate()}
              time={this.constructTime()}
              location={this.parseLocation()}
              facebookURL={this.state.facebookURL}
              close={this.closeModal}/>
          </Modal>
        </div>
      </div>
    );
  }
}

export default Layout;