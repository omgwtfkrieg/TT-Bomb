// Show page action icon in omnibar.
function onWebNav(details) {
    if (details.frameId === 0) {
        // Top-level frame
        chrome.pageAction.show(details.tabId);
    }
}

var currenttime;

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
var json = JSON.parse(localStorage.getItem("realdataSet"));
function createAlarm() {
	json = JSON.parse(localStorage.getItem("realdataSet"));

	chrome.alarms.clearAll();
	var alarmcounter = 0;
	for (i=0;i<json.length;i++){ //will go through all the data array in the json file
		
		//if (json[i].time === currenttime && json[i].status === "no"){ //will stop and grab all data from the array that matches the time
		
			var time = json[i].time;
			var tt = time.split(":");
			console.log(tt[0] + "-" + tt[1]);
			
			var now = new Date();
			var day = now.getDate();
			if (now.getHours() > tt[0] ) {
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

	};
	//getallalarms(); //calls the getallarms() function which shows the current punches in queue
	console.log("Alarms created");
};//End of createAlarm
createAlarm();
			
//Function that shows the current punches in queue
function getallalarms() {
	chrome.alarms.getAll(function(alarms){

		if(alarms.length === 1){var punchsinplu = "Nothing™";
		}else{punchsinplu = "Nothings™"};
		var notification2 = new Notification('Well, fuck!', {
			icon: 'icons/icon48.png',
			body: alarms.length + " " + punchsinplu + " to run.",
		});
		setTimeout(function(){
			notification2.close();
		}, 3000); 

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
							chrome.tabs.executeScript(tab.id, { file: 'src/options_custom/jquery-1.11.1.min.js', runAt : 'document_start' }, function(tab) {

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
	
	function clearalarms() {
		
		var notification5 = new Notification('Finally!', {
			icon: 'icons/icon48.png',
			body: "Nothing™ to run",
		});
						  
		setTimeout(function(){
			notification5.close();
		}, 3000); 
		chrome.alarms.clearAll();
	};
	
	chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse){
		if(request.msg == "createalarm") {createAlarm(); getallalarms();};
        if(request.msg == "reloadalarm") {chrome.alarms.clearAll(); getallalarms();}; //runs the createalarm(); function from open_page.js
		
		if(request.msg == "alarmsqueue"){getallalarms();};
		if(request.msg == "clearalarms"){clearalarms();};
    }
	);