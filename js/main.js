(function () {

    'use strict';

    /////////////////////////////////////////////////////////////////////////////
    // Renderer
    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0x000000);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.setScissor(0, 0, window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);


    /////////////////////////////////////////////////////////////////////////////
    // Scene and Camera
    var scene  = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 100;
    camera.lookAt(new THREE.Vector3(0, 0, 0));


    /////////////////////////////////////////////////////////////////////////////
    // Controlls
    var controls = new THREE.OrbitControls(camera); 


    /////////////////////////////////////////////////////////////////////////////
    // lights
    var light = new THREE.DirectionalLight(0xfffffff);
    light.position.set(1, 1, 1);
    scene.add(light);

    var ambient = new THREE.AmbientLight(0x666666);
    scene.add(ambient);


    /////////////////////////////////////////////////////////////////////////////
    // Models
    var model = new THREE.Object3D();
    scene.add(model);

    var loader = new THREE.JSONLoader();
    loader.load('models/oculus-rift.json', function (geometry, materials) {
        var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        var s = 5.0;
        mesh.scale.set(s, s, s);
        model.add(mesh);
    });

    loader.load('models/straps.json', function (geometry, materials) {
        var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        var s = 5.0;
        mesh.scale.set(s, s, s);
        model.add(mesh);
    });


    /////////////////////////////////////////////////////////////////////////////
    // Animations
    (function loop() {
        renderer.render(scene, camera);

        controls.update();

        requestAnimationFrame(loop);
    }());

}());
