// Deletable.js
// Version: 1.0.0
// Event: On Awake
// Description: Attach to objects that you want to be trackable by deleter.
// When this object is close to Deleter.js, its script.onShouldDelete is triggered.
// You should assign a function to script.onShouldDelete either from here on in another script.

// @input bool verbose

if (!global.deleter) {
    if (script.verbose) {
        print("Error setting up Deletable. Make sure object with `Deleter.js` exists.");     
    }

    return;
}

// Const
const GetHelpers = require("GetHelpers");
const getComponentOnObject = GetHelpers.getComponentOnObject;

const interactionComponent = getComponentOnObject("Component.InteractionComponent", script.getSceneObject());

if (!interactionComponent) {
    print("[ERROR] Please make sure Deletable is set up correctly.");
    return;
}

// State
let isPendingDelete = false;

interactionComponent.onTouchStart.add(() => {
    global.deleter.show();
});

interactionComponent.onTouchMove.add(() => {
    isPendingDelete = global.deleter.isPendingDelete(script.getSceneObject());
    
    if (script.onInteraction) {
        script.onInteraction(isPendingDelete);
    }
});

interactionComponent.onTouchEnd.add(() => {
    global.deleter.hide();
    
    if (isPendingDelete && script.onShouldDelete) {
        script.onShouldDelete();
    }
});
