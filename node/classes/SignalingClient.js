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
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = __importDefault(require("events"));
var Offer_1 = require("./Offer");
var FlushOffer_1 = require("./FlushOffer");
var Answer_1 = require("./Answer");
var signalingMessage_1 = require("../templates/signalingMessage");
var SignalingClient = (function (_super) {
    __extends(SignalingClient, _super);
    function SignalingClient(client, signalingServerUrl) {
        var _this = _super.call(this) || this;
        _this.client = client;
        _this.signalingServerUrl = signalingServerUrl;
        _this.fetchConnection();
        return _this;
    }
    SignalingClient.prototype.fetchConnection = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.wsConnectionPromise) {
                    return [2, this.wsConnectionPromise];
                }
                this.wsConnectionPromise = new Promise(function (resolve, reject) {
                    var wsConnection = new _this.client.options.WebSocket(_this.signalingServerUrl);
                    wsConnection.binaryType = 'arraybuffer';
                    wsConnection.onopen = function () {
                        resolve(wsConnection);
                    };
                    wsConnection.onerror = function (error) {
                        reject(error);
                    };
                    wsConnection.onclose = function () {
                        delete _this.wsConnectionPromise;
                        _this.emit('close');
                    };
                    wsConnection.onmessage = _this.handleWsConnectionMessage.bind(_this);
                });
                return [2, this.wsConnectionPromise];
            });
        });
    };
    SignalingClient.prototype.handleWsConnectionMessage = function (message) {
        var signalingMessageHenpojo = signalingMessage_1.signalingMessageTemplate.decode(new Uint8Array(message.data));
        switch (signalingMessageHenpojo.key) {
            case signalingMessage_1.SIGNALING_MESSAGE_KEY.OFFER: {
                var offer = Offer_1.Offer.fromHenpojo(signalingMessageHenpojo.value);
                this.emit('offer', offer);
                break;
            }
            case signalingMessage_1.SIGNALING_MESSAGE_KEY.ANSWER: {
                this.emit('answer', Answer_1.Answer.fromHenpojo(signalingMessageHenpojo.value));
                break;
            }
            case signalingMessage_1.SIGNALING_MESSAGE_KEY.FLUSH_OFFER: {
                this.emit('flushOffer', FlushOffer_1.FlushOffer.fromHenpojo(signalingMessageHenpojo.value));
                break;
            }
            default:
                throw new Error('Unhandled key');
        }
    };
    SignalingClient.prototype.send = function (bytes) {
        return __awaiter(this, void 0, void 0, function () {
            var wsConnection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.fetchConnection()];
                    case 1:
                        wsConnection = _a.sent();
                        wsConnection.send(bytes.getBuffer());
                        return [2];
                }
            });
        });
    };
    SignalingClient.prototype.sendOffer = function (offer) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.send(offer.getEncoding())];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    SignalingClient.prototype.sendAnswer = function (answer) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.send(answer.getEncoding())];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    SignalingClient.prototype.sendFlushOffer = function (flushOffer) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.send(flushOffer.getEncoding())];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    return SignalingClient;
}(events_1.default));
exports.SignalingClient = SignalingClient;
//# sourceMappingURL=SignalingClient.js.map