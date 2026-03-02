import { splitRules } from "../config/splitRules.js";

export function validateSplitCoherence(trainingSplit, daysPerWeek) {
    const rules = splitRules[trainingSplit];

    if (!rules) {
        throw {
            field: "trainingSplit",
            message: "Invalid training split"
        };
    }

    if (daysPerWeek < rules.min) {
        throw {
            field: "daysPerWeek",
            message: `${trainingSplit} requires at least ${rules.min} training days`
        };
    }

    if (rules.max && daysPerWeek > rules.max) {
        throw {
            field: "daysPerWeek",
            message: `${trainingSplit} allows at most ${rules.max} training days`
        };
    }

    if (rules.onlyEven && daysPerWeek % 2 !== 0) {
        throw {
            field: "daysPerWeek",
            message: `${trainingSplit} requires an even number of training days`
        };
    }
}