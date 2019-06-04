import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';


let config = Config['localhost'];
let web3 = new Web3(config.url.replace('http', 'ws'));
web3.eth.defaultAccount = web3.eth.accounts[0];
let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
let flightSuretyData = new web3.eth.Contract(FlightSuretyData.abi, config.dataAddress);

var oracles = [];

//await flightSuretyData.methods.authorizeCaller(config.appAddress).send({from: owner});
(async() => {
  
  let accounts = await web3.eth.getAccounts();
  
  // try{
    
  //   await flightSuretyData.methods.authorizeCaller(config.appAddress).send({from:accounts[0]});
  //   console.log("HELLO SERVER");
  // }catch(err){
  //   console.log(err);
  // }


  let fee = await flightSuretyApp.methods.REGISTRATION_FEE().call()
  for(let i = 19; i<= 39 ; i++){
    try{
      console.log("HELLO SERVER REGISTRATION_FEE()");
      await flightSuretyApp.methods.registerOracle().send({from:accounts[i], value: fee, gas: 3000000});
      let indexes = await flightSuretyApp.methods.getMyIndexes().call({from: accounts[i]});
      oracles.push({
        address: accounts[i],
        indexes: indexes
      });
    }catch(err){
      console.log(err);
    }

  }
  

})();

flightSuretyApp.events.OracleRequest({
  fromBlock: 0
}, function (error, event) {
  if (error){ console.log(error)
  }else {
    let randomStatusCode = Math.floor(Math.random() * 4) * 9;
    let eventValue = event.returnValues;

    orcales.forEach((oracle) => {
      oracle.indexes.forEach((index) => {
        flightSuretyApp.methods.submitOracleResponse(index, eventValue.airline, eventValue.flight, eventValue.timestamp, randomStatusCode).send({from: oracle.address , gas:99999999}
        ).then(res => {
          console.log("RESEULT: "+ oracle.address + " INDEX: " +index + "STATUS CODE: "+ randomStatusCode);
        }).catch(err => {
          console.log("ERROR: "+ oracle.address + " INDEX: " +index + "STATUS CODE: "+ randomStatusCode);
        });
      });
    });
  }
});

const app = express();
app.get('/api', (req, res) => {
    res.send({
      message: 'An API for use with your Dapp!'
    })
})

export default app;

// import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
// import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
// import Config from './config.json';
// import Web3 from 'web3';
// import express from 'express';


// let config = Config['localhost'];
// let web3 = new Web3(config.url.replace('http', 'ws'));
// web3.eth.defaultAccount = web3.eth.accounts[0];
// let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
// let flightSuretyData = new web3.eth.Contract(FlightSuretyData.abi, config.dataAddress);

// var oracles = [];

// //await flightSuretyData.methods.authorizeCaller(config.appAddress).send({from: owner});
// (async() => {
  
//   let accounts = await web3.eth.getAccounts();
  
//   try{
    
//     await flightSuretyData.methods.authorizeCaller(config.appAddress).send({from:accounts[0]});
//     console.log("HELLO SERVER");
//   }catch(err){
//     console.log(err);
//   }

//   let fee = await flightSuretyApp.methods.REGISTRATION_FEE().call()
//   for(let i = 19; i<= 39 ; i++){
//     try{
//       console.log("HELLO SERVER REGISTRATION_FEE()");
//       await flightSuretyApp.methods.registerOracle().send({from:accounts[i], value: fee, gas: 3000000});
//       let indexes = await flightSuretyApp.methods.getMyIndexes().call({from: accounts[i]});
//       oracles.push({
//         address: accounts[i],
//         indexes: indexes
//       });
//     }catch(err){
//       console.log(err);
//     }

//   }
  

// })();

// flightSuretyApp.events.OracleRequest({
//   fromBlock: 0
// }, function (error, event) {
//   if (error){ console.log(error)
//   }else {
//     let randomStatusCode = Math.floor(Math.random() * 4) * 9;
//     let eventValue = event.returnValues;

//     orcales.forEach((oracle) => {
//       oracle.indexes.forEach((index) => {
//         flightSuretyApp.methods.submitOracleResponse(index, eventValue.airline, eventValue.flight, eventValue.timestamp, randomStatusCode).send({from: oracle.address , gas:99999999}
//         ).then(res => {
//           console.log("RESEULT: "+ oracle.address + " INDEX: " +index + "STATUS CODE: "+ randomStatusCode);
//         }).catch(err => {
//           console.log("ERROR: "+ oracle.address + " INDEX: " +index + "STATUS CODE: "+ randomStatusCode);
//         });
//       });
//     });
//   }
// });

// const app = express();
// app.get('/api', (req, res) => {
//     res.send({
//       message: 'An API for use with your Dapp!'
//     })
// })

// export default app;