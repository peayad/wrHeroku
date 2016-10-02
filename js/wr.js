// dat.GUI parameters and data
var gui, guiData;
var previousSelectedName = 'L1_H1_V1';      // previously selected obj, so we can hide it

var GUI_data = function () {
    this.L = 5;
    this.H = 2;
    this.V = 3;
};


function initGUI() {
    guiData = new GUI_data();
    gui = new dat.GUI();

    gui.remember(guiData);
    var myParamsFolder = gui.addFolder('Parameters');
    myParamsFolder.add(guiData, 'L', 1, 6).step(1).onChange(updateGeometry);
    myParamsFolder.add(guiData, 'H', 1, 6).step(1).onChange(updateGeometry);
    myParamsFolder.add(guiData, 'V', 1, 6).step(1).onChange(updateGeometry);
    myParamsFolder.open();
}

function updateGeometry() {
    /*
     it's called each time the slider are changed to load a different object,
     but it doesn't really reload, it just makes the previous one not visible the newly selected becomes visible
     */

    var selectedObject = scene.getObjectByName(previousSelectedName);
    if (selectedObject) selectedObject.visible = false;

    var objName = 'L' + guiData.L + '_H' + guiData.H + '_V' + guiData.V;

    var newSelectedObject = scene.getObjectByName(objName);
    if (newSelectedObject) {
        newSelectedObject.visible = true;
    }

    previousSelectedName = objName;

}


