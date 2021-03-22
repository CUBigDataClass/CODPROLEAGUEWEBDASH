import React, { Component } from 'react'
import AsyncSelect from 'react-select'
import '../styles/Search.css'

class Search extends Component {
    constructor () {
        super()

        this.state = {
            inputValue: '',
            defaultOptions: [],
            options: []
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.loadOptions = this.loadOptions.bind(this);
    }

    componentDidMount() {
        const { inputValue } = this.state;
        this.loadDefaultOptions(inputValue);
    }

    loadOptions = async (inputValue) => {
        // perform a request
        const opts = await fetch(`http://localhost:5000/api/search?loc=${encodeURIComponent(inputValue)}`)
                                .then(res => res.json())
                                .catch(err => console.log("err: " + err));
        
        this.setState({ options: opts });
    }

    loadDefaultOptions = inputValue => {
        this.loadOptions(inputValue).then(defaultOptions =>
            this.setState({ defaultOptions })
        );
    };

    handleInputChange = (inputValue, { action }) => {
        console.log("action", action);
        if (action === "input-change") {
          this.setState({ inputValue });
          this.loadOptions(inputValue);
        }
        if (action === "menu-close") {
          this.loadDefaultOptions(this.state.inputValue);
        }
    };

    render() {
        const { inputValue, defaultOptions, options } = this.state;
        const customStyles = {
            option: (provided, state) => ({
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
                    loadOptions={this.loadOptions}
                    placeholder={"Search Origin"}
                    defaultOptions={defaultOptions}
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
