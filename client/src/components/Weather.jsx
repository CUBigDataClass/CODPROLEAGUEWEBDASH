import React, { Fragment } from 'react'
import Styles from '../styles/Weather.module.css'

import cloud from '../images/Clouds.png'
import clear from '../images/Clear.png'
import rain from '../images/Rain.png'
import snow from '../images/Snow.png'

const weather_obj = {
    'Clouds': cloud,
    'Clear': clear,
    'Rain': rain,
    'Snow': snow
}

const Weather =  (props) => {
    let img_src = weather_obj[props.weath.short_desc];

    if (props.weath.hasOwnProperty('message')) {
        return ( <p>{ props.message }</p>)
    } else {
        let container = [];
        let component = (
            <Fragment>
                <div className={Styles.container}>
                    <div className={Styles.innerContainer}>
                        <div className={Styles.Container}>
                            <p>Temperature:&nbsp;{props.weath.temp}F</p>
                            <sub>Forecast:&nbsp;&nbsp;&nbsp;{props.weath.description}</sub>
                        </div>

                        <div className={Styles.infoContainer}>
                            <p>Sunset time: {props.weath.sunrise} AM</p>
                            <p>Sunrise time: {props.weath.sunset} PM</p>
                            <p>Minimum Temperature: {props.weath.temp_min}</p> 
                            <p> Max Temperature: {props.weath.temp_max}F</p> 
                            <p>Humidity: {props.weath.humidity}%</p>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    
        container.push(component)
        return (
            <div className={Styles.container}>
                <div className={Styles.outerContainer}>
                    <div>
                        <h4 style={{margin: '0'}}>&nbsp;&nbsp;Weather </h4>
                    </div>
                    <div>
                        &nbsp;&nbsp;{props.weath.city},&nbsp;{props.weath.state}
                        <div className={Styles.imgContainer}>
                            <p><img className={Styles.cardImg} src={img_src} alt=''/></p>
                        </div>
                    </div>
                </div>
                {container}
            </div>
        )
    }
}

export default Weather
