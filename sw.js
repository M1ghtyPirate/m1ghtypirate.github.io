const cacheName = 'MyPWA-v1';

const appShellFiles = [
	'script.js',
	'index.html',
	'favicon.ico',
	'css/styles.css',
	'img/bg.svg',
	'img/c-sharp-dot-net.png',
	'icons/icon_32x32.png',
	'icons/icon_64x64.png',
	'icons/icon_96x96.png',
	'icons/icon_128x128.png',
	'icons/icon_168x168.png',
	'icons/icon_192x192.png',
	'icons/icon_256x256.png',
	'icons/icon_512x512.png',
	'icons/icon_828x1792.png',
];

//const gamesImages = [];
//for (let i = 0; i < games.length; i++) {
//  gamesImages.push(`data/img/${games[i].slug}.jpg`);
//}
//const contentToCache = appShellFiles.concat(gamesImages);
const contentToCache = appShellFiles;
console.log('SUCCESS');

self.addEventListener('install', (e) => {
	console.log('[Service Worker] Install');
	e.waitUntil((async () => {
		const cache = await caches.open(cacheName);
		console.log('[Service Worker] Caching all: app shell and content');
		await cache.addAll(contentToCache);
	})());
});

self.addEventListener('activate', (e) => {
	console.log('[Service Worker] Activate');
	e.waitUntil(caches.keys().then((keyList) => {
		return Promise.all(keyList.map((key) => {
			if (key === cacheName) { return; }
				{
				console.log('[Service Worker] Deleting ${key} from cache');
				return caches.delete(key); }
		}));
	}));
});

self.addEventListener('fetch', (e) => {
	console.log('[Service Worker] Fetch');
	e.respondWith((async () => {
		const r = await caches.match(e.request);
		console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
		if (r) { return r; }
		const response = await fetch(e.request);
		const cache = await caches.open(cacheName);
		console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
		cache.put(e.request, response.clone());
		return response;
	})());
});

