import React, { Component, Fragment } from 'react'
// import Styles from '../styles/Flight.module.css'
import Styles from '../styles/YelpPlaces.module.css'

const Yelp = (props) => {
   
   if (props.places.hasOwnProperty('message')) {
      return ( <p>{ props.message }</p>)
   }

   return (
      <div className={Styles.container}>
         <p className={Styles.p}> Here are some place in {props.places.location.state} to visit</p>
         <div className={Styles.innerContainer}>
            <p>Name: {props.places.name}</p>
            <p>Rating: {props.places.rating}</p>
            <p>Price: {props.places.price}</p>
            <p>Address:</p>
            <p>{props.places.location.address1}</p>
            <p>{props.places.location.address2}</p>
            <p>{props.places.location.city}</p>
            <p>{props.places.location.state}</p>
            <p>{props.places.location.country}</p>
            <p>{props.places.location.zip}</p>
            <p>{props.places.phone}</p>
            
         </div>
      </div>
   )
}
 
 export default Yelp