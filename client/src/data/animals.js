// Central animal dataset: maps to local assets in src/assets
// Each entry: id, name, latin, foodType, habitat, population, status, unique, funFact, image, photo(optional), video(optional), sound(optional), location (lat,lng)

import imgMacanDahan from '../assets/image/macandahan.png'
import imgKelelawar from '../assets/image/kelelawar malam.png'
import imgHarimau from '../assets/image/harimausumatera.png'
import imgGajahSumatera from '../assets/image/gajahsumatera.png'
import imgBadakSumatera from '../assets/image/badaksumatera.png'
import imgBabirusa from '../assets/image/babirusa sulawesi.png'
import imgBadakJawa from '../assets/image/badakjawa.png'
import imgOrangutanTapanuli from '../assets/image/orangutantapanuli.png'
import imgLutungJawa from '../assets/image/lutungjawa.png'
import imgOrangutanKalimantan from '../assets/image/orangutankalimantan.png'
import imgKangguruPohon from '../assets/image/kanggurupohon.png'
import imgTarsius from '../assets/image/tarsius.png'

import vidMacanDahan from '../assets/video/Macandahan.mp4'
import vidKelelawar from '../assets/video/kelelawarraksasabuah.mp4'
import vidHarimau from '../assets/video/harimaupagi.mp4'
import vidGajahSumatera from '../assets/video/gajahsumatera.mp4'
import vidBadakSumatera from '../assets/video/badaksumatera.mp4'
import vidBabirusa from '../assets/video/babirusa.mp4'
import vidBadakJawa from '../assets/video/badakjawa.mp4'
import vidOrangutanTapanuli from '../assets/video/orangutantapanuli.mp4'
import vidLutungJawa from '../assets/video/lutungjawa.mp4'
import vidOrangutanKalimantan from '../assets/video/orangutan.mp4'
import vidKangguruPohon from '../assets/video/kanggurupohon.mp4'
import vidTarsius from '../assets/video/tarsiusspektral.mp4'

import introSound from '../assets/audio/Intro.m4a' // placeholder sounds per animal

export const animals = [
  {
    id: 'macan-dahan',
    name: 'Macan Dahan',
    latin: 'Neofelis diardi',
    foodType: 'Karnivora (kera, burung, mamalia kecil)',
    habitat: 'Hutan hujan tropis Sumatera dan Kalimantan',
    population: '≈ 3.000–7.000 (Sumatera); Borneo lebih banyak',
    status: 'Rentan (VU)',
    unique: 'Bintik seperti awan, taring sangat panjang, ekor panjang untuk keseimbangan, pemalu dan pemanjat ulung',
    funFact: 'Bisa turun dari pohon secara mundur; disebut clouded leopard karena pola bulu seperti awan',
    image: imgMacanDahan,
    photo: imgMacanDahan,
    video: vidMacanDahan,
    sound: introSound,
    location: { lat: -1.0, lng: 103.0 },
  },
  {
    id: 'kelelawar-buah-papua',
    name: 'Kelelawar Buah Raksasa Papua',
    latin: 'Pteropodidae (contoh: Pteropus vampyrus)',
    foodType: 'Buah & nektar',
    habitat: 'Hutan Papua, Sulawesi, Maluku',
    population: 'Tidak spesifik; relatif umum',
    status: 'Tidak Terancam (LC)',
    unique: 'Rentang sayap bisa >1 meter, penglihatan & penciuman tajam',
    funFact: 'Dapat terbang jauh untuk mencari makan, puluhan kilometer dalam semalam',
    image: imgKelelawar,
    photo: imgKelelawar,
    video: vidKelelawar,
    sound: introSound,
    location: { lat: -4.5, lng: 136.9 },
  },
  {
    id: 'harimau-sumatera',
    name: 'Harimau Sumatera',
    latin: 'Panthera tigris sondaica',
    foodType: 'Karnivora',
    habitat: 'Hutan hujan Sumatera',
    population: '≈ 400–500 ekor',
    status: 'Kritis (CR)',
    unique: 'Tubuh lebih kecil, belang rapat, cakar & otot kuat',
    funFact: 'Satu-satunya harimau yang tersisa di Indonesia',
    image: imgHarimau,
    photo: imgHarimau,
    video: vidHarimau,
    sound: introSound,
    location: { lat: -1.55, lng: 101.0 },
  },
  {
    id: 'gajah-sumatera',
    name: 'Gajah Sumatera',
    latin: 'Elephas maximus sumatranus',
    foodType: 'Herbivora',
    habitat: 'Hutan tropis Sumatera',
    population: '< 1.100 ekor',
    status: 'Kritis (CR)',
    unique: 'Belalai panjang, gading kecil, ukuran tubuh lebih kecil',
    funFact: 'Populasi menurun akibat hilangnya 70% hutan Sumatera',
    image: imgGajahSumatera,
    photo: imgGajahSumatera,
    video: vidGajahSumatera,
    sound: introSound,
    location: { lat: -3.8, lng: 102.3 },
  },
  {
    id: 'badak-sumatera',
    name: 'Badak Sumatera',
    latin: 'Dicerorhinus sumatrensis',
    foodType: 'Herbivora',
    habitat: 'Hutan lebat & pegunungan Sumatera/Kalimantan',
    population: '< 80 ekor',
    status: 'Kritis (CR)',
    unique: 'Badak terkecil di dunia, bercula dua, berbulu halus saat muda',
    funFact: 'Disebut "badak berambut" dan kerabat dekat badak purba',
    image: imgBadakSumatera,
    photo: imgBadakSumatera,
    video: vidBadakSumatera,
    sound: introSound,
    location: { lat: -2.3, lng: 101.6 },
  },
  {
    id: 'babirusa-sulawesi',
    name: 'Babirusa Sulawesi',
    latin: 'Babyrousa celebensis',
    foodType: 'Omnivora (buah, daun, akar, jamur)',
    habitat: 'Hutan hujan & rawa di Sulawesi',
    population: 'Beberapa ribu; menurun',
    status: 'Rentan (VU)',
    unique: 'Taring melengkung menembus moncong seperti tanduk',
    funFact: 'Taring jantan terus tumbuh dan bisa melukai diri',
    image: imgBabirusa,
    photo: imgBabirusa,
    video: vidBabirusa,
    sound: introSound,
    location: { lat: -1.4, lng: 121.4 },
  },
  {
    id: 'badak-jawa',
    name: 'Badak Jawa',
    latin: 'Rhinoceros sondaicus',
    foodType: 'Herbivora',
    habitat: 'Taman Nasional Ujung Kulon',
    population: '≈ 82 ekor',
    status: 'Kritis (CR)',
    unique: 'Bercula satu, kulit tebal berlipat seperti baju baja',
    funFact: 'Seluruh populasi dunia hanya ada di Indonesia',
    image: imgBadakJawa,
    photo: imgBadakJawa,
    video: vidBadakJawa,
    sound: introSound,
    location: { lat: -6.77, lng: 105.35 },
  },
  {
    id: 'orangutan-tapanuli',
    name: 'Orang Utan Tapanuli',
    latin: 'Pongo tapanuliensis',
    foodType: 'Omnivora (buah dominan)',
    habitat: 'Hutan Batang Toru, Sumatera Utara',
    population: '< 800 ekor',
    status: 'Kritis (CR)',
    unique: 'Rambut cokelat kemerahan, jantan dewasa berpipi lebar',
    funFact: 'Spesies orangutan yang baru dideskripsikan (2017)',
    image: imgOrangutanTapanuli,
    photo: imgOrangutanTapanuli,
    video: vidOrangutanTapanuli,
    sound: introSound,
    location: { lat: 1.8, lng: 98.9 },
  },
  {
    id: 'lutung-jawa',
    name: 'Lutung Jawa',
    latin: 'Trachypithecus auratus',
    foodType: 'Herbivora (daun, bunga, buah)',
    habitat: 'Hutan Jawa & Bali',
    population: 'Tidak pasti; menurun',
    status: 'Rentan (VU)',
    unique: 'Bulu hitam mengkilap; bayi berwarna oranye terang',
    funFact: 'Hidup berkelompok dengan pemimpin jantan',
    image: imgLutungJawa,
    photo: imgLutungJawa,
    video: vidLutungJawa,
    sound: introSound,
    location: { lat: -7.2, lng: 111.6 },
  },
  {
    id: 'orangutan-kalimantan',
    name: 'Orang Utan Kalimantan',
    latin: 'Pongo pygmaeus',
    foodType: 'Omnivora (buah, daun, madu, serangga)',
    habitat: 'Hutan hujan Kalimantan',
    population: '≈ 50.000–60.000; menurun',
    status: 'Kritis (CR)',
    unique: 'Jantan dewasa dengan pipi lebar (flensa), lengan sangat panjang',
    funFact: 'Sangat cerdas dan banyak beraktivitas di pepohonan',
    image: imgOrangutanKalimantan,
    photo: imgOrangutanKalimantan,
    video: vidOrangutanKalimantan,
    sound: introSound,
    location: { lat: 0.5, lng: 114.0 },
  },
  {
    id: 'kangguru-pohon-papua',
    name: 'Kanguru Pohon Papua',
    latin: 'Dendrolagus sp.',
    foodType: 'Herbivora (daun, pucuk, bunga, buah)',
    habitat: 'Hutan pegunungan Papua & PNG',
    population: 'Ratusan hingga sangat sedikit tergantung spesies',
    status: 'Terancam (EN)',
    unique: 'Kanguru yang hidup di pohon, berbulu lebat, ekor panjang',
    funFact: 'Satu-satunya kanguru arboreal di wilayah Papua',
    image: imgKangguruPohon,
    photo: imgKangguruPohon,
    video: vidKangguruPohon,
    sound: introSound,
    location: { lat: -4.3, lng: 144.7 },
  },
  {
    id: 'tarsius-spektral',
    name: 'Tarsius Spektral',
    latin: 'Tarsius tarsier',
    foodType: 'Karnivora (serangga, kadal kecil, burung kecil)',
    habitat: 'Hutan tropis Sulawesi',
    population: 'Tidak pasti; menurun',
    status: 'Rentan (VU)',
    unique: 'Mata sangat besar, tubuh mungil, lompatan sangat jauh',
    funFact: 'Kepala bisa berputar hampir 180°, aktif di malam hari',
    image: imgTarsius,
    photo: imgTarsius,
    video: vidTarsius,
    sound: introSound,
    location: { lat: -1.4, lng: 120.8 },
  },
]

export function getAnimalById(id) {
  return animals.find(a => a.id === id)
}
