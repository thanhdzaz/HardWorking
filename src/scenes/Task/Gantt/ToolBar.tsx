/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Component } from 'react';

interface Props{
  onZoomChange: (_zoom: any)=>void
  zoom: string;
}

export default class Toolbar extends Component<Props>
{
  handleZoomChange = (e):void =>
  {
      if (this.props.onZoomChange)
      {
          this.props.onZoomChange(e.target.value);
      }
  };

  render():JSX.Element
  {
      const zoom = { 'Hours': 'Giờ', 'Days': 'Ngày', 'Months': 'Tháng' };
      const zoomRadios = Object.keys(zoom).map((value) =>
      {
          const isActive = this.props.zoom === value;
          return (
              <label
                  key={value}
                  style={{ marginLeft: 20 }}
                  className={`radio-label ${isActive ? 'radio-label-active' : ''}`}
              >
                  <input
                      type='radio'
                      checked={isActive}
                      value={value}
                      onChange={this.handleZoomChange}
                  />
          &nbsp; {zoom[value]}
              </label>
          );
      });

      return (
          <div className="tool-bar">
              <b>Zooming: </b>
              {zoomRadios}
          </div>
      );
  }
}
