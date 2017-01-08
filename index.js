"use strict";
const request     = require('request');
const log         = console.log;
const _           = require('lodash');

const apiKeys     = require('./keys');
const WEATHER_KEY = apiKeys.WEATHER_KEY;
const TIME_KEY    = apiKeys.TIME_KEY;
const NEWS_KEY    = apiKeys.NEWS_KEY;

const getResponse = (data)=>
{
    return {
        statusCode: '200',
        body: JSON.stringify({result: true, data}),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };
};

const getErrorResponse = (error)=>
{
    return {
        statusCode: '500',
        body: JSON.stringify({result: false, error}),
        headers: {
            'Content-Type': 'application/json',
        }
    };
};

const getWeather = (request)=>
{
    return new Promise((success, failure)=>
    {
        const weatherURL = `http://api.openweathermap.org/data/2.5/weather?q=Mechanicsville,va&units=imperial&APPID=${WEATHER_KEY}`;
        request(weatherURL, (error, response, body)=>
        {
            // log("getWeather body:", _.isString(body));
            let json;
            try
            {
                json = JSON.parse(body);
            }
            catch(parseError)
            {
                log("weather parse error:", parseError);
                return failure(parseError);
            }
            if(!error && response.statusCode == 200)
            {
                return success(json);
            }
            else
            {
                log("weather error:", error);
                log("weather status code:", response.statusCode);
                return failure(error);
            }
        });
    });
};

const getTime = (request)=>
{
    return new Promise((success, failure)=>
    {
        // NdQ5paiWd8iUHG3emSUfbn5xjV48zc
        // request('http://www.timeapi.org/utc/now.json', (error, response, body)=>
        request(`https://www.amdoren.com/api/timezone.php?api_key=${TIME_KEY}&loc=Richmond`, (error, response, body)=>
        {
            // log("getTime body:", body);
            if(!error && response.statusCode == 200)
            {
                const timeString = _.get(body, 'time', new Date().toString());
                const now = new Date(timeString);
                // now.setHours(now.getHours() + 3);
                success(now);
            }
            else
            {
                log("time error:", error);
                failure(error);
            }
        });
    });
};

const getNews = (request)=>
{
    log("request:", request);
    return new Promise((success, failure)=>
    {
        request(`https://newsapi.org/v1/articles?source=cnn&apiKey=${NEWS_KEY}`, (error, response, body)=>
        {
            log("news callback");
            let json;
            try
            {
                json = JSON.parse(body);
            }
            catch(parseError)
            {
                log("news parse error:", parseError);
                return failure(parseError);
            }
            if(!error && response.statusCode == 200)
            {
                log("news success");
                return success(json);
            }
            else
            {
                log("news error:", error);
                log("news status code:", response.statusCode);
                return failure(error);
            }
        });
    });
};

const getWeatherAndTimeAndNews = ()=>
{
    return Promise.all([
        getWeather(),
        getTime(),
        getNews()
    ]);
};

const handler = (event, context, callback) =>
{
    getWeatherAndTimeAndNews()
    .then((results)=>
    {
        // console.log("results:", results);
        callback(null, getResponse({
            weather: results[0],
            time: results[1],
            news: results[2]
        }));
    })
    .catch((err)=>
    {
        log("catch error:", err);
        callback(getErrorResponse(err));
    });
};


module.exports = {
    handler,
    getResponse,
    getErrorResponse,
    getWeather,
    getTime,
    getNews
};