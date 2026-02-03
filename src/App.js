import React, { useState } from "react";
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

const CountdownDisplay = ({ countdown }) => {
  if (!countdown || typeof countdown !== 'string') return null;
  const parts = countdown.trim().split(':');
  const minutes = parts[0] ?? '0';
  const seconds = (parts[1] ?? '00').padStart(2, '0');
  return (
    <h3
      className="text-[#FFB703] font-bold mt-8 font-mono"
      style={{ fontSize: "clamp(3rem, 8vw, 10rem)" }}>
      {minutes}:{seconds}
    </h3>
  );
};

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
    countDownAdzan,
    isNotificationActive,
    getCountdownDisplay,
    getAdzanCountdownDisplay,
  } = usePrayerNotifications(minutesSince, prayerSchedule);

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
    if (countDownAdzan) return "-- adzan --";
    if (soundAdzan) return "-- adzan --";
    if (notifSholat) return "-- Sholat --";
    if (countDownIqomah) return "-- Iqomah --";
    if (soundIqomah) return "-- Iqomah --";
    return "";
  };

  if (soundAdzan || countDownAdzan) {
    const adzanCountdown = getAdzanCountdownDisplay();
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 bg-black z-20" style={{ opacity: 0.85 }} />
        <img
          src={bgMasjid}
          alt="Masjid Background"
          className="fixed top-0 left-0 w-full h-full object-cover -z-10"
          style={{ opacity: 0.3 }}
        />
        <div className="min-h-screen relative z-30 flex items-center justify-center">
          <div className="text-center">
            <h1
              className="text-white font-bold mb-8"
              style={{ fontSize: "clamp(3rem, 8vw, 10rem)" }}>
              -- adzan --
            </h1>
            {adzanCountdown && (
              <CountdownDisplay countdown={adzanCountdown} />
            )}
          </div>
        </div>
      </div>
    );
  }

  if (countDownIqomah) {
    const iqomahCountdown = getCountdownDisplay();
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 bg-black z-20" style={{ opacity: 0.85 }} />
        <img
          src={bgMasjid}
          alt="Masjid Background"
          className="fixed top-0 left-0 w-full h-full object-cover -z-10"
          style={{ opacity: 0.3 }}
        />
        <div className="min-h-screen relative z-30 flex items-center justify-center">
          <div className="text-center">
            <h1
              className="text-white font-bold mb-8"
              style={{ fontSize: "clamp(3rem, 8vw, 10rem)" }}>
              -- Iqomah --
            </h1>
            {iqomahCountdown && (
              <CountdownDisplay countdown={iqomahCountdown} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <img
        src={bgMasjid}
        alt="Masjid Background"
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
      />
      <div className="min-h-screen relative z-10 flex flex-col justify-between">
        <div>
          <Header
            hijriDate={hijriDate}
            currentTime={<Clock onTick={handleClockTick} />}
          />
        </div>
        <div
          className="flex-1 flex flex-row justify-center items-center px-[2vw]"
          style={{ paddingBottom: "25vh" }}>
          <HadithDisplay
            hadith={hadith}
            isNotificationActive={!!getNotificationText()}
            notificationText={getNotificationText()}
          />
        </div>
        <div>
          <PrayerTimes
            prayerSchedule={prayerSchedule}
            nextPrayer={nextPrayer}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
