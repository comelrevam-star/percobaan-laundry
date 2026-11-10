/**
 * NAGASA LAUNDRY - Utility Functions
 * Palu, Sulawesi Tengah | WhatsApp: 082251267232
 */

// ---- Toast Notifications ----
export function showToast(type, title, message = '', duration = 4000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: 'fa-solid fa-circle-check',
    error: 'fa-solid fa-circle-xmark',
    warning: 'fa-solid fa-triangle-exclamation',
    info: 'fa-solid fa-circle-info'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon"><i class="${icons[type] || icons.info}"></i></span>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      ${message ? `<div class="toast-message">${message}</div>` : ''}
    </div>
    <button class="toast-close" aria-label="Tutup">&times;</button>
  `;

  toast.querySelector('.toast-close').addEventListener('click', () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 250);
  });

  container.appendChild(toast);
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 250);
    }
  }, duration);
}

// ---- Loading Overlay ----
export function showLoading(text = 'Memuat...') {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    const textEl = overlay.querySelector('.loading-text');
    if (textEl) textEl.textContent = text;
    overlay.classList.remove('hidden');
  }
}

export function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
  }
}

// ---- Format Currency (Rupiah) ----
export function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
}

// ---- Format Date (WITA: Asia/Makassar) ----
export function formatDate(date, includeTime = true) {
  if (!date) return '-';
  const d = date instanceof Date ? date : (date.toDate ? date.toDate() : new Date(date));
  if (isNaN(d.getTime())) return '-';

  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Makassar'
  };
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  return d.toLocaleDateString('id-ID', options) + (includeTime ? ' WITA' : '');
}

export function formatDateShort(date) {
  if (!date) return '-';
  const d = date instanceof Date ? date : (date.toDate ? date.toDate() : new Date(date));
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Makassar'
  });
}

// ---- Transaction ID Generator ----
export function generateTransactionId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `NGS-${year}${month}${day}-${random}`;
}

// ---- WhatsApp Formatting ----
export const NAGASA_WA = '6282251267232';

export function formatWANumber(number) {
  if (!number) return '';
  let cleaned = String(number).replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  } else if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

// ---- WhatsApp Message Generators ----
export function buildWaOrderLink(order) {
  const phone = NAGASA_WA;
  const unit = order.priceType === 'per_item' ? 'pcs' : 'kg';
  const amountQty = order.priceType === 'per_item' ? `${order.quantity || 1} pcs` : `${order.weight || 1} kg`;
  const pickupText = order.pickupMethod === 'delivery' 
    ? `Antar-Jemput (${order.deliveryDistanceKm || 1} km - ${formatCurrency(order.deliveryFee)})` 
    : 'Antar Langsung ke Toko';

  const message = 
`*KONFIRMASI PESANAN - NAGASA LAUNDRY*
=============================
📋 *No. Pesanan:* ${order.transactionId}
👤 *Nama:* ${order.customerName}
📱 *WhatsApp:* ${order.customerPhone}
📍 *Alamat:* ${order.customerAddress || 'Toko'}
=============================
🧺 *Layanan:* ${order.serviceName}
⚖️ *Estimasi:* ${amountQty}
🛵 *Metode:* ${pickupText}
💳 *Pembayaran:* ${order.paymentMethod.toUpperCase()} (${getPaymentStatusLabel(order.paymentStatus)})
💰 *Total Biaya:* ${formatCurrency(order.grandTotal)}
=============================
📝 *Catatan:* ${order.notes || '-'}

Halo Admin Nagasa Laundry, mohon konfirmasi pesanan saya di atas. Terima kasih!`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildWaStatusInquiryLink(orderCode) {
  const phone = NAGASA_WA;
  const message = `Halo Admin Nagasa Laundry, saya ingin menanyakan status pengerjaan pesanan laundry dengan nomor transaksi: *${orderCode}*. Terima kasih!`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildWaReadyNotificationLink(order) {
  const phone = formatWANumber(order.customerPhone);
  const message = 
`*NOTIFIKASI LAUNDRY SIAP - NAGASA LAUNDRY*
Halo Kak *${order.customerName}*,

Kabar gembira! Pesanan laundry Anda dengan nomor transaksi:
🧾 *${order.transactionId}*
✨ *Status:* Pakaian telah bersih, wangi, rapi & *SIAP DIAMBIL / SEDANG DIANTAR*!

💰 Total Pembayaran: *${formatCurrency(order.grandTotal)}*
💳 Status Pembayaran: *${getPaymentStatusLabel(order.paymentStatus)}*

📍 Toko: Tanjung Harapan 1, Palu
⏰ Jam buka: 08.00–16.30 WITA

Terima kasih telah mempercayakan pakaian Anda di Nagasa Laundry! 🫧✨`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

// ---- Validation ----
export function validatePhone(phone) {
  if (!phone) return false;
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 9 && cleaned.length <= 15;
}

export function sanitizeInput(str) {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
}

// ---- Status Definitions (9 Laundry Stages) ----
export const ORDER_STATUSES = [
  { value: 'menunggu_konfirmasi', label: 'Menunggu Konfirmasi', icon: 'fa-hourglass-half', color: '#F59E0B' },
  { value: 'pesanan_diterima', label: 'Pesanan Diterima', icon: 'fa-check-to-slot', color: '#3B82F6' },
  { value: 'sedang_dicuci', label: 'Sedang Dicuci', icon: 'fa-soap', color: '#0288D1' },
  { value: 'sedang_dikeringkan', label: 'Sedang Dikeringkan', icon: 'fa-sun', color: '#F97316' },
  { value: 'sedang_disetrika', label: 'Sedang Disetrika', icon: 'fa-shirt', color: '#8B5CF6' },
  { value: 'siap_diambil', label: 'Siap Diambil', icon: 'fa-box-archive', color: '#10B981' },
  { value: 'sedang_diantar', label: 'Sedang Diantar', icon: 'fa-motorcycle', color: '#06B6D4' },
  { value: 'selesai', label: 'Selesai', icon: 'fa-circle-check', color: '#059669' },
  { value: 'dibatalkan', label: 'Dibatalkan', icon: 'fa-circle-xmark', color: '#EF4444' }
];

export const PAYMENT_STATUSES = [
  { value: 'belum_dibayar', label: 'Belum Dibayar', badgeClass: 'badge-danger' },
  { value: 'menunggu_verifikasi', label: 'Menunggu Verifikasi', badgeClass: 'badge-warning' },
  { value: 'sudah_dibayar', label: 'Sudah Dibayar', badgeClass: 'badge-success' }
];

export function getStatusLabel(status) {
  const match = ORDER_STATUSES.find(s => s.value === status);
  return match ? match.label : (status || '-');
}

export function getStatusBadgeClass(status) {
  const map = {
    'menunggu_konfirmasi': 'status-menunggu',
    'pesanan_diterima': 'status-diterima',
    'sedang_dicuci': 'status-dicuci',
    'sedang_dikeringkan': 'status-dikeringkan',
    'sedang_disetrika': 'status-disetrika',
    'siap_diambil': 'status-siap',
    'sedang_diantar': 'status-diantar',
    'selesai': 'status-selesai',
    'dibatalkan': 'status-dibatalkan'
  };
  return map[status] || 'status-menunggu';
}

export function getPaymentStatusLabel(status) {
  const map = {
    'belum_dibayar': 'Belum Dibayar',
    'menunggu_verifikasi': 'Menunggu Verifikasi',
    'sudah_dibayar': 'Sudah Dibayar'
  };
  return map[status] || status || 'Belum Dibayar';
}

export function getPaymentBadgeClass(status) {
  const map = {
    'belum_dibayar': 'badge-danger',
    'menunggu_verifikasi': 'badge-warning',
    'sudah_dibayar': 'badge-success'
  };
  return map[status] || 'badge-secondary';
}

// ---- Distance Fee Calculation Helper ----
export function calculateDeliveryFee(distanceKm, ratePerKm = 3000, minFee = 5000, freeThreshold = 100000, orderTotal = 0) {
  if (orderTotal >= freeThreshold && freeThreshold > 0) {
    return 0; // Bebas ongkir jika belanja mencapai batas
  }
  const km = Math.max(1, Number(distanceKm) || 1);
  const calculated = km * ratePerKm;
  return Math.max(minFee, calculated);
}
