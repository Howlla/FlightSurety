// import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
// import Config from './config.json';
// import Web3 from 'web3';

// export default class Contract {
//     constructor(network, callback) {

//         let config = Config[network];
//         this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
//         this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
//         this.initialize(callback);
//         this.owner = null;
//         this.airlines = [];
//         this.passengers = [];
//     }

//     initialize(callback) {
//         this.web3.eth.getAccounts((error, accts) => {
           
//             this.owner = accts[0];

//             let counter = 1;
            
//             while(this.airlines.length < 5) {
//                 this.airlines.push(accts[counter++]);
//             }

//             while(this.passengers.length < 5) {
//                 this.passengers.push(accts[counter++]);
//             }
//             this.fundAirline((error, result) => {
//                 if(error){
//                   console.log("fundAirline A101 error" ,error)

//                 } 

//                     this.registerFlight("A101" ,(error, result) => {
//                         if(error){
//                           console.log("registerFlight2 A101 error" ,error)
      
//                         }else{          
//                                       console.log("A101 " ,result)
      
//                       }
//                     }); 
//                     this.registerFlight("KM433" ,(error, result) => {
//                         if(error){
//                           console.log("registerFlight2 KM433 error" ,error)
      
//                         }else{          
//                                       console.log("KM433 " ,result)
      
//                       }
//                     }); 
//                     this.registerFlight("SA333" ,(error, result) => {
//                         if(error){
//                           console.log("registerFlight2 A101 error" ,error)
      
//                         }else{          
//                                       console.log("SA333 " ,result)
      
//                       }
//                     }); 

              
//             }); 
             

//             callback();
//         });
//     }

//     isOperational(callback) {
//        let self = this;
//        self.flightSuretyApp.methods
//             .isOperational()
//             .call({ from: self.owner}, callback);
//     }

//     fetchFlightStatus(flight, callback) {
//         let self = this;
//         let payload = {
//             airline: self.airlines[0],
//             flight: flight,
//             timestamp: Math.floor(Date.now() / 1000)
//         } 
//         self.flightSuretyApp.methods
//             .fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)
//             .send({ from: self.owner}, (error, result) => {
//                 callback(error, payload);
//             });
//     }

//     buyInsurance(flight, insuranceAmount, callback) {
//         let self = this;
//         self.flightSuretyApp.methods.buyInsurance(flight.airline, flight.flight, flight.timestamp, self.passengers[0]).send({
//             from: self.passengers[0],
//             value: self.web3.utils.toWei(insuranceAmount, "ether"),
//             gas: 4712388,
//             gasPrice: 100000000000
//         }, (error, result) => {
//             flight.insuranceAmount = insuranceAmount;
//             flight.passenger = self.passengers[0];
//             callback(error, flight);
//         });
//     }

//     withdrawAmount(walletAddress, callback) {
//         let self = this;
//         self.flightSuretyApp.methods.withdrawAmount().send({
//             from: walletAddress,
//         }, (error, result) => {
//             callback(error, result);
//         });
//     }
//     registerFlight(flight, callback) {
//         let self = this;
          
//         self.flightSuretyApp.methods
//             .registerFlight(flight,Math.floor(Date.now() / 1000)   )
//             .send({ from: self.owner , gas: 5555555 }, (error, result) => {
//                 callback(error, result);
//             });
//     }
//     fundAirline( callback) {
//         let self = this;      
//         self.flightSuretyApp.methods
//             .activateAirline( self.airlines[1] )
//             .send({ from: self.owner ,value: this.web3.utils.toWei("10","ether")}, (error, result) => {
//                 callback(error, result);
//             })
//             .catch(err=>
//             console.log("error here",err));
//     }
// }






import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
import Config from './config.json';
import Web3 from 'web3';

export default class Contract {
    constructor(network, callback) {
        let config = Config[network];
        this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
        console.log("FlightSuretyApp: "+ config.appAddress);
        console.log("FlightSuretyData: "+ config.dataAddress);
        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
        this.flightSuretyData = new this.web3.eth.Contract(FlightSuretyData.abi, config.dataAddress);
        this.initialize(callback);
        this.owner = null;
        this.airlines = [];
        this.passengers = [];
        this.flights = [];
    }

    initialize(callback) {
        this.web3.eth.getAccounts((error, accts) => {

            this.owner = accts[0];
            console.log("owner: " + this.owner);
            let counter = 1;

          
            while (this.airlines.length < 5) {
                this.airlines.push(accts[counter++]);
            }

            while (this.passengers.length < 5) {
                this.passengers.push(accts[counter++]);
            }

            callback();
        });
    }

    registerAirline(airlineAddress, requesterAddress, callback) {
        let self = this;
        self.flightSuretyApp.methods.registerAirline(airlineAddress).send({
            from: requesterAddress,
            gas: 4712388,
            gasPrice: 100000000000
        }, (error, result) => {
            console.log(result);
            callback(error, result);
        });
    }

    activateAirline(airlineAddress, fundsValue, callback) {
        let self = this;
        self.flightSuretyApp.methods.activateAirline(airlineAddress).send({
            from: airlineAddress,
            value: self.web3.utils.toWei(fundsValue, "ether"),
            gas: 4712388,
            gasPrice: 100000000000
        }, (error, result) => {
            console.log(result);
            callback(error, result);
        });
    }

    isOperational(callback) {
        let self = this;
        self.flightSuretyApp.methods
            .isOperational()
            .call({
                from: self.owner
            }, callback);
    }

    fetchFlightStatus(flight, callback) {
        let self = this;
        let payload = {
            airline: self.airlines[0],
            flight: flight,
            timestamp: Math.floor(Date.now() / 1000)
        }
        self.flightSuretyApp.methods
            .fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)
            .send({
                from: self.owner
            }, (error, result) => {
                callback(error, payload);
            });
    }

    buyInsurance(airline, flight, timestamp,passenger,insuranceValue, callback) {
       
        let self = this;
        let payload = {
            airline: airline,
            flight: flight,
            timestamp: timestamp,
            insuranceValue: insuranceValue,
            insuree: passenger
        }
        self.flightSuretyApp.methods.buyInsurance(payload.airline, payload.flight, payload.timestamp).send({
            from: passenger,
            value: self.web3.utils.toWei(insuranceValue, "ether"),
            gas: 4712388,
            gasPrice: 100000000000
        }, (error, result) => {
            callback(error, payload);
        });
    }


    withdrawAmount(insureeAddress, callback) {
        let self = this;
        self.flightSuretyApp.methods.withdrawAmount().send({
            from: insureeAddress
        }, (error, result) => {
            console.log(result);
            callback(error, result);
        });
    }

}