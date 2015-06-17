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
			
	//console.log(uuid)
	////////////////////////////////////////////////////////
	//$('.clockpicker').clockpicker({donetext: 'Done',autoclose: true,align: 'right',});
			
	$('.addnothing').hide();
	$('#addnothing').click(function() {
		$('.addnothing').append('<h4>Add Nothing&#8482;</h4> <div class="divider"></div> <div id = "alert_placeholder"></div> <form class="col s12"> <div class="row center-align" id="addpunches"> <div class="input-field col s4"> <i class="mdi-action-payment prefix"></i> <input name="badgeID" id="badgeID" type="text" class="validate" maxlength="4"> <label for="icon_prefix">Badge ID</label> </div> <!-- <div class="input-field col s3"> <i class="mdi-device-access-time prefix"></i> <input disabled id="uniqueID" type="text" class="validate"> <label class="active" for="first_name2">Unique ID</label> </div> --> <div class="input-field col s4 clockpicker"> <i class="mdi-device-access-time prefix"></i> <input value="" id="timepicker" type="text" class="validate"> <label class="active" for="first_name2">Time</label> </div> <div class="input-field col s4"> <select id="punchtype"> <option value="FN1">In for the day</option> <option value="FN2">Back from lunch</option> <option value="FN3">Out</option> <option value="FN5">End of the day</option> </select> <label>Choose your option</label> </div> </div> <div class="row center-align"> <button href="#" class="waves-effect waves-light btn-flat lighten-3" id="addnothingclose">Cancel</button> <button href="#" class="waves-effect waves-light btn lighten-3" id="Save" name="Save">Save</button> </div> </form>');
		$('.clockpicker').clockpicker({donetext: 'Done',autoclose: true,align: 'right',});
		$('select').material_select();
		$('.addnothing').animate({
			height: 'toggle'
			}, 500
		);
     });
	$('#addnothingclose').click(function() {
		$('.addnothing').animate({
			height: 'toggle'
			}, 500
		);
     });
	$('.addnothing').show
	
    // Initializes modal
    $('.modal-trigger').leanModal();
	// Initializes Option drop down
	

	$('.boom').click(function () {
	printStorageBody();
	});

///////////////////////////////////////////////
///////////////////////////////////////////////
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
/* 	$('#myTable').dataTable( {
        
        "data": [],
        "columns": [
            { "title" : "uuid" },
			{ "title" : "badgeID" },
			{ "title" : "punchType" },
			{ "title" : "punch" },
			{ "title" : "time" },
            { "title" : "button" },
			{ "title" : "status" },
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
		} */
	$('#myTable').dataTable({
		"data": [],

		"aoColumns":[ 
			{ "sTitle": "Unique ID", "mData": "uuid" },
			{ "sTitle": "Emp ID", "mData": "badgeID" },
			{ "sTitle": "Punch Type", "mData": "punchType" },
			{ "sTitle": "Punch Value", "mData": "punch" },
			{ "sTitle": "Time", "mData": "time" },
			{ "sTitle": "Run", "mData": "status" },
			{ "sTitle": "Actions", "mData": "button" },
			
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
///////////////////////////////////////////////
///////////////////////////////////////////////
	//$('#Save').addClass('disabled', true);
	// Do stuff when there is textarea activity
	
	$('#Save').prop("disabled", true);
		 $('#badgeID').keyup(function() {
			if($(this).val() != '') {
				$('#Save').prop("disabled", false);
			}
	});
	
	//saves entry to localStorage
	$('#Save').click(function () {
		
		var uuid = guid();
		console.log($('#badgeID').val() + " " + $('#punchtype option:selected').text() + " " + $('#punchtype').val() + " " + $('#timepicker').val() + " " + $('#uniqueID').val());
		//checks modal if input fields are not empty, if they are it will show an alert message
		if ($('#badgeID').val() == '' || $('#punchtype select option:selected').val() == '' || $('#timepicker').val() == '') {
			$('#alert_placeholder').html('<p class="flow-text red-text text-darken-1" id="alert_placeholder"><i class="small mdi-alert-warning yellow-text text-darken-2" style="float:left; margin:0 7px 0px 0;"></i>You missed a field!</p>')

		} else {

			
			var tabledata; 
			tabledata = {
				badgeID : $('#badgeID').val(),
				uuid : uuid,
				punchType : $('#punchtype option:selected').text(),
				punch : $('#punchtype').val(),
				time : $('#timepicker').val(),
				status: "no",
				button: "<button class='delete btn waves-effect waves-light red'><span class='mdi-action-highlight-remove'></span></button>",
				
		};

			oTable.row.add(tabledata).draw();
			dataSet.push(tabledata);
			localStorage.setItem('dataSet', JSON.stringify(dataSet));
			//chrome.extension.sendRequest({ msg: "reloadalarm" }); setTimeout(alarmsqueue,1000);//runs the createalarm(); function in the background.js
				
		}
		//$( ".addnothing" ).hide("slow");
	$( ".addnothing" ).hide("slow").empty();
	return false;
	});
	
	$(document).on('click', '.delete', function () {
		var index = $(this).closest('tr').attr('id').split('-')[1];
		var row = $(this).closest('tr');

		oTable.row(row).remove().draw();
		
		dataSet.splice(index, 1);
		localStorage.setItem('dataSet', JSON.stringify(dataSet));
/* 		
		realdataSet.splice(index, 1);
		localStorage.setItem('realdataSet', JSON.stringify(realdataSet)); */

	});

	$(document).on('click', '.test-3', function () {
	chrome.alarms.clearAll();
	});

	$(".alarmsinq").click(function (){alarmsqueue();});
	$(".removealarms").click(function () {chrome.extension.sendRequest({ msg: "clearalarms" }); setTimeout(alarmsqueue,1000);//runs the clearalarm(); function in the background.js
	});
	$(".reloadalarms").click(function () {chrome.extension.sendRequest({ msg: "createalarm" }); setTimeout(alarmsqueue,1000);//runs the createalarm(); function in the background.js
	});
	
	function alarmsqueue() {
	var alarmLogger = function(alarm){ console.log(alarm.name + " " + alarm.scheduledTime) };
	chrome.alarms.getAll(function(alarms){
	alarms.forEach(alarmLogger); 
		for (i=0;i<alarms.length;i++){
			console.log(i+1);
            //do whatever the alarm was supposed to do.
        }
		console.log(i);
		});
		
	};
	alarmsqueue();
}); //END