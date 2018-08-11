import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import Layout from './components/Layout';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={ Home }/>
            <Route path='/map' component={ Layout }/>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
