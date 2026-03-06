import { splitRules } from "../config/splitRules.js";

export function validateSplitCoherence(trainingSplit, daysPerWeek) {
    const rules = splitRules[trainingSplit];

    if (!rules) {
        throw {
            field: "trainingSplit",
            message: "Division de entrenamiento no valida"
        };
    }

    if (daysPerWeek < rules.min) {
        throw {
            field: "daysPerWeek",
            message: `${trainingSplit} requiere al menos ${rules.min} dias de entrenamiento`
        };
    }

    if (rules.max && daysPerWeek > rules.max) {
        throw {
            field: "daysPerWeek",
            message: `${trainingSplit} permite como maximo ${rules.max} dias de entrenamiento`
        };
    }

    if (rules.onlyEven && daysPerWeek % 2 !== 0) {
        throw {
            field: "daysPerWeek",
            message: `${trainingSplit} requiere un numero par de dias de entrenamiento`
        };
    }
}
