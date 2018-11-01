'use strict'
const cote = require('cote')
const u = require('elife-utils')
var stellar_vanity = require('./vanity');

/*      understand/
 * This is the main entry point where we start.
 *
 *      outcome/
 * Start our microservice and register with the communication manager.
 */
function main() {
    startMicroservice()
    registerWithCommMgr()
}

const commMgrClient = new cote.Requester({
    name: 'Calculator -> CommMgr',
    key: 'everlife-communication-svc',
})

function sendReply(msg, req) {
    req.type = 'reply'
    req.msg = msg
    commMgrClient.send(req, (err) => {
        if(err) u.showErr(err)
    })
}




let msKey = 'everlife-vanity-address-svc'
/*      outcome/
 * Register ourselves as a message handler with the communication
 * manager so we can handle requests for simple calculations.
 */
function registerWithCommMgr() {
    commMgrClient.send({
        type: 'register-msg-handler',
        mskey: msKey,
        mshelp: [{cmd:'/stellar_vanity_address',txt: 'Find a stellar vanity address'}],
        mstype: 'msg',
    }, (err) => {
        if(err) u.showErr(err)
    })
}

let currentVanity
function startMicroservice() {

    /*      understand/
     * The calculator microservice (partitioned by key to prevent
     * conflicting with other services.
     */
    const stellarVanityAddressSvc = new cote.Responder({
        name: 'Everlife Vanity Address Generation Service',
        key: msKey,
    })

    /*      outcome/
     * Respond to user messages asking us to calculate things by
     * evaluating them as an expression and returning the result if
     * found.
     */
    stellarVanityAddressSvc.on('msg', (req, cb) => {
        if(askedForService) {
            askedForService = false
            let suffix_word = req.msg
            cb(null, true)
            stellar_vanity.generateVanityStellarAddress(suffix_word,(err, data)=>{
                if(err) sendReply(err, req)
                else sendReply(data,req)
            })
        } else {
            if(req.msg.toLowerCase() == "/stellar_vanity_address") {
                askedForService = true
                sendReply("What word should the stellar address end with?", req)
            } else {
                cb()
            }
        }
    })

}
/*      understand/
 * We keep context here - if the user has asked for our service or not.
 * TODO: Save state in leveldb service
 */
let askedForService = false;
main()

