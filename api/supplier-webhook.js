export default function handler(req, res) {
  // Hanya terima POST
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  // Ambil data dari supplier
  const {
    success,
    status,
    refid,
    supplier_trxid,
    kode_produk,
    nomor_tujuan,
    harga,
    kodereseller,
    message,
    note,
    updated_at
  } = req.body;

  // Validasi minimal
  if (!refid || !status) {
    return res.status(400).json({
      success: false,
      message: "Data wajib tidak lengkap"
    });
  }

  // Tentukan status akhir
  const finalStatus =
    status === "success" || success === true
      ? "SUCCESS"
      : "FAILED";

  // LOG (nanti terlihat di Vercel Logs)
  console.log("WEBHOOK MASUK:", {
    refid,
    finalStatus,
    kode_produk,
    nomor_tujuan,
    harga,
    note
  });

  // Respon ke supplier
  return res.status(200).json({
    success: true,
    refid,
    status: finalStatus
  });
}
