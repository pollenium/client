"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pollenium_buttercup_1 = require("pollenium-buttercup");
var bn_js_1 = __importDefault(require("bn.js"));
exports.stunServers = [
    'stun.l.google.com:19302',
    'stun1.l.google.com:19302',
    'stun2.l.google.com:19302',
    'stun3.l.google.com:19302',
    'stun4.l.google.com:19302',
    'global.stun.twilio.com:3478?transport=udp'
];
function getNow() {
    return Math.floor((new Date).getTime() / 1000);
}
exports.getNow = getNow;
function calculateEra(time) {
    return Math.floor(time / 60);
}
exports.calculateEra = calculateEra;
function getSimplePeerConfig() {
    return {
        iceServers: exports.stunServers.sort(function () {
            return Math.random() - .5;
        }).slice(0, 2).map(function (stunServer) {
            return {
                urls: "stun:" + stunServer
            };
        })
    };
}
exports.getSimplePeerConfig = getSimplePeerConfig;
function getTimestamp() {
    return pollenium_buttercup_1.Buttercup.fromNumber(getNow()).getPaddedLeft(5);
}
exports.getTimestamp = getTimestamp;
exports.twoBn = new bn_js_1.default(2);
function getMaxHash(difficulty, cover, applicationDataLength) {
    var powBn = new bn_js_1.default(255 - difficulty);
    var divisor = new bn_js_1.default(cover + applicationDataLength);
    var maxHashBn = exports.twoBn.pow(powBn).divRound(divisor);
    return pollenium_buttercup_1.Buttercup.fromBn(maxHashBn);
}
exports.getMaxHash = getMaxHash;
function getNonce(noncelessPrehash, difficulty, cover, applicationDataLength, timeoutAt) {
    var maxHashBn = getMaxHash(difficulty, cover, applicationDataLength).getBn();
    while (true) {
        if (getNow() > timeoutAt) {
            throw new Error('Timeout');
        }
        var nonce = pollenium_buttercup_1.Buttercup.random(32);
        var prehash = noncelessPrehash.append(nonce);
        var hashBn = prehash.getHash().getBn();
        if (hashBn.lte(maxHashBn)) {
            return nonce;
        }
    }
}
exports.getNonce = getNonce;
//# sourceMappingURL=utils.js.map