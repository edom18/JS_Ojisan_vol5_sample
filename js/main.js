(function () {

    'use strict';

    window.deltaX = 0;
    window.deltaY = 0;

    var ua = navigator.userAgent.toLowerCase();
    var isSP = !!(~ua.indexOf('iphone') || ~ua.indexOf('ipad') || ~ua.indexOf('android'));

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
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);


    /////////////////////////////////////////////////////////////////////////////
    // Controlls
    // var controls = new THREE.OrbitControls(camera); 

    var spControls = null;
    if (isSP) {
        spControls = new THREE.DeviceOrientationControls(camera);
        spControls.connect();
    }

    var vrControls = new THREE.VRControls(camera);
    var effects    = new THREE.VREffect(renderer);
    effects.setSize(window.innerWidth, window.innerHeight);

    /////////////////////////////////////////////////////////////////////////////
    // lights
    var light = new THREE.DirectionalLight(0xfffffff);
    light.position.set(1, 1, 1);
    scene.add(light);

    var ambient = new THREE.AmbientLight(0x666666);
    scene.add(ambient);

    var urls = [
        'textures/skybox/px.jpg', // right
        'textures/skybox/nx.jpg', // left
        'textures/skybox/py.jpg', // top
        'textures/skybox/ny.jpg', // bottom
        'textures/skybox/pz.jpg', // back
        'textures/skybox/nz.jpg'  // front
    ];
    var size = 8000;

    var skyboxCubemap = THREE.ImageUtils.loadTextureCube(urls);
    skyboxCubemap.format = THREE.RGBFormat;

    var skyboxShader = THREE.ShaderLib.cube;
    skyboxShader.uniforms.tCube.value = skyboxCubemap;

    var skyBox = new THREE.Mesh(
            new THREE.BoxGeometry(size, size, size),
            new THREE.ShaderMaterial({
                fragmentShader: skyboxShader.fragmentShader,
                vertexShader  : skyboxShader.vertexShader,
                uniforms      : skyboxShader.uniforms,
                depthWrite    : false,
                side          : THREE.BackSide
            })
        );
    scene.add(skyBox);


    /////////////////////////////////////////////////////////////////////////////
    // Models
    var model = new THREE.Object3D();
    model.position.z = -100;
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

    document.addEventListener('click', function (e) {
        effects.setFullScreen(true);
    }, false);

    var dragging = false;
    var prevX = 0;
    var prevY = 0;
    document.addEventListener('mousedown', function (e) {
        dragging = true;
        prevX = e.pageX;
        prevY = e.pageY;
    }, false);
    document.addEventListener('mouseup', function (e) {
        dragging = false;
    }, false);
    document.addEventListener('mousemove', function (e) {
        if (!dragging) {return;}

        var deltaX = e.pageX - prevX;
        var deltaY = e.pageY - prevY;

        window.deltaX += deltaX;
        window.deltaY += deltaY;

        prevX = e.pageX;
        prevY = e.pageY;
    }, false);


    /////////////////////////////////////////////////////////////////////////////
    // Animations
    (function loop() {
        effects.render(scene, camera);
        // renderer.render(scene, camera);

        // controls.update();
        if (isSP) {
            spControls.update();
        }
        else {
            vrControls.update();
        }

        requestAnimationFrame(loop);
    }());

}());
