"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seasonDates = exports.seasonDBDefaults = exports.SeasonType = void 0;
var SeasonType;
(function (SeasonType) {
    SeasonType["SUMMER"] = "SUMMER";
    SeasonType["AUTUMN"] = "AUTUMN";
    SeasonType["WINTER"] = "WINTER";
    SeasonType["SPRING"] = "SPRING";
    SeasonType["AUTUMN_LATE"] = "AUTUMN_LATE";
    SeasonType["SPRING_EARLY"] = "SPRING_EARLY";
    SeasonType["STORM"] = "STORM";
})(SeasonType || (exports.SeasonType = SeasonType = {}));
exports.seasonDBDefaults = {
    seasonType: -1,
    seasonName: "",
    seasonLength: -1,
    seasonLeft: -1,
};
exports.seasonDates = [
    {
        seasonType: 0,
        name: "SUMMER",
        startDay: 1,
        startMonth: 1,
        endDay: 31,
        endMonth: 12,
    },
    {
        seasonType: 1,
        name: "AUTUMN",
        startDay: 1,
        startMonth: 1,
        endDay: 31,
        endMonth: 12,
    },
    {
        seasonType: 2,
        name: "WINTER",
        startDay: 1,
        startMonth: 1,
        endDay: 31,
        endMonth: 12,
    },
    {
        seasonType: 3,
        name: "SPRING",
        startDay: 1,
        startMonth: 1,
        endDay: 31,
        endMonth: 12,
    },
    {
        seasonType: 4,
        name: "AUTUMN_LATE",
        startDay: 1,
        startMonth: 1,
        endDay: 31,
        endMonth: 12,
    },
    {
        seasonType: 5,
        name: "SPRING_EARLY",
        startDay: 1,
        startMonth: 1,
        endDay: 31,
        endMonth: 12,
    },
    {
        seasonType: 6,
        name: "STORM",
        startDay: 1,
        startMonth: 1,
        endDay: 31,
        endMonth: 12,
    },
];
//# sourceMappingURL=seasons.js.map