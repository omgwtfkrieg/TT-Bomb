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
	//console.log(smashID);
	//var foundin = $('*:contains("Honduras KM2")');
	//console.log("smash time hour: " + time_hour + " now_hour: " + now_hour);
	if ( time_hour == now_hour && time_minute == now_minute){
		//console.log("valid: execute smash");


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
				chrome.extension.sendMessage({didthis: "Smash Accepted"});
			});
			$('*:contains("Session terminated")').each(function(){
				chrome.extension.sendMessage({didthis: "Close Tab - Session Terminated"});
			});
			$('*:contains("HAVE A NICE DAY")').each(function(){
				chrome.extension.sendMessage({didthis: "Close Tab - HAVE A NICE DAY"});
			});
			$('*:contains("Cancelled")').each(function(){
				chrome.extension.sendMessage({didthis: "Close Tab - Cancelled"});
			});
			$('*:contains("Invalid Badte ID")').each(function(){
				chrome.extension.sendMessage({didthis: "Close Tab - Invalid Badge ID"});
			});

	}else {
		//console.log("invalid: not suppose to execute smash");
		$('*:contains("Session terminated")').each(function(){
			chrome.extension.sendMessage({didthis: "Close Tab - Session Terminated"});
		});
	};

});

////////////////////////////////////////////////////////////////////////////////
