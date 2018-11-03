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

const MAX_SEARCH_TIME = 1000 * 60 * 2 // (2 minutes)
module.exports.generateVanityStellarAddress = function(suffix_word, cb) {
    if(!suffix_word) cb(`Error - no word found to search for!`)
    suffix_word = suffix_word.toUpperCase()

    search_for_keypair_1(suffix_word, Date.now(), cb)

    function search_for_keypair_1(suffix_word, start_time, cb) {
        let time_taken = Date.now() - start_time
        if(time_taken > MAX_SEARCH_TIME) {
            cb(`Error - failed to find a matching address in time`)
            return
        }

        getRandomKeyPair(suffix_word, (data) => {
            if(data) cb(null, data)
            else process.nextTick(() => {
                search_for_keypair_1(suffix_word, start_time, cb)
            })
        })
    }
}


