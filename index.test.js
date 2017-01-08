const {expect} = require('chai');
const should = require('chai').should();
const moment = require('moment');
const {
    handler,
    getResponse,
    getErrorResponse,
    getWeather,
    getTime,
    getNews
} = require('./index');
const log = console.log;
const TIMEOUT = 10 * 1000;
const _ = require('lodash');

describe('#index', function()
{
    this.timeout(TIMEOUT);
    describe.skip('#handler', function()
    {
        this.timeout(TIMEOUT);
        it('should get data', (done)=>
        {
            handler({}, {}, (err, data)=>
            {
                log("data:", data);
                done(err);
            });
        });
    });
    describe('#getResponse', ()=>
    {
        it('gives response of 200', ()=>
        {
            const result = getResponse();
            result.statusCode.should.equal('200');
        });
    });
    describe('#getErrorResponse', ()=>
    {
        it('gives response of 500', ()=>
        {
            const result = getErrorResponse();
            result.statusCode.should.equal('500');
        });
    });
    describe('#getWeather', ()=>
    {
        it('gives weather data', (done)=>
        {
            const mockWeatherRequest = (url, cb) => cb(undefined, {statusCode: '200'}, JSON.stringify({main: {temp: 8}}));
            getWeather(mockWeatherRequest)
            .then((result)=>
            {
                result.main.temp.should.equal(8);
                done();
            })
            .catch(done);
        });
    });
    describe('#getTime', ()=>
    {
        it('gives the time', (done)=>
        {
            const mockTimeRequest = (url, cb) => cb(undefined, {statusCode: '200'}, JSON.stringify({time: '2017-01-08T14:57:39.000Z'}));
            getTime(mockTimeRequest)
            .then((result)=>
            {
                const time = new Date('2017-01-08T14:57:39.000Z');
                moment(result).isSame(time, 'day').should.be.true;
                done();
            })
            .catch(done);
        });
    });
    describe('#getNews', ()=>
    {
        it('should return news', (done)=>
        {
            const mockNewsRequest = (url, cb) => cb(undefined, {statusCode: '200'}, JSON.stringify({
                articles: [
                    {author: "cow"}
                ]
            }));
            getNews(mockNewsRequest)
            .then((result)=>
            {
                result.articles[0].author.should.equal('cow');
                done();
            })
            .catch(done);
        });
    });
});
