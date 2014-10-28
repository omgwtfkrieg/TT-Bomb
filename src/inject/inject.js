////////////////////////////////////////////////////////////////////////////////

chrome.extension.sendMessage({method: "getpunchdata"}, function(response) {
	var badgeID = response.data1;
	var punch = response.data2;
	var status = response.data3;
	//alert(punch);
	
	var port = chrome.runtime.connect({name: "injectscript"});
	port.postMessage({pagestate: "PageReady"});
	port.onMessage.addListener(function(msg) {
		if (status == "no"){
			if (msg.dothis == "Selecting type of Punch"){
				$(document).ready(function() {
					$("input[name='"+ punch +"']").click();
					port.postMessage({didthis: "Punch Type selected"});
				});
			}else if (msg.dothis == "Enter Badge ID"){
				$(document).ready(function() {
					
					$("input[name*='MSG4']").val(badgeID);
					//port.postMessage({didthis: "Badge ID entered"});
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
		} else if ( status == "yes"){
			port.postMessage({didthis: "punch already ran"});
		}
	});
});
////////////////////////////////////////////////////////////////////////////////