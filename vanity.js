const StellarSdk = require('stellar-sdk');

/*      outcome/
 * This method generates random stellar address and returns it if it
 * matches the given suffix.
 */
function getRandomKeyPair(suffix_word, cb) {
    const pair = StellarSdk.Keypair.random();
    const publicKey = pair.publicKey();
    if (publicKey.endsWith(suffix_word)) cb([pair.publicKey(),pair.secret()])
    else cb()
}

module.exports.generateVanityStellarAddress = function(suffix_word, cb) {
    if(!suffix_word) cb(`Error - no word found to search for!`)
    search_for_keypair_1(suffix_word, cb)

    function search_for_keypair_1(suffix_word, cb) {
        getRandomKeyPair(suffix_word, (data) => {
            if(data) cb(null, data)
            else process.nextTick(() => {
                search_for_keypair_1(suffix_word, cb)
            })
        })
    }
}


