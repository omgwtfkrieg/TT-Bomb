$(function() {
	$(document).ready(function(){
		$('.tooltipped').tooltip({delay: 50});
		smashes_pending();
	});
	
	function smashes_pending() {
		$( "#queue_list ul li" ).empty();
		//port.postMessage({answer: "Test"});var alarmLogger = function(alarm){ console.log(alarm.name + " " + alarm.scheduledTime) };
		var alarmsqlist = function(alarm){
			//myDate = new Date(1000*alarm.scheduledTime);
			var epoch = alarm.scheduledTime;
			var epoch2 = parseInt((""+epoch).substring(0,13), 10);
			var dt = new Date(epoch2);
			//dt.setDate(dt.getDate()+1);
			//alert(dt); //Sat Jul 20 2013 00:00:00 GMT+0100 (GMT Daylight Time) 
			//alert(dt.valueOf()); //1374274800000
			dt = (
				dt.getHours() + ":" +
				dt.getMinutes() + " " +
				(dt.getMonth() ) + "/" +
				dt.getDate() + "/" +
				dt.getFullYear() 
			);
		$( '#queue_list ul').append( '<li><div class="collapsible-header"><i class="material-icons teal-text lighten-2-text">keyboard_arrow_right</i>' + alarm.name + '</div><div class="collapsible-body center-align"><p>' + dt + '</p></div></li>' );
		$('.collapsible').collapsible({
		  accordion : true, // A setting that changes the collapsible behavior to expandable instead of the default accordion style
		});
		$('#queue_list ul li:first div').addClass("active");
		$("#queue_list ul li:first div i:contains('keyboard_arrow_right')").html("schedule");
		//$( 'ul#queue_list').append( '<li>hello</li>' );
		//console.log(alarm.name + " " + alarm.scheduledTime)
		};
		chrome.alarms.getAll(function(alarms){ alarms.forEach(alarmsqlist); });
		return false;
		
		
	};
	
	
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
		$("#myTable td:contains('no')").html("<i class='center-align material-icons teal-text lighten-2-text'>check</i>");
		$('#myTable td').addClass("center-align");
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
				button: "<button class='delete btn waves-effect waves-light red lighten-2'><i class='material-icons'>clear</i></button>",
				
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
				$('.addnothing').fadeToggle( "fast", "linear" );
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
		return false;

	});
	// close button action, will hide and reset values from the addnothing form
	$('#addnothingclose').click(function () {
		$('select').material_select();
		$('.addnothing').fadeToggle( "fast", "linear" );
		$('#addsmashinqueue')[0].reset();
		$('#Save').prop("disabled", true);
		return false;
	});
	
	$(document).on('click', '.test-3', function () {
		chrome.alarms.clearAll();
		return false;
	});

	//$(".alarmsinq").click(function (){alarmsqueue();});

	$('.getalarms').click(function () {//chrome.extension.sendRequest({ msg: "createalarm" }); //runs the createalarm(); function in the background.js
		//chrome.runtime.sendMessage({ msg: "createalarm" });
		port.postMessage({joke: "Knock knock"});
		$('.getalarms i').addClass('spin');	
		return false;
	});
	$(".addalarms").click(function () {//chrome.extension.sendRequest({ msg: "clearalarms" }); //runs the clearalarm(); function in the background.js
		port.postMessage({answer: "Create Alarms"});
		return false;
	});
	
	$(".removealarms").click(function () {//chrome.extension.sendRequest({ msg: "clearalarms" }); //runs the clearalarm(); function in the background.js
		port.postMessage({answer: "Remove Alarms"});
		return false;
	});
	$('.testbutton').click(function () {
		$( "ul#queue_list li" ).empty();
		//port.postMessage({answer: "Test"});var alarmLogger = function(alarm){ console.log(alarm.name + " " + alarm.scheduledTime) };
		var alarmsqlist = function(alarm){
			//myDate = new Date(1000*alarm.scheduledTime);
			var epoch = alarm.scheduledTime;
			var epoch2 = parseInt((""+epoch).substring(0,13), 10);
			var dt = new Date(epoch2);
			//dt.setDate(dt.getDate()+1);
			//alert(dt); //Sat Jul 20 2013 00:00:00 GMT+0100 (GMT Daylight Time) 
			//alert(dt.valueOf()); //1374274800000
		$( 'ul#queue_list').append( '<li class=\'collection-item\'>' + alarm.name + ' <br/ >' + dt + '</li>' );
		//$( 'ul#queue_list').append( '<li>hello</li>' );
		//console.log(alarm.name + " " + alarm.scheduledTime)
		};
		chrome.alarms.getAll(function(alarms){ alarms.forEach(alarmsqlist); });
		return false;
	});
	$('.reloadext').click(function () {
		chrome.runtime.reload();
		return false;
	});
	
	//<--end-->
	
	//Toggles the add option to add Smashes
	$('.addnothing').hide();//hides the add option form when the website loads
	$("#addnothing").click(function(){//instructs the app what to do when you click on the add button
		// var $this = $(this);
		// $this.toggleClass('buttonHidden');//add a class in order to switch icons on toggle action when clicked
		// if($this.hasClass('buttonHidden')){
			// $this.html('<i class="material-icons">access_alarm</i>');           
		// } else {
			// $this.html('<i class="material-icons">add_alarm</i>');
		// }
		$(".addnothing").fadeToggle( "fast", "linear" );//adds the fade in animation to the form when loading
		return false;
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
	

}); //END