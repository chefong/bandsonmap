import React from 'react';
import './Content.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Content = props => {
  return (
    <div className="row">
      <div className="col-md-6 image-modal-container">
        <img src={props.imageURL} alt={props.name + ' image'} className="image-modal"/>
      </div>
      <div className="col-md-6">
        <div className="row justify-content-center">
          <p id="artist-name">{props.name}</p>
        </div>
        <div className="box">
          <div className="row justify-content-center">
            <div className="col-md-3 col-sm-3 col-3 event-icon-container">
              <FontAwesomeIcon icon="clock" size="lg" className="event-icon"/>
            </div>
            <div className="col-md-9 col-sm-9 col-9 event-container">
              <p className="event-date">{props.date} </p>
              {props.currentEvent && <p className="event-time">{props.time} </p>}
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-3 col-sm-3 col-3 event-icon-container">
              <FontAwesomeIcon icon="map-marker-alt" size="lg" className="event-icon"/>
            </div>
            <div className="col-md-9 col-sm-9 col-9 event-container">
              {props.currentEvent && <p className="venue-name">{props.currentEvent.venue.name}</p>}
              {props.currentEvent && <p className="venue-location">{props.location}</p>}
            </div>
          </div>
          <div className="row justify-content-center modal-link-container">
            <div className="col-md-3 col-3">
              {props.currentEvent && <a href={props.currentEvent.url} target="_blank" className="modal-link"><FontAwesomeIcon icon="ticket-alt" size="2x" className="modal-icon ticket-icon"/></a>}
            </div>
            <div className="col-md-3 col-3">
              {props.facebookURL && <a href={props.facebookURL} target="_blank" className="modal-link"><FontAwesomeIcon icon={['fab', 'facebook']} size="2x" className="modal-icon facebook-icon"/></a>}
            </div>
          </div>
        </div>
        <div className="row justify-content-center close-button-container">
          <button type="button" className="btn btn-primary" id="close-button" onClick={props.close}><FontAwesomeIcon icon="times" size="sm" className="close-icon"/> Close</button>
        </div>
      </div>
    </div>
  )
}

export default Content;