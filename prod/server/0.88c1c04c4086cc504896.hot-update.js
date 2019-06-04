exports.id=0,exports.modules={"./src/server/server.js":function(e,t,r){"use strict";r.r(t);var n=r("./build/contracts/FlightSuretyData.json"),s=r("./build/contracts/FlightSuretyApp.json"),o=r("./src/server/config.json"),a=r("web3"),c=r.n(a),u=r("express"),i=r.n(u);function l(e,t,r,n,s,o,a){try{var c=e[o](a),u=c.value}catch(e){return void r(e)}c.done?t(u):Promise.resolve(u).then(n,s)}var d=o.localhost,f=new c.a(new c.a.providers.WebsocketProvider(d.url.replace("http","ws")));f.eth.defaultAccount=f.eth.accounts[0];var h,p=new f.eth.Contract(s.abi,d.appAddress),v=(new f.eth.Contract(n.abi,d.dataAddress),[]);(h=regeneratorRuntime.mark(function e(){var t,r,n,s;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,f.eth.getAccounts();case 2:return t=e.sent,e.next=5,p.methods.REGISTRATION_FEE().call();case 5:r=e.sent,n=19;case 7:if(!(n<=39)){e.next=24;break}return e.prev=8,console.log("HELLO SERVER REGISTRATION_FEE()"),e.next=12,p.methods.registerOracle().send({from:t[n],value:r,gas:3e6});case 12:return e.next=14,p.methods.getMyIndexes().call({from:t[n]});case 14:s=e.sent,v.push({address:t[n],indexes:s}),e.next=21;break;case 18:e.prev=18,e.t0=e.catch(8),console.log(e.t0);case 21:n++,e.next=7;break;case 24:case"end":return e.stop()}},e,null,[[8,18]])}),function(){var e=this,t=arguments;return new Promise(function(r,n){var s=h.apply(e,t);function o(e){l(s,r,n,o,a,"next",e)}function a(e){l(s,r,n,o,a,"throw",e)}o(void 0)})})(),p.events.OracleRequest({fromBlock:0},function(e,t){if(e)console.log(e);else{var r=9*Math.floor(4*Math.random()),n=t.returnValues;orcales.forEach(function(e){e.indexes.forEach(function(t){p.methods.submitOracleResponse(t,n.airline,n.flight,n.timestamp,r).send({from:e.address,gas:99999999}).then(function(n){console.log("RESEULT: "+e.address+" INDEX: "+t+"STATUS CODE: "+r)}).catch(function(n){console.log("ERROR: "+e.address+" INDEX: "+t+"STATUS CODE: "+r)})})})}});var m=i()();m.get("/api",function(e,t){t.send({message:"An API for use with your Dapp!"})}),t.default=m}};