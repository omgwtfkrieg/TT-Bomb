////////////////////////////////////////////////////////////////////////////////

chrome.extension.sendMessage({method: "getpunchdata"}, function(response) {
	var badgeID = response.data1;
	var punch = response.data2;
	var status = response.data3;
	
	//var foundin = $('*:contains("Honduras KM2")');
	
	var port = chrome.runtime.connect({name: "injectscript"});
	port.postMessage({pagestate: "PageReady"});
	port.onMessage.addListener(function(msg) {
	
		$('*:contains("Honduras KM2")').each(function(){
		 if($(this).children().length < 1) 
			$(this).css("border","solid 2px red");
			$("input[name='"+ punch +"']").click();
		});
		
		$('*:contains("Enter Badge Number")').each(function(){
		 if($(this).children().length < 1) 
			$(this).css("border","solid 2px red");
			$("input[name*='MSG4']").val(badgeID);
		});
		$('*:contains("SWIPE EMPLOYEE BADGE")').each(function(){
		if($(this).children().length < 1) 
			 $(this).css("border","solid 2px red");
			 $("input[name*='MSG4']").val(badgeID);			  
			  //port.postMessage({didthis: "Click submitted"});
		});
		
		
		if(!!$("input[name*='MSG4']").val){
			$("input[name=OK]").click();
		};
		$('*:contains("Your Session Has Terminated - Please Close Your Browser")').each(function(){
			port.postMessage({didthis: "Close Tab"});
		});
		
		$('*:contains("Accepted")').each(function(){
			port.postMessage({didthis: "Accepted was found"});
		});

		
		
	});
	//Accepted
	//HAVE A NICE DAY
	//if (founding){alert("It does have Honduras KM2");};
	//alert(punch + status + badgeID);
/* 	var port = chrome.runtime.connect({name: "injectscript"});
	port.postMessage({pagestate: "PageReady"});
	port.onMessage.addListener(function(msg) {
		if (status == "no"){
			if (msg.dothis == "Selecting type of Punch"){
				$(document).on("pageload",function(){
					$("input[name='"+ punch +"']").click();
					port.postMessage({didthis: "Punch Type selected"});
				});
			}else if (msg.dothis == "Enter Badge ID"){
				$(document).on("pageload",function(){
					
					$("input[name*='MSG4']").val(badgeID);
					setTimeout( function(){
						port.postMessage({didthis: "Badge ID entered"});
					}, 5000); // delay 5000 ms
				});
			}else if (msg.dothis == "Submit Badge"){
				$(document).on("pageload",function(){
					setTimeout( function(){
						$("input[name=OK]").click();
						port.postMessage({didthis: "Click submitted"});
					}, 5000); // delay 5000 ms

				});
			}else if (msg.dothis == "Was the punch accepted?"){
				$(document).on("pageload",function(){
					var foundAccepted = $('*:contains("Accepted")');
					if (foundAccepted) {  
						port.postMessage({didthis: "Accepted was found"});
					}
				});
			}
		} else if ( status == "yes"){
			port.postMessage({didthis: "punch already ran"});
		}
	}); */
});

////////////////////////////////////////////////////////////////////////////////