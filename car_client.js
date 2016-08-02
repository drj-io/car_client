var five = require("johnny-five");
var board = new five.Board();
var request = require("request");

var username = "foo";
var password = "bar";
var url = "http://my_car_domain.com:3000/car_api";
var pollInterval = 15000
var car = {}


board.on("ready", function() {
  var unlock = new five.Relay(11);
  var lock = new five.Relay(12);

  lock.off();
  unlock.off();

  

  setInterval(function(){ 
	server_req(function(err,res){
		if(res=="unlock"){
			car.unlock();
		}
		else if(res=="lock"){
			car.lock();
		}
		else if(res=="start"){
			car.start();
		}
		else if(res=="windows"){
			car.windows();
		}

	});	

	}, pollInterval);



  car.unlock= function(){
	console.log('unlock!');
        unlock.on();
	setTimeout(function(){ unlock.off() }, 300); 

  }
  car.lock = function(){
	console.log('lock!');
        lock.on();
	setTimeout(function(){ lock.off() }, 300);
  }
  car.start = function(){
	car.lock();
        setTimeout(function(){ car.lock(); }, 600);
	setTimeout(function(){
		lock.on();
		setTimeout(function(){ lock.off() }, 6000); 
	},1200);

  }
  car.windows = function(){
	unlock.on();
	setTimeout(function(){ unlock.off(); }, 10000);

  }


});


function server_req(cb){
	var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
 	request(
    	{
        	url : url,
        	headers : {
        	    "Authorization" : auth
       	 	}
    	},
    	function (error, response, body) {
		//console.log(body);
  		if(body){
			cb(null,body);
		}
		else {
			cb(true, "{}");
		} 
	}
);



}
