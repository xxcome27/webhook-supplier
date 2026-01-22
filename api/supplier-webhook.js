export default async function handler(req, res) {
  // 1️⃣ Hanya terima POST
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  // 2️⃣ VALIDASI RESELLER (ANTI WEBHOOK PALSU)
  if (req.body.kodereseller !== "RS00547") {
    return res.status(403).json({
      success: false,
      message: "Invalid reseller"
    });
  }

  // 3️⃣ Ambil data dari supplier
  const {
    success,
    status,
    refid,
    supplier_trxid,
    kode_produk,
    nomor_tujuan,
    harga,
    message,
    note,
    updated_at
  } = req.body;

  // 4️⃣ Validasi minimal wajib
  if (!refid || !status) {
    return res.status(400).json({
      success: false,
      message: "Data wajib tidak lengkap"
    });
  }

  // 5️⃣ Tentukan status final
  const isSuccess = status === "success" || success === true;

  // 6️⃣ Format harga
  const rupiah = harga
    ? harga.toLocaleString("id-ID")
    : "0";

  // 7️⃣ Format pesan Telegram (SESUIAI DOKUMENTASI)
  const text = isSuccess
    ? `✅ *TRANSAKSI SUCCESS*

📦 Produk : ${kode_produk}
📱 Tujuan : ${nomor_tujuan}
💰 Harga  : Rp${rupiah}
🆔 RefID  : ${refid}
🏭 SupID  : ${supplier_trxid}
📌 SN     : ${note}
🕒 Waktu  : ${updated_at}`
    : `❌ *TRANSAKSI FAILED*

📦 Produk : ${kode_produk}
📱 Tujuan : ${nomor_tujuan}
💰 Harga  : Rp${rupiah}
🆔 RefID  : ${refid}
🏭 SupID  : ${supplier_trxid}
⚠️ Info   : ${note}
🕒 Waktu  : ${updated_at}`;

  // 8️⃣ Kirim ke Telegram
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "Markdown"
    })
  });

  // 9️⃣ Respon ke supplier (WAJIB 200)
  return res.json({
    success: true,
    refid
  });
}
