// HintManager.js
// Version: 1.0.0
// Event: On Awake
// Description: Manages a list of UI Hints containing CustomHint.js from the asset library.
// allows you to show, hide, enable/disable hints globally based on a mapped name.

/*
@typedef hintItem
@property {SceneObject} object
@property {string} hintName 
@property {bool} showOnce 
*/

// @input hintItem[] hints

class HintsManager {
    constructor(hints) {
        this.hintItems = {};
        this.shownHints = {};

        hints.forEach(hintItem => {
            this.hintItems[hintItem.hintName] = {
                object: hintItem.object,
                controller: this.getHintController(hintItem),
                showOnce: hintItem.showOnce,
                enabled: true
            };

            this.shownHints[hintItem.hintName] = false;
        });
    }
    
    show(name) {
        const hintItem = this.hintItems[name];

        if (hintItem && hintItem.enabled) {
            if (
                (hintItem.showOnce && !this.shownHints[name]) 
                || !hintItem.showOnce
            ) {
                hintItem.controller.showHint();
                this.shownHints[name] = true;  
            }
        }
    }
    
    hide(name) {
        const hintItem = this.hintItems[name];
        
        if (hintItem) {
            hintItem.controller.hideHint();
        }
    }
    
    setEnabled(name, state) {
        const hintItem = this.hintItems[name];
        
        if (hintItem) {
            hintItem.enabled = state;
        }
    }
    
    setPositionToObject(name, targetObject) {
        const hintItem = this.hintItems[name];

        const hintST = hintItem.object.getComponent("Component.ScreenTransform");
        const targetST = targetObject.getComponent("Component.ScreenTransform");

        if (targetST) {
            const center = targetST.anchors.getCenter();
            hintST.anchors.setCenter(center);
        }
    }
    
    /**
     * @private
     */
    getHintController(hintItem) {
        const scriptComponents = hintItem.object.getComponents("Component.ScriptComponent");
        for (let i = 0; i < scriptComponents.length; i++) {
            const sc = scriptComponents[i];

            if (sc.showHint && sc.hideHint) {
                return sc;
            }
        }
        
        print("Warning no hint controller found on " + hintItem.object.name);
    }
}

global.hintsManager = new HintsManager(script.hints);