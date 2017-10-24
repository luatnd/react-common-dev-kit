import React from 'react';

require("./BsFooter.module.scss");


export default class BsFooter extends React.Component {
  render() {
    return (
      <footer className="black-bg" id="contact" style={{marginTop: '20px'}}>
        <div className="container">
          <div className="space-40"></div>
          
          
          <div className="space-20"></div>
        </div>
      </footer>
    )
  }
}