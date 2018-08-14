import React from 'react';
import './Message.css';

const spinner = require('../assets/imgs/three-dots.svg');

const Message = props => {
  return (
    <div className="message-container">
      { props.empty && <div className="alert alert-warning" role="alert">Oops! You forgot to enter something.</div> }
      { props.error && <div className="alert alert-danger" role="alert">Sorry, your information was invalid.</div> }
      { props.none && <div className="alert alert-secondary" role="alert">It seems like we don't have any event information for your artist :(</div> }
      { props.loading && <img src={spinner} alt="Loading" id="loading-spinner"/> }
    </div>
  )
}

export default Message;