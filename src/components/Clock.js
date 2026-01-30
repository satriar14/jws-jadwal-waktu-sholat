import React, { useState, useEffect } from 'react';
import moment from 'moment';

const Clock = ({ onTick }) => {
  const [time, setTime] = useState(moment().format('HH:mm:ss'));

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = moment().format('HH:mm:ss');
      setTime(newTime);
      if (onTick) onTick();
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <span>{time}</span>;
};

export default Clock;
