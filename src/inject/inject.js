chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		//console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------

	}
	}, 10);
});
///////////////////////////////////////

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  if (request.method == 'getLocalStorage') {
    var objectString = JSON.stringify(localStorage);
    sendResponse({data: objectString});
  } else {
    sendResponse({}); // snub them.
  }
});



///////////////////////////////////////
//This line opens up a long-lived connection to your background page.
var port = chrome.runtime.connect({name:"mycontentscript"});
port.onMessage.addListener(function(message,sender){

	if (typeof message.badgeID === 'undefined') {
    console.log('OMG it is EMPTY!');
	}
	else {console.log('Badge ID: ' + message.badgeID);
		console.log('it worked! BadgeID: ' + message.badgeID);
			badgeID=message.badgeID;
	};
	
});

chrome.storage.local.get('whatdo', function (result) { //***START***//
	console.log('Current whatdo: ' + result.whatdo + ' value');
	//Fires Event: Submits "In for the Day" with a button click.
	var badgeID_CS;
	if (result.whatdo == undefined ){
		chrome.storage.local.set({'whatdo': "exefun1"}, function() {
		console.log('Changed whatdo: undefined to whatdo: ' + result.whatdo);
		});
		
	};			
		
	if (result.whatdo == "exefun1"){
		chrome.storage.local.set({'whatdo': "exefun2"});
		console.log('Changed whatdo: exefun1 to whatdo: ' + result.whatdo);
		$("input[name=FN1]").click();
		console.log('In for the Day submitted.');
	};
var badgeID_CS;
	if (result.whatdo == "exefun2"){
		
		console.log('Inside exefun2 function');
		chrome.storage.local.set({'whatdo': "exefun1"});
		console.log('Changed whatdo: exefun2 to whatdo: ' + result.whatdo);
		
		chrome.storage.sync.get('badgeID_OP', function(items) {
			console.log("I guess it works" + items.badgeID_OP);
			$("input[name=MSG4]").val(items.badgeID_OP);
		});
		
		if($("input[name=MSG4]").length && $("input[name=MSG4]").val().length){
			console.log('Badge ID inserted');

		};

		 return false;
	};
					
}); //***END***//

