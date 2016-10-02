var container, stats;
var camera, scene, loaded;
var renderer;
var orbit;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

document.addEventListener( 'mousemove', onDocumentMouseMove, false );


THREE.DefaultLoadingManager.onProgress = function (item, loaded, total) {

    console.log(item, loaded, total);

};


init();
animate();

function $(id) {

    return document.getElementById(id);

}

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    var loadScene = createLoadScene();

    camera = loadScene.camera;
    scene = loadScene.scene;

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    container.appendChild(renderer.domElement);

    stats = new Stats();
    document.body.appendChild(stats.dom);


    var callbackProgress = function (progress, result) {

        var bar = 250,
            total = progress.totalModels + progress.totalTextures,
            loaded = progress.loadedModels + progress.loadedTextures;

        if (total)
            bar = Math.floor(bar * loaded / total);

        $("bar").style.width = bar + "px";

    };

    var callbackFinished = function (result) {

        loaded = result;

        $("message").style.display = "none";
        $("progressbar").style.display = "none";
        $("progress").style.display = "none";

        camera = loaded.currentCamera;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        scene = loaded.scene;

        orbit = new THREE.OrbitControls(camera, container);

        initGUI();

        previousSelectedName = 'L' + guiData.L + '_H' + guiData.H + '_V' + guiData.V;
        updateGeometry();
    };

    $("progress").style.display = "block";

    THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());

    var loader = new THREE.SceneLoader();

    loader.addGeometryHandler("binary", THREE.BinaryLoader);
    loader.addGeometryHandler("ctm", THREE.CTMLoader);
    loader.addGeometryHandler("vtk", THREE.VTKLoader);
    loader.addGeometryHandler("stl", THREE.STLLoader);

    loader.addHierarchyHandler("obj", THREE.OBJLoader);
    loader.addHierarchyHandler("dae", THREE.ColladaLoader);
    loader.addHierarchyHandler("utf8", THREE.UTF8Loader);

    loader.callbackProgress = callbackProgress;

    loader.load("scenes/ctmFiles.json", callbackFinished);

    //

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseMove(event) {

    mouseX = ( event.clientX - windowHalfX );
    mouseY = ( event.clientY - windowHalfY );

}

function createLoadScene() {

    var result = {

        scene: new THREE.Scene(),
        camera: new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 1000)

    };

    result.camera.position.z = 100;
    result.scene.add(result.camera);

    var object, geometry, material, light, count = 500, range = 200;

    material = new THREE.MeshLambertMaterial({color: 0x156289, wireframe: true});
    geometry = new THREE.BoxGeometry(5, 5, 5);

    for (var i = 0; i < count; i++) {

        object = new THREE.Mesh(geometry, material);

        object.position.x = ( Math.random() - 0.5 ) * range;
        object.position.y = ( Math.random() - 0.5 ) * range;
        object.position.z = ( Math.random() - 0.5 ) * range;

        object.rotation.x = Math.random() * 6;
        object.rotation.y = Math.random() * 6;
        object.rotation.z = Math.random() * 6;

        object.matrixAutoUpdate = false;
        object.updateMatrix();

        result.scene.add(object);

    }

    result.scene.matrixAutoUpdate = false;

    light = new THREE.PointLight(0xffffff);
    result.scene.add(light);

    light = new THREE.DirectionalLight(0x111111);
    light.position.x = 1;
    result.scene.add(light);

    return result;

}

//

function animate() {

    requestAnimationFrame(animate);

    render();
    stats.update();

}

function render() {

    renderer.render(scene, camera);

}