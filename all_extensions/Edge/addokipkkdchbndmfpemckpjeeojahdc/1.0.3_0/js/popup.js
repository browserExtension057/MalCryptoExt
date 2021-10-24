window.onload = function () {
	getBitcoinHistory();

	getBitcoinPrice();

	$(function () {
		$('[data-toggle="tooltip"]').tooltip();
	});
};

var getBitcoinHistory = function () {
	fetch('https://api.coindesk.com/v1/bpi/historical/close.json')
		.then((response) => response.json())
		.then(buildChart);
};

var buildChart = function (data) {
	var labels = Object.keys(data.bpi).map((key) => moment(key).format('M/D/YY'));
	var values = Object.values(data.bpi).map((value) => value);
	var config = {
		type: 'line',
		data: {
			labels: labels,
			datasets: [
				{
					label: '',
					backgroundColor: '#fff',
					borderColor: '#f2a900',
					data: values,
					fill: false,
				},
			],
		},
		options: {
			responsive: true,
			title: {
				display: false,
				text: '',
			},
			legend: {
				display: false,
			},
			tooltips: {
				callbacks: {
					label: function (tooltipItem) {
						return formatCurrency(tooltipItem.yLabel);
					},
				},
			},
			hover: {
				mode: 'nearest',
				intersect: true,
			},
			scales: {
				xAxes: [
					{
						display: true,
						scaleLabel: {
							display: false,
							labelString: 'Day',
						},
						ticks: {
							fontColor: '#fff',
							callback: function (value) {
								return value;
							},
						},
					},
				],
				yAxes: [
					{
						display: true,
						scaleLabel: {
							display: false,
							labelString: 'USD',
						},
						ticks: {
							fontColor: '#fff',
							callback: function (value) {
								return formatCurrency(value);
							},
						},
					},
				],
			},
		},
	};

	var ctx = document.getElementById('canvas').getContext('2d');
	window.myLine = new Chart(ctx, config);
};
