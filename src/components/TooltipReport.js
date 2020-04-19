import React from 'react';
import dayjs from 'dayjs';

function TooltipReport(props) {
  return (
    <div style={{ width: '200px' }}>
      {props.date && <p>As of: {dayjs(props.date).format('YYYY-MM-DD')}</p>}
      <ul>
        <li><span className="emoji" role='img' aria-label='sick'>😷</span> Active cases: {props.active}</li>
        <li><span className="emoji" role='img' aria-label='death'>☠️</span> Deaths: {props.death}</li>
        <li><span className="emoji" role='img' aria-label='death'>💓</span> Recoveries: {props.recovery}</li>
      </ul>
    </div>
  )
}


export default TooltipReport;
