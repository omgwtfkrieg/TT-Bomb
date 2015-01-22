$(function() {
$('[data-toggle="tooltip"]').tooltip()

			////////////////////////////////////////////////////////
			// Generate rudimentary unique ID.
			////////////////////////////////////////////////////////
			var guid = (function() {
			  function s4() {
				return Math.floor((1 + Math.random()) * 0x10000)
						   .toString(16)
						   .substring(1);
			  }
			  return function() {
				return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
					   s4() + '-' + s4() + s4() + s4();
			  };
			})();
			
			//console.log(uuid)
			////////////////////////////////////////////////////////

$('.boom').click(function () {
printStorageBody();
});

	//initiates bootstrap-timepicker
	$('#datetimepicker1').timepicker({
		defaultTime: 'current',
		showMeridian: false,
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
		"title": "Punch Value"
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
		
		//checks modal if input fields are not empty, if they are it will show an alert message
		if ($('#badgeID').val() == '' || $('#punchtype select option:selected').val() == '' || $('.time').val() == '') {
			$('#alert_placeholder').html('<div id="dialog-confirm" title="Error" class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 0px 0;"></span>Please fill all the required fields!</p></div>')

		} else {
			var uuid = guid();
			var tabledata = [
				uuid = uuid,
				$('#badgeID').val(),
				$('#punchtype option:selected').text(),
				$('#punchtype').val(),
				$('.time').val(),
				"<button class='delete btn btn-danger'><span class='glyphicon glyphicon-remove'></span></button>"
			];
			oTable.row.add(tabledata).draw();
			dataSet.push(tabledata);
			localStorage.setItem('dataSet', JSON.stringify(dataSet));
			
			
			var newItem  = {
				
				uuid : uuid,
				badgeID : $('#badgeID').val(),
				punchType : $('#punchtype option:selected').text(),
				punch : $('#punchtype').val(),
				time : $('.time').val(),
				button: "<button class='delete btn btn-danger'><span class='glyphicon glyphicon-remove'></span></button>",
				status: "no",
				
			};
			realdataSet.push(newItem);
			localStorage.setItem("realdataSet", JSON.stringify(realdataSet));   
			$('#addpunchmodal').modal('hide')		

		}
	
	
	});
	$('#addpunchmodal').on('shown.bs.modal', function (e) {
		$('#datetimepicker1').timepicker({});
		$('#badgeID').attr({ maxLength : 5 });
	})
	
	$('#addpunchmodal').on('hidden.bs.modal', function (e) {
		$('badgeID').val('');
		$('punchtype').val('');
		$(this).prop('checked', false);
		$(".alert").alert('close')
	})
	
	$(document).on('click', '.delete', function () {
		var index = $(this).closest('tr').attr('id').split('-')[1];
		var row = $(this).closest('tr');

		oTable.row(row).remove().draw();
		
		dataSet.splice(index, 1);
		localStorage.setItem('dataSet', JSON.stringify(dataSet));
		
		realdataSet.splice(index, 1);
		localStorage.setItem('realdataSet', JSON.stringify(realdataSet));

		
		
	});

	$(document).on('click', '.test-1', function () {
		//var data = JSON.parse(localStorage.getItem("realdataSet"));
			//alert(data[0].badgeID + "--" + data[0].punchType +"--"+ data[0].punch +"--"+ data[0].time
		//);
/* 		for (var i=0; i<100; i++) {
		   if (localStorage('dataset'+i) == "3:15 PM")
		} */
		//This will compare current time and stored time in localStorage and get all data from that entry 
		//lets get currenttime
		//var d = new Date();
		//alert (d);
		//var hourString;
		//var hourInt;
		//var amPm = "AM";
		//if ( d.getHours() > 11 ) {
		//	amPm = "PM"
		//	hourString = d.getHours() - 12;
		//} else {
		//	amPm = "AM"
		//	hourString = d.getHours();
		//}

		//chrome.storage.local.clear()
		//chrome.storage.local.get(null, function (TTbombKey) {console.log(TTbombKey)});
		

		//var currenttime = hourString + ":" + d.getMinutes() + " " + amPm;
		//alert (currenttime);
		
		/* var json = JSON.parse(localStorage.getItem("realdataSet"));
		for (i=0;i<json.length;i++){
					if (json[i].time == "4:00 PM"){
						alert(json[i].badgeID + "--" + json[i].punchType +"--"+ json[i].punch +"--"+ json[i].time);
					};} */

		
	});

	$(document).on('click', '.test-2', function () {
	chrome.extension.sendRequest({ msg: "alarmsqueue" });
	// var alarmLogger = function(alarm){ console.log(alarm.name + " " + alarm.scheduledTime) };
	// chrome.alarms.getAll(function(alarms){ alarms.forEach(alarmLogger); });
	});
	$(document).on('click', '.test-3', function () {
	chrome.alarms.clearAll();
	});
	// $(document).on('click', '.test-4', function () {
	// chrome.extension.sendRequest({ msg: "reloadalarm" });//runs the createalarm(); function in the background.js
	// });

	$(".alarmsinq").click(alarmsqueue);
	$(".removealarms").click(function () {chrome.alarms.clearAll();alarmsqueue();});
	$(".reloadalarms").click(function () {chrome.extension.sendRequest({ msg: "reloadalarm" }); setTimeout(alarmsqueue,500);//runs the createalarm(); function in the background.js
	});
	
	function alarmsqueue() {
	var alarmLogger = function(alarm){ console.log(alarm.name + " " + alarm.scheduledTime) };
	chrome.alarms.getAll(function(alarms){
	alarms.forEach(alarmLogger); 
		for (i=0;i<alarms.length;i++){
			//console.log(i+1);
            //do whatever the alarm was supposed to do.
        }
		console.log(i);
		//$(".alarmsinq span").text(i);
// Animate the element's value from 0% to 110%:
			$({someValue: 0}).animate({someValue: i}, {
				duration: 500,
				easing:'swing', // can be anything
				step: function() { // called on every step
					// Update the element's text with rounded-up value:
					$('.alarmsinq span').text(Math.ceil(this.someValue));
				}
			}); 
		});
		
	};
	alarmsqueue();
}); //END