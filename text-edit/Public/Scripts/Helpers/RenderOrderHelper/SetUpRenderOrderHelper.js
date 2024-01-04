// SetUpRenderOrderHelper.js
// Version: 1.0.0
// Event: On Awake
// Description: Sets up Render Order Helper on the current object to be accessible by external scripts.

const RenderOrderHelper = require("./RenderOrderHelperModule");
script.renderOrderHelper = new RenderOrderHelper(script.getSceneObject());