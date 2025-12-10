import axios from "axios";

const ListJadwalSholat = async (currentDate) => {
  // let url = `https://api.banghasan.com/sholat/format/json/jadwal/kota/703/tanggal/${currentDate}`;
  let url = `https://api.myquran.com/v2/sholat/jadwal/1225/${currentDate}`;
  let res = await axios.get(url);
  return res.data.data.jadwal; // Mengambil objek jadwal dari struktur baru
};

const ConvertTanggalHijriyah = async (currentDate) => {
  const options = {
    method: "GET",
    url: `https://api.aladhan.com/v1/gToH/${currentDate}`,
  };

  let res = await axios.request(options);
  return res.data;
};

const randomSource = async () => {
  let url = `https://api.hadith.gading.dev/books/muslim?range=1-150`;
  let res = await axios.get(url);
  return res.data;
};

const randomHadits = async (slug, number) => {
  let url = `https://api.hadith.gading.dev/books/${slug}/${number}`;
  let res = await axios.get(url);
  return res.data;
};

export default {
  ListJadwalSholat,
  ConvertTanggalHijriyah,
  randomSource,
  randomHadits,
};
