////////////////////////////////////////////////////////////////////////////////

chrome.extension.sendMessage({method: "getsmashdata"}, function(response) {
	var smashID = response.data1;
	var smash = response.data2;
	var status = response.data3;
	var time = response.data4;
	var time_hour = moment(time).hour();
	var time_minute = moment(time).minute();
	var time_day = moment(time).day();
	var now = moment();
	var now_hour = moment().hour();
	var now_minute = moment().minute();
	var now_day = moment().day();
	
	time = moment(time);
	//console.log(time + " = " + now);
	//var foundin = $('*:contains("Honduras KM2")');
	//console.log("smash time hour: " + time_hour + " now_hour: " + now_hour);
	if ( time_hour == now_hour && time_minute == now_minute){
		//console.log("valid: execute smash");
		
		var port = chrome.runtime.connect({name: "injectconnection"});
		port.postMessage({pagestate: "PageReady"});
		port.onMessage.addListener(function(msg) {
	
			$('*:contains("Honduras KM2")').each(function(){
			 if($(this).children().length < 1) 
				$(this).css("border","solid 2px red");
				$("input[name='"+ smash +"']").click();
			});
			
			$('*:contains("Enter Badge Number")').each(function(){
			 if($(this).children().length < 1) 
				$(this).css("border","solid 2px red");
				$("input[name*='MSG4']").val(smashID);
			});
			//or
			$('*:contains("Enter Badge #")').each(function(){
			 if($(this).children().length < 1) 
				$(this).css("border","solid 2px red");
				$("input[name*='MSG4']").val(smashID);
			});
			//or
			$('*:contains("SWIPE EMPLOYEE BADGE")').each(function(){
			 if($(this).children().length < 1) 
				$(this).css("border","solid 2px red");
				$("input[name*='MSG4']").val(smashID);
			});
			
			if(!!$("input[name*='MSG4']").val){
				$("input[name=OK]").click();
			}
			$('*:contains("Accepted")').each(function(){
				port.postMessage({didthis: "Smash Accepted"});
			});
			$('*:contains("Session terminated")').each(function(){
				port.postMessage({didthis: "Close Tab - Session Terminated"});
			});
			$('*:contains("HAVE A NICE DAY")').each(function(){
				port.postMessage({didthis: "Close Tab - HAVE A NICE DAY"});
			});
			$('*:contains("Cancelled")').each(function(){
				port.postMessage({didthis: "Close Tab - Cancelled"});
			});
			$('*:contains("Invalid Badte ID")').each(function(){
				port.postMessage({didthis: "Close Tab - Invalid Badge ID"});
			});
			
			
			// $('*:contains("SWIPE EMPLOYEE BADGE")').each(function(){
			// if($(this).children().length < 1) 
				 // $(this).css("border","solid 2px red");
				 // $("input[name*='MSG4']").val(smashID);			  
				  //port.postMessage({didthis: "Click submitted"});
			// });
			
			
			// if(!!$("input[name*='MSG4']").val){
				// $("input[name=OK]").click();
			// };
			// $('*:contains("Your Session Has Terminated - Please Close Your Browser")').each(function(){
				//port2.postMessage({didthis: "Close Tab"});
			// });
			
			// $('*:contains("Accepted")').each(function(){
				//port2.postMessage({didthis: "Accepted was found"});
			// });

		
		
		});
		
	}else {
		//console.log("invalid: not suppose to execute smash");
		
	};
	
	
	//Accepted
	//HAVE A NICE DAY
	//if (founding){alert("It does have Honduras KM2");};
	//alert(smash + status + smashID);
/* 	var port = chrome.runtime.connect({name: "injectscript"});
	port.postMessage({pagestate: "PageReady"});
	port.onMessage.addListener(function(msg) {
		if (status == "no"){
			if (msg.dothis == "Selecting type of smash"){
				$(document).on("pageload",function(){
					$("input[name='"+ smash +"']").click();
					port.postMessage({didthis: "smash Type selected"});
				});
			}else if (msg.dothis == "Enter Badge ID"){
				$(document).on("pageload",function(){
					
					$("input[name*='MSG4']").val(smashID);
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
			}else if (msg.dothis == "Was the smash accepted?"){
				$(document).on("pageload",function(){
					var foundAccepted = $('*:contains("Accepted")');
					if (foundAccepted) {  
						port.postMessage({didthis: "Accepted was found"});
					}
				});
			}
		} else if ( status == "yes"){
			port.postMessage({didthis: "smash already ran"});
		}
	}); */
});

////////////////////////////////////////////////////////////////////////////////