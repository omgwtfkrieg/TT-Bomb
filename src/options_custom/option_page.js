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

 $(document).ready(function(){
	starttimepicker ();
	//getpunchval ();
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
	

  
});

function starttimepicker () {
$('.timepicker1').timepicker();
};
