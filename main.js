const PortalShortcut = (function () {

    const pluginName = "portal-shortcut";

    let selectedBlocks = [];
    const contextMenuStack = [];
    let lastContextMenu = undefined;

    const registerShortcut = (function () {
        const errorMessage = "Failed to register shortcut!";
        const nameError = "Shortcut Name is invalid!";

        function precondition() {
            return "enabled";
        }

        function callback() {
            try {
                let xmlText = "";

                xmlText += blockToXml(plugin.getSelectedBlocks());

                

                var entryName = prompt("Enter Shortcut Name.", "");
                if (entryName != "") {
                    var storeData = getData();
                    storeData[entryName] = xmlText;
                    localStorage.setItem(pluginName, JSON.stringify(storeData));
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
            displayText: "Add Shortcut",
            // eslint-disable-next-line no-undef
            scopeType: _Blockly.ContextMenuRegistry.ScopeType.BLOCK,
            weight: 99,
            preconditionFn: precondition,
            callback: callback
        };
    })();

    const addFromShortcut = (function () {
        const errorMessage = "Failed to add blocks from shortcut!";
        function precondition() {
            return "enabled";
        }

        function callback() {
            const storeData = getData();
            const entries = [];
            for (var key in storeData) {
                const xmlText = storeData[key];
                const entryName = key;
                entries.push({
                    text: entryName,
                    enabled: true,
                    callback: function () {
                        try {
                            if (!xmlText || !xmlText.startsWith("<block")) {
                                return;
                            }

                            const domText = `<xml xmlns="https://developers.google.com/blockly/xml">${xmlText}</xml>`;

                            const xmlDom = _Blockly.Xml.textToDom(domText);

                            //NOTE: Determine a bounding box
                            let minX;
                            let minY;

                            for (let i = 0; i < xmlDom.childNodes.length; i++) {
                                const block = xmlDom.childNodes[i];

                                const x = block.getAttribute("x");
                                const y = block.getAttribute("y");

                                if (!minX || x < minX) {
                                    minX = x;
                                }

                                if (!minY || y < minY) {
                                    minY = y;
                                }
                            }

                            //NOTE: Transform blocks to the minimum coords, then move them to their target position.
                            for (let i = 0; i < xmlDom.childNodes.length; i++) {
                                const block = xmlDom.childNodes[i];

                                const x = block.getAttribute("x");
                                const y = block.getAttribute("y");
                                
                                mouseCoords = plugin.getMouseCoords();
    
                                if (x == minX) {
                                    block.setAttribute("x", mouseCoords.x);
                                }
                                else {
                                    block.setAttribute("x", (x - minX) + mouseCoords.x);
                                }

                                if (y == minY) {
                                    block.setAttribute("y", mouseCoords.y);
                                }
                                else {
                                    block.setAttribute("y", (y - minY) + mouseCoords.y);
                                }
                            }

                            _Blockly.Xml.domToWorkspace(xmlDom, _Blockly.getMainWorkspace())[0];
                        }
                        catch (e) {
                            BF2042Portal.Shared.logError(errorMessage, e);

                            alert(errorMessage);
                        }
                    }
                });
            }
            plugin.showContextMenuWithBack(entries.sort(sortByText));
        }

        function sortByText(a, b) {
            return a.text > b.text ? 1 : -1;
        }

        return {
            id: "addFromShortcut",
            displayText: "Add Block from Shortcut >",
            // eslint-disable-next-line no-undef
            scopeType: _Blockly.ContextMenuRegistry.ScopeType.WORKSPACE,
            weight: 99,
            preconditionFn: precondition,
            callback: callback
        };
    })();


    const deleteShortcut = (function(){
        function precondition() {
            return "enabled";
        }

        function callback() {
            const storeData = getData();
            const entries = [];
            for (var key in storeData) {
                const entryName = key;
                entries.push({
                    text: entryName,
                    enabled: true,
                    callback: function () {
                        delete storeData[entryName];
                        localStorage.setItem(pluginName,JSON.stringify(storeData));
                    }
                });
            }

            plugin.showContextMenuWithBack(entries.sort(sortByText));
        }

        function sortByText(a, b) {
            return a.text > b.text ? 1 : -1;
        }

        return {
            id: "deleteShortcut",
            displayText: "Delete Shortcut >",
            // eslint-disable-next-line no-undef
            scopeType: _Blockly.ContextMenuRegistry.ScopeType.WORKSPACE,
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
        _Blockly.ContextMenuRegistry.registry.register(addFromShortcut);
        _Blockly.ContextMenuRegistry.registry.register(deleteShortcut);
    }

    init();
    return {
        init: init
    };
})();
