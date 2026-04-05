// قم بتغيير هذا الرقم في كل مرة تقوم بتحديث الموقع ليظهر الإشعار للمستخدمين
const CACHE_NAME = 'unem-iscae-V24';

const urlsToCache =[
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  './icon-192.png'
];

// حدث التثبيت: نقوم بتخزين الملفات، لكن *لا نجبر* المتصفح على التحديث فوراً
// حتى يتسنى للمستخدم رؤية إشعار "يتوفر تحديث جديد" والضغط عليه.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// حدث التفعيل: مسح أي نسخ قديمة من الكاش من هواتف المستخدمين
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('حذف كاش قديم:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// جلب الملفات: الاستراتيجية تعتمد على جلب الملف من الكاش أولاً إن وجد
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// الاستماع لرسالة زر "تحديث الآن" من واجهة الموقع
self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
