// GetHelpers.js
// Version: 1.0.0
// Event: On Awake
// Description: Given an object, find a script component that contains some property name.

function getScriptWithProperty(object, propertyName) {
    if (!object || !propertyName) {
        return;
    }

    const potentialSCs = object.getComponents("Component.ScriptComponent");
    
    for (var i = 0; i < potentialSCs.length; i++) {
        const potentialSC = potentialSCs[i];

        if (potentialSC[propertyName]) {
            return potentialSC;
        }
    }

    print(`[ERROR] ${object.name} does not have a script component with ${propertyName} in it.`);
}

function getComponentOnObject(componentName, object) {
    if (!object || !componentName) {
        return;
    }

    const component = object.getComponent(componentName);
    
    if (component === undefined || component === null) {
        print(`[ERROR] ${componentName} not found on ${object.name}. Make sure it is on the object.`); 
        return undefined;
    }

    return component;
}

module.exports = {
    getScriptWithProperty: getScriptWithProperty,
    getComponentOnObject: getComponentOnObject
};