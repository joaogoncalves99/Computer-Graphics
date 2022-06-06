/*  * 1st CG Project
    * Group 48
    * Diogo Pacheco
    * Guilherme Peixoto
    * João Gonçalves
*/ 

//Global THREE
var camera, scene, renderer;

function render() { //Function to render the scene
    'use strict';
    renderer.render(scene, camera);
}

function createCamera() { //Function to create a camera
    'use strict';

    camera = new THREE.OrthographicCamera( window.innerWidth / -15, window.innerWidth / 15, window.innerHeight / 15, window.innerHeight / -15, - 500, 1000);
 
    camera.position.set(80, 80, 80); //Default Camera

    camera.lookAt(scene.position);
 
}

function createScene() { //Function to create the scene
    'use strict';

    scene = new THREE.Scene();

    createCar(0, 0, 0);
    createTarget(40, 4.5, 0);
}


function addcarLeg(obj, x, y, z) { //Add a leg to the car
    'use strict';

    var geometry = new THREE.SphereGeometry(2.6, 8, 8);
    var material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
    var mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.set(x, y - 3, z);

    obj.add(mesh)
}

function addcarTop(obj, x, y, z) { //Add a base to the car
    'use strict';

    var geometry = new THREE.CubeGeometry(60, 2, 30);
    var material = new THREE.MeshBasicMaterial({color: 0x00447c, wireframe: true});
    var mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.set(x, y, z);

    obj.add(mesh)
}


function addcarCalope(obj, x, y, z) { //Add a calope to the car
    'use strict';

    var geometry = new THREE.SphereBufferGeometry(4, 8, 8, 0, 2*Math.PI, 0, 0.5 * Math.PI);
    var material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
    var mesh = new THREE.Mesh(geometry, material);
   
    mesh.position.set(x, y, z);

    obj.add(mesh)
}

function addArm(obj, x, y, z) { //Add the main arm
    'use strict';

    var geometry = new THREE.CubeGeometry(1.95, 30, 1.95);
    var material = new THREE.MeshBasicMaterial({color: 0x020f3c, wireframe: true});
    var mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.set(x, y, z);

    obj.add(mesh)
}

function addForearm(obj, x, y, z) { //Add the forearm
    'use strict';

    var geometry = new THREE.CubeGeometry(30, 1.95, 1.95);
    var material = new THREE.MeshBasicMaterial({color: 0x020f3c, wireframe: true});
    var mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.set(x, y, z);

    obj.add(mesh)
}

function addarticulation(obj, x, y, z) { //Add articulation points to arms
    'use strict';

    var geometry = new THREE.SphereGeometry(2.1, 8, 8);
    var material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);

    obj.add(mesh)
}

function addHand(obj, x, y, z) { //Add a hand to the forearm
    'use strict';

    var geometry = new THREE.CubeGeometry(0.5, 6, 2);
    var material = new THREE.MeshBasicMaterial({color: 0x00447c, wireframe: true});
    var mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.set(x, y, z);

    obj.add(mesh)
}

function addHook(obj, x, y, z) { //Add a hook to the hand
    'use strict';

    var geometry = new THREE.CubeGeometry(3.5, 0.5, 1);
    var material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
    var mesh = new THREE.Mesh(geometry, material);
   
    mesh.position.set(x, y, z);

    obj.add(mesh)
}

function createTarget(x, y, z) { //Create a target
    'use strict';

    var target = new THREE.Object3D();
    target.name = "target";

    addTargetSupport(target, x, y, z);
    addToroide(target, x, y + 19.5, z);

    target.position.set(x, y, z);
    
    scene.add(target);
}

function addTargetSupport(obj, x, y, z) { //Create the target's support
    'use strict';

    var geometry = new THREE.CylinderGeometry(5, 5, 30, 32);
    var material = new THREE.MeshBasicMaterial({color: 'magenta', wireframe: true});
    var mesh = new THREE.Mesh(geometry, material);
   
    mesh.position.set(x, y, z);

    obj.add(mesh)
}

function addToroide(obj, x, y, z) { //Create a toroide
    'use strict';

    var geometry = new THREE.TorusGeometry(3.5, 1, 16, 100);
    var material = new THREE.MeshBasicMaterial({ color: 'yellow', wireframe: true});
    var mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);
    mesh.rotation.y = Math.PI / 2;

    obj.add(mesh);
}

function completedForearm(obj, x, y ,z){ //Function to create a Forearm + Articulation + Hand + Hook together
    var forearm = new THREE.Object3D();
    
    addForearm(forearm,15,33,0);
    addarticulation(forearm, 30,33,0);
    addHand(forearm, 32, 33, 0);
    addHook(forearm, 34, 34.5, 0);
    addHook(forearm, 34, 31.5, 0);

    forearm.position.set(x,y,z);

    obj.add(forearm);
}

function completedArm(obj,x,y,z){ //Function to create the completed arm with all the features
  var fullArm = new THREE.Object3D();

  addArm(fullArm, 0, 17.7, 0);
  addarticulation(fullArm, 0, 32.8, 0);
  completedForearm(fullArm,x,y,z);

  fullArm.position.set(x,y,z);

  var pivot = new THREE.Object3D();
 
  pivot.name = "pivotArm";
  pivot.position.set( 0.0, 0.0, 0);
  pivot.add( fullArm );

  obj.add(pivot);
}

function createCar(x, y, z) { // Create the car with all the features
    'use strict';

    var car = new THREE.Object3D();
    
    car.name = "car";

    addcarTop(car, 0, 0, 0);
    addcarLeg(car, -27, -0.5, -12);
    addcarLeg(car, -27, -0.5, 12);
    addcarLeg(car, 27, -0.5, 12);
    addcarLeg(car, 27, -0.5, -12);
    addcarCalope(car, 0, 1, 0);
    completedArm(car, 0,0,0);

    car.position.set(x, y, z);
    
    scene.add(car);
}

function wireframeToggle(node) {
    if (node instanceof THREE.Mesh) {
        bool = node.material.wireframe;
        node.material.wireframe = !bool;
    }
}

function sceneWireFrameToggle() { //Turn on/off the wireframe
    var car = scene.getObjectByName("car");
    car.traverse(wireframeToggle);

    var target = scene.getObjectByName("target");
    target.traverse(wireframeToggle);
}

function moveRight() { //Move the car to the right
    var car = scene.getObjectByName("car");
    car.position.x += 0.5;
}

function moveLeft() { //Move the car to the left
    var car = scene.getObjectByName("car"); 
    car.position.x -= 0.5;
}

function moveForward() { //Move the carforward
    var car = scene.getObjectByName("car");
    car.position.z -= 0.5;
}

function moveBack() { //Move the car back
    var car = scene.getObjectByName("car");
    car.position.z += 0.5;
}

function rotateArmLeft() { //Rotate the arm to the left
    var pivot = scene.getObjectByName("pivotArm");

    if (pivot.rotation.z >= Math.PI / 3)
        return;

    pivot.rotation.z += 0.025;
}

function rotateArmRight() { //Rotate the arm to the right
    var pivot = scene.getObjectByName("pivotArm");

    if (pivot.rotation.z <= -Math.PI / 4)
        return;

    pivot.rotation.z -= 0.025;
}

function _360ArmRight() { //Rotate the arm 360º
    var pivot = scene.getObjectByName("pivotArm");

    pivot.rotation.y += 0.025;
}

function _360ArmLeft() { //Rotate the arm 360º
    var pivot = scene.getObjectByName("pivotArm");

    pivot.rotation.y -= 0.025;
}

function cameraSet(x, y, z) { //Auxiliar function to set cameras
    camera.position.set(x, y, z);
    camera.lookAt(scene.position);
}


var keyMap = {};

function onKeyDown(e) {
    'use strict';

    keyMap[e.code] = true;
}

function onKeyUp(e) {
    'use strict';

    keyMap[e.code] = false;
}

function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({antialias: true});

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    createScene();
    createCamera();

    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
}

function animate() {
	'use strict';

	if (keyMap['ArrowLeft'])
        moveLeft();
    
    if (keyMap['ArrowUp'])
        moveForward();
    
    if (keyMap['ArrowRight'])
        moveRight();
    
    if (keyMap['ArrowDown'])
        moveBack();
    
    if (keyMap['Digit4'])
        sceneWireFrameToggle();
    
    if (keyMap['KeyQ'])
        rotateArmLeft();
    
    if (keyMap['KeyW'])
        rotateArmRight();

    if (keyMap['KeyS'])
        _360ArmLeft();

    if (keyMap['KeyA'])
        _360ArmRight();
    
    if (keyMap['Digit1'])
        cameraSet(0, 120, 0);
    
    if (keyMap['Digit2'])
        cameraSet(0, 0, 120);
    
    if (keyMap['Digit3'])
        cameraSet(-120, 0, 0);
    
    if (keyMap['Digit0'])
        cameraSet(120, 120, 120);

    render();

    requestAnimationFrame(animate);

}
