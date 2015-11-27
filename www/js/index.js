$( window ).load(startApp);

function notify(dialog, title, button){
	try{
		navigator.notification.alert(dialog, null, title, button);
	}
	catch(err){
		alert(dialog);
	}
}

function switchView(newView,newTitle,showHead){
	var oldView = window["oldView"];
	$(oldView).fadeOut('fast', function(){
		if(showHead == false){
			$("#topBar").hide();
		}
		else{
			$("#topBar").show();
		}
        $("#title").html(newTitle);
		$(newView).fadeIn('fast');
    });
	window["oldView"] = newView;
}

function login(){
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;

    if(username == "")
    {
        notify("Please enter username", "Username Missing", "OK");
        return;
    }

    if(password == "")
    {
        notify("Please enter password","Password Missing", "OK"); 
        return;
    }

	switchView("#loadingView","Loading",false);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://moodlighting.co/wp-admin/admin-ajax.php?action=login&username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password),true);
    xhr.onload = function(){
        if(xhr.responseText == "FALSE"){
            notify("Wrong Username and Password", "Wrong Creds", "Try Again");
			switchView("#loginView","Log In",false);
        }
        else if(xhr.responseText == "TRUE" || xhr.responseText == "ALREADY_LOGGED_IN"){
            switchView("#homeView","Home");
        }
		else{
			notify(xhr.responseText, "Error response:", "Try Again");
		}
    }   
    xhr.send();
}

function logout(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://moodlighting.co/wp-admin/admin-ajax.php?action=logout",true);
    xhr.onload = function(){
        if(xhr.responseText == "LOGGED_OUT")
        {
            switchView("#loginView","Log In",false);
        }
		else if(xhr.responseText == "ALREADY_LOGGED_OUT")
        {
            switchView("#loginView","Log In",false);
        }
    }   
    xhr.send();
}

function sendMessage(){
	try {
		var command = String(document.getElementById("command").value);
		udptransmit.initialize("192.168.1.193", 2390);
		udptransmit.sendMessage("%"+command+"\n");
	}
	catch(err) {
		notify(err,"Error", "OK");  
	}
}

function startApp(){
	try{
	notify("Hello!", "Welcome", "Proceed");
	window["oldView"] = "#loginView";
	switchView("#loginView","Log In",false);
		
	var username = "nothing";
	var password = "nothing";
	
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://moodlighting.co/wp-admin/admin-ajax.php?action=login&username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password),true);
	xhr.onload = function(){
		if(xhr.responseText == "ALREADY_LOGGED_IN"){
			switchView("#homeView","Home");
		}
	}   
	xhr.send();
	}
	catch(err){
		alert(err);
	}
}

function open_browser(link){
    window.open(link, '_blank', 'location=yes');
}