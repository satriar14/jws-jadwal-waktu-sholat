import React from "react";
import logoMasjid from "../assets/logo-almuhajirin.png";
import { MASJID_INFO } from "../constants";

const Header = ({ hijriDate, currentTime }) => {
  return (
    <div
      className="w-full bg-[rgba(30,30,30,0.75)] backdrop-blur-[10px]"
      style={{ padding: '3vh 4vw' }}>
      <div className="flex flex-col md:flex-row justify-between items-center gap-[4vw]">
        <div className="w-full md:w-1/2">
          <div className="flex items-center gap-[2vw]">
            <img
              src={logoMasjid}
              alt="Masjid Logo"
              className="flex-shrink-0"
              style={{ width: '8vw', height: 'auto', minWidth: '80px', maxWidth: '120px' }}
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
        </div>

        <div className="w-full md:w-1/2 md:flex md:justify-end">
          <div
            className="bg-[#006783] rounded-2xl flex flex-row justify-between items-center"
            style={{
              width: '100%',
              maxWidth: '50vw',
              padding: '2vh 2vw',
              gap: '2vw',
              minWidth: '350px'
            }}>
            {hijriDate && (
              <div className="flex-1 min-w-0">
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
              </div>
            )}

            <div className="flex-shrink-0">
              <div
                className="font-bold text-white font-mono leading-none whitespace-nowrap"
                style={{ fontSize: 'clamp(2rem, 4.5vw, 5rem)' }}>
                {currentTime}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
