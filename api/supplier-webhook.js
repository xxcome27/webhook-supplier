export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  const {
    success,
    status,
    refid,
    kode_produk,
    nomor_tujuan,
    harga,
    note,
    updated_at
  } = req.body;

  if (!refid || !status) {
    return res.status(400).json({ success: false });
  }

  const isSuccess = status === "success" || success === true;

  const rupiah = harga
    ? harga.toLocaleString("id-ID")
    : "0";

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const text = isSuccess
    ? `✅ *TRANSAKSI SUCCESS*

📦 Produk : ${kode_produk}
📱 Tujuan : ${nomor_tujuan}
💰 Harga  : Rp${rupiah}
🆔 RefID  : ${refid}
📌 SN     : ${note || "-"}
🕒 Waktu  : ${updated_at || "-"}`
    : `❌ *TRANSAKSI FAILED*

📦 Produk : ${kode_produk}
📱 Tujuan : ${nomor_tujuan}
💰 Harga  : Rp${rupiah}
🆔 RefID  : ${refid}
⚠️ Alasan : ${note || "-"}
🕒 Waktu  : ${updated_at || "-"}`;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "Markdown"
    })
  });

  res.json({ success: true });
}
