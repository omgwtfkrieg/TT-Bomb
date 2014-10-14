//chrome.extension.sendMessage({}, function(response) {
	//var readyStateCheckInterval = setInterval(function() {
	//if (document.readyState === "complete") {
		//clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		//console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------
		
		// This gets the localStorage from the background/option page

		
		// we Parse it again to obtain the data individually.
		/* var dataSet = JSON.parse(JSONdataSet);

			// Make Inject do a second check to make sure no changes has been made.
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
			console.log(currenttime); */
	
		////////////////////
		
		var port = chrome.runtime.connect({name: "injectscript"});
		port.postMessage({pagestate: "PageReady"});
		port.onMessage.addListener(function(msg) {
			if (msg.dothis == "Select type of Punch"){
				$("input[name='FN1']").click();
				port.postMessage({didthis: "Punch Type selected"});
			}else if (msg.dothis == "Enter Badge ID"){
				var badgeID = "41614";
				$("input[name=MSG4]").val(badgeID)
				port.postMessage({didthis: "Badge ID entered"});
			}
		});
		
		///////////////////
		
	/* 	chrome.runtime.connect(function(request, sender, sendResponse) {
			if (request.method == 'startinject') {
				console.log( "Starting inject!" );
				chrome.extension.sendMessage({method: "getLocalStorage"}, function(response) {
					var JSONdataSet = JSON.parse(response.data);
					//console.log(JSONdataSet);
					
				
			
				var dataSet = JSON.parse(JSONdataSet);

				// Make Inject do a second check to make sure no changes has been made.
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
			
				console.log("startinject works!");
				for (i=0;i<dataSet.length;i++){
				if (dataSet[i].time === currenttime){
					if(dataSet[i].status === "no"){
						console.log("Has this been punched? " + dataSet[i].status);
						//console.log(dataSet[i].badgeID + "--" + dataSet[i].punchType +"--"+ dataSet[i].punch +"--"+ dataSet[i].time);
						//$("input[name="+ dataSet[i].punch + "]").click();
						//console.log('punch button clicked');
						//$("input[name=MSG4]").val(dataSet[i].badgeID);
						//$("input[name=OK]").click();
					};
					if(dataSet[i].status === "yes"){
						console.log("sending message to background to close tab");
						//chrome.extension.sendMessage({method: "donesubmitting"}, function(response){});
					};
					//if($("input[name=MSG4]").length && $("input[name=MSG4]").val().length){
						//console.log('Badge ID inserted');
						//$("input[name=OK]").click();
						//console.log('submitted');
						//alert("stopping script for a moment");
					//};
					
					//chrome.extension.sendMessage({method: "donesubmitting"}, function(response){});
					
				}else{
					console.log("nothing to punch yet!");
					//chrome.extension.sendMessage({method: "donesubmitting"}, function(response){});
				};
			
			};
			if (request.method == 'donesubmitting'){
				
			} 
			});
			}
		}); */
		
		////////////////////
	//will loop, search in localStorage and execute if stored time matches current time.  
	//var currenttime = hours + ":" + minutes + " " + amPm;
	//console.log(currenttime);

			
		
	

	//}
//	}, 10);
//});
///////////////////////////////////////



///////////////////////////////////////
//This line opens up a long-lived connection to your background page.
//var port = chrome.runtime.connect({name:"mycontentscript"});
//port.onMessage.addListener(function(message,sender){

	//if (typeof message.badgeID === 'undefined') {
    //console.log('OMG it is EMPTY!');
	//}
	//else {//console.log('Badge ID: ' + message.badgeID);
		//console.log('it worked! BadgeID: ' + message.badgeID);
	//		badgeID=message.badgeID;
	//};
	
//});

//chrome.storage.local.get('whatdo', function (result) { //***START***//
	//console.log('Current whatdo: ' + result.whatdo + ' value');
	//Fires Event: Submits "In for the Day" with a button click.
	//var badgeID_CS;
	//if (result.whatdo == undefined ){
		//chrome.storage.local.set({'whatdo': "exefun1"}, function() {
		//console.log('Changed whatdo: undefined to whatdo: ' + result.whatdo);
		//});
		
	//};			
		
	//if (result.whatdo == "exefun1"){
		//chrome.storage.local.set({'whatdo': "exefun2"});
		//console.log('Changed whatdo: exefun1 to whatdo: ' + result.whatdo);
		//$("input[name=FN1]").click();
		//console.log('In for the Day submitted.');
	//};
//var badgeID_CS;
	//if (result.whatdo == "exefun2"){
		
		//console.log('Inside exefun2 function');
		//chrome.storage.local.set({'whatdo': "exefun1"});
		//console.log('Changed whatdo: exefun2 to whatdo: ' + result.whatdo);
		
		//chrome.storage.sync.get('badgeID_OP', function(items) {
			//console.log("I guess it works" + items.badgeID_OP);
			//$("input[name=MSG4]").val(items.badgeID_OP);
		//});
		
		//if($("input[name=MSG4]").length && $("input[name=MSG4]").val().length){
			//console.log('Badge ID inserted');

		//};

		 //return false;
	//};
					
//}); //***END***//

