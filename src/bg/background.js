//Show page action icon in omnibar if it matches the URL specified
//Checks if dataSet key exists if not it creates it
	if (localStorage.getItem("dataSet") === null) {
		setdataSet = [];
		localStorage.setItem('dataSet', JSON.stringify(setdataSet));
	}

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
			

var currenttime;

////////////////////////////////////////
// Alarm
////////////////////////////////////////
var random = Math.floor(Math.random() * 10+1) ;
var json = JSON.parse(localStorage.getItem("dataSet"));
function createAlarm() {
	json = JSON.parse(localStorage.getItem("dataSet"));

	chrome.alarms.clearAll();
	var alarmcounter = 0;
	
	//will go through all the data array in the json file
	for (i=0;i<json.length;i++){
			
		
		var time = moment(json[i].time);
		var currentime = moment();
		var timestamp = moment(time).valueOf();	
		timestamp = Number(timestamp);
		
		var checkifbefore = moment(time).isBefore(currentime);
		
		console.log("raw time: " + time);
		console.log("timestamp: " + timestamp);
		//console.log("time + random: " + randomtimestamp);
		
		
		//checks if the date stored was scheduled before the current local time. If it is, it will schedule the alarm for the next day.
		if (checkifbefore){
			timestamp = moment(timestamp).add(1, 'days').minute(random).valueOf();
			json[i].time = moment(timestamp);
			localStorage.setItem('dataSet', JSON.stringify(json));
		}
		
		//Generates random number from 1-10
		
		console.log("random number: " + random);
		
		//converts object to string
		//timestamp = parseInt(timestamp);
		console.log("timestamp: " + timestamp);
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
			title:'Running a scheduled smash.',
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
	

  function createtab() {
    chrome.tabs.create({'url': "http://km2.timetrak.com:85/web.exe?sp2application=079950102ClocTrak", active: false, selected: false,  }, function(tab){ 
				tabID = tab.id;
		});
		/* chrome.tabs.onUpdated.addListener(function(tabID, info, tab) {
				chrome.tabs.executeScript(tab.id, { file: 'src/options_custom/jquery-1.11.1.min.js', runAt : 'document_start' }, function(tab) {
					chrome.tabs.executeScript(tabID, { 
						file : 'src/inject/inject.js',
						runAt : 'document_start'
					});

				});
			}); */
							
							
			//Lets send the smash data from the matching array to the inject.js script
			chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
				if (request.method == 'getsmashdata') {
					var objectsmashIDString = json[counter].smashID;
					var objectsmashString = json[counter].smash;
					var objectstatusString = json[counter].status;
					var objecttimeString = json[counter].time;					
					sendResponse({data1: objectsmashIDString, data2: objectsmashString, data3: objectstatusString, data4: objecttimeString});
				} else {
					sendResponse({}); // snub them.
				}
			});
			
			chrome.runtime.onConnect.addListener(function(port) {
				port.onMessage.addListener(function(msg) {
					if (msg.pagestate == "PageReady"){
						port.postMessage({dothis: "Selecting type of smash"});
					}else if (msg.didthis == "Smash Accepted"){
					}else if (msg.didthis == "Close Tab - Session Terminated"){
						chrome.tabs.remove(tabID);
					}else if (msg.didthis == "Close Tab - HAVE A NICE DAY"){
						chrome.tabs.remove(tabID);
					}
					else if (msg.didthis == "Close Tab - Cancelled"){
						chrome.tabs.remove(tabID);
					}
				});
			});	
					
  }
	//will go through all the data array in the json file				
	for (i=0;i<json.length;i++){ 
		var alarmcounter = 0;
		//goes through all the smashes in localstorage and compares it with the alarm in queue, if one UUID matches with the alarm it grabs all the data
		if (json[i].uuid === alarm.name){ //will stop and grab all data from the array that matches the time
			counter = i;
			createtab();
							
			//listens to the tab recently created by ID and makes sure to add the inject.js
			//including the jquery library every time it changes/updates etc...
															
			//////////////////////////////////////////////////////////////
			// Places the same smash for the next day once it is executed.
			//////////////////////////////////////////////////////////////
				
			var time = moment(json[i].time).toJSON();
			time = moment(time).add(1, 'days').valueOf();
			json[i].time = moment(time).valueOf();
			localStorage.setItem('dataSet', JSON.stringify(json));
			
			alarmcounter++;
									
		}

	}

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