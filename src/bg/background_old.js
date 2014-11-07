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
		
			if(json[i].status == "no"){
				console.log("Something was found to punch.")
				var counter = i;
				//console.log(json[i].badgeID + "--" + json[i].punchType +"--"+ json[i].punch +"--"+ json[i].time);
				chrome.tabs.query({currentWindow: true, active: false}, function(tab) {
					
					chrome.tabs.create({'url': "http://km2.timetrak.com:85/web.exe?sp2application=079950102ClocTrak", active: false, selected: false,  }, function(tab){ 
						console.log(tab.id);
						tabID = tab.id;
	/* 					chrome.tabs.executeScript(tab.id, {
							file : 'src/inject/inject.js',
							runAt : 'document_start'
						}); */
							chrome.tabs.onUpdated.addListener(function(tabID, info, tab) {
							
								chrome.tabs.executeScript(tabID, { file: 'js/jquery/jquery.min.js', runAt : 'document_start' }, function() {
									chrome.tabs.executeScript(tabID, { 
										file : 'src/inject/inject.js',
										runAt : 'document_start' });
								});
							});
							
							
						//});
						
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

									setTimeout( function(){
										console.log("Punch Accepted closing tab");
										
										chrome.tabs.remove(tab.id);
									}, 1000); // delay 5000 ms
									
								}else if (msg.didthis == "punch already ran"){
									setTimeout( function(){
										console.log("closing tab");
										
										chrome.tabs.remove(tab.id);
									}, 7000); // delay 5000 ms
								}
							});
						});
					
					
					////////////////////////////////
					
					
					////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\/
					surprise(cb) {
						(function loop() {
							var now = new Date();
							if (now.getDate() === 12 && now.getHours() === 12 && now.getMinutes() === 0) {
								cb();
							}
							now = new Date();                  // allow for time passing
							var delay = 60000 - (now % 60000); // exact ms to next minute interval
							setTimeout(loop, delay);
						})();
					}
					///////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\/
					
					
						
					});
								
				});
			}
			
		}else if ( json[i].status == "yes"){console.log("Nothing to punch");};
	}

//}, 10000);