////////////////////////////////////////////////////////////////////////////////
	
	var port = chrome.runtime.connect({name: "injectscript"});
	port.postMessage({pagestate: "PageReady"});
	port.onMessage.addListener(function(msg) {
		if (msg.dothis == "Selecting type of Punch"){
			$(document).ready(function() {
				$("input[name='FN3']").click();
				port.postMessage({didthis: "Punch Type selected"});
			});
		}else if (msg.dothis == "Enter Badge ID"){
			$(document).ready(function() {
				var badgeID = "41614";
				$("input[name=MSG4]").val(badgeID)
				port.postMessage({didthis: "Badge ID entered"});
			});
		}else if (msg.dothis == "Submit Badge"){
			$(document).ready(function() {
				$("input[name=OK]").click();
				port.postMessage({didthis: "Click submitted"});
			});
		}else if (msg.dothis == "Was the punch accepted?"){
			$(document).ready(function() {
				var foundAccepted = $('*:contains("Accepted")');
				if (foundAccepted) {  
					port.postMessage({didthis: "Accepted was found"});
				}
			});
		}
	});
////////////////////////////////////////////////////////////////////////////////