import React, { useState } from "react";
import { motion } from "framer-motion";
import moment from "moment";
import "./App.css";

import bgMasjid from "./assets/bg1.jpg";
import Header from "./components/Header";
import Clock from "./components/Clock";
import HadithDisplay from "./components/HadithDisplay";
import PrayerTimes from "./components/PrayerTimes";

import { usePrayerTimes } from "./hooks/usePrayerTimes";
import { useHijriDate } from "./hooks/useHijriDate";
import { useHadith } from "./hooks/useHadith";
import { usePrayerNotifications } from "./hooks/usePrayerNotifications";
import { getCurrentAdzanPrayer } from "./utils/prayerTimeUtils";
import { PRAYER_NAMES } from "./constants";

function App() {
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [currentTime, setCurrentTime] = useState(moment().format("HH:mm:ss"));

  // Custom hooks
  const { prayerSchedule, minutesSince, nextPrayer } =
    usePrayerTimes(refreshFlag);
  const { hijriDate } = useHijriDate(refreshFlag);
  const { hadith } = useHadith();
  const {
    soundAdzan,
    soundIqomah,
    notifSholat,
    countDownIqomah,
    isNotificationActive,
    getCountdownDisplay,
  } = usePrayerNotifications(minutesSince);

  // Check if it's midnight to refresh data
  const checkFlag = () => {
    const isMidnight = moment().format("HH:mm:ss") === "00:00:00";
    if (isMidnight) {
      setRefreshFlag((prev) => !prev);
    }
  };

  // Handle clock tick
  const handleClockTick = () => {
    setCurrentTime(moment().format("HH:mm:ss"));
    checkFlag();
  };

  // Get notification text
  const getNotificationText = () => {
    if (soundAdzan) {
      const currentPrayer = getCurrentAdzanPrayer(minutesSince);
      const prayerName = currentPrayer ? PRAYER_NAMES[currentPrayer] : "";
      return prayerName ? `-- Adzan ${prayerName} --` : "-- Adzan --";
    }
    if (notifSholat) return "-- Sholat --";
    if (countDownIqomah) {
      const countdown = getCountdownDisplay();
      return countdown
        ? `-- ${countdown} menuju Iqomah --`
        : "-- Menuju Iqomah --";
    }
    if (soundIqomah) return "-- Iqomah --";
    return "";
  };

  // Special layout for adzan time
  if (soundAdzan) {
    const currentPrayer = getCurrentAdzanPrayer(minutesSince);
    const prayerName = currentPrayer ? PRAYER_NAMES[currentPrayer] : "";

    return (
      <motion.div
        className="min-h-screen relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}>
        {/* Dark overlay for adzan */}
        <motion.div
          className="fixed inset-0 bg-black z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ duration: 0.5 }}
        />

        {/* Background Image with reduced opacity */}
        <motion.img
          src={bgMasjid}
          alt="Masjid Background"
          className="fixed top-0 left-0 w-full h-full object-cover -z-10"
          style={{ opacity: 0.3 }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* Adzan Display - Full Screen Center */}
        <div className="min-h-screen relative z-30 flex items-center justify-center">
          <motion.div
            className="text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}>
            <motion.h1
              className="text-white font-bold mb-8"
              style={{ fontSize: "clamp(3rem, 8vw, 10rem)" }}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}>
              ADZAN
            </motion.h1>
            {prayerName && (
              <motion.h2
                className="text-[#FFB703] font-bold"
                style={{ fontSize: "clamp(2rem, 6vw, 7rem)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}>
                {prayerName.toUpperCase()}
              </motion.h2>
            )}
            <motion.div
              className="mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}>
              <div
                className="text-white font-mono font-bold"
                style={{ fontSize: "clamp(2rem, 5vw, 6rem)" }}>
                <Clock onTick={handleClockTick} />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}>
      {/* Background Image */}
      <motion.img
        src={bgMasjid}
        alt="Masjid Background"
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />

      {/* Main Content */}
      <div className="min-h-screen relative z-10 flex flex-col justify-between">
        {/* Header Section */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}>
          <Header
            hijriDate={hijriDate}
            currentTime={<Clock onTick={handleClockTick} />}
          />
        </motion.div>

        {/* Hadith/Notification Display Section */}
        <motion.div
          className="flex-1 flex flex-row justify-center items-center px-[2vw]"
          style={{ paddingBottom: "25vh" }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}>
          <HadithDisplay
            hadith={hadith}
            isNotificationActive={isNotificationActive && !soundAdzan}
            notificationText={getNotificationText()}
          />
        </motion.div>

        {/* Prayer Times Footer */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}>
          <PrayerTimes
            prayerSchedule={prayerSchedule}
            nextPrayer={nextPrayer}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default App;
