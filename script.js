//Запрос курсов.
async function learnRequest(targetDiv){
	var response =  await fetch ("https://learn.microsoft.com/api/learn/catalog?locale=ru-ru");
	showPaths(await response.json(), targetDiv);
}

//Запрос лога
async function logRequest(targetArea){
	var response =  await fetch ("https://log/logSW.html");
	var logArray = await response.json();
	logArray.forEach(showLog, targetArea);
}

//Вывод лога
function showLog(e)
{
	this.innerHTML += e + "\n";
}

//Вывод курсов.
function showPaths(response, targetDiv){
	targetDiv.innerHTML="";
	response.learningPaths.forEach(addPath, targetDiv);
}

//Вывод курса.
function addPath(e)
{
	if (!(e.products.includes("dotnet"))) 
		return;
	let div = document.createElement("div");
	let divCol1 = document.createElement("div");
	let divCol2 = document.createElement("div");
	let img = document.createElement("img");
	let p = document.createElement("p");
	let a = document.createElement("a");
	let br = document.createElement("br");
	div.className = "content";
	div.style = "align-items: center";
	divCol1.className = "column";
	divCol1.style = "flex: 0.10";
	divCol2.className = "column";
	img.src = e.icon_url;
	img.alt = e.title;
	img.style = "width: 100%";
	a.href = e.url;
	a.target = "_blank";
	a.textContent = e.title;
	p.append(a, br, e.summary);
	divCol1.append(img);
	divCol2.append(p);
	div.append(divCol1, divCol2);
	this.append(div);
}

//Вывод уведомлений.
let notificationsCount = 0;

function randomNotification() {
	//const randomItem = Math.floor(Math.random() * games.length);
	//const notifTitle = games[randomItem].name;
	const notifTitle = 'Новое уведомление!';
	//const notifBody = `Created by ${games[randomItem].author}.`;
	const notifBody = "Это уведомление № " + ++notificationsCount + '.';
	const notifImg = "icons/icon_96x96.png";
	//const notifImg = "icon_96x96.png";
	const options = {
		body: notifBody,
		icon: notifImg,
	};
	new Notification(notifTitle, options);
	setTimeout(randomNotification, 30000);
}

//Кнопка курсов.
var getPathsButton=document.getElementById("getpathsbutton");
var pathsListDiv=document.getElementById("pathslistdiv");
getPathsButton.addEventListener("click", () => learnRequest(pathsListDiv));

//Регистрация servicew worker'а
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

//Кнопка уведомлений.
const notificationsButton = document.getElementById("notificationsbutton");
notificationsButton.addEventListener("click", () => {
	Notification.requestPermission().then((result) => {
		if (result === "granted") {
			randomNotification();
		}
	});
	notificationsButton.style.display = "none";
});

//Кнопка инсталляции.
var installButton=document.getElementById("installbutton");
installButton.style.display = "none";
this.addEventListener("beforeinstallprompt", (e) => {
	e.preventDefault();
	var deferredPrompt = e;
	installButton.style.display = "block";
	
	installButton.addEventListener("click", (e) => {
		installButton.style.display = "none";
		deferredPrompt.prompt();
		deferredPrompt.userChoice.then((choiceResult) => {
			if (choiceResult.outcome === "accepted") {
				console.log("Пользователь согласился на установку A2HS.");
			} else {
				console.log("Пользователь отказался от установки A2HS.");
			}
			deferredPrompt = null;
		});
	});
});


//Кнопка лога
const logButton = document.getElementById("logbutton");
logButton.addEventListener("click", () => {
	var logArea = document.getElementById("logarea");
	logRequest(logArea);
});


