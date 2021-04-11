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
        this.handleChange = this.handleChange.bind(this);
    }

    handleInputChange = (inputValue) => {
        this.setState({ inputValue });
    };

    handleChange = (selectedOption) => { 
        this.props.updateSelection(selectedOption, this.props.place); 
    }

    render() {
        const { inputValue, options } = this.state;
        const customStyles = {
            option: (_, state) => ({
                color: 'black',
                backgroundColor: 'white'
            })
        }

        return (
            <div className={searchStyles.mainContainer}>
                <Select 
                    cacheOptions
                    options={options}
                    styles={customStyles}
                    placeholder={this.props.place}
                    inputValue={this.state.inputValue}
                    onInputChange={this.handleInputChange}
                    onChange={this.handleChange}
                />
            </div>
        )
    }
}

export default Search
