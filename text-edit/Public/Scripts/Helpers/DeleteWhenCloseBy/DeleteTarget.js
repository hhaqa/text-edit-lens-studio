// Deleter.js
// Version: 1.0.0
// Event: On Awake
// Description: When an object with Deletable.js is touched, delete icon is shown.
// When the Deletable object is close to the deleter UI, a callback is triggered.

// @input Component.Image deleteUI
// @input float distanceToActivate = 0.1;

const objHelpers = require("./SceneObjectHelpersModule");

class Deleter {
    constructor(deleteUI, distanceToActivate) {
        this.deleteUI = deleteUI;
        this.distanceToActive = distanceToActivate;
    }
    
    show() {
        this.deleteUI.enabled = true;
    }
    
    hide() {
        this.deleteUI.enabled = false;
    }
    
    isPendingDelete(object) {
        // Get the screen pos of the delete button
        const deleteUICamera = objHelpers.getFirstParentCameraIntersectingRecursive(this.deleteUI.getSceneObject());
        const deleteUIWorldPos = this.deleteUI.getTransform().getWorldPosition();
        const deleteUIScreenPos = deleteUICamera.worldSpaceToScreenSpace(deleteUIWorldPos);        
        
        // Get the screen pos of the object
        const objectCamera = objHelpers.getFirstParentCameraIntersectingRecursive(object);
        const objectWorldPos = object.getTransform().getWorldPosition();
        const objectScreenPos = objectCamera.worldSpaceToScreenSpace(objectWorldPos);
        
        // Get the distance between the two
        const dist = deleteUIScreenPos
            .distance(objectScreenPos);

        return dist < this.distanceToActive;
    }
}

function init() {
    global.deleter = new Deleter(script.deleteUI, script.distanceToActivate);
    global.deleter.hide();
}

if (script.deleteUI && script.distanceToActivate) {
    init();
} else {
    print("Error: Please make sure Delete UI and Distance to Activate is assigned.");
}