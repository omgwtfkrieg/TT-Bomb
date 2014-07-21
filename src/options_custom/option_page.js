// Saves options to chrome.storage
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
document.getElementById('save').addEventListener('click', save_options);