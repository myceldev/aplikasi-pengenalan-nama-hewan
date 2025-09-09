# aplikasi-pengenalan-nama-hewan

# Proyek Client/Server — React + Node.js + MongoDB

Dokumen ini menjelaskan cara menjalankan proyek secara lokal, stack teknologi yang digunakan, catatan perubahan terbaru, serta panduan troubleshooting. Seluruh instruksi ditulis dalam Bahasa Indonesia agar tim lebih mudah memahami.

---

## Ringkasan

* **Client**: React 18 + Vite + react-router-dom + react-quill
* **Server**: Node.js + Express + MongoDB (via Mongoose/driver sesuai implementasi)
* **Health Check**: `GET /api/health`

---

## Perubahan Terbaru (Changelog)

**client/src/main.jsx**

* Perbaikan impor: gunakan `BrowserRouter` dari `react-router-dom`.

**client/package.json**

* Samakan versi React ke **18.x** agar kompatibel dengan `react-quill`.

**client/src/App.jsx**

* Tambahkan UI minimal agar dev server menampilkan konten.
* Hapus impor yang tidak terpakai agar lolos ESLint.

**server/configs/db.js**

* Gunakan `process.env.MONGODB_URI` secara langsung (hapus akhiran "/" yang tidak valid).

**server/server.js**

* Tambahkan route `GET /api/health`.
* Guard koneksi DB: hanya melakukan koneksi jika `MONGODB_URI` memiliki skema `mongodb` yang valid.

**README.md (root)**

* Tambahkan stack teknologi, contoh variabel environment, langkah instalasi & menjalankan, troubleshooting, dan referensi skrip.

---

## Arsitektur Singkat

```
root
├── client/              # Aplikasi frontend (React + Vite)
│   ├── src/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/              # Aplikasi backend (Express)
│   ├── configs/
│   │   └── db.js
│   ├── server.js
│   └── package.json
└── README.md            # Dokumen ini
```

---

## Prasyarat

* **Node.js** LTS (disarankan versi terbaru LTS)
* Akses ke **MongoDB** (contoh: MongoDB Atlas)
* **npm** (bundled dengan Node.js)

---

## Konfigurasi Environment

Buat file `server/.env` dengan isi:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@HOST/DBNAME?retryWrites=true&w=majority
PORT=3000
```

> Catatan: Pastikan kredensial benar. Jangan commit file `.env` ke repository.

---

## Cara Menjalankan Secara Lokal

### 1) Menjalankan Server

```bash
npm install --prefix server
npm run start --prefix server
```

Health check:

```
http://localhost:3000/api/health
```

### 2) Menjalankan Client

```bash
npm install --prefix client
npm run dev --prefix client
```

Buka di browser:

```
http://localhost:5173
```

---

## Skrip NPM yang Berguna

**Server** (di `server/package.json`):

* `npm run start` — Menjalankan server dalam mode produksi/dev sesuai konfigurasi.

**Client** (di `client/package.json`):

* `npm run dev` — Menjalankan Vite dev server.
* (Tambahkan skrip lain jika diperlukan: `build`, `lint`, dsb.)

---

## Endpoint

* **GET** `/api/health` — Mengembalikan status health server.

---

## Testing / Smoke Test

* Server tetap dapat melakukan boot **tanpa DB** jika `MONGODB_URI` kosong/tidak valid (akan log peringatan).
* Jika `MONGODB_URI` valid, server akan log: `MongoDB connected.`
* Client dev server memuat dan menampilkan UI minimal.
* ESLint untuk `App.jsx` lulus (karena impor tidak terpakai dihapus).
* Vite dev server berjalan sukses.

---

## Troubleshooting

1. **Tidak bisa konek ke MongoDB**

   * Cek format `MONGODB_URI` (pastikan skema `mongodb`/`mongodb+srv` dan tidak ada trailing slash yang tidak perlu).
   * Pastikan IP whitelist di MongoDB Atlas (jika memakai Atlas).
   * Pastikan variabel environment terbaca (restart terminal jika perlu).

2. **Port bentrok**

   * Ubah `PORT` di `server/.env` atau hentikan proses yang memakai port tersebut.
   * Untuk Vite (client), port default `5173`; gunakan flag `--port` bila perlu.

3. **ESLint gagal**

   * Hapus impor yang tidak terpakai.
   * Jalankan format/lint sesuai konfigurasi proyek.

4. **react-quill tidak kompatibel**

   * Versi `react-quill` 2.0.0 kompatibel dengan React 18. Proyek ini **dipatok ke React ^18.3.1** untuk sementara.

---

## Catatan Kompatibilitas

* **Risiko**: Depedensi di masa depan mungkin memerlukan React 19.

  * **Mitigasi**: Saat ini React dipatok ke `^18.3.1` untuk kompatibilitas dengan `react-quill 2.0.0`. Pertimbangkan upgrade ke React 19 setelah kompatibilitas library terkait dipastikan.

* **Keamanan `.env`**:

  * Pastikan `client/.env` dan `server/.env` masuk dalam `.gitignore` dan tidak di-track git.


  Screenshot / Bukti ada di FOLDER DOCS \ PRE 1

Server: respon dari GET /api/health.

Client: landing page yang dirender dari client/src/App.jsx.


