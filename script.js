// GANTI DENGAN URL WEB APP ANDA
const SHEET_URL = "https://script.google.com/macros/s/AKfycbyck83UuqzriflSGq3swPuwy5i4x_z3A8YTXrqXok05WPv8uhnNGLgVtg9VcQ3YlX3l/exec";

const initIcons = () => lucide.createIcons();

async function loadData() {
    const container = document.getElementById('app-container');
    const loader = document.getElementById('loader');
    
    try {
        const res = await fetch(`${SHEET_URL}?t=${new Date().getTime()}`);
        const data = await res.json();
        
        loader.classList.add('hidden');
        container.innerHTML = "";

        if (!data || data.length === 0) {
            container.innerHTML = "<p class='col-span-full text-center py-10'>Belum ada riwayat servis.</p>";
            return;
        }

        data.reverse().forEach((item) => {
            const biaya = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.Biaya || 0);
            
            const card = `
                <div class="card-service shadow-sm">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="font-extrabold text-lg uppercase tracking-tight">${item['Nama Pelanggan']}</h3>
                            <span class="text-blue-600 font-bold text-sm">${item['Jenis Motor']}</span>
                        </div>
                        <span class="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-bold">${item.Tanggal || '-'}</span>
                    </div>
                    <div class="space-y-2 mb-6">
                        <div class="flex gap-2 text-sm">
                            <i data-lucide="alert-circle" class="w-4 h-4 text-orange-500"></i>
                            <p><b>Keluhan:</b> ${item.Keluhan}</p>
                        </div>
                        <div class="flex gap-2 text-sm">
                            <i data-lucide="check-circle" class="w-4 h-4 text-green-500"></i>
                            <p><b>Tindakan:</b> ${item.Tindakan}</p>
                        </div>
                    </div>
                    <div class="pt-4 border-t border-dashed flex justify-between items-center">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Biaya</span>
                        <span class="text-2xl font-black text-blue-700">${biaya}</span>
                    </div>
                </div>
            `;
            container.innerHTML += card;
        });
        initIcons();
    } catch (e) {
        loader.innerHTML = "Gagal memuat data.";
    }
}

document.getElementById('service-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-simpan');
    btn.disabled = true;
    btn.innerHTML = "Menyimpan...";

    const payload = {
        nama: document.getElementById('nama').value,
        motor: document.getElementById('motor').value,
        keluhan: document.getElementById('keluhan').value,
        tindakan: document.getElementById('tindakan').value,
        biaya: document.getElementById('biaya').value,
        tanggal: new Date().toLocaleDateString('id-ID')
    };

    try {
        await fetch(SHEET_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) });
        alert("✅ Berhasil disimpan!");
        document.getElementById('service-form').reset();
        setTimeout(loadData, 1500);
    } catch (err) {
        alert("Gagal menyimpan.");
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i data-lucide="save"></i> Simpan Data';
        initIcons();
    }
});

window.onload = () => { loadData(); initIcons(); };
