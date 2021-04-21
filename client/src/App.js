import React, { Component } from 'react';
import Search from './components/Search';
import Flight from './components/Flight';
// import Weather from './components/Weather'
import Yelp from './components/Yelp';
import Navbar from './components/Navbar'
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
      // tempRes: {message: ""},
      present: false
    };

    this.updateSelection = this.updateSelection.bind(this);
  }

  updateSelection = async (input, place) => {

      let root = ""
      if (process.env.REACT_APP_ENVIRONMENT === "development"){
         root = "http://localhost:5000"
      }
      else{
         root = "https://trip-ahead.herokuapp.com"
      }
    
      if (place === 'Origin') {
          await this.setState({ originValue: input.value });
      } else {
          // put weather fetch in here 
          await this.setState({ destValue: input.value });
        
          const respon = await fetch(`${root}/api/search/yelp?location=${encodeURIComponent(this.state.destValue.abbreviation)}`)
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
              const res = await fetch(`${root}/api/search/flight?from=${encodeURIComponent(from_city)},${encodeURIComponent(from_state)}&to=${encodeURIComponent(to_city)},${encodeURIComponent(to_state)}`)
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
        {/* <Navbar bg="light">
          <Navbar.Brand>Trip Planner</Navbar.Brand>
        </Navbar> */}
        <Navbar />
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
                {/* <div>
                  <Weather temprature={this.state.tempRes}/>
                </div> */}
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
