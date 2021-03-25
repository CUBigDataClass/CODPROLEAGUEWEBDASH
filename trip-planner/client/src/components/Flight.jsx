import React, { Fragment } from 'react'
import Styles from '../styles/Flight.module.css'

// {
//     "QuoteId": 3,
//     "MinPrice": 96,
//     "Direct": false,
//     "Carrier": "jetBlue",
//     "OriginCity": "New York",
//     "OriginState": "NY",
//     "DestinationCity": "Los Angeles",
//     "DestinationState": "CA"
// }
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const airlines = [
    {
        "id": "AS",
        "lcc": "0",
        "name": "Alaska Airlines",
        "logo": "https://images.kiwi.com/airlines/64/AS.png"
    },
    {
        "id": "B6",
        "lcc": "1",
        "name": "jetBlue",
        "logo": "https://images.kiwi.com/airlines/64/B6.png"
    },

]

const Flight = (props) => {
    if (props.quotes.hasOwnProperty('message')) {
        return ( <p>{ props.message }</p>)
    } else {
        const quotes_sorted = props.quotes.sort((a,b) => (a.Month > b.Month) ? 1 : -1);
        let container = [];
    
        for (const quote of quotes_sorted) {
            const img_src = airlines.find(obj => {
                return obj.name === quote.Carrier;
            }).logo;
            let component = (
                <Fragment>
                    <div>
                        <div className={Styles.innerContainer}>
                            <p>* ${quote.MinPrice}</p>
                            <p>* <img src={img_src}/> <sub>{quote.Carrier}</sub></p>
                            <p>* month: {months[parseInt(quote.Month)]}</p>
                            <p>* from: {quote.OriginCity}, {quote.OriginState}</p>
                            <p>* to: {quote.DestinationCity}, {quote.DestinationState}</p>
                        </div>
                    </div>
                    <br/>
                </Fragment>
            )
    
            container.push(component)
        }

        return (
            <div className={Styles.container}>
                {container}
            </div>
        )
    }
}

export default Flight
