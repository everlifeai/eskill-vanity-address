const StellarSdk = require('stellar-sdk');
const pkg = require('./package.json');

//This method generates random stellar address till the suffix word matches
function getRandomKeyPair(cb){
	
	const pair = StellarSdk.Keypair.random();
	
	const publicKey = pair.publicKey();
  
  	//Checks if the public key ends with the suffix word
  	if (suffix_word && publicKey.endsWith(suffix_word)) {
   		console.log('Public: ', pair.publicKey());
    	console.log('Secret: ', pair.secret());
        
        cb([pair.publicKey(),pair.secret()])
    	//Array of Key Pair is returned
  	}else{
		  cb()
	  }
}
function generateVanityStellarAddress(suffix_word,cb) {
	
		getRandomKeyPair((data)=>{
			if(data) cb(data)
		});
}

let suffix_word='EV'
let keyPair
while (!keyPair){
	generateVanityStellarAddress(suffix_word,(data)=>{
		keyPair = data
	});
	if(keyPair) break
}
console.log(keyPair)