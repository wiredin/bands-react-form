import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const Header = ({number}) => {
  console.log(number==0)
  let title = null;
  if (number==0) {
    title = <h4> Headliner </h4>;
  }else{
    title = <h4>Band #{number+1}</h4>;
  }
  return(
      <div className="Header">{title}</div>
  );

}

const Band = ({band}) => {
  return (
      <div className="Band">
        <ul>
          <li>{band.name}</li>
          <li>{band.state}</li>
          <li><a href="{band.bandcamp}">{band.bandcamp}</a></li>
          <li>{band.soundcloud}</li>
        </ul>
      </div>
  );
}

const BandList = ({bands}) => {
  const bandListNode =  bands.map((band, i) => {
    return (<div><Header number={i} /> <Band band={band} /></div>)
  });
  return (<div className="BandList">{bandListNode}</div>);
}

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: '',
      state: '',
      bandcamp: '',
      soundcloud: '',
      data: [{name: 'name', state: 'state'},{name: 'name2', state: 'state2'}]
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event){
    const key = event.target.id;
    this.setState({
      [key]: event.target.value
    });
  }
  handleSubmit(event){
    console.log(this.state.name);
    let data = this.state.data;
    data.push({
      name: this.state.name,
      state: this.state.state,
      bandcamp: this.state.bandcamp + ".bandcamp.com",
      soundcloud: this.state.soundcloud
    });
    this.setState({data: data});
    event.preventDefault();
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
            <label htmlFor="state" className="control sr-only">
              State:
            </label>
              <input type="text" className="form-control" placeholder="state" id="state" value={this.state.state} onChange={this.handleChange} />
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
            <input className="btn btn-default" type="submit" value="Submit" />
          </div>
        </form>  
          <BandList bands={this.state.data} />
      </div>
    );
  }
}

export default App;