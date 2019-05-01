
/*****************************/
/* LOADING DATA HAPPENS HERE */
/*****************************/

var defaultLoader = function(file, id, title){
	Papa.parse('data/'+file, {
		worker: useWebWorker,
		header: true,
		delimiter: ',',
		download: true,
		skipEmptyLines: true,
		dynamicTyping: true,
		comments: 'Station',
		complete: function (result) {
			var temperatures = parseGISSTEMP(result);
			renderTemperatureGraph(temperatures, id, title);
		},
	});
};



var globalTemperatures = function () {
	Papa.parse('data/GLB.Ts downloaded 21062018.csv', {
		worker: useWebWorker,
		header: true,
		delimiter: ',',
		download: true,
		skipEmptyLines: true,
		dynamicTyping: true,
		comments: 'Station',
		complete: function (result) {
			var temperatures = parseGISSTEMP(result);
			renderTemperatureGraph(temperatures, 'globalTemperatures', 'Global temperatures');
		},
	});
};
// globalTemperatures();

var parseZonal = function () {
	var cached;

	var complete = (result) => {
		if (cached) result = cached;
		else cached = result;
		var temperatures = parseGISSTEMPzonalMeans(result);
		renderTemperatureDifferenceGraph(temperatures['64n-90n'], 'temperatureDifference1', 'Temperature difference for Arctic (64N-90N)');
		renderTemperatureDifferenceGraph(temperatures['nhem'], 'temperatureDifference2', 'Temperature difference for Northern Hemisphere');
		renderTemperatureDifferenceGraph(temperatures['glob'], 'temperatureDifference3', 'Global temperature difference');
	}

	Papa.parse('data/ZonAnn.Ts+dSST downloaded 21062018.csv', {
		worker: useWebWorker,
		header: true,
		delimiter: ',',
		download: true,
		skipEmptyLines: true,
		dynamicTyping: true,
		complete,
	});

	return complete;
};
// parseZonal();

var parseAbisko = function () {
	var cached;

	var complete = (result) => {
		if (cached) result = cached;
		else cached = result;
		var data = parseAbiskoCsv(result);
		var summerRange = monthName(summerMonths[0]) + ' to ' + monthName(summerMonths[summerMonths.length - 1]);
		var winterRange = monthName(winterMonths[0]) + ' to ' + monthName(winterMonths[winterMonths.length - 1]);
		renderAbiskoTemperatureGraph(data, 'AbiskoTemperatures', 'Abisko temperatures');
		renderAbiskoMonthlyTemperatureGraph(data.summerTemps, 'AbiskoTemperaturesSummer', 'Abisko temperatures for ' + summerRange);
		renderAbiskoMonthlyTemperatureGraph(data.winterTemps, 'AbiskoTemperaturesWinter', 'Abisko temperatures for ' + winterRange);
		months().forEach(month =>
			renderAbiskoMonthlyTemperatureGraph(data.monthlyTemps[month], 'monthlyAbiskoTemperatures_' + month, 'Abisko temperatures for ' + monthName(month)));
		renderTemperatureDifferenceGraph(data.difference, 'temperatureDifferenceAbisko', 'Temperature difference for Abisko');

		renderGrowingSeasonGraph(data.growingSeason, 'growingSeason');

		renderYearlyPrecipitationGraph(data.yearlyPrecipitation, 'yearlyPrecipitation', 'Yearly precipitation');
		renderYearlyPrecipitationGraph(data.summerPrecipitation, 'summerPrecipitation', 'Precipitation for ' + summerRange);
		renderYearlyPrecipitationGraph(data.winterPrecipitation, 'winterPrecipitation', 'Precipitation for ' + winterRange);
		months().forEach(month =>
			renderMonthlyPrecipitationGraph(data.monthlyPrecipitation[month], 'monthlyPrecipitation_' + month, 'Precipitation for ' + monthName(month)));

		renderPrecipitationDifferenceGraph(data.yearlyPrecipitation.difference, 'yearlyPrecipitationDifference', 'Precipitation difference');
		renderPrecipitationDifferenceGraph(data.summerPrecipitation.difference, 'summerPrecipitationDifference', 'Precipitation difference ' + summerRange);
		renderPrecipitationDifferenceGraph(data.winterPrecipitation.difference, 'winterPrecipitationDifference', 'Precipitation difference ' + winterRange);
	}

	Papa.parse('data/ANS_Temp_Prec_1913-2017.csv', {
		worker: useWebWorker,
		header: true,
		//delimiter: ';',
		download: true,
		skipEmptyLines: true,
		dynamicTyping: false,
		complete,
	});

	return complete;
};
// parseAbisko();

var parseTornetrask = function () {
	Papa.parse('data/Tornetrask_islaggning_islossning.csv', {
		worker: useWebWorker,
		header: true,
		download: true,
		skipEmptyLines: true,
		complete: (result) => {
			var data = parseAbiskoIceData(result);
			renderAbiskoIceGraph(data, 'abiskoLakeIce', 'Freeze-up and break-up of lake ice vs ice time');
		},
	});
};

var parseSnowDepth = function () {
	Papa.parse('data/ANS_SnowDepth_1913-2017.csv', {
		worker: useWebWorker,
		header: true,
		download: true,
		skipEmptyLines: true,
		complete: (result) => {
			var data = parseAbiskoSnowData(result);
			renderAbiskoSnowGraph(data.periodMeans, 'abiskoSnowDepthPeriodMeans', 'Monthly mean snow depth for Abisko');
			renderAbiskoSnowGraph(data.decadeMeans, 'abiskoSnowDepthPeriodMeans2', 'Monthly mean snow depth for Abisko');
		},
	});
};
