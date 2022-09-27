
const PortalShortcut = (function () {

    const pluginName = "portal-shortcut";
    let selectedBlocks = [];

    const registerShortcut = (function() {
        const errorMessage = "Failed to register shortcut!";
        const nameError = "Shortcut Name is invalid!";

        function precondition() {
            return "enabled";
        }

        function callback(scope) {
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
                
                var entryName = prompt("Enter Shortcut Name.", "");
                if(entryName != ""){
                    const storeData = getData();
                    var addData = {"name" : entryName, "block" : xmlText}
                    storeData.push(addData);
                    localStorage.setItem(pluginName,JSON.stringify(storeData));
                    console.log(storeData);
                }else{
                    alert(nameError);
                }
                
            }
            catch(e) {
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
            displayText: "Register Shorcut",
            // eslint-disable-next-line no-undef
            scopeType: _Blockly.ContextMenuRegistry.ScopeType.BLOCK,
            weight: 99,
            preconditionFn: precondition,
            callback: callback
        };
    })();

    function getData() {
        const storeData = localStorage.getItem(pluginName);
    
        if (storeData) {
            return JSON.parse(storeData);
        }
    
        return {};
    }

    function init() {
        plugin = BF2042Portal.Plugins.getPlugin(pluginName);
        
        _Blockly.ContextMenuRegistry.registry.register(registerShortcut);
    }

    init();
    return {
        debugMessage: debugMessage,
        toggleDebug: toggleDebug
    };
})();