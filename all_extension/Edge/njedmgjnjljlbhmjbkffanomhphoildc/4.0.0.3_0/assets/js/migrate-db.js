const getIndexedDb = (dbname, dbver) => new Promise((resolve, reject) => {
  const req = indexedDB.open(dbname, dbver);
  req.onsuccess = () => resolve(req.result);
  req.onerror = (evt) => reject(new Error(`Error opening indexedDB code ${evt.target.errorCode}`));
  req.onupgradeneeded = () => reject(new Error(`Database upgrade needed`));
});

const makeTransaction = (db, stores, func, mode = 'readwrite') => new Promise(async (resolve, reject) => {
  const tx = db.transaction(stores, mode);
  tx.oncomplete = () => resolve();
  tx.onerror = () => reject(tx.error);
  await func(tx);
});

const deleteKey = (os, key) => new Promise((resolve, reject) => {
  const req = os.delete(key);
  req.onsuccess = () => resolve();
  req.onerror = () => reject(req.error);
})

const migrateLocalDb = async () => {
  const db = await getIndexedDb('bittube', 2);

  const clear = {"facebook":["1135080553233309","Alan.D.Dennis","Beats4Change","aneukayahh","bablorru","dionysis.tsintzas","disparaitre.fantome.9","dravlic","francaisLS","groups","luisjavier.munozpolonio","nikita.ooofff.larsen","petwranglers","pg","play","rizkyaulya.info","roma.ilin.85"
,"shawn.allan2","soren.groth","technotip","todd.kalcik","user-712792907"],"soundcloud":["bakc26","blackfiredj","daddycosmic","deejaydarkstorm","delarak","juan-antonio-48","madbill4life","magasdi-laszlo","rizkyaulya","user-712792907"],"twitch":["coolcrisys","email-verification","nathansifuhd","saullg00dm4n","settings","xsgamingtv"],"twitter":["ArizonaEosio","Beats4Change","BitTubeTop1","DCAL_Gamevid4","IisBetoQ","IisBetoq","MaxEnne88","MovieVigilante","Ooo42425634","Prince_Ed","armijogarcia","ashishudeshi","coinobserve","coolcrisys","cryptowaleforce","infoPOLBAN","putra_crypto","rub241","seed_coin","technotip","xsgamingtv","yalla_lives","zcopley"],"youtube":["Gamevid4","MovieViewerMan","UC0Z6ZpaONmthzFPEEf_T0FQ","UC0xX6HiWblN_kTTUxPaeFmA","UC2JrVVT7JR8yOiGCbzqoPIA","UC2d_u45_E7J2TptwMzBxC7w","UC3qMnaI3bwsHgqyYmkBAidg","UC4G-l9yUs9H6mboYL4mHYCg","UC5f8LqRhjUc88Ct0PuNO7hw","UCA4ItHaKjTwLDGiM5FCvrxw","UCARY23dtwgzn2kPyqQzNJCQ","UCAiVZosgg0fMr0LKLOo8LCg","UCBia1prS9jwbNQAxCcxUgEg","UCBzSHZR37g0ftb59Wae3c3A","UCFHRqnmqhx9fDcWNZhF2RfA","UCFUKESqogHax2af9lmhICZQ","UCGUa_cFQzLJ7mlM2SKfNNfA","UCIfLcvC-u1iLwZmZvwh_8sA","UCIg8uBUcOo2uRIaIr85_O3Q","UCPjEFmkOCVP1xT5B4HlUKrw","UCSxKp5uns4r1B-A0oBfITLA","UCTVykp_6rZVzqk8DOgggqLg","UCTZkz170BGfzUIHzBoWh0AA","UCUrJZgW3f-_-ogluFznz2sA","UCVH6DUVDW4at_4f3HFcrPOQ","UC__G2Mea6zGyQ9sg1542iXA","UCcTgA_qFm7VWBW0-P5Kzb6g","UCcUqVhlwj7S2Qh2nNdaVRYw","UCf9iQKkAWDJ-Ii1G9GbJ1HQ","UCg-ETOJdbM-YshxMx2g3fgg","UCg-ETOJdbM-YshxMx2g3fgg ","UCg3bMbE6gbL1GaADuZaC8jw","UChDQj27cJyfH8wU6f3ixqDw","UCic3-ZWJRfVIW9jdkt34svg","UCl0sg218LutU-XbgOLLDbuw","UCldq_tDGCrgy_NoyYNk30Xw","UCmNLR-I769dCCICFg5bHw7A","UCrm3N6bvmnrERkyQD1Duy-g","UCtCWCMs0ZOWp1122zmF3Eww","UCwh2MF_s_E-ZqDswdANEaXg","UCxwHAsxnZ6G_aNb7PnjggJw","movievigilante","technotipdotorg","zcopley"]};

  await makeTransaction(db, db.objectStoreNames, (tx) => {
    const promises = [];
    Object.keys(clear).forEach(table => {
      const os = tx.objectStore(table);
      clear[table].forEach(key => promises.push(deleteKey(os, key)));
    });
    return Promise.all(promises);
  });
}