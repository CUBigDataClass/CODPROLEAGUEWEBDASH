import React, { Component } from 'react';
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import Search from './components/Search';
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
      originValue: '',
      destValue: '',
      json: {
        "name": "Falafel cafe",
        "rating": 5,
        "price": "$",
        "location": {
          "address1": "401 19th St S",
          "address2": "Ste 100",
          "city": "Birmingham",
          "zip_code": "35233",
          "country": "US",
          "state": "AL"
        },
        "phone": "+12058683999"
      },
    };

    this.updateSelection = this.updateSelection.bind(this);
  }
  
  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }
  
  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    
    return body;
  };
  
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
      this.setState({ originValue: input });
    } 
    else {
      this.setState({ destValue: input });
      // call yelp endpoint search/yelp with destValue 
      const opts = await fetch(`http://localhost:5000/api/search/yelp?location=${encodeURIComponent(input)}`)
                                .then(res => res.json())
                                .catch(err => console.log("err: " + err));

      // const opts = await fetch('http://localhost:5000/api/search/yelp?location=NY')
      //         .then(res => res.json())
      //         .catch(err => console.log("err: " + err));

      console.log(opts)
      this.setState({ options: opts });
    }
  }
  
render() {
    const { response, post, responseToPost } = this.state;

    // console.log(originValue);
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

            <Yelp />
          </Container>
        </Jumbotron>

        </header>
        {/* Testing quck GET POST requests */}
        <p>{ response }</p>
        <form onSubmit={this.handleSubmit}>
          <p>
            <strong>Post to Server:</strong>
          </p>
          <input
            type="text"
            value={ post }
            onChange={e => this.setState({ post: e.target.value })}
          />
          <button type="submit">Submit</button>
        </form>
        <p>{ responseToPost }</p>
      </div>
    );
  }
}

export default App;