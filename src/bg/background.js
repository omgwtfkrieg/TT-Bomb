// Show page action icon in omnibar.
function onWebNav(details) {
    if (details.frameId === 0) {
        // Top-level frame
        chrome.pageAction.show(details.tabId);
    }
}
/* var filter = {
    url: [{
        hostEquals: 'http://km2.timetrak.com:85/'
    }]
}; */

//var IntID = setInterval(function () {

    //getcurrenttime();
	//checkitemdate();

/*     if (date.getDate() === 12 && date.getHours() === 10 && date.getMinutes === 0) {
        alert("Surprise!!")
    }    if (date.getDate() === 12 && date.getHours() === 10 && date.getMinutes === 0) {
        alert("Surprise!!")
    } */
//}, 1000)
//var refreshId = setInterval(function(){
var currenttime;
var json = JSON.parse(localStorage.getItem("realdataSet"));

/////////////////////////////////////////
// Notifications
function notifyMe() {
  if (!Notification) {
    alert('Notifications are supported in modern versions of Chrome, Firefox, Opera and Firefox.'); 
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();

  var notification = new Notification('Hey asshole!', {
    icon: 'icons/icon48.png',
    body: "π-Bomb was loaded.",
  });
	setTimeout(function(){
		notification.close();
	}, 3000); 
  // notification.onclick = function () {
    // window.open("http://stackoverflow.com/a/13328397/1269037");      
  // };
}
/////////////////////////////////////////
notifyMe();//runs the notifyMe function and shows notification to display when the extension is loaded then it closes after 2 seconds


////////////////////////////////////////
// Alarm
////////////////////////////////////////

function createAlarm() {
	var alarmcounter = 0;
	for (i=0;i<json.length;i++){ //will go through all the data array in the json file
		
		//if (json[i].time === currenttime && json[i].status === "no"){ //will stop and grab all data from the array that matches the time
		
			var time = json[i].time;
			var tt = time.split(":");
			//console.log(tt[0] + "-" + tt[1]);
			
			var now = new Date();
			var day = now.getDate();
			if (now.getHours() >= tt[0] && now.getMinutes >= tt[1]) {
				// If the punch already passed sets to try next day
				day += 1;
			}
			// '+' casts the date to a number, like [object Date].getTime();
			var timestamp = +new Date(now.getFullYear(), now.getMonth(), day, tt[0], tt[1], 0, 0);
			//                        YYYY               MM              DD    HH     MM   SS MS
			//console.log("We found something to punch");
			//console.log(timestamp);
			//counter = i;
			    // Create Alarm
			
			 chrome.alarms.create(json[i].uuid, {
				when: timestamp
			 });
			 alarmcounter++;
			 
			////////////////////////////////////////////////////////
			// Generate rudimentary unique ID.
			////////////////////////////////////////////////////////
			// var guid = (function() {
			  // function s4() {
				// return Math.floor((1 + Math.random()) * 0x10000)
						   // .toString(16)
						   // .substring(1);
			  // }
			  // return function() {
				// return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
					   // s4() + '-' + s4() + s4() + s4();
			  // };
			// })();
			// var uuid = guid();
			//console.log(uuid)
			////////////////////////////////////////////////////////
		
			// chrome.alarms.create(uuid, {delayInMinutes: 1, periodInMinutes: 1}); //test alarm that uses the UUID function above: works!
			// alarmcounter++;
			// console.log(i);
		//};

	};
	//getallalarms(); //calls the getallarms() function which shows the current punches in queue
}//End of createAlarm
createAlarm();

			 // chrome.alarms.getAll(function(alarms){
			  // for(i=0;i<alarms.length;i++){
			   // console.log("Scheduled Time  "+alarms[0].scheduledTime);
			   // console.log("Alarm Name "+alarms[0].name);
			  // }
			 // });
			 //var alarmLogger = function(alarm){ console.log(alarm.name + " " + alarm.scheduledTime) };
			 //chrome.alarms.getAll(function(alarms){ alarms.forEach(alarmLogger); });
			//chrome.alarms.clear("Punch-1");
			//chrome.alarms.clearAll();
			//chrome.runtime.onStartup.addListener(function () {
			//Checks the total amount of punches in queue.
			
			//Function that shows the current punches in queue
			function getallalarms() {
				chrome.alarms.getAll(function(alarms){
					//if(alarms.length){
						//do whatever the alarm was supposed to do.
						if(alarms.length === 1){var punchsinplu = "Nothing™";
						}else{punchsinplu = "Nothings™"};
						  var notification2 = new Notification('Well, fuck!', {
							icon: 'icons/icon48.png',
							body: alarms.length + " " + punchsinplu + " to run.",
						  });
						  
							setTimeout(function(){
								notification2.close();
							}, 3000); 
					//}
				});
			};	
				chrome.alarms.onAlarm.addListener(function( alarm ) {
					console.log("Alarm was found and executed, it punched.!", alarm);
				  
					var notification3 = new Notification('I dont even get paid to do your shit.', {
						icon: 'icons/icon48.png',
						body: 'Running your nothingness...',
					});
					setTimeout(function(){
						notification3.close();
					}, 3000); 
					console.log(alarm.name);
					//checkitemdate();
					///////////////////////////////////////////////////////////
					///////////////////////////////////////////////////////////
					for (i=0;i<json.length;i++){ //will go through all the data array in the json file
		
						if (json[i].uuid === alarm.name){ //will stop and grab all data from the array that matches the time

							console.log("We found something to punch");
							counter = i;

							chrome.tabs.create({'url': "http://km2.timetrak.com:85/web.exe?sp2application=079950102ClocTrak", active: false, selected: false,  }, function(tab){ 
										console.log(tab.id);
										tabID = tab.id;
							});
							
							//listens to the tab recently created by ID and makes sure to add the inject.js
							//including the jquery library every time it changes/updates etc...
							chrome.tabs.onUpdated.addListener(function(tabID, info, tab) {
							chrome.tabs.executeScript(tab.id, { file: 'js/jquery/jquery.min.js', runAt : 'document_start' }, function(tab) {

								chrome.tabs.executeScript(tabID, { 
									file : 'src/inject/inject.js',
									runAt : 'document_start' });

								});
							});
							
							
							//Lets send the punch data from the matching array to the inject.js script
							chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
								if (request.method == 'getpunchdata') {
									var objectbadgeString = json[counter].badgeID;
									var objectpunchString = json[counter].punch;
									var objectstatusString = json[counter].status;
										
									sendResponse({data1: objectbadgeString, data2: objectpunchString, data3: objectstatusString});
								} else {
									sendResponse({}); // snub them.
								}
							});
							
							////////////////////////////////
										
										chrome.runtime.onConnect.addListener(function(port) {
											console.assert(port.name == "injectscript");
											port.onMessage.addListener(function(msg) {
												if (msg.pagestate == "PageReady"){
													port.postMessage({dothis: "Selecting type of Punch"});
													console.log( "Timetrak Tab loaded" );
												}else if (msg.didthis == "Punch Type selected"){
													port.postMessage({dothis: "Enter Badge ID"});
													console.log( "Punch Type entered" );
												}else if (msg.didthis == "Badge ID entered"){
													port.postMessage({dothis: "Submit Badge"});
													console.log( "Badge ID entered" );
												}else if (msg.didthis == "Click submitted"){
													console.log( "Click submitted" );
													port.postMessage({dothis: "Was the punch accepted?" });
												}else if (msg.didthis == "Accepted was found"){
													var punchstatus = json[counter].status;
													json[counter].status = "yes";
													localStorage.setItem('realdataSet', JSON.stringify(json));
													console.log(punchstatus);

													//setTimeout( function(){
														console.log("Punch Accepted closing tab");
														
														chrome.tabs.remove(tab.id);									
													//}, 1000); // delay 5000 ms
													
												}else if (msg.didthis == "punch already ran"){
													//setTimeout( function(){
														console.log("closing tab");
														
														chrome.tabs.remove(tab.id);
													//}, 7000); // delay 5000 ms
												}else if (msg.didthis == "Close Tab"){
													console.log( "Closing Tab" );
													chrome.tabs.remove(tabID);

												}
											});
										});
									
									
							////////////////////////////////
							// Places the same punch for the next day once it is executed.
							///////////////////////////////
							var time = json[i].time;
							var tt = time.split(":");
							//console.log(tt[0] + "-" + tt[1]);
							
							var now = new Date();
							var day = now.getDate();
							day += 1;
							
							// '+' casts the date to a number, like [object Date].getTime();
							var timestamp = +new Date(now.getFullYear(), now.getMonth(), day, tt[0], tt[1], 0, 0);
							chrome.alarms.create(json[i].uuid, {
								when: timestamp
							});
							alarmcounter++;
							
							//////////////////////////////////
							
						};//
						//console.log("Nothing to punch");

					};
					///////////////////////////////////////////////////////////
					///////////////////////////////////////////////////////////
					//chrome.alarms.clearAll();
				});
				
			//});
			
	chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse){
        if(request.msg == "reloadalarm") {createAlarm();getallalarms();}; //runs the createalarm(); function from open_page.js
		
		if(request.msg == "alarmsqueue"){getallalarms();};
		//if(request.msg == "alarmsqueue"){getallalarms();};
    }
	);
			
/* chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    id: 'main',
    bounds: { width: 620, height: 500 }
  });
});
chrome.alarms.onAlarm.addListener(function( alarm ) {
  console.log("Got an alarm!", alarm);
});

// Listen
chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === '3AMyet') {
        // Whatever you want
    }
});
createAlarm(); */
////////////////////////////////////////

//checkitemdate();
// function getcurrenttime(){
	
	// var now    = new Date();
	// var hours   = now.getHours();
	// var minutes = now.getMinutes();
	// var amPm = "AM";
	// if (hours   > 11) {amPm = "PM";}
	// if (hours  > 12) {hours = hours - 12;}
	// if (hours  == 0) {hours = 12;}
	// if (hours  < 10) {hours = "0" + hours;}
	// if (minutes < 10) {minutes = "0" + minutes;}

	// currenttime = hours + ':' + minutes;
	// console.log(currenttime);
	
// };

// function checkitemdate(){

// getcurrenttime();//Runs function to check the current time.



	//for (i=0;i<json.length;i++){ //will go through all the data array in the json file
		
		//if (json[i].time === currenttime && json[i].status === "no"){ //will stop and grab all data from the array that matches the time

		//	console.log("We found something to punch");
	//		counter = i;

		//	chrome.tabs.create({'url': "http://km2.timetrak.com:85/web.exe?sp2application=079950102ClocTrak", active: false, selected: false,  }, function(tab){ 
		//				console.log(tab.id);
		//				tabID = tab.id;
		//	});
			
			//listens to the tab recently created by ID and makes sure to add the inject.js
			//including the jquery library every time it changes/updates etc...
		//	chrome.tabs.onUpdated.addListener(function(tabID, info, tab) {
		//	chrome.tabs.executeScript(tab.id, { file: 'js/jquery/jquery.min.js', runAt : 'document_start' }, function(tab) {

			//	chrome.tabs.executeScript(tabID, { 
			//		file : 'src/inject/inject.js',
			//		runAt : 'document_start' });

			//	});
			//});
			
			
			//Lets send the punch data from the matching array to the inject.js script
			//chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
			//	if (request.method == 'getpunchdata') {
			//		var objectbadgeString = json[counter].badgeID;
			//		var objectpunchString = json[counter].punch;
			//		var objectstatusString = json[counter].status;
						
			//		sendResponse({data1: objectbadgeString, data2: objectpunchString, data3: objectstatusString});
			//	} else {
			//		sendResponse({}); // snub them.
			//	}
			//});
			
			////////////////////////////////
						
			//			chrome.runtime.onConnect.addListener(function(port) {
			//				console.assert(port.name == "injectscript");
			//				port.onMessage.addListener(function(msg) {
			//					if (msg.pagestate == "PageReady"){
			//						port.postMessage({dothis: "Selecting type of Punch"});
			//						console.log( "Timetrak Tab loaded" );
			//					}else if (msg.didthis == "Punch Type selected"){
			//						port.postMessage({dothis: "Enter Badge ID"});
			//						console.log( "Punch Type entered" );
			//					}else if (msg.didthis == "Badge ID entered"){
			//						port.postMessage({dothis: "Submit Badge"});
			//						console.log( "Badge ID entered" );
			//					}else if (msg.didthis == "Click submitted"){
			//						console.log( "Click submitted" );
			//						port.postMessage({dothis: "Was the punch accepted?" });
			//					}else if (msg.didthis == "Accepted was found"){
			//						var punchstatus = json[counter].status;
			//						json[counter].status = "yes";
			//						localStorage.setItem('realdataSet', JSON.stringify(json));
			//						console.log(punchstatus);

									//setTimeout( function(){
			//							console.log("Punch Accepted closing tab");
										
			//							chrome.tabs.remove(tab.id);									
									//}, 1000); // delay 5000 ms
									
			//					}else if (msg.didthis == "punch already ran"){
									//setTimeout( function(){
			//							console.log("closing tab");
										
			//							chrome.tabs.remove(tab.id);
									//}, 7000); // delay 5000 ms
			//					}else if (msg.didthis == "Close Tab"){
			//						console.log( "Closing Tab" );
			//						chrome.tabs.remove(tabID);

			//					}
			//				});
			//			});
					
					
			////////////////////////////////
			

		//};//
		//console.log("Nothing to punch");

	//};

//};
//};
// chrome.runtime.onStartup.addListener(function () {
    // window.alarm_suffix = Date.now();
// });
// chrome.alarms.create('myAlarm' + window.alarm_suffix, {
    // delayInMinutes : 1.0
// });
// chrome.alarms.onAlarm.addListener(function(alarm) {
    // var parsedName = alarm.name.match(/^([\S\s]*?)(\d+)$/);
    // if (parsedName) {
        // alarm.name = parsedName[0];
        // alarm.suffix = +parsedName[1];
    // }
    // if (alarm.name == 'myAlarm') {
        // if (alarm.suffix === window.alarm_suffix) {
            // doSomething();
        // }
    // }
// });


	//will loop, search in localStorage and execute if stored time matches current time.  
	//var currenttime = hours + ":" + minutes + " " + amPm;
	//console.log(currenttime);

//}, 10000);