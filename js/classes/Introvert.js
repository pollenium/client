"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Friend_1 = require("./Friend");
var Answer_1 = require("./Answer");
var simple_peer_1 = __importDefault(require("simple-peer"));
var utils_1 = require("../utils");
var delay_1 = __importDefault(require("delay"));
var Bytes_1 = require("./Bytes");
var wrtc = __importStar(require("wrtc"));
var Introvert = (function (_super) {
    __extends(Introvert, _super);
    function Introvert(client, offer) {
        var _this = _super.call(this, client, new simple_peer_1.default({
            initiator: false,
            wrtc: wrtc,
            config: utils_1.getSimplePeerConfig()
        })) || this;
        _this.offer = offer;
        _this.peerClientNonce = offer.clientNonce;
        _this.connect();
        return _this;
    }
    Introvert.prototype.fetchAnswerSdpb = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.simplePeer.once('signal', function (signal) {
                resolve(Bytes_1.Bytes.fromUtf8(signal.sdp));
            });
            _this.simplePeer.signal({
                type: 'offer',
                sdp: _this.offer.sdpb.getUtf8()
            });
        });
    };
    Introvert.prototype.fetchAnswer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = Answer_1.Answer.bind;
                        _b = [void 0, this.client.nonce,
                            this.offer.getId()];
                        return [4, this.fetchAnswerSdpb()];
                    case 1: return [2, new (_a.apply(Answer_1.Answer, _b.concat([_c.sent()])))()];
                }
            });
        });
    };
    Introvert.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var answer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.fetchAnswer()];
                    case 1:
                        answer = _a.sent();
                        this.setStatus(Friend_1.FRIEND_STATUS.CONNECTING);
                        this.client.signalingClientsByOfferIdHex[this.offer.getId().getHex()].sendAnswer(answer);
                        return [4, delay_1.default(this.client.signalTimeoutMs * 2)];
                    case 2:
                        _a.sent();
                        if (this.status === Friend_1.FRIEND_STATUS.CONNECTING) {
                            this.destroy();
                        }
                        return [2];
                }
            });
        });
    };
    Introvert.prototype.destroy = function () {
        var friendIndex = this.client.introverts.indexOf(this);
        this.client.introverts.splice(friendIndex, 1);
        _super.prototype.destroy.call(this);
    };
    return Introvert;
}(Friend_1.Friend));
exports.Introvert = Introvert;
//# sourceMappingURL=Introvert.js.map