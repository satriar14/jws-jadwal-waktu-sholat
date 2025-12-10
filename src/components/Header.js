import React from "react";
import { motion } from "framer-motion";
import logoMasjid from "../assets/logo-almuhajirin.png";
import { MASJID_INFO } from "../constants";

const Header = ({ hijriDate, currentTime }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const timeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="w-full bg-[rgba(30,30,30,0.75)] backdrop-blur-[10px]"
      style={{ padding: '3vh 4vw' }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-[4vw]">
        {/* Left side - Masjid Info */}
        <motion.div className="w-full md:w-1/2" variants={itemVariants}>
          <div className="flex items-center gap-[2vw]">
            <motion.img
              src={logoMasjid}
              alt="Masjid Logo"
              className="flex-shrink-0"
              style={{ width: '8vw', height: 'auto', minWidth: '80px', maxWidth: '120px' }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <div>
              <h1 className="font-bold text-white" style={{ fontSize: 'clamp(1.2rem, 2vw, 2.5rem)', marginBottom: '0.5vh', lineHeight: '1.2' }}>
                {MASJID_INFO.name}
              </h1>
              <p className="text-white" style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1.2rem)', marginBottom: '0.3vh' }}>
                {MASJID_INFO.location}
              </p>
              <p className="text-white" style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1.2rem)' }}>
                {MASJID_INFO.city}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right side - Date and Time Box */}
        <motion.div className="w-full md:w-1/2 md:flex md:justify-end" variants={itemVariants}>
          <motion.div
            className="bg-[#006783] rounded-2xl flex flex-row justify-between items-center"
            style={{
              width: '100%',
              maxWidth: '50vw',
              padding: '2vh 2vw',
              gap: '2vw',
              minWidth: '350px'
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Left side - Date information */}
            {hijriDate && (
              <motion.div
                className="flex-1 min-w-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="font-bold text-white leading-tight" style={{ fontSize: 'clamp(1.2rem, 1.8vw, 2rem)', marginBottom: '1vh' }}>
                  {hijriDate.hari}
                </h2>
                <p className="text-white underline underline-offset-2 decoration-white mb-[0.5vh]" style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1.2rem)' }}>
                  {hijriDate.tanggal_masehi} {hijriDate.bulan_masehi}{" "}
                  {hijriDate.tahun_masehi}
                </p>
                <p className="text-white leading-relaxed" style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1.2rem)' }}>
                  {hijriDate.tanggal_hijriyah} {hijriDate.bulan_hijriyah}{" "}
                  {hijriDate.tahun_hijriyah}
                </p>
              </motion.div>
            )}

            {/* Right side - Time */}
            <motion.div
              className="flex-shrink-0"
              variants={timeVariants}
            >
              <motion.div
                className="font-bold text-white font-mono leading-none whitespace-nowrap"
                style={{ fontSize: 'clamp(2rem, 4.5vw, 5rem)' }}
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {currentTime}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Header;
