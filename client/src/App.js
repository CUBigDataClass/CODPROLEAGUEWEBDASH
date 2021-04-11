import React, { Component } from 'react';
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import Search from './components/Search';
import Flight from './components/Flight';
import Yelp from './components/Yelp';
import Intro from './components/Intro';

import './App.css';
// import { Discovery } from 'aws-sdk';

class App extends Component {
  constructor() {
    super()

    this.state = {
      response: '',
      post: '',
      responseToPost: '',
      originValue: null,
      destValue: null,
      flightRes: {message: ""},
      placeRes: {message: ""}
    };

    this.updateSelection = this.updateSelection.bind(this);
  }
  
//   componentDidMount() {
//     this.callApi()
//       .then(res => this.setState({ response: res.express }))
//       .catch(err => console.log(err));
//   }
  
//   callApi = async () => {
//     const response = await fetch('/api/hello');
//     const body = await response.json();
//     if (response.status !== 200) throw Error(body.message);
    
//     return body;
//   };
  
  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch('/api/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    const body = await response.text();
    
    this.setState({ responseToPost: body });
  };

    updateSelection = async (input, place) => {
        if (place === 'Origin') {
            await this.setState({ originValue: input.value });
        } else {
            await this.setState({ destValue: input.value });
            const respon = await fetch(`https://trip-ahead.herokuapp.com/api/search/yelp?location=${encodeURIComponent(this.state.destValue.abbreviation)}`)
                                      .then(res => res.json())
                                      .catch(err => console.log("err: " + err));

            if (typeof(respon) === 'undefined') {
              this.setState({ flightRes: { message: "No places to visit" } })
            } else {
              // console.log(respon['0']._source)
              let hits = Array.from(respon, h => h._source);
              this.setState({ placeRes: hits });
          }
        }

        if (this.state.originValue && this.state.destValue &&
            this.state.originValue.cities.length && this.state.destValue.cities.length) {
                const from_state = this.state.originValue.abbreviation;
                const from_city = this.state.originValue.selected;
                const to_state = this.state.destValue.abbreviation;
                const to_city = this.state.destValue.selected;

                // perform a request
                const res = await fetch(`https://trip-ahead.herokuapp.com/api/search/flight?from=${encodeURIComponent(from_city)},${encodeURIComponent(from_state)}&to=${encodeURIComponent(to_city)},${encodeURIComponent(to_state)}`)
                                        .then(res => res.json())
                                        .catch(err => console.log("err: " + err));
                
                if (typeof(res) === 'undefined') {
                    this.setState({ flightRes: { message: "No flights found" } })
                } else {
                    this.setState({ flightRes: res });
                }
        }
    }
  
render() {
    return (
      <div className="App" style={{ position: "relative" }}>
        <div className="Intro">
          <header className="App-header">
              <Intro />
          </header>
        </div>
        <div className="Search_bar">
          <Card.Text>Please select your From and To:</Card.Text>
            <section className="search-container">
              <Search place='Origin' update={ this.updateSelection }/>
              <Search place='Destination' update={ this.updateSelection }/>
            </section>
        </div>
        <div className="InformationSection">
            <div>
                <Flight quotes={this.state.flightRes}/>
            </div>
            <div className="rowC">
                <Yelp className="Introoo" places={this.state.placeRes}/>
            </div>
        </div>
      </div>
    );
  }
}

export default App;