(function($) {
    "use strict";
    $.fn.yweather = function(options){
        var opts = $.extend({}, $.fn.yweather.options, options || {});
        var translation = $.fn.yweather.translation[opts.language] ? $.fn.yweather.translation[opts.language] : $.fn.yweather.translation.en;

        var unit = (opts.unit == 'c' || opts.unit=='f') ? opts.unit : 'c';
        var d = new Date();
        var weather_query = encodeURIComponent("SELECT * FROM weather.forecast WHERE woeid="+opts.woeid+" AND u='"+unit+"'");

        return this.each(function(index, element){
            var $e = $(element);
            $.ajax({
                type: "GET",
                url: "http://query.yahooapis.com/v1/public/yql?q="+weather_query+"&format=json&diagnostics=true&callback=",
                dataType: "json",
                beforeSend : function(){
                    $e.html(opts.loading_message);
                },
                success: function(data){
                    console.log(data);
                    var result = data.query.results.channel;
                    if(result.title == 'Yahoo! Weather - Error'){
                        $e.html(result.item.title);
                        return false;
                    }
                    var city_text = opts.city_text ? opts.city_text : result.location.city;
                    var country_text = opts.country_text ? opts.country_text : result.location.country;
                    var forecast='';
                    if(opts.show_forecast==true){
                        forecast += '<ul class="forecast">';
                        for(var i=0; i<result.item.forecast.length; i++){
                            forecast += '<li><span class="day">'+translation[result.item.forecast[i].day]+'</span><img src="'+opts.icons_path+''+result.item.forecast[i].code+'.png" title="'+translation[result.item.forecast[i].code]+'"/><span class="high">'+result.item.forecast[i].high+'°'+result.units.temperature+'</span><span class="low">'+result.item.forecast[i].low+'°'+result.units.temperature+'</span></li>';
                        }
                        forecast += '</ul>';
                    }
                    var res = '\
                        <div class="yweather"> \
                         <div class="location"><h1>'+city_text+', '+country_text+'</h1><span>'+translation.dayNames[d.getDay()]+', '+d.getDate()+' '+translation.monthNamesShort[d.getMonth()]+' '+d.getFullYear()+'</span></div> \
                         <div class="current"> \
                          <img src="'+opts.icons_path+''+result.item.condition.code+'.png"/> \
                          <span class="temp">'+result.item.condition.temp+'<sup>°'+result.units.temperature+'</sup></span> \
                          <div class="conditions">'+translation.conditions+': <span>'+translation[result.item.condition.code]+'</span></div> \
                         </div> \
                         '+forecast+' \
                        </div> \
                    ';
                    $e.html(res);
                },
                error: function(){
                    $e.html(opts.error_message);
                }
           });
        });
    };

    $.fn.yweather.options = {
        language: 'en',
        woeid: '44418',
        unit: 'c',
        city_text: null,
        country_text: null,
        show_forecast: true,
        icons_path: 'img/weather-icons/',
        loading_message: 'Please wait while fetching data from Yahoo Weather...',
        error_message: 'There was an error fetching data from Yahoo Weather...',
    };

    $.fn.yweather.translation = {
        en: {
            0:'Tornado',
            1:'Tropical storm',
            2:'Hurricane',
            3:'Severe thunderstorms',
            4:'Thunderstorms',
            5:'Mixed rain and snow',
            6:'Mixed rain and sleet',
            7:'Mixed snow and sleet',
            8:'Freezing drizzle',
            9:'Drizzle',
            10:'Freezing rain',
            11:'Showers',
            12:'Showers',
            13:'Snow flurries',
            14:'Light snow showers',
            15:'Blowing snow',
            16:'Snow',
            17:'Hail',
            18:'Sleet',
            19:'Dust',
            20:'Foggy',
            21:'Haze',
            22:'Smoky',
            23:'Blustery',
            24:'Windy',
            25:'Cold',
            26:'Cloudy',
            27:'Mostly cloudy (night)',
            28:'Mostly cloudy (day)',
            29:'Partly cloudy (night)',
            30:'Partly cloudy (day)',
            31:'Clear (night)',
            32:'Sunny',
            33:'Fair (night)',
            34:'Fair (day)',
            35:'Mixed rain and hail',
            36:'Hot',
            37:'Isolated thunderstorms',
            38:'Scattered thunderstorms',
            39:'Scattered thunderstorms',
            40:'Scattered showers',
            41:'Heavy snow',
            42:'Scattered snow showers',
            43:'Heavy snow',
            44:'Partly cloudy',
            45:'Thundershowers',
            46:'Snow showers',
            47:'Isolated thundershowers',
            3200:'Not available',
            conditions: 'Conditions',
            monthNamesShort: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            dayNames: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
            Mon:'Mon',
            Tue:'Tue',
            Wed:'Wed',
            Thu:'Thu',
            Fri:'Fri',
            Sat:'Sat',
            Sun:'Sun'
        }
    };

})(jQuery);