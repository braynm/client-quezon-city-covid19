import React from 'react';

function TooltipReport(props) {
  return (
    <div style={{ width: '200px' }}>
      <p>Sun, April 12 2020</p>
      <ul>
        <li>Active cases: {props.active}</li>
        <li>Deaths: {props.death}</li>
        <li>Recoveries: {props.recovery}</li>
      </ul>
    </div>
  )
}


export default TooltipReport;
