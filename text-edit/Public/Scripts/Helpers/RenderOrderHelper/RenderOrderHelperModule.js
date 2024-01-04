// RenderOrderHelperModule.js
// Version: 1.0.0
// Event: On Awake
// Description: Allows you to modify the render order of children objects directly under a parent.

// Example
//
// ```
// const RenderOrderHelper = require("./RenderOrderHelperModule");
// script.renderOrderHelper = new RenderOrderHelper(script.getSceneObject()); // track the children of the current scene object
// script.renderOrderHelper.sendToFront(childObject.getComponent("Component.Visual"));
// ```

class RenderOrderHelper {
    constructor(parent) {
        /** @type {ComponentNameMap.Visual[]} */
        this.parent = parent;
        this.storeChildrenVisualComponents();
    }

    storeChildrenVisualComponents() {
        this.visualComponents = getComponentsRecursive(this.parent, "Component.Visual");
    }
    
    sendForward(visualToMove) {
        this.sendNext(visualToMove, true);
    }
    
    sendBackward(visualToMove) {
        this.sendNext(visualToMove, false);
    }

    sendToFront(visualToMove) {
        let lastRenderOrder;
        let setRenderOrderToPrevious = false;
    
        for (let i = 0; i < this.visualComponents.length - 1; i++) {
            const currentVisual = this.visualComponents[i];
            const currentRenderOrder = currentVisual.getRenderOrder();
    
            if (visualToMove === currentVisual) {
                // Set the render order to whatever was at the end
                const topMostRenderOrder = this.visualComponents[this.visualComponents.length - 1].getRenderOrder();
                currentVisual.setRenderOrder(topMostRenderOrder);
    
                // Remove from current, and add to the end
                this.visualComponents.splice(i, 1);
                this.visualComponents.push(currentVisual);
    
                // Decrement i, since we just removed an element
                i--;
    
                // Shift every render order after the current
                setRenderOrderToPrevious = true;
    
            } else if (setRenderOrderToPrevious) {
                // Modify every render order except for the last one
                // since we moved the last one there earlier.
                if (i < this.visualComponents.length - 1) {
                    currentVisual.setRenderOrder(lastRenderOrder);
                }
            }
    
            lastRenderOrder = currentRenderOrder;
        }
    }
    
    sendToBack(visualToMove) {
        let lastRenderOrder;
        let setRenderOrderToPrevious = false;
    
        for (let i = this.visualComponents.length - 1; i > 0; i--) {
            const currentVisual = this.visualComponents[i];
            const currentRenderOrder = currentVisual.getRenderOrder();
    
            if (visualToMove === currentVisual) {
                // Set the render order to whatever was at the Bottom
                const bottomMostRenderOrder = this.visualComponents[0].getRenderOrder();
                currentVisual.setRenderOrder(bottomMostRenderOrder);
    
                // Remove from current, and add to the beginning
                this.visualComponents.splice(i, 1);
                this.visualComponents.unshift(currentVisual);
    
                // increment i, since we just removed an element and we're going backward
                i = i + 1;
    
                // Shift every render order after the current
                setRenderOrderToPrevious = true;
    
            } else if (setRenderOrderToPrevious) {
                // Modify every render order except for the last one
                // since we moved the last one there earlier.
                if (i > 0) {
                    currentVisual.setRenderOrder(lastRenderOrder);
                }
            }
    
            lastRenderOrder = currentRenderOrder;
        }
    }
    
    getCurrentRenderOrderStack() {
        return this.visualComponents.map(c => {
            return {
                name: c.getSceneObject().name,
                renderOrder: c.getRenderOrder()
            };
        });
    }
    
    refreshRenderOrderAuto() {
        // Get the render order of the object previous to current.
        let renderOrder = this.visualComponents[this.visualComponents.length - 1].getRenderOrder();
        
        for (let i = 0; i < this.visualComponents.length; i++) {
            const currentVisual = this.visualComponents[i];
            currentVisual.setRenderOrder(renderOrder);
            renderOrder++;
        }
    }

    /**
     * @private
     */
    sendNext(visualToMove, shouldSendForward) {
        let currRenderOrder;
    
        for (let i = 0; i < this.visualComponents.length - 1; i++) {
            const currentVisual = this.visualComponents[i];
            currRenderOrder = currentVisual.getRenderOrder();
    
            if (visualToMove === currentVisual) {
                if (
                    (shouldSendForward && i === this.visualComponents.length - 1)
                    || (!shouldSendForward && i === 0)
                ) {
                    // print(`Already in the ${sendBackward ? "back" : "front"} most position.`)
                    return;
                }
    
                // swap with next in line
                const otherVisualIndex = shouldSendForward ? i+1 : i-1;
                const otherVisual = this.visualComponents[otherVisualIndex];
    
                // Swap render order with next one
                currentVisual.setRenderOrder(otherVisual.getRenderOrder());
                otherVisual.setRenderOrder(currRenderOrder);
    
                // Swap place in array
                const tempVisual = currentVisual;
                this.visualComponents[i] = otherVisual;
                this.visualComponents[otherVisualIndex] = tempVisual;
    
                break;
            }
        }
    }
}

/**
* From SceneObjectHelpersModule.js, June 2023
* Copied here to reduce the need to pull another dependency.
* 
* Returns a list of all Components of `componentType` found in the object and its children.
* @template {keyof ComponentNameMap} T
* @param {SceneObject} object Object to search
* @param {T} componentType Component type name to search for
* @param {ComponentNameMap[componentType][]=} results Optional list to store results in
* @returns {ComponentNameMap[componentType][]} Matching Components in `object` and children
*/
function getComponentsRecursive(object, componentType, results) {
    results = results || [];
    var components = object.getComponents(componentType);
    for (var i=0; i<components.length; i++) {
        results.push(components[i]);
    }
    var childCount = object.getChildrenCount();
    for (var j=0; j<childCount; j++) {
        getComponentsRecursive(object.getChild(j), componentType, results);
    }
    return results;
}

module.exports.version = "1.0.0";
module.exports = RenderOrderHelper;