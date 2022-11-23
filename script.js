function learnRequest(targetDiv){
	var request = new XMLHttpRequest();
	request.onload = () => showPaths(request, targetDiv);
	request.open("GET", "https://learn.microsoft.com/api/learn/catalog?locale=ru-ru", true);
	request.send();
}

function showPaths(request, targetDiv){
	targetDiv.innerHTML="";
	var response = JSON.parse(request.responseText);
	response.learningPaths.forEach(addPath, targetDiv);
}

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

//Функция уведомлений.
function randomNotification() {
	//const randomItem = Math.floor(Math.random() * games.length);
	//const notifTitle = games[randomItem].name;
	const notifTitle = 'TestTitle';
	//const notifBody = `Created by ${games[randomItem].author}.`;
	const notifBody = "Created by TestNotifBody";
	const notifImg = "icons/icon_96x96.png";
	//const notifImg = "icon_96x96.png";
	const options = {
		body: notifBody,
		icon: notifImg,
	};
	new Notification(notifTitle, options);
	setTimeout(randomNotification, 30000);
}

var getPathsButton=document.getElementById("getpathsbutton");
var pathsListDiv=document.getElementById("pathslistdiv");
getPathsButton.addEventListener("click", () => learnRequest(pathsListDiv));

//Регистрация servicew worker'а
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

//Кнопка уведомлений.
const button = document.getElementById("notifications");
button.addEventListener("click", () => {
	Notification.requestPermission().then((result) => {
		if (result === "granted") {
			randomNotification();
		}
	});
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
				console.log("User accepted the A2HS prompt");
			} else {
				console.log("User dismissed the A2HS prompt");
			}
			deferredPrompt = null;
		});
	});
});
