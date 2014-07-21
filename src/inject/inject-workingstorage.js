/* chrome.extension.sendMessage({}, function(response) {
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

chrome.extension.sendMessage({}, function(response) {

	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		//clearInterval(readyStateCheckInterval);
		//var IFTDSubmit = document.getElementsByName('FN1')[0];
		//IFTDSubmit.click();
		
		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		//console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------

	}
	}, 10);
	
}); */


/* var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") { */
		chrome.storage.local.get('whatdo', function (result) { //***START***//
				 console.log('Current whatdo: ' + result.whatdo + ' value');
				//Fires Event: Submits "In for the Day" with a button click.
				//whatdo = result.whatdo;
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
					
				if (result.whatdo == "exefun2"){
					console.log('Inside exefun2 function');
					chrome.storage.local.set({'whatdo': "exefun1"});
					console.log('Changed whatdo: exefun2 to whatdo: ' + result.whatdo);
					$("input[name=MSG4]").val('41614');
					if($("input[name=MSG4]").length && $("input[name=MSG4]").val().length){
						console.log('Badge ID inserted');
						$("input[name=OK]").click();
					};
					//$("input[name=OK]").click();
					whatdo = null;
					 return false;
				};
					
		}); //***END***//
/* 	}
}); */

