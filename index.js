
'use strict';

const Hapi = require('hapi');
const vision = require('vision');
//const url="api.openweathermap.org/data/2.5/weather?zip=55405,us&units=imperial&APPID=2c3004ca33cbb4a1de197fab6e008bd9";
const url="https://data.cityofnewyork.us/resource/swhp-yxa4.json";
const https = require('https');


// Creating a server with a host and port
const server = Hapi.server({
    host:'localhost',
    port: 8000
});

// Adding the index.html route
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, h){

        return '<h1> You have reached the homepage</h1>';
    }
});

// Adding the content.html route

https.get(url, res => {
    res.setEncoding("utf8");
    let body = "";
    res.on("data", data => {
        body += data;
    });

    var data = res.on("end", () => {
        body = JSON.parse(body);

        server.route({

            method: 'GET',
            path: '/content.html',
            handler: function (req, h){

                return h.view('content', {dataOutput : body} );

            }
        }); 
    })
})
// Starting the server
async function start(){
    await server.register(vision);
    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname
    });
    try{
        await server.start();
    }
    catch (err){
        console.log(err);
        process.exit(1);
    }
    console.log('Server running at:', server.info.uri);

}

start();