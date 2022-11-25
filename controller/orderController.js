const e = require("express");
const express = require("express");
const fs = require("fs");
const path = require("path");
const request = require("requests");
exports.perchase = async (req, res, next) => {
  console.log("ord1");
  var item_number = req.params.item_number;
  var clientServerOptions = {
    uri: "http://localhost:3000/" + "info/" + item_number,
    body: "",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  request(clientServerOptions, (error, infoResponse) => {
    if (error) throw error;
    if (infoResponse.statusCode == 200) {
      clientServerOptions.method = "PUT";
      
      clientServerOptions.body = JSON.stringify({ itemsInStock: -1 });
      clientServerOptions.uri =
        "http://localhost:3000/" + "update/" + item_number;
      request(clientServerOptions, (err, updateResponse) => {
        if (err) throw err;
        if (updateResponse.statusCode == 200) {
          return res.status(200).json({ status: true, msg: "succeed" });
        } else {
          return res
            .status(500)
            .json({ status: false, msg: "something went wrong" });
        }
      });
    } else {
      return res.status(404).json({ status: false, msg: "try another item" });
    }
  });
};
