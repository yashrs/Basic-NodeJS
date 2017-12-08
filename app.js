var express = require('express');
var request = require("request");
var cp = require("cookie-parser");
var bodyParser = require('body-parser');

var app = express();
app.use(cp());
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function (err, resp) {
        resp.send("Hello World - Arpit");
});

app.get("/robots.txt", function(req, resp)
{
    request("http://httpbin.org/deny", function(error, response, body)
    {
        resp.write(body);
        resp.end();
    });
});
app.get("/setcookie", function (req,resp)
{
    resp.cookie('name', 'Yash');
    resp.cookie('age', '19');
    resp.send("Cookies have been set");
});

app.get("/getcookie", function(req, resp)
{
    resp.writeHead(200, {'Content-Type': 'text/html'});

    let name = req.cookies['name'];
    let age = req.cookies['age'];
    if(name===undefined || age ===undefined)
    {
        resp.write("Please visit /setcookie first.");
    }
    else
    {
        resp.write("Name : " + name + "<br><br>\n");
        resp.write("Age : " + age);
    }
    resp.end();
});
app.get("/html", function(req, resp)
{
    resp.writeHead(200, {'Content-Type': 'text/html'});
    resp.write("<h1>A sample HTML Page, folks.</h1>");
    resp.write("<p>Hey all! This is a paragraph in HTML.</p>");
    resp.end();
});
app.get("/input", function(req, resp)
{
    resp.writeHead(200, {'Content-Type': 'text/html'});
    resp.write("<form name='h' action='/post_data' method='POST'/>");
    resp.write("<p>Enter your hobby here : ");
    resp.write("<input name='hobby'/>");
    resp.write("<input name='sub' type='submit'/></p></form>");
    resp.end();
});
app.post("/post_data", function(req, resp)
{
    resp.writeHead(200, {'Content-Type': 'text/html'});
    let hobby = req.body.hobby;
    resp.write("Your hobbies are : " + hobby + ". Keep it up and keep enjoying them!");
    resp.end();
});
app.get("/authors", function (err, resp)
{
    resp.header('content-type','text/html')
    resp.write("Fetching data...<br><br>\n");
    request('https://jsonplaceholder.typicode.com/users',
        function (error, response, users)
        {
            //console.log('error:', error); // Print the error if one occurred
            //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            // console.log('body:', body); // Print the HTML for the Google homepage.
            let count_arr = [];
            let users_p = JSON.parse(users);
            //console.log(users_p);

            for(let i=0; i<users_p.length; i++)
            {
                let user = users_p[i];
                //console.log(user);
                //console.log(user["id"]);
                count_arr[user["id"]] = 0;
            }
            console.log(count_arr);

            request('https://jsonplaceholder.typicode.com/posts',
                function (error, response, posts)
                {
                   // console.log('error:', error); // Print the error if one occurred
                    //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                    //console.log('body:', body); // Print the HTML for the Google homepage.
                    let posts_p = JSON.parse(posts);
                    for(let j=0; j<posts_p.length; j++)
                    {
                        let post = posts_p[j];
                        //console.log(post);
                        count_arr[post["userId"]]++;
                        console.log(count_arr);
                        //resp.write();
                    }
                    for(let i=0; i<users_p.length; i++)
                    {
                        let user = users_p[i];
                        let name = user["name"];

                        resp.write(name + " : " + count_arr[user["id"]] + "<br><br>\n");
                    }
                    //console.log(count_arr);
                    resp.end();
                });
        });
});

app.listen(5000, new function () {
    console.log("Listening on port 5000");
});