import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HadithDisplay = ({ hadith, isNotificationActive, notificationText }) => {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
  };

  if (isNotificationActive) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="notification"
          className="bg-[rgba(30,30,30,0.75)] backdrop-blur-[10px] rounded-2xl text-center"
          style={{
            maxWidth: '50vw',
            padding: '3vh 3vw'
          }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.h2
            className="font-bold text-[#FFB703]"
            style={{ fontSize: 'clamp(1.5rem, 2.5vw, 3rem)' }}
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {notificationText}
          </motion.h2>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (!hadith) {
    return null;
  }

  const arabTextLength = hadith.arab?.length || 0;
  const idTextLength = hadith.id?.length || 0;

  const arabFontSize = '';
  const idFontSize = '';

  // const arabFontSize = arabTextLength > 1500 ? 'clamp(0.875rem, 1vw, 1.2rem)' : 'clamp(1rem, 1.3vw, 1.5rem)';
  // const idFontSize = idTextLength > 1500 ? 'clamp(0.875rem, 1vw, 1.2rem)' : 'clamp(1rem, 1.3vw, 1.5rem)';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="hadith"
        className="bg-[rgba(30,30,30,0.75)] backdrop-blur-[10px] rounded-2xl"
        style={{
          maxWidth: '50vw',
          padding: '3vh 3vw'
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {hadith.arab && (
          <motion.p
            className="text-center font-bold text-[#FFB703] mb-[2vh] leading-relaxed arabic-text"
            dir="rtl"
            style={{
              textAlign: 'center',
              fontSize: arabFontSize,
              fontFamily: 'Amiri, serif'
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {hadith.arab}
          </motion.p>
        )}
        {hadith.id && (
          <motion.p
            className="text-center font-xs text-[#FFB703] mb-[2vh] leading-relaxed"
            style={{ fontSize: idFontSize }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {hadith.id}
          </motion.p>
        )}
        {hadith.name && hadith.number && (
          <motion.p
            className="text-center font-normal text-[#FFB703] italic"
            style={{ fontSize: 'clamp(0.875rem, 1vw, 1.2rem)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            HR. {hadith.name} : {hadith.number}
          </motion.p>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default HadithDisplay;
