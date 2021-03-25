import React, { Component } from 'react'
import Select from 'react-select'
import searchStyles from '../styles/Search.module.css'

import states from '../resources/states'

function cleanOptions() {
    let options = [];
    for (const state of states) {
        for (const city of state.cities) {
            state['selected'] = city;
            let option = { value: state, label: city + ', ' + state.name }
            options.push(option);
        }
    }
    return options;
}

class Search extends Component {
    constructor (props) {
        super(props)

        this.state = {
            inputValue: '',
            options: cleanOptions(),
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        // this.loadOptions = this.loadOptions.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    // loadOptions = async (inputValue) => {
    //     // perform a request
    //     const opts = await fetch(`http://localhost:5000/api/search?loc=${encodeURIComponent(inputValue)}`)
    //                             .then(res => res.json())
    //                             .catch(err => console.log("err: " + err));
        
    //     this.setState({ options: opts });
    // }

    handleInputChange = (inputValue) => {
        this.setState({ inputValue });
        // this.loadOptions(inputValue);
    };

    handleChange = (selectedOption) => { 
        this.props.update(selectedOption, this.props.place); 
    }

    render() {
        const { inputValue, options } = this.state;
        const customStyles = {
            option: (_, state) => ({
                color: state.isSelected ? 'white' : 'purple',
                backgroundColor: state.isSelected ? 'purple' : 'white'
            })
        }

        return (
            <div className={searchStyles.mainContainer}>
                <Select 
                    cacheOptions
                    options={options}
                    styles={customStyles}
                    placeholder={'Search ' + this.props.place}
                    inputValue={inputValue}
                    onInputChange={this.handleInputChange}
                    onChange={this.handleChange}
                />
            </div>
        )
    }
}

export default Search
