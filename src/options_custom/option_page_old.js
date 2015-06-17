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
	$('.clockpicker').clockpicker({donetext: 'Done',autoclose: true,align: 'right',});
			
	//$('.addnothing').hide();
	$('#addnothing').click(function() {
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
	$('select').material_select();

	$('.boom').click(function () {
	printStorageBody();
	});

	var dataSet;
	var realdataSet;

	try{
		dataSet = JSON.parse(localStorage.getItem('dataSet')) || [];
		realdataSet = JSON.parse(localStorage.getItem('realdataSet')) || [];
	} catch (err) {
		dataSet = [];
	}
	
	//initiates DataTable
	$('#myTable').dataTable({
		"data": [],
			"columns": [{
			"title": "UUID"
		},{
			"title": "ID"
		}, {
			"title": "Type"
		}, {
		"title": "Value"
		}, {
			"title": "Time"
		}, {
			"title": "Action"
		}],
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

	//saves entry to localStorage
	$('#Save').click(function () {
		console.log($('#badgeID').val() + $('#punchtype').val() + $('#timepicker').val());
		//checks modal if input fields are not empty, if they are it will show an alert message
		if ($('#badgeID').val() == '' || $('#punchtype select option:selected').val() == '' || $('.time').val() == '') {
			$('#alert_placeholder').html('<p class="flow-text red-text text-darken-1" id="alert_placeholder"><i class="small mdi-alert-warning yellow-text text-darken-2" style="float:left; margin:0 7px 0px 0;"></i>You missed a field!</p>')

		} else {
			var uuid = guid();
			var tabledata = [
				uuid,
				$('#badgeID').val(),
				$('#punchtype option:selected').text(),
				$('#punchtype').val(),
				$('#timepicker').val(),
				"<button class='delete btn waves-effect waves-light red'><span class='mdi-action-highlight-remove'></span></button>"
			];
			oTable.row.add(tabledata).draw();
			dataSet.push(tabledata);
			localStorage.setItem('dataSet', JSON.stringify(dataSet));
			
			
			var newItem  = {
				
				uuid : uuid,
				badgeID : $('#badgeID').val(),
				punchType : $('#punchtype option:selected').text(),
				punch : $('#punchtype').val(),
				time : $('#timepicker').val(),
				button: "<button class='delete btn waves-effect waves-light red'><span class='mdi-action-highlight-remove'></span></button>",
				status: "no",
				
			};
			realdataSet.push(newItem);
			localStorage.setItem("realdataSet", JSON.stringify(realdataSet));   
			chrome.extension.sendRequest({ msg: "reloadalarm" }); setTimeout(alarmsqueue,1000);//runs the createalarm(); function in the background.js
			//$('#addpunchmodal').modal('hide')		
			
		}
	
	
	});
	
	$(document).on('click', '.delete', function () {
		var index = $(this).closest('tr').attr('id').split('-')[1];
		var row = $(this).closest('tr');

		oTable.row(row).remove().draw();
		
		dataSet.splice(index, 1);
		localStorage.setItem('dataSet', JSON.stringify(dataSet));
		
		realdataSet.splice(index, 1);
		localStorage.setItem('realdataSet', JSON.stringify(realdataSet));

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