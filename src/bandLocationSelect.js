import React, { Component } from 'react';
import Select from  'react-select';

const LOCATIONS = require('./data/locations');

class BandLocationSelect extends Component{
  constructor(props){
    super(props);
    this.state = {
      selectLocation: 'US',
      selectLabel: 'State',
    };
    this.handleLocation = this.handleLocation.bind(this);
  }

  handleLocation(val) {
    console.log("Selected: " + JSON.stringify(val));
    if (val.value === 'INTL'){
      this.setState({
        selectLabel: "Country",
        selectLocation: "INTL",
        state: null
      });
    }else if (val.value === 'USA'){
      this.setState({
        selectLabel: "State",
        selectLocation: "US",
        state: null
      });
    }else{
      this.props.onLocationChange(val.value);
    }
  }


  render(){
    return(
      <Select 
        name="location"
        placeholder={this.state.selectLabel}
        value={this.props.value}
        options={LOCATIONS[this.state.selectLocation]}
        onChange={this.handleLocation} 
        className="select-sm"
        clearable={false}
      />
    );
  }
}

export default BandLocationSelect;
