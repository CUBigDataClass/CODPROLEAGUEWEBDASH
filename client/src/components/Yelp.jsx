import React, { Fragment } from 'react'
import StarRatings from 'react-star-ratings'
import Styles from '../styles/YelpPlaces.module.css'

const Yelp = (props) => {
   
   if (props.places.hasOwnProperty('message')) {
      return ( <p>{ props.message }</p>)
   } else {
      let arr = []
      let state = props.places[0].location.state
      let upper = 5;

      for (const place of props.places){
         let add2 = place.location.address2 ? '' : ', ' + place.location.address2 ;
         let component = (
            <Fragment>
               <div className={Styles.container}>
                  <div className={Styles.innerContainer}>
                     <div className={Styles.imgContainer}>
                        <img className={Styles.cardImg} src={place.image_url} alt=''></img>
                     </div>
                     <a href={place.url} target="_blank" rel="noreferrer" style={{margin: '10px 0px 5px 0px', fontWeight: 'bold',color: 'black' }}>{place.name} </a>
                     <StarRatings
                        rating={place.rating}
                        starRatedColor="tomato"
                        starDimension="25px"
                        starSpacing="0"
                        numberOfStars={5}
                        name='rating'
                     />
                     <h4 style={{margin: '0px 0px 5px 0px'}}>{place.price}</h4>
                     <div className={Styles.infoContainer}>
                        <sub>{place.location.address1}{add2}</sub>
                        <sub>{place.location.city}, {place.location.state}</sub>
                        <sub>{place.phone}</sub>
                     </div>
                  </div>
               </div>
            </Fragment>
         )
         arr.push(component)
         upper -= 1;

         if (!upper) break;
      }

      return (
         <div className={Styles.yelpContainer}>
            <h2 className={Styles.places}>Places in {state} to visit</h2>
            <div className={Styles.outerContainer}>
                  {arr}
            </div>
         </div>
      )
   }
}
 
 export default Yelp
