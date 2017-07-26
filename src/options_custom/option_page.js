$(function() {
	
	// window.onload = function() {
		// var htmlStyle = document.querySelector('html').style;
		// chrome.windows.getCurrent(function(currentWindow) {
			// htmlStyle.height = (currentWindow.height*.9) + 'px';
			//htmlStyle.width = (currentWindow.width*.9) + 'px';
			// console.log(htmlStyle.height, htmlStyle.width);
		// });
	// };
	
	$(document).ready(function(){
		$('.tooltipped').tooltip({delay: 50});
	});
	moment().format();
	var random = Math.floor(Math.random() * 10+1) ;
	console.log("random number " + random);
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

	//Initialise Select for Materialise CSS
	$('#multipleSelect').material_select();
	//Making value available globally





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
			{ "sTitle": "UID", "mData": "uuid", "sClass": "hide center-align" },
			{ "sTitle": "ID", "mData": "smashID", "sClass": "center-align" },
			{ "sTitle": "Type", "mData": "smashType", "sClass": "center-align" },
			{ "sTitle": "Value", "mData": "smash", "sClass": "hide center-align"  },
			{ "sTitle": "Time", "mData": "time", "sClass": "center-align" },
			{ "sTitle": "Day", "mData": "day", "sClass": "center-align" },
			{ "sTitle": "Remove", "mData": "button", "sClass": "center-align" },

        ],

			"bStateSave": true,
			"stateSave": true,
			"bPaginate": false,
			"bLengthChange": false,
			"bFilter": false,
			"bInfo": false,
			"bAutoWidth": false,
			"fnCreatedRow": function (nRow, aData, iDataIndex) {
				$(nRow).attr('id', 'row-' + iDataIndex); // this adds a custom row ID for each entry
			},
	});
	oTable = $('#myTable').DataTable();
	for (var i = 0; i < dataSet.length; i++) {
		oTable.row.add(dataSet[i]).draw();
		$("#myTable td:contains('no')").html("<i class='center-align material-icons teal-text lighten-2-text'>check</i>");
		$("#myTable td:contains('deleteme')").html("<a class='delete red-text'><i class='material-icons'>delete</i></a>");

		//will convert epoch to human in the tables
		var momentdatasettime = dataSet[i].time;
		var momenttableop = moment(momentdatasettime).format("MMMM Do YYYY, h:mm:ss a");
		$("#myTable td:contains('" + momentdatasettime + "')").html("" + momenttableop + "");

	}

	///////////////////////////////////////////////////////
	// Saves entries to localStorage in order for DataTable to read
	////////////////////////////////////////////////////////

	$('#Save').click(function () {

		var uuid = guid();
		//var day = multiSelectValue();

		var newValuesArr = [],

		//The way Materialise CSS treats select will not pass multi option value, work around
		select = $('#multipleSelect'),
		ul = select.prev();
		ul.children('li').toArray().forEach(function (li, i) {
			if ($(li).hasClass('active')) {
				newValuesArr.push(select.children('option').toArray()[i].value);
			}
		});

		select.val(newValuesArr);

		//checks if input fields are not empty, if they are it will show an alert message
		if ($('#smashID').val() === '' || $('#smashType select option:selected').val() === '' || $('#timepicker').val() === '') {
			$('#alert_placeholder').hide().html('<p class="flow-text red-text text-darken-1" id="alert_placeholder"><i class="small mdi-alert-warning yellow-text text-darken-2" style="float:left; margin:0 7px 0px 0;"></i>You missed a field!<a href="#"><i class="material-icons">clear</i></a></p>').fadeIn('slow');

		} else {
			var timepicker = $('#timepicker').val();
			var tt = timepicker.split(":");
			var momentnow = moment().hour(tt[0]).minutes(tt[1]); //uses moment.js to grab current local date and adds the time to epoch
			momentnow = moment(momentnow).valueOf();
			//momentnow = moment(momentnow).unix();
			var currentime = moment();
			var checkifbefore = moment(momentnow).isBefore(currentime);
			if (checkifbefore){
				momentnow = moment(momentnow).add(1, 'days').valueOf();
			}

			var tabledata;
			tabledata = {
				uuid : uuid,
				smashID : $('#smashID').val(),
				smashType : $('#smashType option:selected').text(),
				smash : $('#smashType').val(),
				time : momentnow,
				day : newValuesArr,
				button: "deleteme",

		};

			oTable.row.add(tabledata).draw();
			$("#myTable td:contains('no')").html("<i class='center-align material-icons teal-text lighten-2-text'>check</i>");
			$("#myTable td:contains('deleteme')").html("<a class='delete red-text'><i class='material-icons'>delete</i></a>");

			var momenttableop = moment(momentnow).format("MMMM Do YYYY, h:mm:ss a");
			$("#myTable td:contains('" + momentnow + "')").html("" + momenttableop + "");

			dataSet.push(tabledata);
			localStorage.setItem('dataSet', JSON.stringify(dataSet));

				$('#alert_placeholder').empty();
				$('#addsmashinqueue')[0].reset();
				$('#Save').prop("disabled", true);
				$('.addnothing').fadeToggle( "fast", "linear" );
		}
		port.postMessage({answer: "Create Alarms"});
		return false;
	});

	$(document).on('click', '.delete', function () {
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
		port.postMessage({answer: "Test"});var alarmLogger = function(alarm){
		console.log(alarm.name + " " + alarm.scheduledTime)
		};
		var alarmsqlist = function(alarm){
			var epoch = alarm.scheduledTime;
			var epoch2 = parseInt((""+epoch).substring(0,13), 10);
			var dt = new Date(epoch2);
		$( 'ul#queue_list').append( '<li class=\'collection-item\'>' + alarm.name + ' <br/ >' + dt + '</li>' );
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
		$(".addnothing").fadeToggle( "fast", "linear" );//adds the fade in animation to the form when loading
		return false;
	});
	$('.clockpicker').clockpicker({donetext: 'Done',autoclose: true,});//initialize the clock picker in the time input box
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

}); //END
