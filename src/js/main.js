// onlick event: mark as read || unread
var readButton  = document.getElementById("readMarker");

readButton.onlick = function() {
	if (readButton.className == "read-btn") {
		// toggle as read
		readButton.innerHTML  = "Mark as Read";

	}
	else {
		// toggle as Unread
		readButton.className = "";
		readButton.innerHTML  = "Mark as Unread";
	}
};