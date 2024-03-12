"use strict";
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var ioredis_1 = require("ioredis");
var uuidv4 = require("uuid").v4;
var cors = require("cors");
var app = express();
var PORT = 3000;
// Redis connection
var redis = new ioredis_1.default();
redis.on("connect", function () {
    console.log("connected to Redis");
});
redis.on("error", function (err) {
    console.log("Redis connection error", err);
});
var corsOptions = {
    origin: "http://localhost:3001",
    credentials: true,
};
app.use(express.json());
app.use(cors(corsOptions));
app.get("/get-layout", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, layout, layoutCounts, minAmount, layoutIndex, layoutName;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = ((_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.userId) || "";
                if (!userId) {
                    userId = uuidv4();
                    res.cookie("userId", userId, {
                        httpOnly: true,
                        sameSite: "none",
                        secure: true,
                    });
                }
                return [4 /*yield*/, redis.hget("user_layouts", userId)];
            case 1:
                layout = _b.sent();
                if (!!layout) return [3 /*break*/, 4];
                return [4 /*yield*/, Promise.all([
                        redis.get("layout_1_count"),
                        redis.get("layout_2_count"),
                        redis.get("layout_3_count"),
                    ]).then(function (counts) { return counts.map(function (count) { return (count ? parseInt(count) : 0); }); })];
            case 2:
                layoutCounts = _b.sent();
                minAmount = Math.min.apply(Math, layoutCounts);
                layoutIndex = layoutCounts.indexOf(minAmount);
                layoutName = "layout_".concat(layoutIndex + 1);
                // update redis with layout and new user
                return [4 /*yield*/, Promise.all([
                        redis.hset("user_layouts", userId, layoutName),
                        redis.incr("".concat(layoutName, "_count")),
                    ])];
            case 3:
                // update redis with layout and new user
                _b.sent();
                layout = layoutName;
                _b.label = 4;
            case 4:
                res.send({ layout: layout });
                return [2 /*return*/];
        }
    });
}); });
app.listen(PORT, function () {
    console.log("Sever is running on port 3000");
});
