const server = require("./bookServer");
const order = require("./orderServer");
const rediss = require("./connectRedis");
const connectRedis = require("./connectRedis");
const { SequentialRoundRobin } = require("round-robin-js");
const r = require("redis");
const request = require("request");

redis = r.createClient();

var book1 = "http://localhost:3000";
var book2 = "http://localhost:3004";
var order1 = "http://localhost:3001";
var order2 = "http://localhost:3005";

const bookServers = new SequentialRoundRobin([book1, book2]);
const orderServers = new SequentialRoundRobin([order1, order2]);

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const port = 3002;

server.bookServer();
order.orderServer();
connectRedis();

const getCache = async (req, res, next) => {
  try {
    const data = await redis.GET(req.url);
    if (data != null) {
      return res.status(200).json({ status: true, data: data });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false });
  }
};
app.all("/search/:topic", getCache, (req, res) => {
  var bookForwardOptions = {
    uri: bookServers.next().value + req.url,
    body: JSON.stringify(req.body),
    method: req.method,
    headers: {
      "Content-Type": req.headers["content-type"],
    },
  };

  request(bookForwardOptions, async (error, response) => {
    if (error) {
      console.log(error);
    }
    const topic = req.params.topic;
    await redis.set(req.url, response.body);
    console.log(bookForwardOptions.uri);
    // console.log('Catalog server[search]: ' + catalogServers.currentTurn))
    res.status(response.statusCode).send(response.body);
  });
});

app.all("/info/:item_number", getCache, (req, res) => {
  var bookForwardOptions = {
    uri: bookServers.next().value + req.url,
    body: JSON.stringify(req.body),
    method: req.method,
    headers: {
      "Content-Type": req.headers["content-type"],
    },
  };
  request(bookForwardOptions, async (error, response) => {
    if (error) {
      console.log(error);
    }
    const id = req.params.item_number;
    console.log(response.body);

    await redis.set(req.url, response.body);

    res.status(response.statusCode).send(response.body);
  });
});

app.post("/purchase/:item_number",async (req, res) => {

    var orderForwardOptions = {
      uri: orderServers.next().value + req.url,
      body: JSON.stringify(req.body),
      method: req.method,
      headers: {
        "Content-Type": req.headers["content-type"],
      },
    };
     request(orderForwardOptions, async (error, response) => {
      if (error) {
        console.log(error);
      }
        res.status(200).send(response.body);
     
    });
  
 
});

app.listen(port, () => {
  console.log(`frontend connected with port ${port}`);
});
