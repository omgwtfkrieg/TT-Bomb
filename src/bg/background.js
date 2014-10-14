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

//var refreshId = setInterval(function(){
	console.log( "bg.js ready!" );
	

	var now    = new Date();
	var hours   = now.getHours();
	var minutes = now.getMinutes();
	var amPm = "AM";
	if (hours   > 11) {amPm = "PM";}
	if (hours  > 12) {hours = hours - 12;}
	if (hours  == 0) {hours = 12;}
	//if (hours  < 10) {hours = "0" + hours;}
	if (minutes < 10) {minutes = "0" + minutes;}

	var currenttime = hours + ':' + minutes + " " + amPm;
	console.log(currenttime);
	
	
	//will loop, search in localStorage and execute if stored time matches current time.  
	//var currenttime = hours + ":" + minutes + " " + amPm;
	//console.log(currenttime);
    var json = JSON.parse(localStorage.getItem("realdataSet"));
	for (i=0;i<json.length;i++){
		if (json[i].time == currenttime){
			console.log("Something was found to punch.")
			//console.log(json[i].badgeID + "--" + json[i].punchType +"--"+ json[i].punch +"--"+ json[i].time);
			chrome.tabs.query({currentWindow: true, active: false}, function(tab) {
				
				chrome.tabs.create({'url': "km2.timetrak.com:85/web.exe?sp2application=079950102ClocTrak", active: false, selected: false,  }, function(tab){ 
					console.log(tab.id);
					/* chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
						if (request.method == 'getLocalStorage') {
						var objectString = JSON.stringify(localStorage.realdataSet);
						sendResponse({data: objectString});
						chrome.extension.sendMessage({method: "startinject"}, function(response){});
						} else {
						sendResponse({}); // snub them.
						}
						if (request.method == 'donesubmitting'){
							console.log("Closing tab");
							chrome.tabs.remove(tab.id);
						}
					}); */
					
				////////////////////////////////
	
					chrome.runtime.onConnect.addListener(function(port) {
						console.assert(port.name == "injectscript");
						port.onMessage.addListener(function(msg) {
							if (msg.pagestate == "PageReady"){
							  port.postMessage({dothis: "Select type of Punch"});
							  console.log( "Timetrak Tab loaded" );
							}else if (msg.didthis == "Punch Type selected"){
							  port.postMessage({dothis: "Enter Badge ID"});
							  console.log( "Punch Type enetered" );
							}else if (msg.didthis == "Badge ID entered"){
							  //port.postMessage({question: "I don't get it."});
							  console.log( "Badge ID entered" );
							  chrome.tabs.remove(tab.id);
							  console.log( "Tab closed" );
							}
						});
					});
				
				
				////////////////////////////////
					
				});
							
			});
			
		};
	}

//}, 5000);


