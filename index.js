#!/usr/bin/env node

const request = require("request");
const GSI_DGY = require("gsi-discovergy");
require('dotenv').config()

if((typeof process.env.DISCOVERGY_PASSWORD == "undefined")||(process.env.DISCOVERGY_PASSWORD == null)) {
  process.env.DISCOVERGY_PASSWORD="demo";
}

if((typeof process.env.DISCOVERGY_ACCOUNT == "undefined")||(process.env.DISCOVERGY_ACCOUNT == null)) {
  process.env.DISCOVERGY_ACCOUNT ="demo@discovergy.com";
}

let instance = new GSI_DGY({DISCOVERGY_PASSWORD:process.env.DISCOVERGY_PASSWORD,DISCOVERGY_ACCOUNT:process.env.DISCOVERGY_ACCOUNT});
instance.meters().then(function(meters) {
  let res = [];
  for(let j=0 ; j<meters.length ; j++) {
    if(typeof meters[j].account != "undefined") {
        let item = {};
        item.serialNumber = meters[j].serialNumber;
        item.location = meters[j].location.city;
        item.oracle = meters[j].account;
        item.url = "https://elements.corrently.io/co2reading.html?a="+meters[j].account;
        res.push(item);
    }

  }
  console.table(  res.map(field => {
    return {
      "Zählernummer": field.serialNumber,
      "Ort": field.location,
      "Orakel ID": field.oracle,
      "URL": field.url
    };
  }))
}).catch(function(d) {
  console.log("Upstream Meter request failed with ",d);
});
