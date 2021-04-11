import React from 'react';
import './../App.css';
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";


const Intro = () => {
   return(
      <div>
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
               </Container>
            </Jumbotron>
      </div>
   )
}

export default Intro;