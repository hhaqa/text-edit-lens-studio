// InstantiatorController.js
// Version: 1.0.0
// Event: On Awake
// Description: Provides callback from when an instantiator button is pressed in the Meme Sticker Template.
// It will instantiate the provided `prefabToInstantiate` under the `parent`. In addition, it will
// modify the instantiated object (e.g. change its materials to reflect the material in the instanntiator button).
// Finally, it will refresh the render order of all stickers to ensure the right sticker is on top. 

// @input SceneObject parent
// @input Asset.ObjectPrefab prefabToInstantiate
// @input vec4 instantiationArea = {-1,1,-1,1}

// Const
const GetHelpers = require("GetHelpers");
const getComponentOnObject = GetHelpers.getComponentOnObject;

const interactionComponent = getComponentOnObject("Component.InteractionComponent", script.getSceneObject());
const imageComponent = getComponentOnObject("Component.Image", script.getSceneObject());
const renderOrderHelper = getRenderOrderHelper();

if (!interactionComponent || !imageComponent) {
    print("[ERROR] Please make sure Instantiator Button Controller is set up correctly.");
    return;
}

function instantiateImage() {
    const imageMaterial = imageComponent.getMaterial(0);
    const imageTexture = imageMaterial.mainPass.baseTex;    

    const instantiatedObject = script.prefabToInstantiate.instantiate(script.parent);
    const instantiatedImage = instantiatedObject.getComponent("Component.Image");
    
    const instantiatedST = instantiatedObject.getComponent("Component.ScreenTransform");
    const x = (Math.random() * (script.instantiationArea.g - script.instantiationArea.r)) + script.instantiationArea.r;
    const y = (Math.random() * (script.instantiationArea.a - script.instantiationArea.b)) + script.instantiationArea.b;
    instantiatedST.anchors.setCenter(new vec2(x, y));

    const newMaterial = instantiatedImage.getMaterial(0).clone();
    newMaterial.mainPass.baseColor = vec4.one();
    newMaterial.mainPass.baseTex = imageTexture;
    
    instantiatedImage.clearMaterials();
    instantiatedImage.addMaterial(newMaterial);
    
    renderOrderHelper.storeChildrenVisualComponents();
    renderOrderHelper.refreshRenderOrderAuto();
    
    global.hintsManager.setPositionToObject("rotate", instantiatedObject);
    global.hintsManager.show("rotate");
}

interactionComponent.onTouchStart.add(() => {
    global.hintsManager.hide("tap");
    global.hintsManager.setEnabled("tap", false);

    instantiateImage();  
});

script.instantiateImage = instantiateImage;

// HELPERS
function getRenderOrderHelper() {
    const getScriptWithProperty = GetHelpers.getScriptWithProperty;
    const renderOrderHelperScript = getScriptWithProperty(script.parent, "renderOrderHelper");
    return renderOrderHelperScript.renderOrderHelper;
}