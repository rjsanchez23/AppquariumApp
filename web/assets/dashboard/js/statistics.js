var parameter = [];
var date = [];
var number = [];
var lastMeasure = [];
var opts = {
    showTooltips: true,
    responsive: true,
    tooltipTemplate: "<%if (label){ %><%=label%>: <%}%><%= value %>",
    multiTooltipTemplate: "<%= value %>",
    multiTooltipKeyBackground: "#000",
    bezierCurveTension : 0

};
jQuery.each(measures, function (key, val) {
    date.push(val.date);
    number.push(val.value);


});
jQuery.each(parameters, function (key, val) {
    parameter.push(val.name);
    lastMeasure.push(val.value);

});


var barChart = $("#barChart");
var lineChart = $("#lineChart");

var bctx = barChart.get(0).getContext("2d");
var lctx = lineChart.get(0).getContext("2d");



barChart.attr('width', barChart.parent('div').width()).attr('height', barChart.parent('div').height());
lineChart.attr('width', lineChart.parent('div').width()).attr('height', lineChart.parent('div').height());


var barChartData = {
    labels: parameter,
    datasets: [
        {
            fillColor : "rgba(151,187,205,0.5)",
            strokeColor : "rgba(151,187,205,1)",
            pointColor : "rgba(151,187,205,1)",
            pointStrokeColor : "#fff",
            data: lastMeasure
        }
    ]
};

var lineChartData = {
    labels: date,
    datasets: [
        {
            fillColor : "rgba(151,187,205,0.5)",
            strokeColor : "rgba(151,187,205,1)",
            pointColor : "rgba(151,187,205,1)",
            pointStrokeColor : "#fff",
            data: number
        }
    ]
};


barChart = new Chart(bctx).Bar(barChartData, opts);
lineChart = new Chart(lctx).Line(lineChartData, opts);