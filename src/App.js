import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import Location from  'react-select';
import 'react-select/dist/react-select.css';

const LOCATIONS = require('../data/locations');


const Header = ({number}) => {
  let title = null;
  if (number===0) {
    title = <h4> Headliner </h4>;
  }else{
    title = <h4>Band #{number+1}</h4>;
  }
  return(
      <div className="Header">{title}</div>
  );

}

const Bandcamp = ({bandcamp}) => {
  if (bandcamp) {
    return <li><a href={`https://${bandcamp}.bandcamp.com`}>{`${bandcamp}.bandcamp.com`}</a></li>;
  }
  return <li></li>;
};


const Soundcloud = ({soundcloud}) => {
  if (soundcloud) {
    return <li><a href={`https://soundcloud.com/${soundcloud}`}>{`soundcloud.com/${soundcloud}`}</a></li>;
  }
  return <li></li>;
};


const Band = SortableElement(({band, onRemove, value}) => {
  return (
      <div className="Band">
        <div><button className="Remove" onClick={() => onRemove(value)}>x</button></div>
        <ul>
          <li>{band.name}</li>
          <li>{band.state}</li>
          <Bandcamp bandcamp={band.bandcamp}/>
          <Soundcloud soundcloud={band.soundcloud}/>
        </ul>
      </div>
  );
});

const BandList = SortableContainer(({bands, onRemove}) => {
  const bandListNode =  bands.map((band, i) => {
    return ([<Header key={`header-${i}`} number={i} />, <Band index={i} key={`band-${i}`} value={i} band={band} onRemove={onRemove}/>])
  });
  return (<div className="BandList">{bandListNode}</div>);
});




class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: '',
      state: '',
      bandcamp: '',
      soundcloud: '',
      selectLocation: 'US',
      selectLabel: 'State',
      data: [{name: 'name', state: 'state'},{name: 'name2', state: 'state2'  }]
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
  handleSubmit(event){
    let data = this.state.data;
    data.push({
      name: this.state.name,
      state: this.state.state,
      bandcamp: this.state.bandcamp, 
      soundcloud: this.state.soundcloud
    });
    this.setState({data: data});
    event.preventDefault();
  }
  handleRemove(index){
    console.log("hi");
    const key = index;
    console.log(key);
    let data = this.state.data;
    data.splice(key,1);
    this.setState({data: data});
  }
 
  handleLocation(val) {
    console.log("Selected: " + JSON.stringify(val));
    if (val.value == 'INTL'){
      this.setState({
        selectLabel: "Country",
        selectLocation: "INTL"
      });
    }else if (val.value == 'US'){
      this.setState({
        selectLabel: "State",
        selectLocation: "US"
      });
    }else{
      this.setState({state: val.value});
    }
  }


  render() {
    return (
      <div className="Bands">
        <form onSubmit={this.handleSubmit} className="form-horizontal">
          <div className="form-group">
            <label htmlFor="name" className="control sr-only sr-only"> Band Name:</label>
              <input type="text" className="form-control" placeholder="band name" id="name" value={this.state.name} onChange={this.handleChange} />
            </div>
          <div className="form-group">
            <label htmlFor="state" className="control sr-only">State:</label>
            <Location 
              name="location"
              placeholder={this.state.selectLabel}
              value={this.state.state}
              options={LOCATIONS[this.state.selectLocation]}
              onChange={this.handleLocation} 
            />
          </div>
         <div className="form-group">
            <label htmlFor="bandcamp" className="control sr-only">Bandcamp:</label>
              <div className="input-group">
                <input type="text" className="form-control" placeholder="blackblahblah" id="bandcamp" value={this.state.bandcamp} onChange={this.handleChange} />
                <div className="input-group-addon">.bandcamp.com</div>
              </div>
          </div>
          <div className="form-group">
            <label htmlFor="soundcloud" className="control sr-only"> Soundcloud:</label>
              <div className="input-group">
                <div className="input-group-addon">soundcloud.com/</div>
                <input type="text" className="form-control" placeholder="blahblahblah" id="soundcloud" value={this.state.soundcloud} onChange={this.handleChange} />
              </div> 
          </div>
          <div className="form-group">
            <input className="btn btn-default" type="submit" value="Add" />
          </div>
        </form>  
          <BandList bands={this.state.data} onSortEnd={this.onSortEnd} onRemove={this.handleRemove} />
      </div>
    );
  }
}

export default App;
