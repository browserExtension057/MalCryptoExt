$(document).ready(function(){
    getPriceHistory().always(
        function(historical_data){
            window.historical_price = historical_data;
            window.all_days = Object.keys(historical_price.bpi).sort();

            plot_projection_chart();
        }
    );
});

function getPriceHistory(){
    var dfd2 = $.Deferred();
    $.ajax({
      crossDomain: true,  
      dataType: "json",
      url: "https://api.coindesk.com/v1/bpi/historical/close.json?start=2010-07-17&end=2100-01-01",
      success: function(data){dfd2.resolve(data)}
    })
    return dfd2.promise();
}

function plot_projection_chart(){

    var ctx = document.getElementById("btcTrendFuture").getContext('2d');

    var all_values = [];
    var mov_avg_map = [];
    var expensiveness_factors = [];

    var smooting_length = 200;

    for(var i=0; i<all_days.length; i++){
      var val= Number((Number(historical_price.bpi[all_days[i]])).toFixed(2));
      all_values.push(val);
      var two_hundred_days_back = moment(all_days[i], "YYYY-MM-DD").add(-smooting_length, 'day');
      if(all_days.indexOf(two_hundred_days_back.format("YYYY-MM-DD")) >= 0){
        var data_to_Average = all_values.slice(-smooting_length);
        var mov_avg = data_to_Average.reduce((previous, current) => current += previous) / smooting_length;
        expensiveness_factors.push(val/mov_avg);
        mov_avg_map.push(
            [
              moment(all_days[i], "YYYY-MM-DD").diff(moment("2009-01-03", "YYYY-MM-DD"), 'days'),
              mov_avg
            ]
          );
      }
    }

    var avg_expensiveness = expensiveness_factors.reduce((previous, current) => current += previous) / expensiveness_factors.length;
    var expensiveness_variance = 0.0;
    for(var i=0; i<expensiveness_factors.length; i++){
      expensiveness_variance = expensiveness_variance + (avg_expensiveness-expensiveness_factors[i])*(avg_expensiveness-expensiveness_factors[i]);
    }
    var expensiveness_sd = Math.sqrt(expensiveness_variance/expensiveness_factors.length);

    for(var i=0; i<mov_avg_map.length; i++){
      mov_avg_map[i][1] = Math.log(mov_avg_map[i][1] * avg_expensiveness);
    }

    var model = regression.logarithmic(mov_avg_map);

    var all_days_to_plot = [];
    var all_values_to_plot = [];
    var all_projections_to_plot = [];
    var projections_min = [];
    var projections_max = [];
    var day = moment("2011-01-01", "YYYY-MM-DD");
    var end_day = moment().add(11, 'years').date(1).month(0);
    while(day < end_day){
      all_days_to_plot.push(day.format("YYYY-MM-DD"));
      var predicted_price = model.predict(
          day.diff(moment("2009-01-03", "YYYY-MM-DD"), 'days')
        );
      all_projections_to_plot.push(Number(Math.exp(predicted_price[1]).toFixed(3)));
      if(all_days.indexOf(day.format("YYYY-MM-DD")) >= 0){
        all_values_to_plot.push(historical_price.bpi[day.format("YYYY-MM-DD")]);
        projections_min.push(null);
        projections_max.push(null);
      }else{
        all_values_to_plot.push(null);
        var expected_max = Math.exp(predicted_price[1])*(avg_expensiveness+expensiveness_sd*3)/avg_expensiveness;
        var expected_min = Math.exp(predicted_price[1])*(avg_expensiveness-expensiveness_sd*1)/avg_expensiveness;
        projections_max.push(Number(expected_max.toFixed(3)));
        projections_min.push(Number(expected_min.toFixed(3)));
      }
      day.add(1, 'days');
    }

    window.projectionChart = new Chart(ctx, {
      type: 'line',
        data: {
          labels: all_days_to_plot,
          datasets: [{
              label: "Expected Projection",
              type: "line",
              borderColor: "#FFE082",
              data: all_projections_to_plot,
              fill: false
            }, {
              label: "Min Projection",
              type: "line",
              borderColor: "#80CBC4",
              data: projections_min,
              fill: false
            }, {
              label: "Max Projection",
              type: "line",
              borderColor: "#E57373",
              data: projections_max,
              fill: false
            }, {
              label: "BTC historical price",
              type: "line",
              backgroundColor: "rgba(0,0,0,0.2)",
              data: all_values_to_plot,
            }
          ]
        },
        options: {
          animation : false,
          title: {
            display: false,
            text: 'BTC price history'
          },
          legend: { display: true },
          scales: {
            yAxes: [{
                id: 'left-y-axis',
                type: 'logarithmic',
                position: 'right'
            }]
          },
        }
    });
    $('.projection_explanation').show();
}