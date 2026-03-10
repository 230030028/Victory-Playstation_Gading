const HARGA_PS = { "PS3": 5000, "PS4": 8000, "PS5": 15000 };

// Cek status login saat halaman dimuat
window.onload = () => {
    if (sessionStorage.getItem("isLogged") === "true") {
        document.getElementById('loginOverlay').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
        tampilkanData();
    }
};

function login() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    if (user === "admin" && pass === "123") {
        sessionStorage.setItem("isLogged", "true");
        location.reload(); // Refresh untuk masuk ke dashboard
    } else {
        alert("Username atau Password salah!");
    }
}

function logout() {
    sessionStorage.removeItem("isLogged");
    location.reload();
}

function tambahBooking() {
    const nama = document.getElementById('nama').value;
    const jenisPS = document.getElementById('jenisPS').value;
    const durasi = document.getElementById('durasi').value;
    const metode = document.getElementById('metodeBayar').value;

    if (!nama || !durasi || durasi < 1) {
        alert("Data tidak valid!");
        return;
    }

    const total = HARGA_PS[jenisPS] * parseInt(durasi);
    const dataBaru = {
        id: Date.now(),
        nama,
        jenisPS,
        durasi,
        metode,
        total,
        tanggal: new Date().toLocaleString('id-ID')
    };

    let storage = JSON.parse(localStorage.getItem('victoryData')) || [];
    storage.push(dataBaru);
    localStorage.setItem('victoryData', JSON.stringify(storage));

    document.getElementById('nama').value = "";
    document.getElementById('durasi').value = "1";
    tampilkanData();
}

function tampilkanData() {
    const storage = JSON.parse(localStorage.getItem('victoryData')) || [];
    const tbody = document.getElementById('listBooking');
    const statAktif = document.getElementById('statAktif');
    const statPendapatan = document.getElementById('statPendapatan');

    tbody.innerHTML = "";
    let totalDuit = 0;

    if (storage.length === 0) {
        tbody.innerHTML = "<tr><td colspan='4' style='text-align:center; color:#999;'>Tidak ada unit aktif</td></tr>";
    } else {
        storage.forEach((item) => {
            totalDuit += item.total;
            tbody.innerHTML += `
                <tr>
                    <td><strong>${item.nama}</strong></td>
                    <td>${item.jenisPS} (${item.durasi}j)</td>
                    <td>Rp${item.total.toLocaleString('id-ID')}</td>
                    <td>
                        <button class="btn-download" onclick="unduhStruk(${item.id})">Struk</button>
                        <button class="btn-finish" onclick="hapusData(${item.id})">Hapus</button>
                    </td>
                </tr>
            `;
        });
    }

    statAktif.innerText = storage.length;
    statPendapatan.innerText = `Rp${totalDuit.toLocaleString('id-ID')}`;
}

function hapusData(id) {
    if (confirm("Yakin ingin menghapus data ini?")) {
        let storage = JSON.parse(localStorage.getItem('victoryData')) || [];
        const filtered = storage.filter(item => item.id !== id);
        localStorage.setItem('victoryData', JSON.stringify(filtered));
        tampilkanData(); // Refresh table & stats
    }
}

function unduhStruk(id) {
    const storage = JSON.parse(localStorage.getItem('victoryData')) || [];
    const data = storage.find(item => item.id === id);
    if (!data) return;

    const isiStruk = `
===============================
      VICTORY PLAYSTATION      
===============================
Tanggal  : ${data.tanggal}
Nama     : ${data.nama}
Console  : ${data.jenisPS}
Durasi   : ${data.durasi} Jam
Metode   : ${data.metode}
-------------------------------
TOTAL    : Rp${data.total.toLocaleString('id-ID')}
===============================
   Terima Kasih & Selamat Datang!
    `;

    const blob = new Blob([isiStruk], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Struk_${data.nama}.txt`;
    link.click();
}