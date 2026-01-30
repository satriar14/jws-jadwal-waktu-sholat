import React from 'react';

const HadithDisplay = ({ hadith, isNotificationActive, notificationText }) => {
  if (isNotificationActive) {
    return (
      <div
        className="bg-[rgba(30,30,30,0.75)] backdrop-blur-[10px] rounded-2xl text-center"
        style={{ maxWidth: '50vw', padding: '3vh 3vw' }}>
        <h2
          className="font-bold text-[#FFB703]"
          style={{ fontSize: 'clamp(1.5rem, 2.5vw, 3rem)' }}>
          {notificationText}
        </h2>
      </div>
    );
  }

  if (!hadith) return null;

  const arabFontSize = '';
  const idFontSize = '';

  return (
    <div
      className="bg-[rgba(30,30,30,0.75)] backdrop-blur-[10px] rounded-2xl"
      style={{ maxWidth: '50vw', padding: '3vh 3vw' }}>
      {hadith.arab && (
        <p
          className="text-center font-bold text-[#FFB703] mb-[2vh] leading-relaxed arabic-text"
          dir="rtl"
          style={{ textAlign: 'center', fontSize: arabFontSize, fontFamily: 'Amiri, serif' }}>
          {hadith.arab}
        </p>
      )}
      {hadith.id && (
        <p
          className="text-center font-xs text-[#FFB703] mb-[2vh] leading-relaxed"
          style={{ fontSize: idFontSize }}>
          {hadith.id}
        </p>
      )}
      {hadith.name && hadith.number && (
        <p
          className="text-center font-normal text-[#FFB703] italic"
          style={{ fontSize: 'clamp(0.875rem, 1vw, 1.2rem)' }}>
          HR. {hadith.name} : {hadith.number}
        </p>
      )}
    </div>
  );
};

export default HadithDisplay;
