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
			{ "sTitle": "Smash ID", "mData": "badgeID" },
			{ "sTitle": "Smash Type", "mData": "punchType" },
			{ "sTitle": "Smash Value", "mData": "punch" },
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
		console.log($('#badgeID').val() + " " + $('#punchtype option:selected').text() + " " + $('#punchtype').val() + " " + $('#timepicker').val() + " " + $('#uniqueID').val());
		//checks if input fields are not empty, if they are it will show an alert message
		if ($('#badgeID').val() == '' || $('#punchtype select option:selected').val() == '' || $('#timepicker').val() == '') {
			$('#alert_placeholder').hide().html('<p class="flow-text red-text text-darken-1" id="alert_placeholder"><i class="small mdi-alert-warning yellow-text text-darken-2" style="float:left; margin:0 7px 0px 0;"></i>You missed a field!<a href="#"><i class="material-icons">clear</i></a></p>').fadeIn('slow');

		} else {

			
			var tabledata; 
			tabledata = {
				uuid : uuid,
				badgeID : $('#badgeID').val(),
				punchType : $('#punchtype option:selected').text(),
				punch : $('#punchtype').val(),
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
				$('#addpunchinqueue')[0].reset();
				$('#Save').prop("disabled", true);
		}

	
	return false;
	});
	
	$(document).on('click', '.delete', function () {
		//var index = $(this).closest('tr').attr('id').split('-')[1];
		//alert(index);
		var row = $(this).closest('tr');
		
		//reloads/updates datatables with new values
		oTable.row(row).remove().draw();
		//grabs the uuid from the first cell and stores it in "getuuid"
		var getuuid = $(this).parent().siblings(":first").text();
		
		//once we get the uuid we pull our dataSet in local storage and search for the value to delete
		var json = JSON.parse(localStorage["dataSet"]);
		for (i=0;i<json.length;i++)
		if (json[i].uuid == getuuid) json.splice(i,1);
		localStorage["dataSet"] = JSON.stringify(json);
		

	});
	//close button action, will hide and reset values from the addnothing form
	$('#addnothingclose').click(function () {
		$('.addnothing').fadeToggle( "fast", "linear" );
		$('#addpunchinqueue')[0].reset();
		$('#Save').prop("disabled", true);
	});
	
	$(document).on('click', '.test-3', function () {
	chrome.alarms.clearAll();
	});

	$(".alarmsinq").click(function (){alarmsqueue();});
	$(".removealarms").click(function () {chrome.extension.sendRequest({ msg: "clearalarms" }); //runs the clearalarm(); function in the background.js
	});
	$('.reloadalarms').click(function () {//chrome.extension.sendRequest({ msg: "createalarm" }); //runs the createalarm(); function in the background.js
		var port1 = chrome.runtime.connect({name: "fromoptionpagescript"});
		port1.postMessage({requestaction: "getalarmsnumber"});
		port1.onMessage.addListener(function(msg) {
			port1.postMessage({didthis: "Find amnt alarms"});
			});
		$('.reloadalarms i').addClass('spin');	
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
	$('#badgeID').keyup(function() {//enables the save button once smash ID meets the 4 character long criteria
		if($(this).val().length == 4 ) {
			$('#Save').prop("disabled", false);
		}
	});	
	
	///////////////////////////////////////////////////////////
	// Communication section between Option_Page and Background
	///////////////////////////////////////////////////////////
	
	//Listener
	chrome.extension.onRequest.addListener(
		function(request, sender, sendResponse){

			if(request.elementaction == "btnstopspinning"){
				$('.reloadalarms i').removeClass('spin');
				console.log("Stopping button animation");
			};

		}
	);

}); //END