
var Test = require('../config/testConfig.js');
var BigNumber = require('bignumber.js');

contract('Flight Surety Tests', async (accounts) => {

  var config;
  before('setup contract', async () => {
    config = await Test.Config(accounts);
  });

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

  it(`(multiparty) has correct initial isOperational() value`, async function () {

    // Get operating status
    let status = await config.flightSuretyData.isOperational.call();
    assert.equal(status, true, "Incorrect initial operating status value");

  });

  it(`(multiparty) can block access to setOperatingStatus() for non-Contract Owner account`, async function () {

      // Ensure that access is denied for non-Contract Owner account
      let accessDenied = false;
      try 
      {
          await config.flightSuretyData.setOperatingStatus(false, { from: config.testAddresses[2] });
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, true, "Access not restricted to Contract Owner");
            
  });

  it(`(multiparty) can allow access to setOperatingStatus() for Contract Owner account`, async function () {

      // Ensure that access is allowed for Contract Owner account
      let accessDenied = false;
      try 
      {
          await config.flightSuretyData.setOperatingStatus(false,{from:config.firstAirline});
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, false, "Access not restricted to Contract Owner");
      
      //reset to true
    //   await config.flightSuretyData.setOperatingStatus(true,{from:config.firstAirline});
  });

  it(`(multiparty) can block access to functions using requireIsOperational when operating status is false`, async function () {

    //   await config.flightSuretyData.setOperatingStatus(false,{from:config.firstAirline});

      let reverted = false;
      try 
      {
          await config.flightSuretyApp.buyInsurance();
      }
      catch(e) {
          reverted = true;
      }
      assert.equal(reverted, true, "Access not blocked for requireIsOperational");      

      // Set it back for other tests to work
      await config.flightSuretyData.setOperatingStatus(true,{from:config.firstAirline});

  });



  it('(airline) cannot register an Airline using registerAirline() if it is not funded', async () => {
    
    // ARRANGE
    let newAirline = accounts[2];

    // ACT
    try {
        await config.flightSuretyApp.registerAirline(newAirline, {from: config.firstAirline});
    }
    catch(e) {

    }
    let result = await config.flightSuretyData.isAirlineRegistered(newAirline); 

    // ASSERT
    assert.equal(result, false, "Airline should not be able to register another airline if it hasn't provided funding");

  });


  it('(airline) can fund another airline', async function () {
    //   let result1 = await config.flightSuretyApp.isAirlineActivated.call(config.firstAirline);
      
    //   assert.equal(result1,false,"Airline is not activated");

      await config.flightSuretyApp.activateAirline.sendTransaction(config.firstAirline,{
          from: config.firstAirline,
          value: config.weiMultiple*10
      })
      let result2 = await config.flightSuretyApp.isAirlineActivated(config.firstAirline);
      assert.equal(result2,true,"Airline should be activated if provided funding");
  });

  it('(airline) can register 3 new airlines', async () => {
    let result1 = await config.flightSuretyApp.isAirlineRegistered.call(accounts[4]);
    assert.equal(result1, false, "Unable to register Airline 1");

    let result2 = await config.flightSuretyApp.isAirlineRegistered.call(accounts[5]);
    assert.equal(result2, false, "Unable to register Airline 2");

    let result3 = await config.flightSuretyApp.isAirlineRegistered.call(accounts[6]);
    assert.equal(result3, false, "Unable to register Airline 3");

    await config.flightSuretyApp.registerAirline(accounts[4], {from: config.firstAirline});
    await config.flightSuretyApp.registerAirline(accounts[5], {from: config.firstAirline});
    await config.flightSuretyApp.registerAirline(accounts[6], {from: config.firstAirline});

    let result4 = await config.flightSuretyApp.isAirlineRegistered.call(accounts[4]);
    assert.equal(result4, true, "Unable to register Airline 1");

    let result5 = await config.flightSuretyApp.isAirlineRegistered.call(accounts[5]);
    assert.equal(result5, true, "Unable to register Airline 2");

    let result6 = await config.flightSuretyApp.isAirlineRegistered.call(accounts[6]);
    assert.equal(result6, true, "Unable to register Airline 3");

})

it('(airline) can fund the 3 new airlines', async () => {
    let result1 = await config.flightSuretyApp.isAirlineActivated.call(accounts[4]);
    assert.equal(result1, false, "Unable to fund Airline 1");

    let result2 = await config.flightSuretyApp.isAirlineActivated.call(accounts[5]);
    assert.equal(result2, false, "Unable to fund Airline 2");

    let result3 = await config.flightSuretyApp.isAirlineActivated.call(accounts[6]);
    assert.equal(result3, false, "Unable to fund Airline 3");

    await config.flightSuretyApp.activateAirline(accounts[4], {
        from: config.firstAirline,
        value: config.weiMultiple * 10
    });
    await config.flightSuretyApp.activateAirline(accounts[5], {
        from: accounts[4],
        value: config.weiMultiple * 10
    });
    await config.flightSuretyApp.activateAirline(accounts[6], {
        from: accounts[5],
        value: config.weiMultiple * 10
    });

    let result4 = await config.flightSuretyApp.isAirlineActivated.call(accounts[4]);
    assert.equal(result4, true, "Unable to fund Airline 1");

    let result5 = await config.flightSuretyApp.isAirlineActivated.call(accounts[5]);
    assert.equal(result5, true, "Unable to fund Airline 2");

    let result6 = await config.flightSuretyApp.isAirlineActivated.call(accounts[6]);
    assert.equal(result6, true, "Unable to fund Airline 3");
});

it('(airline) Registration of fifth and subsequent airlines requires multi-party consensus of 50% of registered airlines', async () => {
    
 
    // ARRANGE
    let airline2 = accounts[4];
    let airline3 = accounts[5];
    let airline4 = accounts[6];
    let airline5 = accounts[7];
    let airline6 = accounts[8];
    let airline7 = accounts[9]
    // ACT
       let result1 = await config.flightSuretyApp.isAirlineRegistered.call(airline5);
        assert.equal(result1, false, "Unable to register Airline");

        await config.flightSuretyApp.registerAirline(airline5, {from: config.firstAirline});
        await config.flightSuretyApp.registerAirline(airline5, {from: accounts[4]});

        let result2 = await config.flightSuretyApp.isAirlineRegistered.call(airline5);
        assert.equal(result2, true, "Unable to register Airline");

    // try {
      
    //     await config.flightSuretyApp.registerAirline(airline5, {from: airline2});

    //     await config.flightSuretyApp.registerAirline(airline6, {from: airline3});
    //     await config.flightSuretyApp.registerAirline(airline6, {from: config.firstAirline});
    //     // await config.flightSuretyApp.registerAirline(airline6, {from: airline2});

    //     await config.flightSuretyApp.registerAirline(airline7, {from:airline2});

        
    // }
    // catch(e) {
    //     console.log("error here")
    //     console.log(e);
    // }
    
    // let resultAirline5 = await config.flightSuretyData.isAirlineRegistered.call(airline5, {from: config.firstAirline}); 
    // let resultAirline6 = await config.flightSuretyData.isAirlineRegistered.call(airline6, {from: config.firstAirline}); 
    // let resultAirline7 = await config.flightSuretyData.isAirlineRegistered.call(airline7, {from: config.firstAirline}); 
    // console.log(resultAirline5,resultAirline6,resultAirline7)
    // // ASSERT
    // assert.equal(resultAirline5, true, "Airline registered requires multi-party consensus of 50% of registered airlines");
    // assert.equal(resultAirline6, false, "Airline registered has consensus of 50% of registered airlines");
    // assert.equal(resultAirline7,false,"Airline does not have consensus")
    
  });

  it(`(passenger) can buy a flight insurance`, async function () {
    
    // ARRANGE
    let airline7 = accounts[4];
    let passenger = accounts[10];
    let purchased = false;
    let flight = "1DP7 - Delhi to Patna";
    
    // ACT
    try {
        await config.flightSuretyApp.registerFlight(flight, 1, {from: airline7});

        await config.flightSuretyApp.buyInsurance(airline7, flight, 1,passenger ,{
            from: passenger,
            value: config.weiMultiple * 1
        });
        purchased = true;
    } catch (e) {
        console.log(e);
        purchased = false;
    }

    // ASSERT
    assert.equal(purchased, true, "Passenger should be to buy a flight insurance");

});

it(`(passengers) can be credited`, async function () {
    
    // ARRANGE
    let airline7 = accounts[4];
    let credited = false;
    let flight = "1DP7 - Delhi to Patna";
    let passenger = accounts[10];

    
    // ACT
    try {
        // flight is delayed
        await config.flightSuretyApp.processFlightStatus( airline7, flight, 1, 20);
        //credit passenger
        await config.flightSuretyApp.claimInsuranceAmount(airline7, flight, 1,passenger);
        credited = true;
    } catch (e) {
        console.log(e);
        credited = false;
    }

    // ASSERT
    assert.equal(credited, true, "Passengers should have been credited");

});


it(`(passenger) can to be payed/refunded`, async function () {
    
    // ARRANGE
    
    // assuming previous tests, the nine passenger can be refunded now
    let passenger = accounts[10];

    let payed = false;
    let before = await web3.eth.getBalance(passenger);
    let after;
    // ACT
    try {
        await config.flightSuretyApp.withdrawAmount({from:passenger});
        after = await web3.eth.getBalance(passenger);
        payed = true;
      
    } catch (e) {
        console.log(e);
        payed = false;
    }

    // ASSERT
    assert.equal(payed, true, "Passenger should be refunded");
    assert.equal(after - before > config.weiMultiple * 1.49,true , "refund value is not 1.5X");

});

    //    (airline) Registration of fifth and subsequent airlines requires multi-party consensus of 50% of registered airlines:
    //           (passenger) can buy a flight insurance:
    //                  Passenger can withdraw any funds owed to them:
});


