import React, { Component } from 'react';
import Search from './components/Search';
import Flight from './components/Flight';
import Yelp from './components/Yelp';
import Intro from './components/Intro';

import './App.css';

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

  updateSelection = async (input, place) => {
    
      if (place === 'Origin') {
          await this.setState({ originValue: input.value });
      } else {
          await this.setState({ destValue: input.value });
          const respon = await fetch(`http://localhost:5000/api/search/yelp?location=${encodeURIComponent(this.state.destValue.abbreviation)}`)
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
              const res = await fetch(`http://localhost:5000/api/search/flight?from=${encodeURIComponent(from_city)},${encodeURIComponent(from_state)}&to=${encodeURIComponent(to_city)},${encodeURIComponent(to_state)}`)
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
        <div className="searchAreaContainer">
            <section className="searchContainer">
              <div>
                <Search 
                  place='Origin' 
                  inputValue={this.state.originInput}
                  updateSelection={this.updateSelection}
                />
              </div>
              <div>
                <Search 
                  place='Destination' 
                  inputValue={this.state.destInput}
                  updateSelection={this.updateSelection}
                />
              </div>
            </section>
        </div>
        <div className="infoContainer">
            <div>
                <Flight quotes={this.state.flightRes}/>
            </div>
            <div className="yelpRow">
                <Yelp places={this.state.placeRes}/>
            </div>
        </div>
      </div>
    );
  }
}

export default App;