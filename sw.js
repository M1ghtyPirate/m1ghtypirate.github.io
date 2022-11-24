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

//Запись в лог
function logEvent (logText)
{
	logText = '[' + new Date().toLocaleString() + '] ' + logText;
	console.log(logText);
	logSW.push(logText);
}

const contentToCache = appShellFiles;
let logSW = [];
logEvent('Download - SW скачан и запущен.');

//Установка.
self.addEventListener('install', (e) => {
	logEvent('Installation - SW установлен.');
	e.waitUntil((async () => {
		const cache = await caches.open(cacheName);
		logEvent('Installation - Кэширование ресурсов.');
		await cache.addAll(contentToCache);
	})());
});

//Проверка кэша.
self.addEventListener('activate', (e) => {
	logEvent('Activation - Проверка кэша.');
	e.waitUntil(caches.keys().then((keyList) => {
		return Promise.all(keyList.map((key) => {
			if (key === cacheName) { return; }
				{
				logEvent('Activation - Удаление ' +  key + ' из кэша.');
				return caches.delete(key); }
		}));
	}));
});


//Перехват запросов.
self.addEventListener('fetch', (e) => {
	logEvent('Fetch - Перехват запросов.');
	e.respondWith((async () => {
		const r = await caches.match(e.request);
		logEvent('Fetch - Запрос: '+ e.request.url);
		if (e.request.url == "https://log/logSW.html") {
			logEvent('Fetch - Возвращение лога: '+ e.request.url);
			var responseLog = new Response(JSON.stringify(logSW));
			logSW = [];
			return responseLog; 
		}
		
		if (r) { 
			logEvent('Fetch - Возвращение ответа из кэша: '+ e.request.url);
		}
		logEvent('Fetch - Отправка запроса: '+ e.request.url);
		const response = await fetch(e.request);
		const cache = await caches.open(cacheName);
		logEvent('Fetch - Кэширование полученного ответа: '+ e.request.url);
		cache.put(e.request, response.clone());
		logEvent('Fetch - Возвращение полученного ответа: '+ e.request.url);
		return response;
	})());
});

