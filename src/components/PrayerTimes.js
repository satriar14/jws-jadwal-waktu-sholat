import React from 'react';
import { motion } from 'framer-motion';
import { PRAYER_ORDER, PRAYER_NAMES, MASJID_INFO } from '../constants';
import logoFPS from '../assets/Logo New FPS v1 2.png';

const PrayerTimeCard = ({ name, time, index }) => {
  return (
    <motion.div
      className="bg-[#006783] rounded-xl w-full text-center"
      style={{
        padding: '1.5vh 1.5vw',
        minWidth: '120px'
      }}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      whileHover={{
        scale: 1.05,
        y: -5,
        transition: { duration: 0.2 },
      }}
    >
      <h3 className="font-semibold text-white mb-[0.5vh]" style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1.8rem)' }}>
        {name}
      </h3>
      <motion.p
        className="font-bold text-white font-mono"
        style={{ fontSize: 'clamp(1.25rem, 2.5vw, 3rem)' }}
        key={time}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {time || '--:--'}
      </motion.p>
    </motion.div>
  );
};

const PrayerTimes = ({ prayerSchedule, nextPrayer }) => {
  const getNextPrayerText = () => {
    if (!nextPrayer) return '';
    return `-- ${nextPrayer.minutesUntil} Menit menjelang ${PRAYER_NAMES[nextPrayer.name]} --`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      className="fixed left-0 bottom-0 w-full bg-[rgba(30,30,30,0.90)] backdrop-blur-[10px]"
      style={{ padding: '2vh 2vw' }}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Next Prayer Banner */}
      {nextPrayer && (
        <motion.div
          className="flex flex-row justify-center items-center mb-[2vh] flex-wrap gap-[1vw]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="hidden sm:block">
            <motion.img
              src={logoFPS}
              alt="FPS Logo"
              style={{ width: '3vw', height: 'auto', minWidth: '40px', maxWidth: '60px' }}
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            />
          </div>
          <div className="w-full sm:w-auto text-center">
            <motion.h2
              className="font-bold text-[#FFB703] text-center"
              style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1.8rem)' }}
              animate={{
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {getNextPrayerText()}
            </motion.h2>
          </div>
          <div className="hidden sm:block">
            <motion.img
              src={logoFPS}
              alt="FPS Logo"
              style={{ width: '3vw', height: 'auto', minWidth: '40px', maxWidth: '60px' }}
              animate={{
                rotate: [0, -5, 5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            />
          </div>
        </motion.div>
      )}

      {/* Prayer Times Grid */}
      <motion.div
        className="flex flex-row justify-center md:justify-evenly items-center mb-[1vh]"
        style={{ gap: '1.5vw' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {PRAYER_ORDER.map((prayer, index) => (
          <div key={prayer} className="w-full">
            <PrayerTimeCard
              name={PRAYER_NAMES[prayer]}
              time={prayerSchedule?.[prayer]}
              index={index}
            />
          </div>
        ))}
      </motion.div>

      {/* Website Footer */}
      {/* <motion.p
        className="text-center text-white mt-[1vh]"
        style={{ fontSize: 'clamp(0.75rem, 0.9vw, 1rem)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        {MASJID_INFO.website}
      </motion.p> */}
    </motion.div>
  );
};

export default PrayerTimes;
