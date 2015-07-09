$(function() {
	
	///////////////////////////////////////////////////////
	// Generate rudimentary unique ID.
	////////////////////////////////////////////////////////
	var guid = (function() {
		function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
		}
		return function() {
		return s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4();
		};
	})();

	////////////////////////////////////////////////////////
	// Prepares the localstorage for datatables
	////////////////////////////////////////////////////////
	var dataSet;
 
	try{
		dataSet = JSON.parse(localStorage.getItem('dataSet')) || [];
	} catch (err) {
		dataSet = [];
	} 
	
	//Checks if dataSet key exists if not it creates it
	if (localStorage.getItem("dataSet") === null) {
		setdataSet = [];
		localStorage.setItem('dataSet', JSON.stringify(setdataSet));
	}
	// Initialise the DataTable
	
	////////////////////////////////////////////////////////
	// Initialise DataTable & configuration
	////////////////////////////////////////////////////////

	$('#myTable').dataTable({
		"data": [],

		"aoColumns":[ 
			{ "sTitle": "UID", "mData": "uuid" },
			{ "sTitle": "Smash ID", "mData": "smashID" },
			{ "sTitle": "Smash Type", "mData": "smashType" },
			{ "sTitle": "Smash Value", "mData": "smash" },
			{ "sTitle": "Time", "mData": "time" },
			{ "sTitle": "Status", "mData": "status" },
			{ "sTitle": "Remove", "mData": "button" },
			
        ],
			"bStateSave": true,
			"stateSave": true,
			"bPaginate": false,
			"bLengthChange": false,
			"bFilter": false,
			"bInfo": false,
			"bAutoWidth": false,
			"fnCreatedRow": function (nRow, aData, iDataIndex) {
				$(nRow).attr('id', 'row-' + iDataIndex) // this adds a custom row ID for each entry
			},
	});
	oTable = $('#myTable').DataTable();
	for (var i = 0; i < dataSet.length; i++) {
		oTable.row.add(dataSet[i]).draw();
	}
	////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// Saves entries to localStorage in order for DataTable to read
	////////////////////////////////////////////////////////

	$('#Save').click(function () {
		
		var uuid = guid();
		console.log($('#smashID').val() + " " + $('#smashType option:selected').text() + " " + $('#smashType').val() + " " + $('#timepicker').val() + " " + $('#uniqueID').val());
		//checks if input fields are not empty, if they are it will show an alert message
		if ($('#smashID').val() == '' || $('#smashType select option:selected').val() == '' || $('#timepicker').val() == '') {
			$('#alert_placeholder').hide().html('<p class="flow-text red-text text-darken-1" id="alert_placeholder"><i class="small mdi-alert-warning yellow-text text-darken-2" style="float:left; margin:0 7px 0px 0;"></i>You missed a field!<a href="#"><i class="material-icons">clear</i></a></p>').fadeIn('slow');

		} else {

			
			var tabledata; 
			tabledata = {
				uuid : uuid,
				smashID : $('#smashID').val(),
				smashType : $('#smashType option:selected').text(),
				smash : $('#smashType').val(),
				time : $('#timepicker').val(),
				status: "no",
				button: "<button class='delete btn waves-effect waves-light red lighten-2'><span class='mdi-action-highlight-remove'></span></button>",
				
		};

			oTable.row.add(tabledata).draw();
			dataSet.push(tabledata);
			localStorage.setItem('dataSet', JSON.stringify(dataSet));
			//chrome.extension.sendRequest({ msg: "reloadalarm" }); setTimeout(alarmsqueue,1000);//runs the createalarm(); function in the background.js
				//$( ".addnothing" ).hide("slow").empty();
				//$('.addnothing').fadeToggle( "fast", "linear" );
				$('#alert_placeholder').empty();
				$('#addsmashinqueue')[0].reset();
				$('#Save').prop("disabled", true);
		}

	
	return false;
	});
	
	$(document).on('click', '.delete', function () {
		//var index = $(this).closest('tr').attr('id').split('-')[1];
		//alert(index);
		var row = $(this).closest('tr');
		
		// reloads/updates datatables with new values
		oTable.row(row).remove().draw();
		// grabs the uuid from the first cell and stores it in "getuuid"
		var getuuid = $(this).parent().siblings(":first").text();
		
		// once we get the uuid we pull our dataSet in local storage and search for the value to delete
		var json = JSON.parse(localStorage["dataSet"]);
		for (i=0;i<json.length;i++)
		if (json[i].uuid == getuuid) json.splice(i,1);
		localStorage["dataSet"] = JSON.stringify(json);
		

	});
	// close button action, will hide and reset values from the addnothing form
	$('#addnothingclose').click(function () {
		$('.addnothing').fadeToggle( "fast", "linear" );
		$('#addsmashinqueue')[0].reset();
		$('#Save').prop("disabled", true);
	});
	
	$(document).on('click', '.test-3', function () {
	chrome.alarms.clearAll();
	});

	//$(".alarmsinq").click(function (){alarmsqueue();});

	$('.getalarms').click(function () {//chrome.extension.sendRequest({ msg: "createalarm" }); //runs the createalarm(); function in the background.js
		//chrome.runtime.sendMessage({ msg: "createalarm" });
		port.postMessage({joke: "Knock knock"});
		$('.getalarms i').addClass('spin');	
	});
	$(".addalarms").click(function () {//chrome.extension.sendRequest({ msg: "clearalarms" }); //runs the clearalarm(); function in the background.js
		port.postMessage({answer: "Create Alarms"});
	});
	
	$(".removealarms").click(function () {//chrome.extension.sendRequest({ msg: "clearalarms" }); //runs the clearalarm(); function in the background.js
		port.postMessage({answer: "Remove Alarms"});
	});
	
	//<--end-->
	
	//Toggles the add option to add Smashes
	$('.addnothing').hide();//hides the add option form when the website loads
	$("#addnothing").click(function(){//instructs the app what to do when you click on the add button
		var $this = $(this);
		$this.toggleClass('buttonHidden');//add a class in order to switch icons on toggle action when clicked
		if($this.hasClass('buttonHidden')){
			$this.html('<i class="material-icons">remove</i>');           
		} else {
			$this.html('<i class="material-icons">add</i>');
		}
		$(".addnothing").fadeToggle( "fast", "linear" );//adds the fade in animation to the form when loading
			
	});
	$('.clockpicker').clockpicker({donetext: 'Done',autoclose: true,align: 'right',});//initialize the clock picker in the time input box
	$('select').material_select();//initialize the select option for materialize
	$('#smashID').keyup(function() {//enables the save button once smash ID meets the 5 character long criteria
		if($(this).val().length == 5 ) {
			$('#Save').prop("disabled", false);
		}
	});	
	
	///////////////////////////////////////////////////////////
	// Communication section between Option_Page and Background
	///////////////////////////////////////////////////////////
	// Sender
	var port = chrome.runtime.connect({name: "knockknock"});
	port.onMessage.addListener(function(msg) {
		if (msg.question == "Who's there?"){
		//Stops the spinning animation from the reload/refresh button
			$('.getalarms i').removeClass('spin');	
		}
	else if (msg.question == "Madame who?")
		port.postMessage({answer: "Madame... Bovary"});
	});
	// Listener
	
	// chrome.runtime.onMessage.addListener(
		// function(request, sender, sendResponse){
			// if(request.msg == "createalarm") {createAlarm(); getallalarms();};
			// if(request.msg == "reloadalarm") {chrome.alarms.clearAll(); getallalarms();}; //runs the createalarm(); function from open_page.js
			
			// if(request.msg == "alarmsqueue"){getallalarms();};
			// if(request.msg == "clearalarms"){clearalarms();};
		// }
	// );
	$('.testbutton').click(function () {
		// var items = Array(     
			// "I pity the FOOL!", 
			// "I aint gettin on no plane!", 
			// "Quit yo Jibba Jabba!", 
			// "Shut up, fool!", 
			// "Life's tough, but I'm tougher!", 
			// "Do some prep!",
			// "I'm on a real short leash here", 
			// "Don't make me mad, Arrr!", 
			// "You're gonna meet my friend, PAIN!",
			// "You aint hurt, you pathetic!",
			// "Accept who you are, unless you’re a serial killer",
			// "I tried to be normal once. Worst two minutes of my life.",
			// "May your coffee be strong and your Monday be short.",
			// "Out of all the lies I\'ve told, \"Just kidding!\" is my favorite.",
			// "People say nothing is impossible, but I do nothing every day.",
			// "I put the pro in procrastinate",
			// "It’s all fun and games, until someone calls the cops. Then it’s a new game; hide and seek",
			// "I’m great in bed; I can sleep for days",
			// "Silence is golden; duct tape is silver",
			// "A good friend will help you move, a best friend will help you move a dead body",
			// "Trying to understand you is like trying to smell the color 9",
			// "Anything that is unrelated to elephants is irrelephant",
			// "Most people are only alive because it’s illegal to shoot them",
			// "If God made everything, then God must be Chinese?",
			// "Some people are like Slinky’s. Pretty much useless but make you smile when you push them down the stairs. :)",
			// "Never argue with an idiot they’ll drag you down to their level and beat you through experience"
			// );
		// var item = items[Math.floor(Math.random()*items.length)];
		// alert(item);
	});

}); //END