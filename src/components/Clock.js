import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import moment from 'moment';

const Clock = ({ onTick }) => {
  const [time, setTime] = useState(moment().format('HH:mm:ss'));

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = moment().format('HH:mm:ss');
      setTime(newTime);
      if (onTick) {
        onTick();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [onTick]);

  return (
    <motion.span
      key={time}
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {time}
    </motion.span>
  );
};

export default Clock;
