function switchView(newView){
	$("#loadingView").hide();
	var oldView = window["oldView"];
	$(oldView).fadeOut('fast', function(){
        $(newView).fadeIn('fast');
    });
	window["oldView"] = newView;
}

function login()
{
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;

    if(username == "")
    {
        navigator.notification.alert("Please enter username", null, "Username Missing", "OK");
        return;
    }

    if(password == "")
    {
        navigator.notification.alert("Please enter password", null, "Password Missing", "OK");  
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://moodlighting.co/wp-admin/admin-ajax.php?action=login&username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password));
    xhr.onload = function(){
        if(xhr.responseText == "FALSE"){
            navigator.notification.alert("Wrong Username and Password", null, "Wrong Creds", "Try Again");
        }
        else if(xhr.responseText == "TRUE" || xhr.responseText == "ALREADY_LOGGED_IN"){
            switchView("#homeView");
        }
		else{
			navigator.notification.alert(xhr.responseText, null, "Error response:", "Try Again");
		}
    }   
    xhr.send();
}

function logout()
{
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://moodlighting.co/wp-admin/admin-ajax.php?action=logout");
    xhr.onload = function(){
        if(xhr.responseText == "LOGGED_OUT")
        {
            switchView("#loginView");
        }
		else if(xhr.responseText == "ALREADY_LOGGED_OUT")
        {
            switchView("#loginView");
        }
    }   
    xhr.send();
}

function sendMessage(){
	try {
		udptransmit.initialize("192.168.1.193", 2390);
		udptransmit.sendMessage("%101008000255000005000\n");
	}
	catch(err) {
		alert(err.message)
	}
}

function initialize()
{
	window["oldView"] = "#loadingView";
	switchView("#loginView");
	
	var username = "nothing";
	var password = "nothing";

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://moodlighting.co/wp-admin/admin-ajax.php?action=login&username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password));
    xhr.onload = function(){
		if(xhr.responseText == "ALREADY_LOGGED_IN")
        {
            switchView("#homeView");
        }
		else{
			switchView("#loginView");
		}
    }   
    xhr.send();
}

function open_browser(link)
{
    window.open(link, '_blank', 'location=yes');
}