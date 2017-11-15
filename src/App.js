import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';
import Location from  'react-select';
import './react-select.css';
import BandLocationSelect from './bandLocationSelect.js';
const LOCATIONS = require('../data/locations');

const DragHandle = SortableHandle(() => <div className="drag-handle"></div>);

const Header = ({number}) => {
  let title = null;
  if (number===0) {
    title = <h5> Headliner </h5>;
  }else{
    title = <h5>Band #{number+1}</h5>;
  }
  return(
      <div className="Header">{title}</div>
  );

};

const HiddenInput =  ({number, band}) => {
  
  return(
    <div>
      <input type="hidden" name={`show[bands_attribute][${number}][name]`} id={`show_bands_attributes_${number}_name`} value={band.name} />
      <input type="hidden" name={`show[bands_attribute][${number}][state]`} id={`show_bands_attributes_${number}_state`} value={band.state} />
      <input type="hidden" name={`show[bands_attribute][${number}][bandcamp]`} id={`show_bands_attributes_${number}_bandcamp`} value={band.bandcamp} />
      <input type="hidden" name={`show[bands_attribute][${number}][soundcloud]`} id={`show_bands_attributes_${number}_soundcloud`} value={band.soundcloud} />
    </div> 
  )
};

const Bandcamp = ({bandcamp}) => {
  if (bandcamp) {
    return <li><a target="_blank" href={`https://${bandcamp}.bandcamp.com`}>{`${bandcamp}.bandcamp.com`}</a></li>;
  }
  return <li></li>;
};


const Soundcloud = ({soundcloud}) => {
  if (soundcloud) {
    return <li><a target="_blank" href={`https://soundcloud.com/${soundcloud}`}>{`soundcloud.com/${truncate(soundcloud,30)}`}</a></li>;
  }
  return <li></li>;
};


const Band = SortableElement(({band, onRemove, value}) => {
  return (
      <div className="Band">
        <div><button className="Remove" onClick={() => onRemove(value)}>x</button></div>
        <DragHandle />
        <ul className="band-content">
          <li className="band-name">{band.name}</li>
          <li>{locationName(band.state)}</li>
          <Bandcamp bandcamp={band.bandcamp}/>
          <Soundcloud soundcloud={band.soundcloud}/>
        </ul>
      </div>
  );
});


const BandList = SortableContainer(({bands, onRemove}) => {
  const bandListNode =  bands.map((band, i) => {
    return ([<Header key={`header-${i}`} number={i} />, <Band index={i} key={`band-${i}`} value={i} band={band} onRemove={onRemove}/>, <HiddenInput key={`input-${i}`} number={i} band={band} />])
  });
  return (<div className="BandList">{bandListNode}</div>);
});

function validationClasses(error){
  var className = 'form-group';
  if (error){
    className = className.concat(" has-error");
  }
  return className;
}

function locationName(loc){
  console.log(LOCATIONS["US"].find(x => x.value === loc));
  if(loc.length > 2){
    return LOCATIONS["INTL"].find(x => x.value === loc).label;
  }else{
    return LOCATIONS["US"].find(x => x.value === loc).label;
  }
}

function truncate(str, max) {
    return str.length > max ? str.substr(0, max-1) + '…' : str;
}

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: '',
      state: '',
      bandcamp: '',
      soundcloud: '',
      data: [{name: 'Pile', state: 'NJ', bandcamp: 'pile', soundcloud: 'explodinginsoundrecords/pile-texas'}],
      errors: {name: false, state: false}
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleLocation = this.handleLocation.bind(this);
  }

  handleChange(event){
    const key = event.target.id;
    this.setState({
      [key]: event.target.value
    });
  }

   onSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
            data: arrayMove(this.state.data, oldIndex, newIndex),
    });
  };
  
  valid(){
    let errors = this.state.errors;
    let valid = true;
    for (const input in errors){
      if (this.state[input]){
        errors[input]=false;
        this.setState({errors: errors});
      }else{
        errors[input]=true;
        this.setState({errors: errors});
        valid = false;
      }
    }
    return valid;
  }

  handleSubmit(event){
    if (this.valid()) {
      let data = this.state.data;
      data.push({
        name: this.state.name,
        state: this.state.state,
        bandcamp: this.state.bandcamp, 
        soundcloud: this.state.soundcloud
      });
      this.setState({data: data});
      this.clearInput();
    }
    event.preventDefault();
  }

  clearInput(){
    this.setState({
      name: '',
      state: '',
      bandcamp: '',
      soundcloud: ''
    });
  }


  handleRemove(index){
    console.log("hi");
    const key = index;
    console.log(key);
    let data = this.state.data;
    data.splice(key,1);
    this.setState({data: data});
  }
 
  handleLocation(loc) {
      this.setState({state: loc});
  }

    render() {
    return (
      <div className="Bands">
          <div className={validationClasses(this.state.errors["name"])}>
            <label htmlFor="name" className="control sr-only sr-only"> Band Name:</label>
              <input type="text" className="form-control form-control-sm" placeholder="band name" id="name" value={this.state.name} onChange={this.handleChange} />
            </div>
          <div className={validationClasses(this.state.errors["state"])}>
            <label htmlFor="state" className="control sr-only">State:</label>
            <BandLocationSelect
              value={this.state.state}
              onLocationChange={this.handleLocation}
            />
          </div>
         <div className="form-group">
                <input type="text" className="form-control form-control-sm" placeholder="Bandcamp (optional)" id="bandcamp" value={this.state.bandcamp} onChange={this.handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="soundcloud" className="control sr-only"> Soundcloud:</label>
                <input type="text" className="form-control form-control-sm" placeholder="Soundcloud (optional)" id="soundcloud" value={this.state.soundcloud} onChange={this.handleChange} />
          </div>
          <div className="form-group">
            <input className="btn btn-secondary btn-sm" onClick={this.handleSubmit}  type="submit" value="Add" />
          </div>
          <BandList bands={this.state.data} onSortEnd={this.onSortEnd} onRemove={this.handleRemove} useDragHandle={true}/>
      </div>
    );
  }
}

export default App;
