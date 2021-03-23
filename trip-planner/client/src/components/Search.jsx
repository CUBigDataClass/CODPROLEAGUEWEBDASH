import React, { Component } from 'react'
import AsyncSelect from 'react-select'
import '../styles/Search.css'

class Search extends Component {
    constructor () {
        super()

        this.state = {
            inputValue: '',
            options: []
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.loadOptions = this.loadOptions.bind(this);
    }

    loadOptions = async (inputValue) => {
        // perform a request
        const opts = await fetch(`http://localhost:5000/api/search?loc=${encodeURIComponent(inputValue)}`)
                                .then(res => res.json())
                                .catch(err => console.log("err: " + err));
        
        this.setState({ options: opts });
    }

    handleInputChange = (inputValue) => {
        this.setState({ inputValue });
        this.loadOptions(inputValue);
    };

    render() {
        const { inputValue, options } = this.state;
        const customStyles = {
            option: (_, state) => ({
                color: state.isSelected ? 'white' : 'black',
                backgroundColor: state.isSelected ? 'black' : 'white'
            })
        }
        return (
            <div>
                <AsyncSelect 
                    styles={customStyles}
                    cacheOptions
                    options={options}
                    // loadOptions={this.loadOptions}
                    placeholder={"Search Origin"}
                    // defaultOptions={defaultOptions}
                    inputValue={inputValue}
                    onInputChange={this.handleInputChange}
                />
                {/* <AsyncSelect 
                    styles={customStyles}
                    cacheOptions
                    options={options}
                    loadOptions={this.loadOptions}
                    placeholder={"Search Destination"}
                    defaultOptions={defaultOptions}
                    inputValue={inputValue}
                    onInputChange={this.handleInputChange}
                /> */}
            </div>
        )
    }
}

export default Search
