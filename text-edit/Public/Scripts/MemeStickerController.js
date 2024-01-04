// MemeStickerController.js
// Version: 1.0.0
// Event: On Awake
// Description: Instantiates Instantiator buttons or stickers in the Meme Sticker Template.

// @input Asset.Texture[] textures
// @input bool autoInstatiateFirst
// @input bool showInstantiator
// @input bool deletable

//@ui {"widget":"separator"}

// @input bool advanced

//@ui {"widget":"group_start", "label":"Settings", "showIf": "advanced"}
// @input vec4 instantiationArea = {-1,1,-1,1}
// @input Asset.ObjectPrefab buttonsPrefab
// @input SceneObject buttonsParent
// @input SceneObject deleteTarget
//@ui {"widget":"group_end"}

let buttons = [];

// Const
const GetHelpers = require("GetHelpers");
const getComponentOnObject = GetHelpers.getComponentOnObject;
const getScriptWithProperty = GetHelpers.getScriptWithProperty;

script.textures.forEach((texture, i) => {
    const button = script.buttonsPrefab.instantiate(script.buttonsParent);
    buttons.push(button);

    // Get property of buttons
    const imageComponent = getComponentOnObject("Component.Image", button);
    const buttonAction = getScriptWithProperty(button, "instantiateImage");
    
    if (!imageComponent || !buttonAction) {
        print("[ERROR] Please double check Buttons Prefab is set up correctly.");
        return;
    }

    // Setup look of image on button
    const imageMaterial = imageComponent.getMaterial(0).clone();
    imageMaterial.mainPass.baseTex = texture;
    imageComponent.clearMaterials();
    imageComponent.addMaterial(imageMaterial);

    // Setup behavior of button
    buttonAction.instantiationArea = script.instantiationArea;
    if (i === 0 && script.autoInstatiateFirst) {
        buttonAction.instantiateImage();
    }
});

if (!script.showInstantiator) {
    script.buttonsParent.enabled = false;
    global.hintsManager.setEnabled("tap", false);
}

if (!script.deletable) {
    script.deleteTarget.enabled = false;
}

