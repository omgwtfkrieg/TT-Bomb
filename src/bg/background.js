//Show page action icon in omnibar if it matches the URL specified
// function checkForValidUrl(tabId, changeInfo, tab) {

//   If  'example.com' is the hostname for the tabs url.
   // var a = document.createElement ('a');
   // a.href = tab.url;
   // if (a.hostname == "http://km2.timetrak.com:85/web.exe") {
//       ... show the page action.
       // chrome.pageAction.show(tabId);
//	   alert("timetrak web is opened");
		
   // }
// };
//Listen for any changes to the URL of any tab.
// chrome.tabs.onUpdated.addListener(checkForValidUrl);
//For highlighted tab as well
// chrome.tabs.onHighlighted.addListener(checkForValidUrl);


function getQuote() {
	
	function randomFrom(arr){
    var randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

         var quotes = new Array("I pity the FOOL!", 
         "I aint gettin on no plane!", 
         "Quit yo Jibba Jabba!", 
         "Shut up, fool!", 
         "Life's tough, but I'm tougher!", 
         "Do some prep!",
         "I'm on a real short leash here", 
         "Don't make me mad, Arrr!", 
         "You're gonna meet my friend, PAIN!",
         "You aint hurt, you pathetic!");

         var randomChoice = Math.floor(Math.random()* quotes.length)         

        // return randomChoice;

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

  var notification = new Notification(getQuote(), {
    icon: 'icons/icon48.png',
    body: "π-Bomb was loaded.",
  });
	setTimeout(function(){
		notification.close();
	}, 3000); 
  // notification.onclick = function () {
    // window.open("http://stackoverflow.com/a/13328397/1269037");      
  // };
};
/////////////////////////////////////////
notifyMe();//runs the notifyMe function and shows notification to display when the extension is loaded then it closes after 2 seconds


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
		//getallalarms(); //calls the getallarms() function which shows the current smashes in queue
		console.log("Alarms created");
		//getallalarms();
		var notification3 = new Notification(getQuote, {
			icon: 'icons/icon48.png',
			body: 'Added smashes to the queue...',
		});
		setTimeout(function(){
			notification3.close();
		}, 3000); 
					//console.log(alarm.name);
	};//End of createAlarm
	createAlarm(); // Initializes function on app load

	
				chrome.alarms.onAlarm.addListener(function( alarm ) {
					console.log("Alarm was found and executed, it punched.!", alarm);
				  
					var notification3 = new Notification(getQuote, {
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
	
	// chrome.extension.onRequest.addListener(
		// function(request, sender, sendResponse){
		// }else if(request.msg == "createalarm") {
			// createAlarm(); getallalarms();
		// }else if(request.msg == "reloadalarm") {
			// chrome.alarms.clearAll();
			// getallalarms(); //runs the createalarm(); function from open_page.js
			
		// }else if(request.msg == "alarmsqueue"){
			// getallalarms();
		// }else if(request.msg == "clearAlarms"){
			// clearAlarms();
		// }
	// );
	
///////////////////////////////////////////////////////////
// Communication section between option_page.js and background.js
///////////////////////////////////////////////////////////
chrome.runtime.onConnect.addListener(function(port) {
console.assert(port.name == "knockknock");
	port.onMessage.addListener(function(msg) {
		if (msg.joke == "Knock knock"){
			
			getallalarms();
			//port.postMessage({question: "Who's there?"});
		}
		else if (msg.answer == "Remove Alarms")
			//port.postMessage({question: "Madame who?"});
			clearAlarms();
		else if (msg.answer == "Create Alarms")
			createAlarm();
	});
  
	//Function that shows the current smashes in queue
	function getallalarms() {
		chrome.alarms.getAll(function(alarms){
			if(alarms.length === 1){var punchsinplu = "Nothing™";
			}else{punchsinplu = "Nothings™"};
			var notification2 = new Notification(getQuote, {
				icon: 'icons/icon48.png',
				body: alarms.length + " " + punchsinplu + " to run.",
			});
			
			setTimeout(function(){
				notification2.close();	
			}, 3000); 
		});
		
		setTimeout(function(){
			//chrome.runtime.sendMessage({ elementaction: "btnstopspinning" });
			port.postMessage({question: "Who's there?"});
		}, 3000); 
		
	};
	
	// Clears all alarms in queue
	function clearAlarms() {
		
		var notification5 = new Notification(getQuote, {
			icon: 'icons/icon48.png',
			body: "Nothing™ to run",
		});
						  
		setTimeout(function(){
			notification5.close();
		}, 3000); 
		chrome.alarms.clearAll();
		getallalarms();
	};
	
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
chrome.runtime.onConnect.addListener(function(port2) {
	//console.assert(port2.name == "tofrominjectscript");
	port2.onMessage.addListener(function(msg) {
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
			localStorage.setItem('dataSet', JSON.stringify(json));
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
///////////////////////////////////////////