function generateDashboard(data,geom){
    var map = new lg.map('#map').geojson(geom).nameAttr('NAME').joinAttr('ISO_A3').zoom(2).center([20,-80]);

    var status = new lg.column('STATUS')
                        .label('Status')
                        .domain([0,1])
                        .axisLabels(false)
                        .valueAccessor(function(d){
                            if(d== 'Rojo'){
                                return 1;
                            } else if (d=='Amarillo'){
                                return 0.99999
                            } else if (d== 'Verde'){
                                return 0.99998
                            } else {
                                return null;
                            }
                        })
                        .colorAccessor(function(d,i,max){
                            if(d=='Rojo'){
                                return 2;
                            } else if(d=='Amarillo'){
                                return 1;
                            } else {
                                return 0;
                            }
                        })
                        .colors(['#388E3C','#FDD835','#C62828']);

    var affected = new lg.column('# Affected').label('No. Affected').scale(d3.scale.log()).domain([1,1500000])
                        .colorAccessor(
                            function(d,i,max){
                                d=Math.log(d+1);
                                max=Math.log(max);
                                var c = Math.floor(d/max*5);
                                if(c==5){c=4}
                                return c
                            }
                        );

    var affectedper100000 = new lg.column('Affected per 100,000').label('Affected per 100,000').scale(d3.scale.log()).domain([1,1000])
                        .colorAccessor(
                            function(d,i,max){
                                d=Math.log(d+1);
                                max=Math.log(max);
                                var c = Math.floor(d/max*5);
                                if(c==5){c=4}
                                return c
                            }
                        );                         

    var grid = new lg.grid('#grid')
        .data(data)
        .width($('#grid').width())
        .height(1200)
        .nameAttr('Country')
        .joinAttr('ISO-3')
        .hWhiteSpace(4)
        .vWhiteSpace(4)
        .margins({top: 150, right: 20, bottom: 30, left: 200})
        .columns([affected,status,affectedper100000]);

    lg.init();

    $("#map").width($("#map").width());

}

function stickydiv(){
    var window_top = $(window).scrollTop();
    var div_top = $('#sticky-anchor').offset().top;
    if (window_top > div_top){
        $('#map-container').addClass('sticky');
    }
    else{
        $('#map-container').removeClass('sticky');
    }
};

$(window).scroll(function(){
    stickydiv();
}); 

//load data

var dataCall = $.ajax({ 
    type: 'GET', 
    url: 'data/data.json', 
    dataType: 'json',
});

//load geometry

var geomCall = $.ajax({ 
    type: 'GET', 
    url: 'data/geom.json', 
    dataType: 'json',
});

//when both ready construct dashboard

$.when(dataCall, geomCall).then(function(dataArgs, geomArgs){
    geom = topojson.feature(geomArgs[0],geomArgs[0].objects.geom);
    generateDashboard(dataArgs[0],geom);
});
