
const PortalShortcut = (function () {

    const pluginName = "portal-shortcut";

    const showCodeEditor = (function() {
        function precondition() {
            return "enabled";
        }

        function callback() {
            console.log("splitscreen-right");
        }

        return {
            id: "toggleEditorBlockly",
            displayText: "Show Code Editor",
            // eslint-disable-next-line no-undef
            scopeType: _Blockly.ContextMenuRegistry.ScopeType.BLOCK,
            weight: 99,
            preconditionFn: precondition,
            callback: callback
        };
    })();

    function init() {
        _Blockly.ContextMenuRegistry.registry.register(showCodeEditor);
    }

    init();
    return {
        debugMessage: debugMessage,
        toggleDebug: toggleDebug
    };
})();