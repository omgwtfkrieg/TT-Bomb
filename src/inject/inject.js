chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------
		
		// This gets the localStorage from the background/option page
		//chrome.extension.sendMessage({method: "getLocalStorage"}, function(response) {
		//var JSONdataSet = JSON.parse(response.data);
		//console.log(JSONdataSet);
		
		// we Parse it again to optain the data individually.
		//var dataSet = JSON.parse(JSONdataSet);
		//for (i=0;i<dataSet.length;i++){
		//	if (dataSet[i].time == "9:15 PM"){
		//		console.log(dataSet[i].badgeID + "--" + dataSet[i].punchType +"--"+ dataSet[i].punch +"--"+ dataSet[i].time);
		//	};
		//}
		//});
		
		//This will compare current time and stored time in localStorage and get all data from that entry 
		//lets get currenttime
		//var d = new Date();
		//alert (d);
		//var hourString;
		//var hourInt;
		//var amPm = "AM";
		//if ( d.getHours() > 11 ) {
		//	amPm = "PM"
		//	hourString = d.getHours() - 12;
		//} else {
		//	amPm = "AM"
		//	hourString = d.getHours();
		//}
		
		//var currenttime = hourString + ":" + d.getMinutes() + " " + amPm;
		//console.log(currenttime);
		
		//var json = JSON.parse(JSONdataSet);
		//for (i=0;i<JSONdataSet.length;i++){
		//	if (JSONdataSet[i].time == "4:30 PM"){
		//		alert(JSONdataSet[i].badgeID + "--" + JSONdataSet[i].punchType +"--"+ JSONdataSet[i].punch +"--"+ JSONdataSet[i].time);
		//	};
		//}
		//console.log(JSONdataSet[2].badgeID + "--" + JSONdataSet[2].punchType +"--"+ JSONdataSet[2].punch +"--"+ JSONdataSet[2].time);
		//});

	}
	}, 10);
});
///////////////////////////////////////



///////////////////////////////////////
//This line opens up a long-lived connection to your background page.
var port = chrome.runtime.connect({name:"mycontentscript"});
port.onMessage.addListener(function(message,sender){

	if (typeof message.badgeID === 'undefined') {
    //console.log('OMG it is EMPTY!');
	}
	else {//console.log('Badge ID: ' + message.badgeID);
		//console.log('it worked! BadgeID: ' + message.badgeID);
			badgeID=message.badgeID;
	};
	
});

chrome.storage.local.get('whatdo', function (result) { //***START***//
	//console.log('Current whatdo: ' + result.whatdo + ' value');
	//Fires Event: Submits "In for the Day" with a button click.
	var badgeID_CS;
	if (result.whatdo == undefined ){
		chrome.storage.local.set({'whatdo': "exefun1"}, function() {
		//console.log('Changed whatdo: undefined to whatdo: ' + result.whatdo);
		});
		
	};			
		
	if (result.whatdo == "exefun1"){
		chrome.storage.local.set({'whatdo': "exefun2"});
		//console.log('Changed whatdo: exefun1 to whatdo: ' + result.whatdo);
		$("input[name=FN1]").click();
		//console.log('In for the Day submitted.');
	};
var badgeID_CS;
	if (result.whatdo == "exefun2"){
		
		//console.log('Inside exefun2 function');
		chrome.storage.local.set({'whatdo': "exefun1"});
		//console.log('Changed whatdo: exefun2 to whatdo: ' + result.whatdo);
		
		chrome.storage.sync.get('badgeID_OP', function(items) {
			//console.log("I guess it works" + items.badgeID_OP);
			$("input[name=MSG4]").val(items.badgeID_OP);
		});
		
		if($("input[name=MSG4]").length && $("input[name=MSG4]").val().length){
			//console.log('Badge ID inserted');

		};

		 return false;
	};
					
}); //***END***//


