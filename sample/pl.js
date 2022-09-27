const registerShortcut = (function () {
    const errorMessage = "Failed to register shorcut!";
    const nameError = "Shortcut Name is invalid!";

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


            var entryName = prompt("Enter Shortcut Name.", "");
            if (entryName != "") {
                const storeData = getData();
                callback(storeData);
                var addData = { name: entryName, block: xmlText }
                await storeData.push(addData);
                await localStorage.setItem(pluginName, JSON.stringify(storeData))
            } else {
                alert(nameError);
            }
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
        id: "registerShortcut",
        displayText: "Register Shortcut",
        scopetype: _Blockly.ContextMenuRegistry.ScopeType.BLOCK,
        weight: 100,
        preconditionFn: precondition,
        callback: callback
    };
})();

const placeholder = (function () {
    function precondition() {
        return "enabled";
    }

    function callback() {

    }

    return {
        id: "placeholder",
        displayText: "placeholder",
        scopetype: _Blockly.ContextMenuRegistry.ScopeType.BLOCK,
        weight: 100,
        preconditionFn: precondition,
        callback: callback
    };
})();

/*
const deleteShortcut = (function() {
    const errorMessage = "Failed to delete shorcut!";

    function precondition(){
        return "enabled";
    }

    return {
        id: "deleteShortcut",
        displayText: "Delete Shorcut",
        scopetype: _Blockly.ContextMenuRegistry.ScopeType.WORKSPACE,
        weight: 100,
        preconditionFn: precondition,
        callback: callback
    };
    
})();

const addFromShorcut = (function(){

    function precondition(){
        return "enabled";
    }

    return {
        id: "addFromShortcut",
        displayText: "Add Block from Shorcut",
        scopetype: _Blockly.ContextMenuRegistry.ScopeType.WORKSPACE,
        weight: 100,
        preconditionFn: precondition,
        callback: callback
    };

})();
*/

function getData() {
    const storeData = localStorage.getItem(pluginName);

    if (storeData) {
        return JSON.parse(storeData);
    }

    return {};
}
