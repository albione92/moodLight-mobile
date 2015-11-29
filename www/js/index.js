startApp();

document.addEventListener("deviceready", onDeviceReady, false);
window["devicesList"] = "NONE";
window["menuState"] = false;
window["gotData"] = false;

function onDeviceReady(){
    document.addEventListener("backbutton", function(e){
       if(window["viewActive"] == "#homeView"){
           e.preventDefault();
           navigator.app.exitApp();
       }
       else {
           navigator.app.backHistory();
       }
    }, false);
}

$(function() {
	FastClick.attach(document.body);
	$("#email").val(localStorage.getItem("email"));
	writeCredits();
	setInterval(function(){
		if(window["loggedIn"] == true){
			getData();
		}
	},60000);
});

function writeCredits(){
	specials = [
		"Reggie Bellinger","G S Reddy","Marc DeBonis","Ken Nickerson","Chantelle Benson"
	];
	
	backers = [
		"Reggie Bellinger","G S Reddy","Marc DeBonis","Ken Nickerson","Cody Clendenen","FORCE LLC","Mike Mogenson","Ricky Wright",
		"Josiah Means","Bates Research & Development","Jiten Chandiramani","Richard Tang","George Cisko","Derek Blankenship","Reese C. Hand","Paul Luchini",
		"Xingyang Cai","Katherine McKenzie","Jason Noodle Laurianti","Pakorn Jaruspanavasan","Gail j","Nicholas Martin","SO32 2BL","Harrison Jones",
		"Glynn Haystonopoulos","Rob Muehleisen","willis wolfgram","Mats Thell","Cory Benjamin","David Hamjediers","Ian Bailey",
		"Steven M","Sam Lyon","Raphi Houri","Benjamin Garner","Markus Jahn","Todd Sims","Michelle Rose","Michael Stelzl",
		"John","Roel kerkhofs","Auman Hartwig [R+D]","Torben Steeg","Justin Tyme","D J","Terri Ann","Geoff Coves",
		"Amelior","Roberto","Austin Brown","Andrew Macdonald","Stacy Webb","robin van haelst","Michelle Arnell Jackson","Adam Tenhouse",
		"Andy Fine","Chip Schnarel","Sam Paynter","Kaytlyn Cortes","KW","Jared Kotoff","Chris Cobb","jsmith0012",
		"Daniel Hollands","Helen Errington","Martin Baratz","Mark Tokach","Franklin","Kadeem Warren","Pollyanna Ward","David Robertson",
		"John Shoemaker","Narasimha Sairam Yamanoor","Dayle Payne","Reed Martin","Antonio","Jon Moss","Ben Gould","Hendrik Rommens",
		"Sarah McGrew","Monty Cholmeley","Claus Österbauer","Justine Gastault","Christopher Danvers","Fraser Fitzgerald","M Müller","Robert Starliper",
		"Dag Ströman","David Hochrein","William Lee","David Cornejo","Gary Kuhre","Tristan","Seeya Sia","Jacob Loukota",
		"Stephan Groshek","yasmeen kashef","RJ"
	];
	
	var outString = "";
	specials.forEach(function(entry) {
		outString+='<span class="specialName">';
		outString+=entry.replace(" ","&nbsp;");
		outString+='</span>';
	});

	$("#specialList").html(outString);
	
	var outString = "";
	backers.forEach(function(entry) {
		outString+='<span class="backerName">';
		outString+=entry.replace(" ","&nbsp;");
		outString+='</span>';
	});

	$("#backerList").html(outString);
}

function toggleMenu(state){
		if(state == true){
			window["menuState"] = state;
			$("body").css("overflow", "hidden");
			$('#container').removeClass('slideOut').addClass('slideIn');
			$('#topBar').removeClass('slideOut').addClass('slideIn');
			$('#mask').show();
		}
		if(state == false){
			window["menuState"] = state;
			$("body").css("overflow", "visible");
			$('#container').removeClass('slideIn').addClass('slideOut');
			$('#topBar').removeClass('slideIn').addClass('slideOut');
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

function switchView(newView,newTitle,showHead,hideMenu){
	var oldView = window["oldView"];
	$(oldView).fadeOut('fast', function(){
		if(showHead == false){
			$("#topBar").hide();
			$("#topBarPush").hide();
		}
		else{
			$("#topBar").show();
			$("#topBarPush").show();
		}
        $("#title").html(newTitle);
		$(newView).fadeIn('fast',function(){
			window["viewActive"] = newView;
			if(hideMenu == true){
				toggleMenu(false);
			}
			if(newView == "#homeView" && window["gotData"] == false){
				getData();
			}
		});
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
	switchView("#homeView","Last 6 Hours",true,true);
	getDevices();
	setInterval(getDevices,5000);
	$("#splash").fadeOut("fast");
	
}

function getDevices(){
	if(window["loggedIn"] == true){
		
	var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://moodlighting.co/wp-admin/admin-ajax.php?action=get_user_info",true);
    xhr.onload = function(){
		data = JSON.parse(xhr.responseText);
		window["username"] = encodeURIComponent(data["username"]);
		window["email"] = data["email"];
		$("#accountName").html(window["email"]);
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
				
				data["devices"].forEach(function(entry) {
					nickname = entry["nickname"].replace("_", " ");
					mode = entry["mode"];
					ip = entry["ip"];
					outHTML += 
						"<div class='deviceli'>"+
							"<div class='inner'>"+
								"<span class='nick'>"+
									nickname.replace("_", " ")+
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

function signup(){
	var email = document.getElementById("emailNew").value;
	var password = document.getElementById("passwordNew").value;
	var password2 = document.getElementById("passwordNew2").value;

    if(email == "")
    {
        notify("Please enter your email", "Email Missing", "OK");
        return;
    }

    if(password == "")
    {
        notify("Please enter a password","Password Missing", "OK"); 
        return;
    }
	
	if(password2 != password)
    {
        notify("Password inputs do not match!","Password Mismatch", "OK"); 
        return;
    }

	switchView("#loadingView","Loading",false,false);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://moodlighting.co/wp-admin/admin-ajax.php?action=register_user&email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password),true);
    xhr.onload = function(){
        if(xhr.responseText == "TRUE" || xhr.responseText == "ALREADY_LOGGED_IN" || xhr.responseText == "USER_EXISTS"){
			var xhr2 = new XMLHttpRequest();
			xhr2.open("GET", "http://moodlighting.co/wp-admin/admin-ajax.php?action=login&email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password),true);
			xhr2.onload = function(){
				if(xhr2.responseText == "FALSE"){
					notify(xhr2.responseText, "Bad Creds", "Try Again");
					switchView("#signupView","Sign Up",false,false);
				}
				else if(xhr2.responseText == "TRUE" || xhr2.responseText == "ALREADY_LOGGED_IN"){
					localStorage.setItem("email",email);
					$("#email").val(email);
					loginSuccess();
				}
				else{
					notify(xhr2.responseText, "Error response (Login):", "Try Again");
					switchView("#signupView","Sign Up",false,false);
				}
			};   
			xhr2.send();
		}
		else{
			notify(xhr.responseText, "Error response:", "Try Again");
			switchView("#signupView","Sign Up",false,false);
		}
    };   
    xhr.send();
	
	
}

function login(){
	var email = document.getElementById("email").value;
	var password = document.getElementById("password").value;

    if(email == "")
    {
        notify("Please enter your email", "Email Missing", "OK");
        return;
    }

    if(password == "")
    {
        notify("Please enter a password","Password Missing", "OK"); 
        return;
    }

	switchView("#loadingView","Loading",false,false);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://moodlighting.co/wp-admin/admin-ajax.php?action=login&email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password),true);
    xhr.onload = function(){
        if(xhr.responseText == "FALSE"){
            notify("Wrong Email or Password", "Wrong Creds", "Try Again");
			switchView("#loginView","Log In",false,false);
        }
        else if(xhr.responseText == "TRUE" || xhr.responseText == "ALREADY_LOGGED_IN"){
			localStorage.setItem("email",email);
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
            switchView("#loginView","Log In",false,true);
        }
		else if(xhr.responseText == "ALREADY_LOGGED_OUT")
        {
            switchView("#loginView","Log In",false,true);
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
		
	var email = "nothing";
	var password = "nothing";
	
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://moodlighting.co/wp-admin/admin-ajax.php?action=login&email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password),true);
	xhr.onload = function(){
		if(xhr.responseText == "ALREADY_LOGGED_IN"){
			window["oldView"] = "#loginView";
			loginSuccess();
		}
		else{
			window["oldView"] = "#loginView";
			switchView("#loginView","Log In",false,false);
		}
	};   
	xhr.send();
	$("#splash").fadeOut("fast");
	}
	catch(err){
		alert(err);
	}
	return;
}

function open_browser(link){
    window.open(link, '_blank', 'location=yes');
}