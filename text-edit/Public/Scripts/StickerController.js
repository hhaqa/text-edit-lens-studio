// StickerController.js
// Version: 1.0.0
// Event: On Awake
// Description: A prefab that represents a sticker in the Meme Sticker template
// This script will let the hint system know when to show/hide hints, as well as organize itself in the render order.
// Finally, this script adds a callback when this object is to be deleted by Deleter.js

// @input Component.ScriptComponent deletable

// Configs
const opacityDefault = 1;
const opacityOnPendingDelete = 0.4;

// Const
const GetHelpers = require("GetHelpers");
const getComponentOnObject = GetHelpers.getComponentOnObject;

const interactionComponent = getComponentOnObject("Component.InteractionComponent", script.getSceneObject());
const imageComponent = getComponentOnObject("Component.Image", script.getSceneObject()); 
const renderOrderHelper = getRenderOrderHelper();

if (!interactionComponent || !imageComponent) {
    print("[ERROR] Please make sure Image Controller is set up correctly.");
    return;
}

function onTouchStart() {
    global.hintsManager.hide("rotate");
    global.hintsManager.show("tap");
    
    if (renderOrderHelper) {
        renderOrderHelper.sendToFront(script.getSceneObject().getComponent("Component.Visual"));
    }
}
interactionComponent.onTouchStart.add(onTouchStart);

// DELETABLE BEHAVIOR
script.deletable.onInteraction = function(isPendingDelete) {
    let baseColor = imageComponent.mainPass.baseColor;
    baseColor.a = isPendingDelete ? opacityOnPendingDelete : opacityDefault;
   
    imageComponent.mainPass.baseColor = baseColor;
};

script.deletable.onShouldDelete = function() {
    script.getSceneObject().destroy();
    
    renderOrderHelper.storeChildrenVisualComponents();
};

// HELPERS
function getRenderOrderHelper() {
    const getScriptWithProperty = GetHelpers.getScriptWithProperty;
    const parent = script.getSceneObject().getParent();
    
    if (parent) {
        const renderOrderHelperScript = getScriptWithProperty(parent, "renderOrderHelper");
        return renderOrderHelperScript.renderOrderHelper;
    } else {
        print("Warning: No parent with `renderOrderHelper` found. Can't set render order of image automatically.");
    }
}
