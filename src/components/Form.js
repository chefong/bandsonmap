import React from 'react';
import './Form.css';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Form = props => {
  return (
    <div className="form-bar-container">
      <form onSubmit={props.submit}>
        <div className="input-group">
          <span className="input-group-prepend">
            <NavLink to="/" id="home-link">
              <button className="btn btn-outline-secondary border" id="home-button" type="button">
                <FontAwesomeIcon icon="home" size="sm" id="home"/>
              </button>
            </NavLink>
          </span>
          <input className="form-control py-2 border-right-0 border-left-0 border col-md-12" name="searchbox" placeholder="Search for an artist" type="search" autoComplete="off" size="50"/>
          <span className="input-group-append">
            <button className="btn btn-outline-secondary border-left-0 border" id="search-button" type="submit">
              <FontAwesomeIcon icon="search" size="sm" id="magnifying-glass"/>
            </button>
          </span>
        </div>
      </form>
    </div>
  )
}

export default Form;