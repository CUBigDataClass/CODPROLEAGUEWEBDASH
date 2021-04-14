import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';
import Search from './components/Search';
import Flight from './components/Flight';
import Yelp from './components/Yelp';
import Footer from './components/Footer';
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
      placeRes: {message: ""},
      present: false
    };

    this.updateSelection = this.updateSelection.bind(this);
  }

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
            let hits = Array.from(respon, h => h._source);
            this.setState({ placeRes: hits });
        }
        await this.setState({ present: true });
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

              await this.setState({ present: true });
      }
  }
  
render() {
  let resultClass = this.state.present ? 'infoContainer' : 'infoContainerHide';
    return (
      <>
        <Navbar bg="light">
          <Navbar.Brand>Trip Planner</Navbar.Brand>
        </Navbar>
        <div className="appContainer">
          <div className="App">
              <div className="Intro">
                <div className="searchAreaContainer">
                  <section className="searchContainer">
                    <div className="Search">
                      <Search 
                        place='Origin' 
                        inputValue={this.state.originInput}
                        updateSelection={this.updateSelection}
                        updateInput={this.updateInput}
                      />
                    </div>
                    <div className="Search">
                      <Search 
                        place='Destination' 
                        inputValue={this.state.destInput}
                        updateSelection={this.updateSelection}
                        updateInput={this.updateInput}
                      />
                    </div>
                    </section>
                  </div>
              </div> 

            <div className={resultClass}>
                <div>
                    <Flight quotes={this.state.flightRes}/>
                </div>
                <div className="yelpRow">
                    <Yelp places={this.state.placeRes}/>
                </div>
            </div>
            <div>
              <Footer/>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default App;
