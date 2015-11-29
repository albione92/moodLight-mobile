window["chartGran"] = 3;
window["lastRender"] = Math.round(new Date().getTime()/1000.0);

function getData(){
		$.getJSON("http://moodlighting.co/6hour.json", function(result){
			window["JSONdata"] = result;
			var perMin = parseInt(result["data"][0]["phrases_min"]);
			if(perMin > 0){
				setTimeout(drawData,500);
			}
			else{
				getData();
			}
		}).fail(function() {
			getData();
		});
	}

function drawData(){
		getArchivePercent(window["JSONdata"]);
		getArchiveSignificance(window["JSONdata"]);
		getArchiveCount(window["JSONdata"]);
		getArchivePer(window["JSONdata"]);
	}

	google.load('visualization', '1', {
	    packages: ['corechart', 'line']
	});

	function getArchivePercent(result) {

			var data = new google.visualization.DataTable();
			var dateFormatter = new google.visualization.DateFormat({formatType: 'short'});

			data.addColumn('datetime', 'Time');
		        data.addColumn('number', 'Love');
		        data.addColumn('number', 'Joy');
			data.addColumn('number', 'Surprise');
		        data.addColumn('number', 'Anger');
			data.addColumn('number', 'Sadness');
		        data.addColumn('number', 'Fear');
			data.addColumn('number', '100% (Normal)');
			data.addColumn('number', 'Trends');
			data.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});
			data.addColumn('number', 'Maintenance');

			i = 0;
			try{
				while(i<21600){
					var lovePercent = parseInt(result["data"][i]["emotions"]["love"]["percent"]);
					var joyPercent = parseInt(result["data"][i]["emotions"]["joy"]["percent"]);
					var surprisePercent = parseInt(result["data"][i]["emotions"]["surprise"]["percent"]);
					var angerPercent = parseInt(result["data"][i]["emotions"]["anger"]["percent"]);
					var sadnessPercent = parseInt(result["data"][i]["emotions"]["sadness"]["percent"]);
					var fearPercent = parseInt(result["data"][i]["emotions"]["fear"]["percent"]);

					var maintenance = parseInt(result["data"][i]["maintenance"]);
					var time = parseInt(result["data"][i]["time"]);
					var trends = result["data"][i]["trends"];

					trendList = trends.split(",");
					trendHead = "<strong>TRENDS:</strong><br>"
					trendCenter = "";

					trendList.forEach(function(entry) {
						trendCenter+="<a href='https://twitter.com/search?q="+entry.replace("#","%23")+"&src=typd'>"+entry+"<br>";
					});

					var d = new Date();
					d.setTime(time*1000);

					data.addRow([
						d,
						lovePercent,
						joyPercent,
						surprisePercent,
						angerPercent,
						sadnessPercent,
						fearPercent,
						100,
						60,
						trendHead+trendCenter,
						maintenance,
					]);

					i+=window["chartGran"];
				}
			}
			catch(err){
				i = 30000
			}

			var chart = new google.visualization.LineChart(document.getElementById("chartPercent"));

			var options = {
				colors: ['#ff5eb1', '#ffcc00', '#cc66ff', '#b03c3c', '#1E8BFF', '#00FFC6', '#727272','#999999','#fb8100'],
				backgroundColor: 'none',
				is3D: true,
				hAxis: {gridlines: {color: 'none'},textStyle:{color: '#999999'},textPosition:'out'},
				vAxis: {gridlines: {color: 'none'},textStyle:{color: '#999999'},textPosition:'in',viewWindow: {min: 55}},
				smoothLine: true,
				chartArea: {'width': '100%', 'height': '80%'},
				series: { 
					8: {type: 'area'},
					7: {type: 'area',lineWidth: 4}
				},
				areaOpacity:0.1,
				tooltip: { isHtml: true },
				legend: {'position': 'none'},
				titleTextStyle: {color: '#cccccc'},
				legendTextStyle: {color: '#cccccc'},
				lineWidth: 1,
			}


			chart.draw(data,options);
		}

		google.load('visualization', '1', {
		    packages: ['corechart', 'line']
		});


		function getArchiveSignificance(result) {
			var data = new google.visualization.DataTable();
			var dateFormatter = new google.visualization.DateFormat({formatType: 'short'});

			data.addColumn('datetime', 'Time');
		        data.addColumn('number', 'Love');
		        data.addColumn('number', 'Joy');
			data.addColumn('number', 'Surprise');
		        data.addColumn('number', 'Anger');
			data.addColumn('number', 'Sadness');
		        data.addColumn('number', 'Fear');

			i = 0;
			try{
				while(i<21600){
					var loveSignificance = parseInt(result["data"][i]["emotions"]["love"]["significance"]);
					var joySignificance = parseInt(result["data"][i]["emotions"]["joy"]["significance"]);
					var surpriseSignificance = parseInt(result["data"][i]["emotions"]["surprise"]["significance"]);
					var angerSignificance = parseInt(result["data"][i]["emotions"]["anger"]["significance"]);
					var sadnessSignificance = parseInt(result["data"][i]["emotions"]["sadness"]["significance"]);
					var fearSignificance = parseInt(result["data"][i]["emotions"]["fear"]["significance"]);

					var time = parseInt(result["data"][i]["time"]);

					var d = new Date();
					d.setTime(time*1000);

					data.addRow([
						d,
						loveSignificance,
						joySignificance,
						surpriseSignificance,
						angerSignificance,
						sadnessSignificance,
						fearSignificance
					]);
					i+=window["chartGran"];
				}
			}
			catch(err){
				i = 30000
			}
			var chart = new google.visualization.LineChart(document.getElementById('chartSignificance'));

			var options = {
				colors: ['#ff5eb1', '#ffcc00', '#cc66ff', '#b03c3c', '#1E8BFF', '#00FFC6', '#727272','#999999','#fb8100'],
				backgroundColor: 'none',
				is3D: true,
				hAxis: {gridlines: {color: 'none'},textStyle:{color: '#999999'},textPosition:'out'},
				vAxis: {gridlines: {color: 'none'},textStyle:{color: '#999999'},textPosition:'in',viewWindow: {min: 1}},
				smoothLine: true,
				chartArea: {'width': '100%', 'height': '80%'},
				areaOpacity:0.1,
				tooltip: { isHtml: true },
				legend: {'position': 'none'},
				titleTextStyle: {color: '#cccccc'},
				legendTextStyle: {color: '#cccccc'},
				lineWidth: 1,
			}
			chart.draw(data,options);
	}

	google.load('visualization', '1', {
	    packages: ['corechart', 'line']
	});


	function getArchiveCount(result) {

			var data = new google.visualization.DataTable();
			var dateFormatter = new google.visualization.DateFormat({formatType: 'short'});

			data.addColumn('datetime', 'Time');
		        data.addColumn('number', 'Love');
		        data.addColumn('number', 'Joy');
			data.addColumn('number', 'Surprise');
		        data.addColumn('number', 'Anger');
			data.addColumn('number', 'Sadness');
		        data.addColumn('number', 'Fear');

			i = 0;
			try{
				while(i<21600){
					var loveCount = parseInt(result["data"][i]["emotions"]["love"]["count"]);
					var joyCount = parseInt(result["data"][i]["emotions"]["joy"]["count"]);
					var surpriseCount = parseInt(result["data"][i]["emotions"]["surprise"]["count"]);
					var angerCount = parseInt(result["data"][i]["emotions"]["anger"]["count"]);
					var sadnessCount = parseInt(result["data"][i]["emotions"]["sadness"]["count"]);
					var fearCount = parseInt(result["data"][i]["emotions"]["fear"]["count"]);

					var time = parseInt(result["data"][i]["time"]);

					var d = new Date();
					d.setTime(time*1000);

					data.addRow([
						d,
						loveCount,
						joyCount,
						surpriseCount,
						angerCount,
						sadnessCount,
						fearCount
					]);
					i+=window["chartGran"];
				}
			}
			catch(err){
				i = 30000
			}
			var chart = new google.visualization.LineChart(document.getElementById('chartCount'));

			var options = {
				colors: ['#ff5eb1', '#ffcc00', '#cc66ff', '#b03c3c', '#1E8BFF', '#00FFC6', '#727272','#999999','#fb8100'],
				backgroundColor: 'none',
				is3D: true,
				hAxis: {gridlines: {color: 'none'},textStyle:{color: '#999999'},textPosition:'out'},
				vAxis: {gridlines: {color: 'none'},textStyle:{color: '#999999'},textPosition:'in',viewWindow: {min: 0}},
				smoothLine: false,
				chartArea: {'width': '100%', 'height': '80%'},
				legend: {'position': 'none'},
				titleTextStyle: {color: '#cccccc'},
				legendTextStyle: {color: '#cccccc'},
				lineWidth: 1,
			}
			chart.draw(data,options);
	}

	google.load('visualization', '1', {
	    packages: ['corechart', 'line']
	});

	function getArchivePer(result) {

			var data = new google.visualization.DataTable();
			var dateFormatter = new google.visualization.DateFormat({formatType: 'short'});

			data.addColumn('datetime', 'Time');
		        data.addColumn('number', 'Phrases / min');

			i = 0;
			try{
				while(i<21600){
					var phrasesPer = parseInt(result["data"][i]["phrases_min"]);
					var time = parseInt(result["data"][i]["time"]);

					var d = new Date();
					d.setTime(time*1000);

					data.addRow([
						d,
						phrasesPer
					]);
					i+=window["chartGran"];
				}
			}
			catch(err){
				i = 30000
			}

			var chart = new google.visualization.LineChart(document.getElementById("chartPer"));

			var options = {
				colors: ['#ff0000'],
				backgroundColor: 'none',
				is3D: true,
				hAxis: {gridlines: {color: 'none'},textStyle:{color: '#999999'},textPosition:'out'},
				vAxis: {gridlines: {color: 'none'},textStyle:{color: '#999999'},textPosition:'in',viewWindow: {min: 55}},
				smoothLine: true,
				chartArea: {'width': '100%', 'height': '80%'},
				series: {
					0: {type: 'area'},
				},
				areaOpacity:0.25,
				tooltip: { isHtml: true },
				legend: {'position': 'none'},
				titleTextStyle: {color: '#cccccc'},
				legendTextStyle: {color: '#cccccc'},
				lineWidth: 1,
			}


			chart.draw(data,options);
		}