import React, { Component, Fragment } from 'react'
// import Styles from '../styles/Flight.module.css'
import Styles from '../styles/YelpPlaces.module.css'
// import '../styles/YelpPlaces.css'

const Yelp = (props) => {
   // console.log(props.places['0'])
   
   if (props.places.hasOwnProperty('message')) {
      return ( <p>{ props.message }</p>)
   }
   var count = 0
   let arr = []
   var state = ''
   for (const place of props.places){
      count = count + 1
      state = place.location.state
      let component = (
         <Fragment>
            <div className={Styles.container}>
            <div className={Styles.imgContainer}>
               <img className={Styles.cardImg} src={state.image_url}></img>
            </div>
            <div className={Styles.innerContainer}>
               <p>Name: {place.name}</p>
               <p>Rating: {place.rating}</p>
               <p>Price: {place.price}</p>
               <p>Address:</p>
               <p>{place.location.address1}</p>
               <p>{place.location.address2}</p>
               <p>{place.location.city}</p>
               <p>{place.location.state}</p>
               <p>{place.location.country}</p>
               <p>{place.location.zip}</p>
               <p>{place.phone}</p>
            </div>
         </div>
         </Fragment>
      )
      arr.push(component)
   }

      return (
         <div>
            <p className="Introoo"> Here are some places in {state} to visit</p>
            <div className={Styles.container}>
                  {arr}
            </div>
         </div>
      )
}
 
 export default Yelp