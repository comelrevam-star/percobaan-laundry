/**
 * NAGASA LAUNDRY - Data Service Layer
 * Bertanggung jawab atas seluruh operasi data Firestore
 * Collections: admins, customers, services, orders, payments, transactions, pickup_deliveries, settings
 */

import { 
  db, 
  isFirebaseConfigured,
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp 
} from './firebase-config.js';

import { formatWANumber, generateTransactionId } from './utils.js';

// ============================================================
// DATA BAWAAN / SEEDER STANDAR NAGASA LAUNDRY
// ============================================================
export const DEFAULT_SERVICES = [
  {
    id: "cuci-kering",
    code: "CK",
    name: "Cuci Kering",
    category: "kiloan",
    price: 7000,
    priceType: "per_kg",
    unitName: "kg",
    estimatedHours: 24,
    description: "Pakaian dicuci bersih menggunakan deterjen premium ramah serat kain dan dikeringkan 100%.",
    features: ["Deterjen higienis anti-bakteri", "Pengeringan mesin 100%", "Lipat rapi dalam plastik pelindung", "Wangi segar tahan lama"],
    icon: "fa-soap",
    badge: "Hemat",
    badgeType: "hemat",
    isActive: true,
    order: 1
  },
  {
    id: "cuci-setrika",
    code: "CS",
    name: "Cuci Setrika",
    category: "kiloan",
    price: 9000,
    priceType: "per_kg",
    unitName: "kg",
    estimatedHours: 24,
    description: "Layanan paling favorit! Pakaian dicuci bersih, dikeringkan, dan disetrika uap halus siap pakai.",
    features: ["Cuci bersih bergaransi", "Setrika uap licin & tanpa kusut", "Parfum premium tahan hingga 14 hari", "Kemasan rapi anti-debu"],
    icon: "fa-shirt",
    badge: "Paling Favorit",
    badgeType: "popular",
    isActive: true,
    order: 2
  },
  {
    id: "setrika-saja",
    code: "SS",
    name: "Setrika Saja",
    category: "kiloan",
    price: 6000,
    priceType: "per_kg",
    unitName: "kg",
    estimatedHours: 12,
    description: "Khusus pakaian yang sudah dicuci di rumah namun butuh sentuhan setrika uap profesional.",
    features: ["Setrika uap suhu teratur", "Pelipatan standar butik", "Semprotan pewangi khusus", "Pengerjaan cepat"],
    icon: "fa-wand-magic-sparkles",
    badge: "Cepat",
    badgeType: "fast",
    isActive: true,
    order: 3
  },
  {
    id: "laundry-kiloan",
    code: "LK",
    name: "Laundry Kiloan Reguler",
    category: "kiloan",
    price: 8000,
    priceType: "per_kg",
    unitName: "kg",
    estimatedHours: 48,
    description: "Paket ekonomis harian untuk pakaian santai keluarga, sprei, sarung bantal, dan handuk.",
    features: ["Minimal order 3 kg", "Pemisahan pakaian putih & warna", "Pewangi aroma segar pilihan", "Harga ekonomis"],
    icon: "fa-basket-shopping",
    badge: "Paket Keluarga",
    badgeType: "hemat",
    isActive: true,
    order: 4
  },
  {
    id: "laundry-satuan",
    code: "LS",
    name: "Laundry Satuan (Dry Cleaning)",
    category: "satuan",
    price: 15000,
    priceType: "per_item",
    unitName: "pcs",
    estimatedHours: 48,
    description: "Perawatan khusus item berharga seperti jas, blazer, gaun pesta, bed cover, jaket kulit, dan selimut tebal.",
    features: ["Perawatan bahan khusus (gentle care)", "Anti luntur & tidak menyusut", "Gantungan baju + plastik pelindung", "Pemeriksaan detail noda"],
    icon: "fa-vest-patches",
    badge: "Perawatan Ekstra",
    badgeType: "exclusive",
    isActive: true,
    order: 5
  },
  {
    id: "laundry-express",
    code: "LE",
    name: "Laundry Express (4-6 Jam)",
    category: "express",
    price: 14000,
    priceType: "per_kg",
    unitName: "kg",
    estimatedHours: 6,
    description: "Solusi darurat untuk kebutuhan mendesak! Cuci, kering, dan setrika selesai dalam 4-6 jam.",
    features: ["Prioritas pengerjaan nomor satu", "Selesai 4-6 jam", "Bisa antar jemput kilat di Palu", "Garansi tepat waktu"],
    icon: "fa-bolt-lightning",
    badge: "Kilat 6 Jam",
    badgeType: "express",
    isActive: true,
    order: 6
  }
];

export const DEFAULT_SETTINGS = {
  shopName: "Nagasa Laundry",
  slogan: "Bersih, Rapi, Harum & Terpercaya di Palu",
  address: "Tanjung Harapan 1, Palu, Sulawesi Tengah",
  whatsapp: "082251267232",
  phoneFormatted: "+62 822-5126-7232",
  operatingHours: "08.00–16.30 WITA",
  operatingDays: "Senin – Sabtu (Minggu & Tanggal Merah Tutup)",
  deliveryRatePerKm: 3000,
  minDeliveryFee: 5000,
  freeDeliveryMinOrder: 100000,
  serviceAreas: [
    "Tanjung Harapan 1 & sekitarnya",
    "Birobuli Utara & Selatan",
    "Tatura Utara & Selatan",
    "Lolu Utara & Selatan",
    "Besusu Barat & Timur",
    "Palu Timur & Palu Selatan",
    "Mantikulore & Sekitarnya"
  ],
  bankAccounts: [
    { bank: "BCA", accountNumber: "7920182741", accountHolder: "NAGASA LAUNDRY" },
    { bank: "BRI", accountNumber: "521001029384531", accountHolder: "NAGASA LAUNDRY" },
    { bank: "Bank Mandiri", accountNumber: "1510012398471", accountHolder: "NAGASA LAUNDRY" }
  ],
  qrisPayload: "00020101021126610016ID.CO.QRIS.WWW011893600918000000000002150822512672320303UMI51440014ID.LINKAJA.WWW02150822512672320303UMI5204581253033605802ID5914NAGASA LAUNDRY6004PALU61059411162230719NAGASA-ONLINE-ORDER6304ABCD"
};

// ============================================================
// HELPER STORAGE LOKAL (Fallback jika Firebase belum terhubung)
// ============================================================
const LOCAL_STORAGE_KEYS = {
  SERVICES: 'nagasa_local_services',
  ORDERS: 'nagasa_local_orders',
  CUSTOMERS: 'nagasa_local_customers',
  SETTINGS: 'nagasa_local_settings',
  PAYMENTS: 'nagasa_local_payments'
};

function getLocalData(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setLocalData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Gagal menulis data lokal:', e);
  }
}

// Inisialisasi fallback data jika kosong
if (!localStorage.getItem(LOCAL_STORAGE_KEYS.SERVICES)) {
  setLocalData(LOCAL_STORAGE_KEYS.SERVICES, DEFAULT_SERVICES);
}
if (!localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS)) {
  setLocalData(LOCAL_STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
}
if (!localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS)) {
  // Tambah 1 data pesanan demo untuk kemudahan pengujian pertama
  const sampleOrder = {
    id: "NGS-20261109-8821",
    transactionId: "NGS-20261109-8821",
    customerName: "Budi Santoso",
    customerPhone: "082251267232",
    customerPhoneFormatted: "6282251267232",
    customerAddress: "Jl. Tanjung Harapan 1 No. 18, Palu",
    serviceId: "cuci-setrika",
    serviceName: "Cuci Setrika",
    servicePrice: 9000,
    priceType: "per_kg",
    weight: 4.5,
    quantity: 0,
    serviceTotal: 40500,
    pickupMethod: "delivery", // 'delivery' or 'pickup'
    deliveryDistanceKm: 2,
    deliveryFee: 6000,
    discount: 0,
    grandTotal: 46500,
    paymentMethod: "qris", // 'cash', 'transfer', 'qris'
    paymentStatus: "sudah_dibayar", // 'belum_dibayar', 'menunggu_verifikasi', 'sudah_dibayar'
    paymentProofUrl: "",
    status: "sedang_dicuci",
    statusNote: "Pakaian sedang dalam proses pencucian drum 1",
    notes: "Pakaian warna putih tolong dipisahkan",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    history: [
      { status: "menunggu_konfirmasi", time: new Date(Date.now() - 3600000 * 3).toISOString(), note: "Pesanan masuk via website" },
      { status: "pesanan_diterima", time: new Date(Date.now() - 3600000 * 2).toISOString(), note: "Pesanan telah dikonfirmasi kasir" },
      { status: "sedang_dicuci", time: new Date(Date.now() - 3600000 * 1).toISOString(), note: "Pakaian masuk mesin cuci" }
    ]
  };
  setLocalData(LOCAL_STORAGE_KEYS.ORDERS, [sampleOrder]);
}

// ============================================================
// SERVIS-SERVIS (SERVICES)
// ============================================================

/**
 * Mengambil semua layanan aktif untuk halaman pelanggan
 */
export async function getActiveServices() {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(
        collection(db, 'services'),
        where('isActive', '==', true),
        orderBy('order', 'asc')
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    } catch (err) {
      console.warn('Fallback ke data lokal saat getActiveServices:', err);
    }
  }
  // Fallback lokal
  const services = getLocalData(LOCAL_STORAGE_KEYS.SERVICES, DEFAULT_SERVICES);
  return services.filter(s => s.isActive !== false).sort((a,b) => (a.order || 0) - (b.order || 0));
}

/**
 * Mengambil semua layanan untuk dashboard admin (aktif maupun nonaktif)
 */
export async function getAllServicesAdmin() {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, 'services'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    } catch (err) {
      console.warn('Fallback lokal getAllServicesAdmin:', err);
    }
  }
  return getLocalData(LOCAL_STORAGE_KEYS.SERVICES, DEFAULT_SERVICES);
}

/**
 * Menyimpan / memperbarui layanan (Admin)
 */
export async function saveService(serviceData) {
  const serviceId = serviceData.id || `srv-${Date.now()}`;
  const payload = {
    ...serviceData,
    id: serviceId,
    updatedAt: new Date().toISOString()
  };

  if (isFirebaseConfigured() && db) {
    try {
      await setDoc(doc(db, 'services', serviceId), payload, { merge: true });
    } catch (err) {
      console.error('Gagal saveService ke Firestore:', err);
    }
  }

  // Simpan ke storage lokal
  const current = getLocalData(LOCAL_STORAGE_KEYS.SERVICES, DEFAULT_SERVICES);
  const idx = current.findIndex(s => s.id === serviceId);
  if (idx >= 0) {
    current[idx] = { ...current[idx], ...payload };
  } else {
    current.push(payload);
  }
  setLocalData(LOCAL_STORAGE_KEYS.SERVICES, current);
  return payload;
}

/**
 * Menghapus layanan (Admin)
 */
export async function deleteService(serviceId) {
  if (isFirebaseConfigured() && db) {
    try {
      await deleteDoc(doc(db, 'services', serviceId));
    } catch (err) {
      console.error('Gagal deleteService di Firestore:', err);
    }
  }
  const current = getLocalData(LOCAL_STORAGE_KEYS.SERVICES, DEFAULT_SERVICES);
  const filtered = current.filter(s => s.id !== serviceId);
  setLocalData(LOCAL_STORAGE_KEYS.SERVICES, filtered);
  return true;
}

// ============================================================
// PESANAN & TRANSAKSI (ORDERS & TRANSACTIONS)
// ============================================================

/**
 * Membuat Pesanan Baru
 */
export async function createOrder(data) {
  const timestamp = Date.now();
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const transactionId = `NGS-${dateStr}-${randomSuffix}`;
  const cleanPhone = formatWANumber(data.customerPhone);

  const initialStatus = 'menunggu_konfirmasi';
  const initialPaymentStatus = data.paymentStatus || 'belum_dibayar';

  const orderPayload = {
    id: transactionId,
    transactionId: transactionId,
    customerName: data.customerName.trim(),
    customerPhone: data.customerPhone.trim(),
    customerPhoneFormatted: cleanPhone,
    customerAddress: (data.customerAddress || '').trim(),
    serviceId: data.serviceId,
    serviceName: data.serviceName,
    servicePrice: Number(data.servicePrice || 0),
    priceType: data.priceType || 'per_kg',
    weight: Number(data.weight || 0),
    quantity: Number(data.quantity || 0),
    serviceTotal: Number(data.serviceTotal || 0),
    pickupMethod: data.pickupMethod || 'pickup', // 'delivery' or 'pickup'
    deliveryDistanceKm: Number(data.deliveryDistanceKm || 0),
    deliveryFee: Number(data.deliveryFee || 0),
    discount: Number(data.discount || 0),
    grandTotal: Number(data.grandTotal || 0),
    paymentMethod: data.paymentMethod || 'cash',
    paymentStatus: initialPaymentStatus,
    paymentProofUrl: data.paymentProofUrl || '',
    status: initialStatus,
    statusNote: 'Pesanan baru berhasil dibuat dan menunggu konfirmasi dari kasir Nagasa Laundry.',
    notes: (data.notes || '').trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    history: [
      {
        status: initialStatus,
        time: new Date().toISOString(),
        note: 'Pesanan dibuat oleh pelanggan'
      }
    ]
  };

  // 1. Simpan ke Firestore jika tersedia
  if (isFirebaseConfigured() && db) {
    try {
      // Simpan di koleksi orders
      await setDoc(doc(db, 'orders', transactionId), orderPayload);

      // Simpan / update di koleksi customers
      const customerDocRef = doc(db, 'customers', cleanPhone);
      await setDoc(customerDocRef, {
        name: orderPayload.customerName,
        phone: orderPayload.customerPhone,
        phoneFormatted: cleanPhone,
        address: orderPayload.customerAddress,
        lastOrderAt: orderPayload.createdAt,
        updatedAt: orderPayload.createdAt
      }, { merge: true });

      // Jika antar-jemput, simpan di koleksi pickup_deliveries
      if (orderPayload.pickupMethod === 'delivery') {
        await setDoc(doc(db, 'pickup_deliveries', transactionId), {
          orderId: transactionId,
          customerName: orderPayload.customerName,
          customerPhone: cleanPhone,
          address: orderPayload.customerAddress,
          distanceKm: orderPayload.deliveryDistanceKm,
          fee: orderPayload.deliveryFee,
          status: 'pending',
          createdAt: orderPayload.createdAt
        });
      }

      // Log transaksi ke koleksi transactions
      await setDoc(doc(db, 'transactions', transactionId), {
        orderId: transactionId,
        amount: orderPayload.grandTotal,
        paymentMethod: orderPayload.paymentMethod,
        paymentStatus: orderPayload.paymentStatus,
        type: 'income',
        createdAt: orderPayload.createdAt
      });

      console.log('✅ Pesanan berhasil disimpan ke Firebase Firestore:', transactionId);
    } catch (err) {
      console.error('Gagal menyimpan pesanan ke Firestore:', err);
    }
  }

  // 2. Simpan juga ke storage lokal
  const localOrders = getLocalData(LOCAL_STORAGE_KEYS.ORDERS, []);
  localOrders.unshift(orderPayload);
  setLocalData(LOCAL_STORAGE_KEYS.ORDERS, localOrders);

  // Update data pelanggan lokal
  const localCustomers = getLocalData(LOCAL_STORAGE_KEYS.CUSTOMERS, []);
  const cIdx = localCustomers.findIndex(c => c.phoneFormatted === cleanPhone);
  if (cIdx >= 0) {
    localCustomers[cIdx].name = orderPayload.customerName;
    localCustomers[cIdx].address = orderPayload.customerAddress;
    localCustomers[cIdx].lastOrderAt = orderPayload.createdAt;
    localCustomers[cIdx].totalOrders = (localCustomers[cIdx].totalOrders || 1) + 1;
    localCustomers[cIdx].totalSpent = (localCustomers[cIdx].totalSpent || 0) + orderPayload.grandTotal;
  } else {
    localCustomers.push({
      name: orderPayload.customerName,
      phone: orderPayload.customerPhone,
      phoneFormatted: cleanPhone,
      address: orderPayload.customerAddress,
      firstOrderAt: orderPayload.createdAt,
      lastOrderAt: orderPayload.createdAt,
      totalOrders: 1,
      totalSpent: orderPayload.grandTotal
    });
  }
  setLocalData(LOCAL_STORAGE_KEYS.CUSTOMERS, localCustomers);

  return orderPayload;
}

/**
 * Mencari Pesanan Berdasarkan Kode Transaksi
 */
export async function getOrderByCode(code) {
  if (!code) return null;
  const cleanCode = code.trim().toUpperCase();

  // Coba dari Firestore
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'orders', cleanCode);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() };
      }
      // Query where transactionId == cleanCode
      const q = query(collection(db, 'orders'), where('transactionId', '==', cleanCode), limit(1));
      const qSnap = await getDocs(q);
      if (!qSnap.empty) {
        return { id: qSnap.docs[0].id, ...qSnap.docs[0].data() };
      }
    } catch (err) {
      console.warn('Gagal getOrderByCode dari Firestore:', err);
    }
  }

  // Fallback ke penyimpanan lokal
  const localOrders = getLocalData(LOCAL_STORAGE_KEYS.ORDERS, []);
  const found = localOrders.find(o => 
    (o.transactionId && o.transactionId.toUpperCase() === cleanCode) || 
    (o.id && o.id.toUpperCase() === cleanCode)
  );
  return found || null;
}

/**
 * Mengambil Riwayat Pesanan Pelanggan berdasarkan Nomor WhatsApp
 */
export async function getOrdersByCustomerPhone(phone) {
  if (!phone) return [];
  const cleanPhone = formatWANumber(phone);

  if (isFirebaseConfigured() && db) {
    try {
      const q = query(
        collection(db, 'orders'),
        where('customerPhoneFormatted', '==', cleanPhone),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (err) {
      console.warn('Gagal getOrdersByCustomerPhone dari Firestore:', err);
    }
  }

  // Fallback lokal
  const localOrders = getLocalData(LOCAL_STORAGE_KEYS.ORDERS, []);
  return localOrders
    .filter(o => o.customerPhoneFormatted === cleanPhone || formatWANumber(o.customerPhone || '') === cleanPhone)
    .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Mengambil Seluruh Pesanan (Untuk Admin Dashboard)
 */
export async function getAllOrders(filters = {}) {
  let ordersList = [];

  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        ordersList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (err) {
      console.warn('Gagal getAllOrders dari Firestore, gunakan lokal:', err);
    }
  }

  if (ordersList.length === 0) {
    ordersList = getLocalData(LOCAL_STORAGE_KEYS.ORDERS, []);
  }

  // Filter di sisi client
  if (filters.status && filters.status !== 'all') {
    ordersList = ordersList.filter(o => o.status === filters.status);
  }
  if (filters.paymentStatus && filters.paymentStatus !== 'all') {
    ordersList = ordersList.filter(o => o.paymentStatus === filters.paymentStatus);
  }
  if (filters.search) {
    const s = filters.search.toLowerCase();
    ordersList = ordersList.filter(o => 
      (o.transactionId && o.transactionId.toLowerCase().includes(s)) ||
      (o.customerName && o.customerName.toLowerCase().includes(s)) ||
      (o.customerPhone && o.customerPhone.includes(s))
    );
  }

  return ordersList;
}

/**
 * Memperbarui Status Pengerjaan Laundry (9 Status)
 */
export async function updateOrderStatus(orderId, newStatus, note = '') {
  const updatePayload = {
    status: newStatus,
    statusNote: note,
    updatedAt: new Date().toISOString()
  };

  const historyItem = {
    status: newStatus,
    time: new Date().toISOString(),
    note: note || `Status diperbarui menjadi ${newStatus}`
  };

  if (isFirebaseConfigured() && db) {
    try {
      const orderRef = doc(db, 'orders', orderId);
      const snap = await getDoc(orderRef);
      if (snap.exists()) {
        const currentData = snap.data();
        const history = currentData.history || [];
        history.push(historyItem);
        await updateDoc(orderRef, {
          ...updatePayload,
          history: history
        });
      }
    } catch (err) {
      console.error('Gagal updateOrderStatus di Firestore:', err);
    }
  }

  // Update lokal
  const localOrders = getLocalData(LOCAL_STORAGE_KEYS.ORDERS, []);
  const idx = localOrders.findIndex(o => o.id === orderId || o.transactionId === orderId);
  if (idx >= 0) {
    localOrders[idx].status = newStatus;
    localOrders[idx].statusNote = note;
    localOrders[idx].updatedAt = updatePayload.updatedAt;
    if (!localOrders[idx].history) localOrders[idx].history = [];
    localOrders[idx].history.push(historyItem);
    setLocalData(LOCAL_STORAGE_KEYS.ORDERS, localOrders);
    return localOrders[idx];
  }
  return null;
}

/**
 * Memperbarui Status Pembayaran & Verifikasi Bukti
 */
export async function updatePaymentStatus(orderId, paymentStatus, proofUrl = null) {
  const updatePayload = {
    paymentStatus: paymentStatus,
    updatedAt: new Date().toISOString()
  };
  if (proofUrl) {
    updatePayload.paymentProofUrl = proofUrl;
  }

  if (isFirebaseConfigured() && db) {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, updatePayload);

      // Catat di payments collection
      await setDoc(doc(db, 'payments', orderId), {
        orderId: orderId,
        paymentStatus: paymentStatus,
        proofUrl: proofUrl || '',
        updatedAt: updatePayload.updatedAt
      }, { merge: true });
    } catch (err) {
      console.error('Gagal updatePaymentStatus di Firestore:', err);
    }
  }

  // Update lokal
  const localOrders = getLocalData(LOCAL_STORAGE_KEYS.ORDERS, []);
  const idx = localOrders.findIndex(o => o.id === orderId || o.transactionId === orderId);
  if (idx >= 0) {
    localOrders[idx].paymentStatus = paymentStatus;
    if (proofUrl) localOrders[idx].paymentProofUrl = proofUrl;
    localOrders[idx].updatedAt = updatePayload.updatedAt;
    setLocalData(LOCAL_STORAGE_KEYS.ORDERS, localOrders);
    return localOrders[idx];
  }
  return null;
}

/**
 * Penyesuaian Harga / Berat oleh Kasir Admin
 */
export async function adjustOrderPricing(orderId, updates) {
  const { weight, quantity, servicePrice, deliveryFee, discount, notes } = updates;
  
  const localOrders = getLocalData(LOCAL_STORAGE_KEYS.ORDERS, []);
  const idx = localOrders.findIndex(o => o.id === orderId || o.transactionId === orderId);
  if (idx < 0) throw new Error("Pesanan tidak ditemukan");

  const current = localOrders[idx];
  const newWeight = weight !== undefined ? Number(weight) : current.weight;
  const newQuantity = quantity !== undefined ? Number(quantity) : current.quantity;
  const newServicePrice = servicePrice !== undefined ? Number(servicePrice) : current.servicePrice;
  const newDeliveryFee = deliveryFee !== undefined ? Number(deliveryFee) : current.deliveryFee;
  const newDiscount = discount !== undefined ? Number(discount) : (current.discount || 0);

  const serviceTotal = current.priceType === 'per_item' 
    ? (newServicePrice * newQuantity) 
    : (newServicePrice * newWeight);

  const grandTotal = Math.max(0, serviceTotal + newDeliveryFee - newDiscount);

  const payload = {
    weight: newWeight,
    quantity: newQuantity,
    servicePrice: newServicePrice,
    serviceTotal: serviceTotal,
    deliveryFee: newDeliveryFee,
    discount: newDiscount,
    grandTotal: grandTotal,
    notes: notes !== undefined ? notes : current.notes,
    updatedAt: new Date().toISOString()
  };

  if (isFirebaseConfigured() && db) {
    try {
      await updateDoc(doc(db, 'orders', orderId), payload);
    } catch (err) {
      console.error('Gagal adjustOrderPricing di Firestore:', err);
    }
  }

  localOrders[idx] = { ...current, ...payload };
  setLocalData(LOCAL_STORAGE_KEYS.ORDERS, localOrders);
  return localOrders[idx];
}

/**
 * Menghapus atau Membatalkan Pesanan
 */
export async function cancelOrDeleteOrder(orderId, action = 'cancel', reason = '') {
  if (action === 'delete') {
    if (isFirebaseConfigured() && db) {
      try {
        await deleteDoc(doc(db, 'orders', orderId));
      } catch (err) {
        console.error('Gagal deleteDoc orders:', err);
      }
    }
    const localOrders = getLocalData(LOCAL_STORAGE_KEYS.ORDERS, []);
    const filtered = localOrders.filter(o => o.id !== orderId && o.transactionId !== orderId);
    setLocalData(LOCAL_STORAGE_KEYS.ORDERS, filtered);
    return true;
  } else {
    // Batalkan pesanan
    return updateOrderStatus(orderId, 'dibatalkan', reason || 'Pesanan dibatalkan oleh kasir/admin');
  }
}

// ============================================================
// PELANGGAN (CUSTOMERS)
// ============================================================

export async function getCustomers() {
  if (isFirebaseConfigured() && db) {
    try {
      const snap = await getDocs(collection(db, 'customers'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (err) {
      console.warn('Gagal getCustomers dari Firestore:', err);
    }
  }
  return getLocalData(LOCAL_STORAGE_KEYS.CUSTOMERS, []);
}

// ============================================================
// PENGATURAN TOKO (SETTINGS)
// ============================================================

export async function getShopSettings() {
  if (isFirebaseConfigured() && db) {
    try {
      const snap = await getDoc(doc(db, 'settings', 'general'));
      if (snap.exists()) {
        return snap.data();
      }
    } catch (err) {
      console.warn('Gagal getShopSettings dari Firestore:', err);
    }
  }
  return getLocalData(LOCAL_STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
}

export async function updateShopSettings(newSettings) {
  const merged = { ...DEFAULT_SETTINGS, ...newSettings, updatedAt: new Date().toISOString() };
  if (isFirebaseConfigured() && db) {
    try {
      await setDoc(doc(db, 'settings', 'general'), merged, { merge: true });
    } catch (err) {
      console.error('Gagal updateShopSettings di Firestore:', err);
    }
  }
  setLocalData(LOCAL_STORAGE_KEYS.SETTINGS, merged);
  return merged;
}

// ============================================================
// LAPORAN & STATISTIK (DASHBOARD METRICS)
// ============================================================

export async function getDashboardStats() {
  const orders = await getAllOrders();
  
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  let totalOrders = orders.length;
  let ordersToday = 0;
  let inProgress = 0;
  let completed = 0;
  let totalRevenue = 0;

  const ordersByStatus = {};
  const revenueByDay = {}; // last 7 days

  // Inisialisasi 7 hari terakhir
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'numeric' });
    revenueByDay[key] = { label, revenue: 0, count: 0 };
  }

  orders.forEach(o => {
    const orderDate = (o.createdAt || '').slice(0, 10);
    if (orderDate === todayStr) {
      ordersToday++;
    }

    // Status pengerjaan
    if (['selesai'].includes(o.status)) {
      completed++;
    } else if (!['dibatalkan'].includes(o.status)) {
      inProgress++;
    }

    // Pendapatan (hanya jika sudah dibayar atau status pengerjaan selesai)
    if (o.paymentStatus === 'sudah_dibayar' || o.status === 'selesai') {
      const amount = Number(o.grandTotal || 0);
      totalRevenue += amount;
      if (revenueByDay[orderDate]) {
        revenueByDay[orderDate].revenue += amount;
        revenueByDay[orderDate].count += 1;
      }
    }

    ordersByStatus[o.status] = (ordersByStatus[o.status] || 0) + 1;
  });

  return {
    totalOrders,
    ordersToday,
    inProgress,
    completed,
    totalRevenue,
    ordersByStatus,
    revenueByDay: Object.values(revenueByDay),
    recentOrders: orders.slice(0, 10)
  };
}

// ============================================================
// SEEDER DATA FIRESTORE (1-KLIK UNTUK MENGISI DATA AWAL)
// ============================================================

export async function seedInitialData() {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firebase belum terhubung. Konfigurasikan API key terlebih dahulu.");
  }

  // 1. Seed Services
  for (const s of DEFAULT_SERVICES) {
    await setDoc(doc(db, 'services', s.id), s, { merge: true });
  }

  // 2. Seed Settings
  await setDoc(doc(db, 'settings', 'general'), DEFAULT_SETTINGS, { merge: true });

  console.log('✅ Firestore Seed Data berhasil diunggah.');
  return { success: true, count: DEFAULT_SERVICES.length };
}
