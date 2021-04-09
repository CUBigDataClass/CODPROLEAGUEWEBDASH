import React, { Component } from 'react';
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import Search from './components/Search';
import Flight from './components/Flight';
import Yelp from './components/Yelp';

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
            const respon = await fetch(`http://localhost:5000/api/search/yelp?location=${encodeURIComponent(this.state.destValue.abbreviation)}`)
                                      .then(res => res.json())
                                      .catch(err => console.log("err: " + err));

            if (typeof(respon) === 'undefined') {
              this.setState({ flightRes: { message: "No places to visit" } })
            } else {
              this.setState({ placeRes: respon['0']._source });
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
      <div className="App">
        <header className="App-header">
         <h1>Welcome to Trip Planner</h1>

        <Jumbotron className="jumbo-style">
          <Container className="Intro">
            <Card className="card">
              <Card.Header as="h5" className="d-flex justify-content-center flex-wrap">
                <Card.Body className="d-flex justify-content-center flex-column">
                  <Card.Text>Trip Planner is the web based application that allows users to plan their trip accordigly to their destination.</Card.Text>
                  <Card.Text>All you have to do is enter the desired location into the search bar and we will take care of the rest.</Card.Text>
                  <Card.Text>Trip Planner is connected to multiple APIs to help us provide you with the best information.</Card.Text>
                  <Card.Text>You enter destination and we will provide with cheapest fligh tickets, weather report, things to do and spots to visit.</Card.Text>
                </Card.Body>
              </Card.Header>
            </Card>

            <section className="search-container">
              <Search 
                place='Origin' 
                update={ this.updateSelection }
              
              />

              {/* Put switch button component here */}

              <Search 
                place='Destination' 
                update={ this.updateSelection }
              />
            </section>

            
          </Container>
        </Jumbotron>

        </header>
        <Flight
            quotes={this.state.flightRes}
          />
        <p>{ this.state.responseToPost }</p>
        <br/>
          <div className="rowC">
          <Yelp
            places={this.state.placeRes}
          />
          </div>
      </div>
    );
  }
}

export default App;