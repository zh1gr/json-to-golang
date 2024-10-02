const inputArea = document.querySelector(".large-area--input");
const outputArea = document.querySelector(".large-area--output");
const btnFormat = document.querySelector(".controls__button--convert");

btnFormat.addEventListener("click", () => {
    try {
        const jsonObj = JSON.parse(inputArea.value);
        outputArea.value = generateGoStruct(jsonObj, "Root");
    } catch (err) {
        outputArea.value = err.message;
    }
});

function capitalizeFirstLetter(string) {
    return string
        .split(/[-_]/)
        .map(part => {
            if (part === part.toUpperCase()) {
                return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
            }
            return part.charAt(0).toUpperCase() + part.slice(1);
        })
        .join('');
}

function convertToGoType(value, fieldName) {
    const valueType = typeof value;
    if (valueType === "string") return "string";
    if (valueType === "number") return Number.isInteger(value) ? "int" : "float64";
    if (valueType === "boolean") return "bool";
    if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === 'object') {
            let nestedStructName = capitalizeFirstLetter(fieldName);
            return "[]" + nestedStructName;
        }
        return "[]" + convertToGoType(value[0], fieldName);
    }
    if (valueType === "object" && value !== null) {
        return capitalizeFirstLetter(fieldName);
    }
    return "interface{}";
}

function generateGoStruct(jsonObject, structName) {
    let goStruct = `type ${structName} struct {\n`;

    // Track nested structs to define them later
    let nestedStructs = "";

    for (const [key, value] of Object.entries(jsonObject)) {
        let fieldName = capitalizeFirstLetter(key);
        let fieldType = convertToGoType(value, key);

        if (fieldType === fieldName) {
            let nestedStruct = generateGoStruct(value, fieldName);
            nestedStructs += "\n" + nestedStruct;
        } else if (fieldType.startsWith("[]") && typeof value[0] === "object") {
            let nestedStruct = generateGoStruct(value[0], fieldName);
            nestedStructs += "\n" + nestedStruct;
        }

        goStruct += `\t${fieldName} ${fieldType} \`json:"${key}"\`\n`;
    }

    goStruct += `}\n`;

    return goStruct + nestedStructs;
}
