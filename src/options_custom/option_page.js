$(function() {

$('.boom').click(function () {
printStorageBody();
});

var printStorageBody = function(){
    // $("body").html("");
    // for(var i=0;i<localStorage.length ;i++)
        // $("body").append(i + " : " + localStorage.getItem(localStorage.key(i)) + "<br />");
		
	// var json = JSON.parse(localStorage["dataSet"]);
	// for (i=0;i<json.length;i++){
				// if (json[i] == '12:15 AM') {
				// alert("hello");
				// };}
	// localStorage["results"] = JSON.stringify(json);
};

	$('#datetimepicker1').timepicker({});


	var dataSet;
	var realdataSet;

	try{
		dataSet = JSON.parse(localStorage.getItem('dataSet')) || [];
	} catch (err) {
		dataSet = [];
	}
	
	$('#myTable').dataTable({
		"data": [],
			"columns": [{
			"title": "Badge ID"
		}, {
			"title": "Punch Type"
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
			
	});
	oTable = $('#myTable').DataTable();
	for (var i = 0; i < dataSet.length; i++) {
		oTable.row.add(dataSet[i]).draw();
	}

	
	$('#Save').click(function () {
		

		if ($('#badgeID').val() == '' || $('#punchtype select option:selected').val() == '' || $('.time').val() == '') {
			$('#alert_placeholder').html('<div id="dialog-confirm" title="Error" class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 0px 0;"></span>Please fill all the required fields!</p></div>')

		} else {
			
			var tabledata = [
				$('#badgeID').val(),
				$('#punchtype option:selected').text(),
				$('#punchtype').val(),
				$('.time').val(),
				"<button class='delete btn btn-danger'><span class='glyphicon glyphicon-remove'></span></button>"
			];
			oTable.row.add(tabledata).draw();
			dataSet.push(tabledata);
			localStorage.setItem('dataSet', JSON.stringify(dataSet));
			
			var realdataSet = JSON.parse(localStorage.getItem('realdataSet')) || [];
			var newItem  = {
				badgeID : $('#badgeID').val(),
				punchType : $('#punchtype option:selected').text(),
				punch : $('#punchtype').val(),
				time : $('.time').val(),
				button: "<button class='delete btn btn-danger'><span class='glyphicon glyphicon-remove'></span></button>"
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
		var row = $(this).closest('tr');
		var index = $("tbody").children().index(row);
		oTable.row(row).remove().draw();
		dataSet.splice(index, 1);
		localStorage.setItem('dataSet', JSON.stringify(dataSet));  
		realdataSet.splice(index, 1);
		localStorage.setItem('realdataSet', JSON.stringify(realdataSet));  		
	});
	
});

/* jQuery(function($){

  var page = $('#options-page'); 
  var newQuery = page.find('.new');
  var tpl = page.find('.template');
  tpl.hide();
  var id = 0;

  function createQuery(id){
    if ($('#row-' + id).length > 0){
      return $('#row-' + id);
    }
    var c = tpl.clone();
    c.removeClass('template');
    tpl.parent().append(c);
    c.show();
    c.attr('id', 'row-' + id);
    c.find('.url').attr('name', 'url-' + id);
    c.find('.query').attr('name', 'query-' + id);
    c.find('.value').attr('name', 'value-' + id);
	c.find('.time').attr('name', 'time-' + id);
	c.find('.punch').attr('name', 'punch-' + id);
	
	$('.timepicker1').timepicker();
	
	$("select[name^='punch_type_OP']").change('change keyup paste click', function(){
		$("input[name^='punch-']").val($(this).val());
	});
	$("input[name^='time_type_OP']").change('change keyup paste click', function(){
		$("input[name^=time-]").val($(this).val());
	});
	//$("input[name^='punch_type_OP']").hide();
	
    c.find('.remove').click(function(){
      c.remove();
      var id = c.attr('id').replace(/row-/, '');
      localStorage.removeItem('url-' + id);
      localStorage.removeItem('query-' + id);
      localStorage.removeItem('value-' + id);
	  localStorage.removeItem('time-' + id);
	  return false;
    });
    return c;
  }
  newQuery.click(function(){
  console.log("new button works");
    createQuery(++id);
    return false;
  });
  
  page.find('input[type=checkbox]').each(function(){
    var key = $(this).attr('name');
    localStorage[key] = localStorage[key] || '';
    if (localStorage[key]){
      $(this).attr('checked', 'checked');
    }
    $(this).change(function(){
      if ($(this).attr('checked')){
        localStorage[key] = 'checked';
      }else{
        localStorage[key] = '';
      }
    });
  });
  
  if (typeof (window.localStorage) != "undefined") {

        // will get value of specific id from the browser localStorage and set to the input 
        page.find("input[type=text]").val(function () {
            return localStorage.getItem(this.id);
        });

        // will set values in browser localStorage for further reference
        page.find("input[type=text]").on("change", function () {
            localStorage.setItem(this.id, $(this).val());
			console.log("Input has changed");
        });
		
	}
 
  */
 
  //page.find('input[type=text]').on("input", function(){
  //page.find.on("change", 'input[type=text]', function(){
  //page.on('change keyup paste click', 'input[type=text]', function(){
  //page.find('input[type=text]').on("input", function(){
    //var key = $(this).attr('name');
	//var inputvalue = $(this).val();
	
    //localStorage[key] = $(this).val();
	//console.log("it works");
	//alert(inputvalue);
	//alert("works?"+$(this).val());
  //});

/* 
  for (var k in localStorage){
    if (k.match(/^(query|url|value|time|punch)-(\d+)/)){
      var type = RegExp.$1;
      var id = RegExp.$2;
      var c = createQuery(id);
      c.find('.' + type).val(localStorage[k]);
    }
  };
  
  if (id == 0){
    var c = createQuery(++id);
    c.find('.url').val('http://akkunchoi.github.io/Autofill-chrome-extension/.*');
    c.find('.query').val('input[name=example]');
    c.find('.value').val('Hello world!');
	c.find('.punch').val();
	c.find('.time').val();
    c.find('input').trigger('change');

  }
}); */

/* // Saves options to chrome.storage
function save_options() {
  var punchtype_OP = document.getElementById('punchtype_OP').value;
  var likesColor = document.getElementById('like').checked;
  var badgeID_OP = document.getElementById('badgeID_OP').value;
  chrome.storage.sync.set({
    favoriteColor: punchtype_OP,
    likesColor: likesColor,
	badgeID_OP: badgeID_OP
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
	badgeID_OP: '12345',
    favoriteColor: 'FN1',
    likesColor: true
  }, function(items) {
    document.getElementById('punchtype_OP').value = items.favoriteColor;
    document.getElementById('like').checked = items.likesColor;
    document.getElementById('badgeID_OP').value = items.badgeID_OP;
	
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options); */

/*  $(document).ready(function(){

	starttimepicker ();
/* 	//getpunchval ();
      var i=1;
	  
	 
    $("#add_row").click(function(){
		$('#addr'+i).html("<td>"+ (i+1) +"</td><td class='col-lg-4'><input type='text' name='badgeID_OP"+i+"'  placeholder='Badge ID: 12345' class='form-control' maxlength='5'/></td><td><div class='input-group bootstrap-timepicker'><input name='schedule"+i+"' class='form-control col-lg-2 timepicker1' type='text' ><span class='input-group-addon'><i class='glyphicon glyphicon-time'></i></span></div></td><td class='col-lg-4'><select name='punch_select"+i+"' class='form-control punch_type_OP'><option value='FN1'>In for the day</option><option value='FN2'>Back from lunch</option><option value='FN3'>Out</option><option value='FN5'>End of the day</option></select></td></tr>");
		//starttimepicker ();
		//getpunchval ();
		$('.timepicker1').timepicker();
		$('#tab_logic').append('<tr id="addr'+(i+1)+'"></tr>');
		i++; 
		
	});
	
    $("#delete_row").click(function(){
    	 if(i>1){
		 $("#addr"+(i-1)).html('');
		 i--;
		 }
		 getpunchval ();
	});
	

	$('#tab_logic').find('input[type=text]').live('keyup', function(){
		var key = $(this).attr('name');
		localStorage[key] = $(this).val();
	});
	
	for (var k in localStorage){
		if (k.match(/^(query|url|value|punch)-(\d+)/)){
			var type = RegExp.$1;
			var id = RegExp.$2;
			var c = createQuery(id);
			c.find('.' + type).val(localStorage[k]);
		}
	};

	$("select[name^='punch_select']").change(function () {
		alert($(this).val())
	});
	

   */
/*}); */

//function starttimepicker () {
  //  $('.datetimepicker1').datetimepicker({
      
    //});
//$('.timepicker1').timepicker();
//};