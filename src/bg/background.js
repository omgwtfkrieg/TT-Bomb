//Show page action icon in omnibar if it matches the URL specified
//Checks if dataSet key exists if not it creates it
if (localStorage.getItem("dataSet") === null) {
	setdataSet = [];
	localStorage.setItem('dataSet', JSON.stringify(setdataSet));
}

var timefortomorrow;
var fortomocounter;
var alarmcounter = 0;
var messages = [
			"Life is too short to remove USB safely",
			"If we're not meant to have midnight snacks, why is there a light in the fridge?",
			"Nothing poisons life more than potassium cyanide",
			"1/7 of our lives are Mondays.",
			"Life's tough, but I'm tougher!",
			"Don't drink while driving – you will spill the beer.",
			"If you love a woman, you shouldn't be ashamed to show her to your wife.",
			"I feel like Tampax – at a good place, but wrong time…",
			"Team work is important; it helps to put the blame on someone else.",
			"It doesn't matter how much you work, there will always be an asshole that works less but gets more.",
			"Accept who you are, unless you're a serial killer",
			"Brains are wonderful, I wish everyone had one.",
			"A person has to have a warm heart and a cold beer.",
			"Virginity is curable.",
			"I'm not sad. I'm sober…",
			"Friends come and go. Enemies pile up.",
			"Learn from your parents mistakes – use a condom!",
			"If you want to hide your face, go out naked.",
			"If you can't buy a person, you can always sell him.",
			"Life is beautiful… from Friday to Monday.",
			"I don't think you are stupid. You just have a bad luck when thinking.",
			"I tried to be normal once. Worst two minutes of my life.",
			"May your coffee be strong and your Monday be short.",
			"Out of all the lies I\'ve told, \"Just kidding!\" is my favorite.",
			"People say nothing is impossible, but I do nothing every day.",
			"I put the pro in procrastinate",
			"It's all fun and games, until someone calls the cops. Then it's a new game; hide and seek",
			"I'm great in bed; I can sleep for days",
			"Silence is golden; duct tape is silver",
			"A good friend will help you move, a best friend will help you move a dead body",
			"Trying to understand you is like trying to smell the color 9",
			"Anything that is unrelated to elephants is irrelephant",
			"Most people are only alive because it's illegal to shoot them",
			"If God made everything, then God must be Chinese?",
			"Some people are like Slinky's. Pretty much useless but make you smile when you push them down the stairs. :)",
			"Never argue with an idiot they'll drag you down to their level and beat you through experience"
];

function getMessages() {
	return messages[Math.floor(Math.random() * messages.length)];
}
chrome.browserAction.onClicked.addListener(function() {
    chrome.browserAction.setPopup({
        popup: 'src/options_custom/index.html'
    });
});

var randomMinutes = (function() {
	return Math.floor(Math.random() * 50+1);
})();
//console.log("randomMinutes: " + randomMinutes);

var currenttime;
var targetPID="";
var targetPI2="";
var sp2pageID="";

////////////////////////////////////////
// Alarm
////////////////////////////////////////
//var randomminute = Math.floor(Math.random() * 50+1).toString() ;
var json = JSON.parse(localStorage.getItem("dataSet"));
function createAlarm() {
	
	json = JSON.parse(localStorage.getItem("dataSet"));
	chrome.alarms.clearAll();
	var alarmcounter = 0;

	//will go through all the data array in the json file
	for (i=0;i<json.length;i++){

		var time = moment(json[i].time).valueOf();
		var currentime = moment();
		var timestamp = moment(time).valueOf();
		timestamp = Number(timestamp);

		var checkifbefore = moment(time).isBefore(currentime);

		//checks if the date stored was scheduled before the current local time. If it is, it will schedule the alarm for the next day.
		if (checkifbefore){

			timestamp = moment(timestamp).add(1, 'days').valueOf();
			console.log("randomminute inside if: " + randomMinutes);
			console.log("timestamp after adding a day: " + moment(timestamp).format("dddd, MMMM Do YYYY, h:mm:ss a"));
			//timestamp = moment(timestamp).minute('randomMinutes');
			console.log("timestamp after adding a minutes: " + moment(timestamp).format("dddd, MMMM Do YYYY, h:mm:ss a"));
			json[i].time = moment(timestamp);
			localStorage.setItem('dataSet', JSON.stringify(json));


		};

		// Creates Alarm and assigns a timestamp
		chrome.alarms.create(json[i].uuid, {
			when: timestamp
		});

		alarmcounter++;



	}


	chrome.alarms.getAll(function(alarms){

		if(alarms.length === 1){
			var smashsinplu = "Smashes™";
		}else{
			smashsinplu = "Smashes™";
		}

		chrome.notifications.create('iniappnoti',{
			type:'basic',
			title: alarms.length + " " + smashsinplu +' added to the queue...',
			iconUrl: 'icons/icon128.png',
			message: getMessages(),
			expandedMessage:'Hello thanks for using our app',
			priority:1,
			buttons:[{title:'Options', iconUrl: 'icons/ic_settings_black_18dp.png'}],
			isClickable:true
		},function(id) {
			myNotificationID = id;
		});

		setTimeout(function(){
			chrome.notifications.clear('iniappnoti');
		}, 3000);
		chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
			if (chrome.runtime.openOptionsPage) {
				// New way to open options pages, if supported (Chrome 42+).
				chrome.runtime.openOptionsPage();
			  } else {
				// Reasonable fallback.
				window.open(chrome.runtime.getURL('options.html'));
			  }
		});
	});

}
//End of createAlarm


createAlarm(); // Initializes function on app load

chrome.alarms.onAlarm.addListener(function( alarm ) {

	chrome.notifications.create('inismash',{
			type:'basic',
			title:'Started smashing.',
			iconUrl: 'icons/icon128.png',
			message: getMessages(),
			expandedMessage:'Hello thanks for using our app',
			priority:1,
	},function(id) {
		myNotificationID = id;
	});

	setTimeout(function(){
		chrome.notifications.clear('inismash');
	}, 3000);
	
	var setfornextday = function() {
		console.log("setfornextday ran L:175");
		var json = JSON.parse(localStorage.getItem("dataSet"));
		for (i=0;i<json.length;i++){
			var alarmcounter = 0;
			//goes through all the smashes in localstorage and compares it with the alarm in queue, if one UUID matches with the alarm it grabs all the data
			if (json[i].uuid === alarm.name){ //will stop and grab all data from the array that matches the time
				counter = i;
				//createtab();
				sfndtime = moment(json[i].time);
				//sfndcounter = counter;
				
				var timeclone = sfndtime.clone();
				console.log("randomMinutes: " + randomMinutes);
				timeclone = timeclone.add(1, 'd').minutes(randomMinutes);
				console.log("time clone value: " + moment(timeclone).format("YYYY-MM-DD HH:mm"));
				//time.add(1, 'd');
				//console.log(moment(time).format("YYYY-MM-DD HH:mm"));

				console.log(json[counter].time);
				console.log("counter: " + counter);
				json[counter].time = timeclone.valueOf();
				localStorage.setItem('dataSet', JSON.stringify(json));
				//createtab();
				//setfornextday();
				//listens to the tab recently created by ID and makes sure to add the inject.js
				//including the jquery library every time it changes/updates etc...

				//////////////////////////////////////////////////////////////
				// Places the same smash for the next day once it is executed.
				//////////////////////////////////////////////////////////////

				alarmcounter++;
			}

		}

	}
	
	function checkforsmashandrun() {
		var json = JSON.parse(localStorage.getItem("dataSet"));
			//will go through all the data array in the json file
			

		for (var i = 0; i < json.length; i++) {
			var obj = json[i];
			if (json[i].uuid == alarm.name) {
				console.log("chrome alarm: " + alarm.name);
				console.log("smash uuid inside if: " + json[i].uuid);
				console.log("matches")
				
				var counter = i;
				var currentime = moment();
				var time = json[counter].time;
				var time_hour = moment(time).hour();
				var time_minute = moment(time).minute();
				var time_day = json[counter].day;
				var now = moment();
				var now_hour = moment().hour();
				var now_minute = moment().minute();
				var now_day = moment().day();
				now_day = parseInt(now_day)
					console.log(now_day);
				var result;
				for( var i = 0, len = time_day.length; i < len; i++ ) {
					var timestored = time_day[i][0];
					console.log("Do you see me? "+timestored);
						if( timestored == now_day ) {
							result = time_day[i];
							console.log("Todays day: " + now_day + " = smash stored day" + time_day[i])
							
									if ( time_hour == now_hour && time_minute == now_minute){
							fetch('http://km2.timetrak.com:85/web.exe?sp2application=079950102ClocTrak',{
								method: 'GET',
								credentials: 'include'
							})  
							.then(
									function(response) {
											return response.text();
									}
							)
							.then(function(text) {
								// <!DOCTYPE ....

								console.log("Retrieving hidden values...");
								targetPID = $(text).find("input[name=targetPID]").val();
								targetPI2 = $(text).find("input[name=targetPI2]").val();
								sp2pageID = $(text).find("input[name=sp2pageID]").val();
								console.log("Hidden values Found!");
								
								//var bodyformdata1 = 'targetPID='+targetPID+'&targetPI2='+targetPI2+'&sp2pageID='+sp2pageID+'&'+json[counter].smash+'='+json[counter].smashType+'&sp2focus=FN1&submitdone=done&sp2menu=0&sp2form=CTRAK&sp2control=+';
								
								var bodyformdata1 = json[counter].smash+'='+json[counter].smashType+'&sp2control=+&sp2focus=FN1&sp2form=CTRAK&sp2menu=0&sp2pageID=0&submitdone=done&targetPI2='+targetPI2+'&targetPID='+targetPID;
								
								console.log(bodyformdata1);

											
								fetch('http://km2.timetrak.com:85/web.exe', {
									method: 'POST',
									credentials: 'include',
									headers: {
												'origin': 'http://km2.timetrak.com:85',
												'upgrade-insecure-requests': '1',
												'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
												'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
												'dnt': '1',
												'referer': 'http://km2.timetrak.com:85/web.exe?sp2application=079950102ClocTrak',
												'accept-encoding': 'gzip, deflate',
												'accept-language': 'en-US,es-HN;q=0.8,es;q=0.6,en;q=0.4',
												'content-type': 'application/x-www-form-urlencoded',
												'postman-token': '5d92c137-6460-ad3d-1f3e-0574b07235f8'	
									},
										body: bodyformdata1
								})
								.then(
									function(response) {
										return response.text();
									}
								)
								.then(function(text) {
									//console.log(text);
									
									//var bodyformdata2 = 'MSG4='+json[counter].smashID+'&OK=Ok&sp2control=+&sp2focus=MSG4&sp2form=CTRAK&sp2menu=0&sp2pageID='+sp2pageID+'&submitdone=done&targetPI2='+targetPI2+'&targetPID='+targetPID;
									
									var bodyformdata2 = 'MSG4='+json[counter].smashID+'&OK=Ok&sp2control=+&sp2focus=MSG4&sp2form=CTRAK&sp2menu=0&sp2pageID=1&submitdone=done&targetPI2='+targetPI2+'&targetPID='+targetPID;
									
											
									var formData = new URLSearchParams();
											
									formData.append('MSG4',json[counter].smashID);
									formData.append('OK','OK');
									formData.append('sp2control',' ');
									formData.append('sp2focus','MSG4');
									formData.append('sp2form','CTRAK');
									formData.append('sp2menu','0');
									formData.append('submitdone','done');
									formData.append('targetPI2',targetPI2);
									formData.append('targetPID',targetPID);
											

									console.log(bodyformdata2);				
										
									fetch('http://km2.timetrak.com:85/web.exe', {
										method: 'POST',
										credentials: 'include',
										headers: {
											'origin': 'http://km2.timetrak.com:85',
											'upgrade-insecure-requests': '1',
											'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
											'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
											'dnt': '1',
											'referer': 'http://km2.timetrak.com:85/web.exe?sp2application=079950102ClocTrak',
											'accept-encoding': 'gzip, deflate',
											'accept-language': 'en-US,es-HN;q=0.8,es;q=0.6,en;q=0.4',
											'content-type': 'application/x-www-form-urlencoded',
											'postman-token': '5d92c137-6460-ad3d-1f3e-0574b07235f8'	
										},
										body: formData

									})
									.then(
										function(response) {
											return response.text();
										}
									)
									.then(function(text) {
										//console.log(text);

										//var bodyformdata3 = 'sp2control=+&sp2focus=FN1&sp2form=CTRAK&sp2menu=9000&sp2pageID='+sp2pageID+'&submitdone=done&targetPI2='+targetPI2+'&targetPID='+targetPID;
										
										var bodyformdata3 = 'sp2control=+&sp2focus='+json[counter].smash+'&sp2form=CTRAK&sp2menu=+9000&sp2pageID=2&submitdone=done&targetPI2='+targetPI2+'&targetPID='+targetPID;
								
										fetch('http://km2.timetrak.com:85/web.exe', {
											method: 'POST',
											credentials: 'include',
											headers: {
												'origin': 'http://km2.timetrak.com:85',
												'upgrade-insecure-requests': '1',
												'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
												'content-type': 'application/x-www-form-urlencoded',
												'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
												'dnt': '1',
												'referer': 'http://km2.timetrak.com:85/web.exe',
												'accept-encoding': 'gzip, deflate',
												'accept-language': 'en-US,es-HN;q=0.8,es;q=0.6,en;q=0.4',
												'postman-token': '87064d09-89f8-a2d0-5017-8db9404ec6c8'
											},
											body: bodyformdata3

										})
										.then(
											function(response) {
												return response.text();
											}
										)
										.then(function(text) {
											//console.log(text);

											//var bodyformdata4 = 'sp2control=&sp2focus=&sp2form=&sp2menu=&sp2pageID=&submitdone=&targetPI2=&targetPID=';	
											var bodyformdata4 = 'OK=Ok&sp2control=+&sp2focus='+json[counter].smash+'&sp2form=CTRAK&sp2menu=0&sp2pageID='+sp2pageID+'&submitdone=done&targetPI2='+targetPI2+'&targetPID='+targetPID;;
														
											fetch('http://km2.timetrak.com:85/web.exe', {
												method: 'POST',
												credentials: 'include',
												headers: {
													'origin': 'http://km2.timetrak.com:85',
													'upgrade-insecure-requests': '1',
													'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
													'content-type': 'application/x-www-form-urlencoded',
													'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
													'dnt': '1',
													'referer': 'http://km2.timetrak.com:85/web.exe',
													'accept-encoding': 'gzip, deflate',
													'accept-language': 'en-US,es-HN;q=0.8,es;q=0.6,en;q=0.4',
													'postman-token': '87064d09-89f8-a2d0-5017-8db9404ec6c8'
											},
											body: bodyformdata4

											})
											.then(
												function(response) {
													return response.text();
												}
											)
											.then(function(text) {
												//console.log(text);
												console.log('TT-5 completed');
											})
											.catch(function(err) { 
												console.log('Fetch Error :-S', err);  
																
											})

												
										})
										.catch(function(err) {
											console.log('Fetch Error :-S', err);  
														
										})

										console.log('Everything was completed Successfully');
										setfornextday();
										chrome.runtime.reload();
										
										chrome.notifications.create('endedsmash',{
											type:'basic',
											title:'Finish smashing',
											iconUrl: 'icons/icon128.png',
											message: getMessages(),
											expandedMessage:'Hello thanks for using our app',
											priority:1,
										},function(id) {
											myNotificationID = id;
										});

										setTimeout(function(){
											chrome.notifications.clear('endedsmash');
										}, 3000);										
													
									})
									.catch(function(err) {
										console.log('Fetch Error :-S', err); 

									})
								})
								.catch(function(err) {
									console.log('Fetch Error :-S', err);  
								 });
								console.log('second method completed');
								
							})
							.catch(function(err) {
								console.log('Fetch Error :-S', err);  
							});
							console.log('first method completed');

						}
						
						return false;
					}
				}
				
				//window.time = moment(json[i].time);
				//window.counter = counter;
				//////////////////////////////////////////////////////////////
				// Places the same smash for the next day once it is executed.
				//////////////////////////////////////////////////////////////
				
				
				return false;
			}
			else if (json[i].uuid != alarm.name) {
				console.log("didn't work")
			}
		}	
			
			
		// for (i=0;i<json.length;i++){
			// var alarmcounter = 0;
			// console.log("Number of smash: "+json.length)
			// checks if there are any smash stored ready to be processed.
			// console.log("smashes found, checking if they need to run...")
			// console.log("chrome alarm:" + alarm.name);
			// console.log("smash uuid:" + json[i].uuid);
			// console.log("loop count: "+i)

			// if (json[i].uuid === alarm.name){ //will stop and grab all data from the array that matches the time
				// counter = i;
				// console.log("retreiving smash data...");
				// console.log("chrome alarm:" + alarm.name);
				// console.log("smash uuid inside if:" + json[i].uuid);

				// alarmcounter++;
			// }else{ console.log("Fetch did not run"); setfornextday(); chrome.runtime.reload();}

		// }
	}
	checkforsmashandrun();
	


});


///////////////////////////////////////////////////////////
// Communication section between option_page.js and background.js
///////////////////////////////////////////////////////////
chrome.runtime.onConnect.addListener(function(port) {

	port.onMessage.addListener(function(msg) {
		if (msg.answer == "Remove Alarms")

			clearAlarms();
		else if (msg.answer == "Create Alarms")
			createAlarm();
		else if (msg.answer == "Test")
			testsmash();
	});

	// Clears all alarms in queue
	function clearAlarms() {
		chrome.alarms.clearAll();
		chrome.alarms.clear("alarms");
		chrome.alarms.onAlarm.removeListener("alarms");
		chrome.notifications.create('clearsmashnoti',{
			type:'basic',
			title: 'Smashes™ removed from the queue.',
			iconUrl: 'icons/icon128.png',
			message: getMessages(),
			expandedMessage:'Hello thanks for using our app',
			priority:1,
		},function(id) {
			myNotificationID = id;
		});

		setTimeout(function(){
			chrome.notifications.clear('clearsmashnoti');
		}, 3000);
	}

});
