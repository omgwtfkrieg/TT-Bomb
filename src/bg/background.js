//Show page action icon in omnibar if it matches the URL specified
//Checks if dataSet key exists if not it creates it
	if (localStorage.getItem("dataSet") === null) {
		setdataSet = [];
		localStorage.setItem('dataSet', JSON.stringify(setdataSet));
	}

 function checkForValidUrl(tabId, changeInfo, tab) {

//   If  'example.com' is the hostname for the tabs url.
    var a = document.createElement ('a');
    a.href = tab.url;
    if (a.hostname == "http://km2.timetrak.com:85/web.exe") {
//       ... show the page action.
        chrome.pageAction.show(tabId);
//	   alert("timetrak web is opened");
		
    }
 };
//Listen for any changes to the URL of any tab.
// chrome.tabs.onUpdated.addListener(checkForValidUrl);
//For highlighted tab as well
// chrome.tabs.onHighlighted.addListener(checkForValidUrl);
// Check whether new version is installed
// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        console.log("This is a first install!");
		//chrome.runtime.reload();

    }else if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
        //console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
		//chrome.runtime.reload();

    }
});


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

var json = JSON.parse(localStorage.getItem("dataSet"));
function createAlarm() {
	json = JSON.parse(localStorage.getItem("dataSet"));

	chrome.alarms.clearAll();
	var alarmcounter = 0;
	for (i=0;i<json.length;i++){ //will go through all the data array in the json file
			
		//if (json[i].time === currenttime && json[i].status === "no"){ //will stop and grab all data from the array that matches the time
			
		var time = moment(json[i].time);
		console.log("Unix Offset: " + time);
		//console.log("not Serialized " + json[i].time);
		var currentime = moment();
		//var epochtime = moment(time);
		var timestamp = moment(time).valueOf();
		//console.log("current time hour " + epochtime + " : " + currentime);
		
		//Determines if the smash will be schedule for the same day or the day after.
		//if (epochtime < currentime) {
			//timestamp = moment(time).add(1, 'days').valueOf();
			//json[i].time = moment(timestamp).toJSON();
			//localStorage.setItem('dataSet', JSON.stringify(json));
		//}
		
		var checkifbefore = moment(time).isBefore(currentime);
		//var checkifafter = moment(time).isAfter(currentime);
		
		if (checkifbefore){//checks if the date stored was scheduled before the current local time. If it is, it will schedule the alarm for the next day.
			console.log("Yes! the stored date is before the current date.");
			timestamp = moment(timestamp).add(1, 'days');
			json[i].time = moment(timestamp).toJSON();
			console.log ("this is what you get: " + timestamp)
			localStorage.setItem('dataSet', JSON.stringify(json));
		//}//else if (checkifafter){
			//console.log ("this is what you get: " + timestamp)
		}
		console.log("Timestamp for alarm: " + time)
		console.log("Timestamp for UUID: " + json[i].uuid)
		console.log ("this is what you get: " + timestamp)
		// Creates Alarm and assigns a timestamp		
		chrome.alarms.create(json[i].uuid, {
			when: timestamp
		});
		
		alarmcounter++;
				 

		
	}
		chrome.alarms.getAll(function(alarms){

			for(i=0;i<alarms.length;i++){
			console.log("There is/are:  " + alarms.length + " alarms in queue.");
			console.log("Alarm ID:  " + alarms[i].name +" | Alarm Time:  " + alarms[i].scheduledTime);
						
			}
		});

	chrome.alarms.getAll(function(alarms){
			if(alarms.length === 1){var smashsinplu = "Smashes™";
			}else{smashsinplu = "Smashes™";}
			
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
			if (notifId === myNotificationID) {
				if (btnIdx === 0) {
					chrome.tabs.create({url: 'chrome://extensions/?options=' + chrome.runtime.id});
				} else if (btnIdx === 1) {
					//alert("button2");
				}
			}
		});
	});
	
}//End of createAlarm
createAlarm(); // Initializes function on app load
	
function notClicked(notID) {
	console.log("The notification '" + notID + "' was clicked");
}
	
chrome.alarms.onAlarm.addListener(function( alarm ) {
	console.log("Alarm processing now: ", alarm.name);
	
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
				console.log("Success! | Tab ID: " + tab.id + " created.");
				tabID = tab.id;
		});
		chrome.tabs.onUpdated.addListener(function(tabID, info, tab) {
				chrome.tabs.executeScript(tab.id, { file: 'src/options_custom/jquery-1.11.1.min.js', runAt : 'document_start' }, function(tab) {
					chrome.tabs.executeScript(tabID, { 
						file : 'src/inject/inject.js',
						runAt : 'document_start'
					});

				});
			});
							
							
			//Lets send the smash data from the matching array to the inject.js script
			chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
				if (request.method == 'getsmashdata') {
					var objectsmashIDString = json[counter].smashID;
					var objectsmashString = json[counter].smash;
					var objectstatusString = json[counter].status;							
					sendResponse({data1: objectsmashIDString, data2: objectsmashString, data3: objectstatusString});
				} else {
					sendResponse({}); // snub them.
				}
			});
			
			chrome.runtime.onConnect.addListener(function(port) {
			//console.assert(port.name == "injectconnection");
				port.onMessage.addListener(function(msg) {
					if (msg.pagestate == "PageReady"){
						port.postMessage({dothis: "Selecting type of smash"});
						console.log( "Success! | Smash Type selected" );
					}else if (msg.didthis == "Smash Accepted"){
						console.log( "Success! | Smashed Accepted" );
						//chrome.tabs.remove(tabID);
					}else if (msg.didthis == "Close Tab - Session Terminated"){
						console.error( "Tab closed | Session Terminated" );
						chrome.tabs.remove(tabID);
					}else if (msg.didthis == "Close Tab - HAVE A NICE DAY"){
						console.log( "Success! | Smash completed: HAVE A NICE DAY" );
						chrome.tabs.remove(tabID);
					}
					else if (msg.didthis == "Close Tab - Cancelled"){
						console.error( "Tab closed | Cancelled" );
						chrome.tabs.remove(tabID);
					}
				});
			});	
					
  }
					
	for (i=0;i<json.length;i++){ //will go through all the data array in the json file
		var alarmcounter = 0;
		//goes through all the smashes in localstorage and compares it with the alarm in queue, if one UUID matches with the alarm it grabs all the data
		if (json[i].uuid === alarm.name){ //will stop and grab all data from the array that matches the time

			console.log("Found Smash UUID: " + json[i].uuid + " time: " + json[i].time + " that matched scheduled alarm: " + alarm.name);
			counter = i;

			createtab();
							
			//listens to the tab recently created by ID and makes sure to add the inject.js
			//including the jquery library every time it changes/updates etc...
							
									
			//////////////////////////////////////////////////////////////
			// Places the same smash for the next day once it is executed.
			//////////////////////////////////////////////////////////////
		/* 	var currentime = moment();
			var checkifbefore = moment(json[i].time).isSame(currentime);
			if (!checkifbefore){//checks if the date stored was scheduled before the current local time. If it is, it will schedule the alarm for the next day.
				console.log("Yes! the stored date is before the current date."); */

				
			var time = moment(json[i].time).toJSON();
			time = moment(time).add(1, 'days');
			json[i].time = moment(time).toJSON();
			localStorage.setItem('dataSet', JSON.stringify(json));
			//}
			/////////////////////////////////////
			
			alarmcounter++;
									
		}

	}

});
	

/////////////////////////////////////////////////////////////	
/////////////////////////////////////////////////////////////	
////Manual smash execution to test injects
/////////////////////////////////////////////////////////////	
/////////////////////////////////////////////////////////////	
	var uuidvalue = '0e62-1ae7-bd37-5f08-397e';
	function testsmash() {
		for (i=0;i<json.length;i++){ //will go through all the data array in the json file
		//goes through all the smashes in localstorage and compares it with the alarm in queue, if one UUID matches with the alarm it grabs all the data
		if (json[i].uuid === uuidvalue){ //will stop and grab all data from the array that matches the time

			//console.log("Found Smash UUID: " + json[i].uuid + " time: " + json[i].time + " that matched alarm: " + alarm.name);
			counter = i;

			chrome.tabs.create({'url': "http://km2.timetrak.com:85/web.exe?sp2application=079950102ClocTrak", active: false, selected: false,  }, function(tab){ 
				console.log(tab.id);
				tabID = tab.id;
			});
							
			//listens to the tab recently created by ID and makes sure to add the inject.js
			//including the jquery library every time it changes/updates etc...
			chrome.tabs.onUpdated.addListener(function(tabID, info, tab) {
				chrome.tabs.executeScript(tab.id, { file: 'src/options_custom/jquery-1.11.1.min.js', runAt : 'document_start' }, function(tab) {
					chrome.tabs.executeScript(tabID, { 
						file : 'src/inject/inject.js',
						runAt : 'document_start'
					});

				});
			});
							
							
			//Lets send the smash data from the matching array to the inject.js script
			chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
				if (request.method == 'getsmashdata') {
					var objectsmashIDString = json[counter].smashID;
					var objectsmashString = json[counter].smash;
					var objectstatusString = json[counter].status;							
					sendResponse({data1: objectsmashIDString, data2: objectsmashString, data3: objectstatusString});
				} else {
					sendResponse({}); // snub them.
				}
			});
			
			chrome.runtime.onConnect.addListener(function(port) {
				//console.assert(port.name == "injectconnection");
				port.onMessage.addListener(function(msg) {
					if (msg.pagestate == "PageReady"){
						port.postMessage({dothis: "Selecting type of smash"});
						console.log( "Success! | Smash Type selected" );
					}else if (msg.didthis == "Smash Accepted"){
						console.log( "Success! | Smashed Accepted" );
						//chrome.tabs.remove(tabID);
					}else if (msg.didthis == "Close Tab - Session Terminated"){
						console.log( "Tab closed | Session Terminated" );
						chrome.tabs.remove(tabID);
					}else if (msg.didthis == "Close Tab - HAVE A NICE DAY"){
						console.log( "Success! | Smash completed: HAVE A NICE DAY" );
						chrome.tabs.remove(tabID);
					}else if (msg.didthis == "Close Tab - Cancelled"){
						console.log( "Tab closed | Cancelled" );
						chrome.tabs.remove(tabID);
					}else if (msg.didthis == "Close Tab - Invalid Badge ID"){
						console.log( "Tab closed | Invalid Badge ID" );
						chrome.tabs.remove(tabID);
					}
				});
			});				
							////////////////////////////////
			// chrome.runtime.onConnect.addListener(function(port) {
			  // console.assert(port.name == "knockknock");
			  // port.onMessage.addListener(function(msg) {
				// if (msg.joke == "Knock knock")
				  // port.postMessage({question: "Who's there?"});
				// else if (msg.answer == "Madame")
				  // port.postMessage({question: "Madame who?"});
				// else if (msg.answer == "Madame... Bovary")
				  // port.postMessage({question: "I don't get it."});
					// console.log("Connection works");
			  // });
			// });							
			// chrome.runtime.onConnect.addListener(function(port) {
				// console.assert(port.name == "injectscript");
				// port.onMessage.addListener(function(msg) {
					// if (msg.pagestate == "PageReady"){
						// port.postMessage({dothis: "Selecting type of smash"});
						// console.log( "Timetrak Tab loaded" );
					// }else if (msg.didthis == "smash Type selected"){
						// port.postMessage({dothis: "Enter Badge ID"});
						// console.log( "smash Type entered" );
					 // }//else if (msg.didthis == "Badge ID entered"){
						// port.postMessage({dothis: "Submit Badge"});
						// console.log( "Badge ID entered" );
					// }else if (msg.didthis == "Click submitted"){
						// console.log( "Click submitted" );
						// port.postMessage({dothis: "Was the smash accepted?" });
					// }else if (msg.didthis == "Accepted was found"){
						// var smashstatus = json[counter].status;
						// json[counter].status = "yes";
						// localStorage.setItem('dataSet', JSON.stringify(json));
						// console.log(smashstatus);

													//setTimeout( function(){
						// console.log("smash Accepted closing tab");
														
						//chrome.tabs.remove(tab.id);									
													//}, 1000); // delay 5000 ms
													
					// }else if (msg.didthis == "smash already ran"){
													//setTimeout( function(){
						// console.log("closing tab");
														
						// chrome.tabs.remove(tab.id);
													//}, 7000); // delay 5000 ms
					// }else if (msg.didthis == "Close Tab"){
						// console.log( "Closing Tab" );
						// chrome.tabs.remove(tabID);

					// }
				// });
			// });
									
									
							////////////////////////////////
							// Places the same smash for the next day once it is executed.
							///////////////////////////////
			// var time = json[i].time;
			// var tt = time.split(":");
							//console.log(tt[0] + "-" + tt[1]);
							
			// var now = new Date();
			// var day = now.getDate();
			// day += 1;
							
							//'+' casts the date to a number, like [object Date].getTime();
			// var timestamp = +new Date(now.getFullYear(), now.getMonth(), day, tt[0], tt[1], 0, 0);
			// chrome.alarms.create(json[i].uuid, {
				// when: timestamp
			// });
			// alarmcounter++;
							
							//////////////////////////////////
							
			}//
						//console.log("Nothing to smash");

		}

	}
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////	
///////////////////////////////////////////////////////////


	
///////////////////////////////////////////////////////////
// Communication section between option_page.js and background.js
///////////////////////////////////////////////////////////
chrome.runtime.onConnect.addListener(function(port) {
//console.assert(port.name == "knockknock");
	port.onMessage.addListener(function(msg) {
		if (msg.answer == "Remove Alarms")
			//port.postMessage({question: "Madame who?"});
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






// chrome.runtime.onMessage.addListener(
  // function(request, sender, sendResponse) {
    // if (request.msg == "createalarm"){
		// getallalarms();
		//sendResponse({farewell: "createalarm"});
	// };
  // });

///////////////////////////////////////////////////////////
// Communication section between background.js and content script inject.js
///////////////////////////////////////////////////////////

//Ready to listen for inject.js for any request
//chrome.runtime.onConnect.addListener(function(port2) {
	//console.assert(port2.name == "tofrominjectscript");
	//port2.onMessage.addListener(function(msg) {
	//	if (msg.pagestate == "PageReady"){
			// port.postMessage({dothis: "Selecting type of smash"});
			// console.log( "Timetrak Tab loaded" );
		// }else if (msg.didthis == "smash Type selected"){
			// port.postMessage({dothis: "Enter Badge ID"});
			// console.log( "smash Type entered" );
		// }else if (msg.didthis == "Badge ID entered"){
			// port.postMessage({dothis: "Submit Badge"});
			// console.log( "Badge ID entered" );
		// }else if (msg.didthis == "Click submitted"){
			// console.log( "Click submitted" );
			// port.postMessage({dothis: "Was the smash accepted?" });
		// }else if (msg.didthis == "Accepted was found"){
			// var smashstatus = json[counter].status;
			// json[counter].status = "yes";
			// localStorage.setItem('dataSet', JSON.stringify(json));
			// console.log(smashstatus);
			//setTimeout( function(){
			// console.log("smash Accepted closing tab");
			// chrome.tabs.remove(tab.id);									
			//}, 1000); // delay 5000 ms

	//	}else if (msg.didthis == "smash already ran"){
			//setTimeout( function(){
		//	console.log("closing tab");
																	
		//	chrome.tabs.remove(tab.id);
		//}, 7000); // delay 5000 ms
		// }else if (msg.didthis == "Close Tab"){
			// console.log( "Closing Tab" );
			// chrome.tabs.remove(tabID);
		// }
	// });
// });
///////////////////////////////////////////