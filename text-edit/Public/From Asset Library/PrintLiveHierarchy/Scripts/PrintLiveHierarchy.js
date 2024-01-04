// PrintLiveHierarchy.js
// Version: 1.0.0
// Event: On Tapped, or whenever you want to get a print out.
// Description: Prints out the current Objects hierarchy of the scene when this script is called.
// It will also provide information about cameras, render order, and render layer when applicable.
// Useful to understand the state of the scene when you are dynamically creating objects.

// Options
const skipWith_ = true;

//Constants
const instruction = "[Print Live Hierarchy][KEY] O: Render Order, L: Render Layer";

function collectAllObjects() {
    const rootObjectCount = global.scene.getRootObjectsCount();
    const res = {};

    res.name = "[ROOT]";
    res.enabled = true;
    res.children = [];

    for (let i=0; i< rootObjectCount; i++) {
        const child = global.scene.getRootObject(i);
        
        if (!(skipWith_ && child.name[0] == "_")) {
            res.children.push(collectChildObjects(child));
        }
    }

    return res;
}

function collectChildObjects(sceneObject) {
    const o = {};

    // Get basic information about object
    o.name = sceneObject.name;
    o.enabled = sceneObject.enabled;
    o.renderLayer = sceneObject.getRenderLayer();
    
    // Get information about camera if available
    const camComponent = sceneObject.getComponent("Component.Camera");
    if (camComponent) {
        o.camRenderOrder = camComponent.renderOrder;
        o.camRenderLayer = camComponent.renderLayer.numbers;
    }

    // Get information about any visual if available
    const visualComponent = sceneObject.getComponent("Component.Visual");
    if (visualComponent) {
        o.renderOrder = visualComponent.getRenderOrder();
    }

    // Collect childrens
    const childCount = sceneObject.getChildrenCount();
    if (childCount > 0) {
        o.children = [];
        
        for (let i=0; i<childCount; i++) {
            const child = sceneObject.getChild(i);
            if (!(skipWith_ && child.name[0] == "_")) {
                const res = collectChildObjects(child);
                o.children.push(res);
            }
        }
    }

    return o;
}

function JSONtoList(json, indent) {
    let finalOutput = "|"; // Need to add prefix so LS would print spaces.
    
    const indentCount = indent !== undefined && indent !== null ? indent : 0;
    const enabledStatus = json.enabled ? "" : "❌ ";
    const camInfo = json.camRenderOrder ? `(🎥 O:${json.camRenderOrder} L:[${json.camRenderLayer}]) ` : "";
    const renderOrder = json.renderOrder ? ` (O:${json.renderOrder})` : "";
    const renderLayer = json.renderLayer ? ` (L:${json.renderLayer})` : "";
    
    finalOutput +=  indenter(" ", indentCount) + "└" + enabledStatus + camInfo + json.name + renderOrder + renderLayer + "\n";
    
    if (json.children) {
        for (let i = 0; i < json.children.length; i++) {
            const child = json.children[i];
            finalOutput += JSONtoList(child, indentCount+1);
        }
    }

    return finalOutput;
}

function indenter(char, times) {
    let finalOutput = "";

    const spacePerIndent = 4;

    for (let i = 0; i < times * spacePerIndent; i++) {
        finalOutput += char;
    }
    return finalOutput;
}

print(instruction + "\n" + JSONtoList(collectAllObjects()));