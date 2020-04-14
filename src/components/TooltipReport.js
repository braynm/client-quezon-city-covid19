import React from 'react';
import dayjs from 'dayjs';

function TooltipReport(props) {
  return (
    <div style={{ width: '200px' }}>
      {props.date && <p>As of: {dayjs(props.date).format('YYYY-MM-DD')}</p>}
      <ul>
        <li>Active cases: {props.active}</li>
        <li>Deaths: {props.death}</li>
        <li>Recoveries: {props.recovery}</li>
      </ul>
    </div>
  )
}


export default TooltipReport;
