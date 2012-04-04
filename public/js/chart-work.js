$( function() {
    
    $('#chart_div').addClass('ui-widget');
    $('#chart_div').addClass('ui-corner-all');
    
    setupCharts();   // Kicks off the backend processes 
});

google.load('visualization', '1', {
    packages : [ 'gauge', 'corechart' ]
});

/**
 * Store all our chart information in a great big pile of gunk. This way
 * I don't need to pollute the global name space.
 */
var history = {
        label   : "Response Times",
        data    : [],
        chart   : [],
        options : {
            theme: 'maximized',
            axisTitlesPosition: "none",
            height: 100,
            width: 300,
            legend: {
                position: 'none'
            },
            hAxis: {
                gridlines: { 
                    count: 0
                }
            }
        }
    };

/**
 * Makes a jQuery GET call to /levels and calls the 
 * [#updateData()] and [#drawChart()] functions to update the gauges
 */

function setupCharts() {
    $.getJSON('/sites', function( data ) {
        for (var d in data) {
            $("#charts").append("<tbody id='section-"+d+"'></tbody>");
            $.fuzzytoast({ 
                template    : 'templates/table-data.html', 
                data        : '/latest/' + d, 
                destination : '#section-' + d,
                finished    : timerCallback(d)
            });
            
            setInterval(timerCallback(d), 20000);
        }
    });
}

function timerCallback(id) {
    return function() {
        dataAcquisition(id);
    };
}

function dataAcquisition(id) {

    $.getJSON('/times/'+id+'/100', function( data ) {
        $("#errors-"+id).html( data.errors );
        
        if ( ! history.chart[id] ) {
            var container = $("#chart-" + id)[0];
            history.chart[id] = 
                new google.visualization.AreaChart(container);
        }

        var dt = new google.visualization.DataTable();
        dt.addColumn('number', 'Position');
        dt.addColumn('number', 'Milliseconds');
        
        // console.log(data.deltas);
        for ( var d in data.deltas ) {
            // console.log("addRow", d, data.deltas[d], typeof d);
            dt.addRow([ parseInt(d), data.deltas[d] ]);
        }
        
        history.chart[id].draw(dt, history.options);
    });
}
