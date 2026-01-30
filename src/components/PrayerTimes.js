import React from 'react';
import { PRAYER_ORDER, PRAYER_NAMES } from '../constants';
import logoFPS from '../assets/Logo New FPS v1 2.png';

const PrayerTimeCard = ({ name, time }) => {
  return (
    <div
      className="bg-[#006783] rounded-xl w-full text-center"
      style={{ padding: '1.5vh 1.5vw', minWidth: '120px' }}>
      <h3 className="font-semibold text-white mb-[0.5vh]" style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1.8rem)' }}>
        {name}
      </h3>
      <p
        className="font-bold text-white font-mono"
        style={{ fontSize: 'clamp(1.25rem, 2.5vw, 3rem)' }}>
        {time || '--:--'}
      </p>
    </div>
  );
};

const PrayerTimes = ({ prayerSchedule, nextPrayer }) => {
  const getNextPrayerText = () => {
    if (!nextPrayer || nextPrayer.minutesUntil == null) return '';
    const name = PRAYER_NAMES[nextPrayer.name] ?? nextPrayer.name ?? '';
    return name ? `-- ${nextPrayer.minutesUntil} Menit menjelang ${name} --` : '';
  };

  return (
    <div
      className="fixed left-0 bottom-0 w-full bg-[rgba(30,30,30,0.90)] backdrop-blur-[10px]"
      style={{ padding: '2vh 2vw' }}>
      {nextPrayer && (
        <div className="flex flex-row justify-center items-center mb-[2vh] flex-wrap gap-[1vw]">
          <div className="hidden sm:block">
            <img
              src={logoFPS}
              alt="FPS Logo"
              style={{ width: '3vw', height: 'auto', minWidth: '40px', maxWidth: '60px' }}
            />
          </div>
          <div className="w-full sm:w-auto text-center">
            <h2
              className="font-bold text-[#FFB703] text-center"
              style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1.8rem)' }}>
              {getNextPrayerText()}
            </h2>
          </div>
          <div className="hidden sm:block">
            <img
              src={logoFPS}
              alt="FPS Logo"
              style={{ width: '3vw', height: 'auto', minWidth: '40px', maxWidth: '60px' }}
            />
          </div>
        </div>
      )}

      <div
        className="flex flex-row justify-center md:justify-evenly items-center mb-[1vh]"
        style={{ gap: '1.5vw' }}>
        {PRAYER_ORDER.map((prayer) => (
          <div key={prayer} className="w-full">
            <PrayerTimeCard
              name={PRAYER_NAMES[prayer]}
              time={prayerSchedule?.[prayer]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrayerTimes;
