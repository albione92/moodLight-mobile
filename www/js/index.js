startApp();

document.addEventListener("deviceready", onDeviceReady, false);
window["devicesList"] = "NONE";

function onDeviceReady(){
    document.addEventListener("backbutton", function(e){
       if($.mobile.activePage.is('#homepage')){
           e.preventDefault();
           navigator.app.exitApp();
       }
       else {
           navigator.app.backHistory()
       }
    }, false);
}

$(function() {
    FastClick.attach(document.body);
});

function toggleMenu(state){
	if(state == true){
		$("body").css("overflow", "hidden");
		$('#container').removeClass('slideOut').addClass('slideIn');
		$('#mask').show();
	}
	else if(state == false){
		$("body").css("overflow", "visible");
		$('#container').removeClass('slideIn').addClass('slideOut');
		$('#mask').hide();
	}
}

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
		toggleMenu(false);
    });
	window["oldView"] = newView;
}

function showMessage(title,content,color){
	color = color || "#235f34";
	$('.messages').css('background-color',color);
	$( ".messages > .inner > .title" ).html(title);
	$( ".messages > .inner > .content" ).html(content);
	$('.messages').fadeIn("fast");
	setTimeout(function(){
		$('.messages').fadeOut("fast");
	},3000);
}

function showAlert(content,color){
	color = color || "#235f34";
	$('.alerts').css('background-color',color);
	$( ".alerts > .inner").html(content);
	$('.alerts').fadeIn("fast");
	setTimeout(function(){
		$('.alerts').fadeOut("fast");
	},3000);
}

function loginSuccess(){
	window["loggedIn"] = true;
	switchView("#homeView","Home");
	getDevices();
	setInterval(getDevices,5000);
}

function getDevices(){
	if(window["loggedIn"] == true){
		
	var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://moodlighting.co/wp-admin/admin-ajax.php?action=get_user_info",true);
    xhr.onload = function(){
		if(xhr.responseText.substring(0, 13) == '{"devices":[]'){
			outHTML =
				"<div class='inform'>"+
					"<div class='inner'>"+
						"No devices added!"+
					"</div>"+
				"</div>";
				
			$("#deviceList").html(outHTML);
		}
		else{
			if(xhr.responseText != window["devicesList"]){
				window["devicesList"] = xhr.responseText;
				outHTML = "";
				data = JSON.parse(xhr.responseText);
				window["username"] = data["username"];
				window["email"] = data["email"];
				
				$("#accountName").html(window["email"]);
				
				data["devices"].forEach(function(entry) {
					nickname = entry["nickname"];
					mode = entry["mode"];
					ip = entry["ip"];
					outHTML += 
						"<div class='deviceli'>"+
							"<div class='inner'>"+
								"<span class='nick'>"+
									nickname+
								"</span>"+
								"<span class='ip'>"+
									ip+
								"</span>"+
							"</div>"+
						"</div>";
				});
				$("#deviceList").fadeOut("fast",function(){
					$("#deviceList").html(outHTML);
					$("#deviceList").fadeIn("fast");
					showAlert("Device list updated!");
				});
					
			}
		}
    };   
    xhr.send();
	
	}
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
			loginSuccess();
		}
		else{
			notify(xhr.responseText, "Error response:", "Try Again");
		}
    };   
    xhr.send();
}

function logout(){
	window["loggedIn"] = false;
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
    }; 
    xhr.send();
}

function sendMessage(){
	try {
		var command = String(document.getElementById("command").value);
		udptransmit.initialize("192.168.1.193", 2390);
		udptransmit.sendMessage("%"+command+"\n");
		showAlert("Sent UDP: '%"+command+"\\n'");
	}
	catch(err) {
		notify(err.message,"Error", "OK");  
	}
}

function startApp(){
	try{
	window["oldView"] = "#loginView";
	switchView("#loginView","Log In",false);
		
	var username = "nothing";
	var password = "nothing";
	
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://moodlighting.co/wp-admin/admin-ajax.php?action=login&username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password),true);
	xhr.onload = function(){
		if(xhr.responseText == "ALREADY_LOGGED_IN"){
			loginSuccess();
		}
	};   
	xhr.send();
	}
	catch(err){
		alert(err);
	}
	return;
}

function open_browser(link){
    window.open(link, '_blank', 'location=yes');
}