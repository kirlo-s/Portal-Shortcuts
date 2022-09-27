
const PortalShortcut = (function () {

    const pluginName = "portal-shortcut";

    const registerShortcut = (function() {
        const errorMessage = "Failed to register shortcut!";
        function precondition() {
            return "enabled";
        }

        function callback(scope) {
            console.log(scope.block);
            try{
                let xmlText = "";

                if (selectedBlocks.length > 0) {
                    for (let i = 0; i < selectedBlocks.length; i++) {
                        xmlText += blockToXml(selectedBlocks[i]);
                    }
                }
                else {
                    xmlText += blockToXml(scope.block);
                }                
            }
            catch(e) {
                BF2042Portal.Shared.logError(errorMessage, e);

                alert(errorMessage);
            }
        }

        return {
            id: "registerShortcut",
            displayText: "Register Shorcut",
            // eslint-disable-next-line no-undef
            scopeType: _Blockly.ContextMenuRegistry.ScopeType.BLOCK,
            weight: 99,
            preconditionFn: precondition,
            callback: callback
        };
    })();

    const sh = (function() {
        function precondition() {
            return "enabled";
        }

        function callback() {
            console.log("splitscreen-right");
        }

        return {
            id: "EditorBlockly",
            displayText: "placeholder",
            // eslint-disable-next-line no-undef
            scopeType: _Blockly.ContextMenuRegistry.ScopeType.WORKSPACE,
            weight: 99,
            preconditionFn: precondition,
            callback: callback
        };
    })();


    function init() {
        plugin = BF2042Portal.Plugins.getPlugin(pluginName);
        
        _Blockly.ContextMenuRegistry.registry.register(registerShortcut);
        _Blockly.ContextMenuRegistry.registry.register(sh);
    }

    init();
    return {
        debugMessage: debugMessage,
        toggleDebug: toggleDebug
    };
})();