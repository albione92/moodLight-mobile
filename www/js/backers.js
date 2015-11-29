function writeBackers(){
	alert("WRITE");
	
	backers = [
		"Cody Clendenen",
		"FORCE LLC",
		"Mike Mogenson",
		"Ricky Wright",
	];
	
	var outString = "TEST";
	backers.forEach(function(entry) {
		outString+=entry;
	}

	$("#backerList").html(outString);
}