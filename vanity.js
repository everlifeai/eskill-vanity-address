const StellarSdk = require('stellar-sdk');

//This method generates random stellar address till the suffix word matches
function getRandomKeyPair(suffix_word, cb){
	
	const pair = StellarSdk.Keypair.random();
	
	const publicKey = pair.publicKey();
  
  	//Checks if the public key ends with the suffix word
  	if (suffix_word && publicKey.endsWith(suffix_word)) {        
		//Array of Key Pair is returned
		console.log(`public key: ${pair.publicKey}`)
		cb([pair.publicKey(),pair.secret()])
    	
  	}else{
		  cb()
	  }
}

module.exports.generateVanityStellarAddress = function(suffix_word, cb) {
	let keyPair
	while (!keyPair){	
		getRandomKeyPair(suffix_word,(data)=>{
			keyPair = data
		});
		if(keyPair) break
	}
	cb(keyPair)
}


