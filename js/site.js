function generateDashboard(data,activities,geom){
    var map = new lg.map('#map').geojson(geom).nameAttr('NAME').joinAttr('ISO_A3').zoom(2).center([20,-80]);
    console.log(data)
    var status = new lg.column('#status')
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
                        .colors(['#99d594','#ffcc00','#ff0000']);

    max = d3.max(data,function(d){return +d['#affected+total']});                     
    var affected = new lg.column('#affected+total').label('No. Affected').scale(d3.scale.log()).domain([1,max])
                        .colors(['#edf8fb','#b3cde3','#8c96c6','#8856a7','#810f7c'])
                        .colorAccessor(
                            function(d,i,max){
                                d=Math.log(d+1);
                                max=Math.log(max);
                                var c = Math.floor(d/max*5);
                                if(c==5){c=4}
                                return c
                            }
                        );

    max = d3.max(data,function(d){return +d['#affected+confirmed']}); 
    var confirmed = new lg.column('#affected+confirmed').label('Confirmed Cases').scale(d3.scale.log()).domain([1,max])
                        .colors(['#edf8fb','#b3cde3','#8c96c6','#8856a7','#810f7c'])
                        .colorAccessor(
                            function(d,i,max){
                                d=Math.log(d+1);
                                max=Math.log(max);
                                var c = Math.floor(d/max*5);
                                if(c==5){c=4}
                                return c
                            }
                        );
    
    max = d3.max(data,function(d){return +d['#affected+suspected']});                     
    var suspected = new lg.column('#affected+suspected').label('Suspected Cases').scale(d3.scale.log()).domain([1,max])
                        .colors(['#edf8fb','#b3cde3','#8c96c6','#8856a7','#810f7c'])
                        .colorAccessor(
                            function(d,i,max){
                                d=Math.log(d+1);
                                max=Math.log(max);
                                var c = Math.floor(d/max*5);
                                if(c==5){c=4}
                                return c
                            }
                        );                                         

    var affectedper100000 = new lg.column('#affected+percapita').label('Affected per 100,000').scale(d3.scale.log()).domain([1,1000])
                        .colors(['#edf8fb','#b3cde3','#8c96c6','#8856a7','#810f7c'])
                        .colorAccessor(
                            function(d,i,max){
                                d=Math.log(d+1);
                                max=Math.log(max);
                                var c = Math.floor(d/max*5);
                                if(c==5){c=4}
                                return c
                            }
                        );
                        console.log(activities);
    var vAccessor = function(d){
                            if(d== 'true'){
                                return 1;
                            } else {
                                return 0.99999
                            }
                        };

    var cAccessor = function(d,i,max){
                            if(d=='true'){
                                return 0;
                            } else {
                                return 1;
                            }
                        }

    var colors = ['#81C784','#FFCDD2'];                  

    var riskComms = new lg.column('#activity+riskcomms').label('Risk communication to general public').domain([0,1]).axisLabels(false).valueAccessor(vAccessor).colorAccessor(cAccessor).colors(colors);                                             
    var commClean = new lg.column("#activity+cleanup").label('Community clean-up campaigns').domain([0,1]).axisLabels(false).valueAccessor(vAccessor).colorAccessor(cAccessor).colors(colors);
    var hhPro = new lg.column("#activity+hhprotection").label('Household and personal protection').domain([0,1]).axisLabels(false).valueAccessor(vAccessor).colorAccessor(cAccessor).colors(colors);   
    var infoPreg = new lg.column("#activity+infowomen").label('Information and commodities for pregnant women').domain([0,1]).axisLabels(false).valueAccessor(vAccessor).colorAccessor(cAccessor).colors(colors);
    var psySup = new lg.column("#activity+pyschosupport").label('Psychosocial support for affected families').domain([0,1]).axisLabels(false).valueAccessor(vAccessor).colorAccessor(cAccessor).colors(colors);
    var bloodSafe = new lg.column("#activity+bloodsafety").label('Blood safety').domain([0,1]).axisLabels(false).valueAccessor(vAccessor).colorAccessor(cAccessor).colors(colors);
    var chemCont = new lg.column("activity+chemvectorcontrol").label('Chemical vector control').domain([0,1]).axisLabels(false).valueAccessor(vAccessor).colorAccessor(cAccessor).colors(colors);
    var protPart = new lg.column("#activity+protectionpartsettings").label('Protection for particular settings').domain([0,1]).axisLabels(false).valueAccessor(vAccessor).colorAccessor(cAccessor).colors(colors);
    var commSurv = new lg.column("activity+communitybasedsurveillance").label('Community-based surveillance').domain([0,1]).axisLabels(false).valueAccessor(vAccessor).colorAccessor(cAccessor).colors(colors);

    var grid1 = new lg.grid('#grid1')
        .data(data)
        .width($('#grid1').width())
        .height(1200)
        .nameAttr('#country')
        .joinAttr('#country+code')
        .hWhiteSpace(4)
        .vWhiteSpace(4)
        .margins({top: 150, right: 20, bottom: 30, left: 200})
        .columns([status,affected,affectedper100000,confirmed,suspected]);

    var grid2 = new lg.grid('#grid2')
        .data(activities)
        .width($('#grid1').width())
        .height(1200)
        .nameAttr('#country')
        .joinAttr('#country+code')
        .hWhiteSpace(6)
        .vWhiteSpace(6)
        .margins({top: 150, right: 20, bottom: 30, left: 200})
        .columns([riskComms,commClean,hhPro,infoPreg,psySup,bloodSafe,chemCont,protPart,commSurv]);     

    lg.init();

    $("#map").width($("#map").width());

}

function hxlProxyToJSON(input,headers){
    var output = [];
    var keys=[]
    input.forEach(function(e,i){
        if(i==0){
            e.forEach(function(e2,i2){
                var parts = e2.split('+');
                var key = parts[0]
                if(parts.length>1){
                    var atts = parts.splice(1,parts.length);
                    atts.sort();                    
                    atts.forEach(function(att){
                        key +='+'+att
                    });
                }
                keys.push(key);
            });
        } else {
            var row = {};
            e.forEach(function(e2,i2){
                row[keys[i2]] = e2;
            });
            output.push(row);
        }
    });
    return output;
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

$('#grid2').hide();

$('#overviewbutton').on('click',function(){
    $('#grid2').hide();
    $('#grid1').show();
});

$('#activitiesbutton').on('click',function(){
    $('#grid1').hide();
    $('#grid2').show();
});

$(window).scroll(function(){
    stickydiv();
}); 

//load data

var dataCall = $.ajax({ 
    type: 'GET', 
    url: 'data/dashboard.csv', 
    dataType: 'text',
});

var activitiesCall = $.ajax({ 
    type: 'GET', 
    url: 'data/nsactivities.csv', 
    dataType: 'text',
});

//load geometry

var geomCall = $.ajax({ 
    type: 'GET', 
    url: 'data/geom.json', 
    dataType: 'json',
});

//when both ready construct dashboard

$.when(dataCall, activitiesCall, geomCall).then(function(dataArgs, activitiesArgs, geomArgs){
    geom = topojson.feature(geomArgs[0],geomArgs[0].objects.geom);
    overview = hxlProxyToJSON(Papa.parse(dataArgs[0]).data,false);
    activities = hxlProxyToJSON(Papa.parse(activitiesArgs[0]).data,false);
    overview.forEach(function(d){
        if(d['#population']==0){
            d['#affected+percapita'] = null
        } else {
            d['#affected+percapita'] = d['#affected+total']/d['#population']*100000
        }
    })
    generateDashboard(overview,activities,geom);
});
