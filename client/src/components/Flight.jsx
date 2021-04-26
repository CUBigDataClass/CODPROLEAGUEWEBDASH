import React, { Fragment } from 'react'
import Styles from '../styles/Flight.module.css'
import Airlines from '../resources/airlines.json'

const Flight = (props) => {
    if (props.quotes.hasOwnProperty('message')) {
        return ( <p>{ props.message }</p>)
    } else {
        const quotes_sorted = props.quotes.sort((a,b) => (a.Month > b.Month) ? 1 : -1);
        let container = [];
    
        for (const quote of quotes_sorted) {
            let date = new Date(quote.DepartureDate).toLocaleDateString('en-US')
            const airline = Airlines.find(obj => {
                return obj.name.toLowerCase() === quote.Carrier.toLowerCase();
            });

            const img_src = typeof(airline) !== 'undefined' ? airline.logo : '';

            let component = (
                <Fragment>
                    <div className={Styles.container}>
                        <div className={Styles.innerContainer}>
                            <div className={Styles.imgContainer}>
                                <img className={Styles.cardImg} src={img_src} alt=''/>
                            </div>
                            <div className={Styles.infoContainer}>
                                <div className={Styles.topContainer}>
                                    <p>{quote.OriginCity}, {quote.OriginState}&nbsp;&nbsp;&nbsp;<sub>to</sub>&nbsp;&nbsp;&nbsp;{quote.DestinationCity}, {quote.DestinationState}</p>
                                    <p>${quote.MinPrice}</p>
                                </div>
                                <div className={Styles.bottomContainer}>
                                    <p>{quote.Carrier}</p>
                                    <p>{date}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br/>
                </Fragment>
            )
            container.push(component)
        }

        return (
            <div className={Styles.container}>
                <div className={Styles.headerContainer}>
                    <div>
                        <h4 style={{margin: '0'}}>Cheapest flight</h4>
                    </div>
                    <div>
                        <sub>Cheapest direct flight one-way, stops may be included</sub>
                    </div>
                </div>
                {container}
            </div>
        )
    }
}

export default Flight
