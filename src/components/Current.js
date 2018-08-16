import React from 'react';
import './Current.css';

const Current = props => {
  return (
    <div className="current-wrapper">
      Showing results for <strong>"{props.name}"</strong>
    </div>
  )
}

export default Current;