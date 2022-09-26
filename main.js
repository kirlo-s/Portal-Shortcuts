const placeholder = (function () {
    const errorMessage = "Failed to copy to clipboard!";

    function precondition() {
        return "enabled";
    }

    async function callback(scope) {
        try {
            let xmlText = "";

            if (selectedBlocks.length > 0) {
                for (let i = 0; i < selectedBlocks.length; i++) {
                    xmlText += blockToXml(selectedBlocks[i]);
                }
            }
            else {
                xmlText += blockToXml(scope.block);
            }

            await navigator.clipboard.writeText(xmlText);
        }
        catch (e) {
            BF2042Portal.Shared.logError(errorMessage, e);

            alert(errorMessage);
        }
    }

    function blockToXml(block) {
        const xmlDom = _Blockly.Xml.blockToDomWithXY(block, true);
        _Blockly.Xml.deleteNext(xmlDom);

        const xmlText = _Blockly.Xml.domToText(xmlDom).replace("xmlns=\"https://developers.google.com/blockly/xml\"", "");

        return xmlText;
    }

    return {
        id: "placeholder",
        displayText: "placeholder",
        scopeType: _Blockly.ContextMenuRegistry.ScopeType.BLOCK,
        weight: 100,
        preconditionFn: precondition,
        callback: callback
    };
})();


_Blockly.ContextMenuRegistry.registry.register(placeholder);