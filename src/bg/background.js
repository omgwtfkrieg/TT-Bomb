

// Show page action icon in omnibar.
function onWebNav(details) {
    if (details.frameId === 0) {
        // Top-level frame
        chrome.pageAction.show(details.tabId);
    }
}
var filter = {
    url: [{
        hostEquals: 'http://km2.timetrak.com:85/'
    }]
};

var refreshId = setInterval(function(){
	console.log( "ready!" );
	
	var d = new Date();
	var hours;
	var amPm = "AM";
	if ( d.getHours() > 11 ) {
		amPm = "PM"
		hours = d.getHours() - 12;
	} else {
		amPm = "AM"
		hours = d.getHours();
	};
	var minutes = d.getMinutes()
	if (minutes < 10){
	minutes = "0" + minutes
	};
	
	//will loop, search in localStorage and execute if stored time matches current time.  
	var currenttime = hours + ":" + minutes + " " + amPm;
	console.log(currenttime);
    var json = JSON.parse(localStorage.getItem("realdataSet"));
			for (i=0;i<json.length;i++){
				if (json[i].time == currenttime){
					console.log(json[i].badgeID + "--" + json[i].punchType +"--"+ json[i].punch +"--"+ json[i].time);
					chrome.tabs.query({currentWindow: true, active: false}, function(tab) {
						chrome.tabs.create( { "url": "http://akkunchoi.github.io/Autofill-chrome-extension/", active: false, 
						selected: false } );
						
					});
				};
			}

}, 5000);
