/*  * 4nd CG Project
    * Group 48
    * Diogo Pacheco
    * Guilherme Peixoto
    * João Gonçalves
*/ 

//Global THREE
var camera, scene, renderer;

var scale = 15;

var cameras = new Array(2);

var cubes = [];

var newdice = null;

function render() { //Function to render the scene
    'use strict';

    renderer.render(scene, camera);
}

function createOrtCamera() { //Function to create a Ort camera
    'use strict';

    cameras[0] = new THREE.OrthographicCamera( -window.innerWidth / scale, window.innerWidth / scale, window.innerHeight / scale, -window.innerHeight / scale, -500, 1000);
    
    cameras[0].position.set(100, 100, 100); 

    cameras[0].lookAt(scene.position);
}

function createPerspCamera() { //Function to create a Persp camera
    'use strict';

    cameras[1] = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 1000);
    
    //cameras[1].position.set(50, 50, 50); 
    //cameras[1].position.set(0, 25, 0); 
    cameras[1].position.set(0, 10, 25); 



    cameras[1].lookAt(scene.position);
}

function createScene() { //Function to create the scene
    'use strict';

    scene = new THREE.Scene();
    scene.background = new THREE.Color("skyblue");
}


function createRectangle(width, height, depth, x, y, z, colorr, flag = true) {

    var geometry = new THREE.BoxGeometry(width, height, depth);
    var material = new THREE.MeshBasicMaterial( {color: colorr, side: THREE.DoubleSide, wireframe: false} );
    var cube = new THREE.Mesh( geometry, material );
    
    cube.position.set(x, y, z);
    
    if(flag)
        scene.add(cube);

    return cube;
}

function createDice(edgeSize,x,y,z){
    'use strict';
    var points = [];
    var dice = createRectangle(edgeSize,edgeSize,edgeSize, x,y,z, 'red', false);
    dice.material.wireframe = false;
    //1
    points[0] = createPoint(dice,0,5.01,0);
    points[0].rotation.x = Math.PI/2;
    //3
    points[1] = createPoint(dice,0,0,5.01);
    points[2] = createPoint(dice,3,-3.5,5.01);
    points[3] = createPoint(dice,-3,3.5,5.01)
    //2
    points[4] = createPoint(dice,3,-3,-5.01);
    points[5] = createPoint(dice,-3,3,-5.01);
    //5
    points[6] = createPoint(dice,5.01,0,0);
    points[7] = createPoint(dice,5.01,-3.5,3);
    points[8] = createPoint(dice,5.01,3.5,3);
    points[9] = createPoint(dice,5.01,3.5,-3);
    points[10] = createPoint(dice,5.01,-3.5,-3);
    for(var i = 6; i<11; i++)
        points[i].rotation.y = Math.PI /2;
    //4
    points[11] = createPoint(dice,-5.01,-3.5,3);
    points[12] = createPoint(dice,-5.01,-3.5,-3);
    points[13] = createPoint(dice,-5.01,3.5,3);
    points[14] = createPoint(dice,-5.01,3.5,-3);
    for(var i = 11; i<15; i++)
        points[i].rotation.y = Math.PI /2;
    //6
    points[15] = createPoint(dice,3,-5.01,3);
    points[16] = createPoint(dice,3,-5.01, 0);
    points[17] = createPoint(dice,3,-5.01,-3);
    points[18] = createPoint(dice,-3,-5.01,-3);
    points[19] = createPoint(dice,-3,-5.01,0);
    points[20] = createPoint(dice,-3,-5.01,3);
    for(var i = 15; i<21; i++)
        points[i].rotation.x = Math.PI /2;

    dice.position.set(0,10.5,0);
    dice.rotation.x = Math.PI /4;
    dice.rotation.z = Math.PI /4;
    
    newdice = new THREE.Object3D();

    newdice.add(dice);
    
    scene.add(newdice);
}

function createPoint(dice,x,y,z){
    'use strict';

    var geometry = new THREE.CircleGeometry( 1, 32 );
    var material = new THREE.MeshBasicMaterial( { color: 'black', side : THREE.DoubleSide, wireframe : false } );
    var circle = new THREE.Mesh( geometry, material );

    circle.position.set(x,y,z);
    dice.add(circle);

    return circle;
}

function createBall(radius, widthSegments, heightSegments, x, y, z, colorr) {
    var geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    var material = new THREE.MeshBasicMaterial( {color: colorr, side: THREE.DoubleSide, wireframe: false} );
    var sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(x, y, z);
    scene.add(sphere);
}

function createChessBoard() {
    'use strict';

    var lineWidthHeight = 15;
    var startX = 52.5;
    var startY = -52.5;

    var endX = -52.5;
    var endY = 52.5;

    var white = false;

    createRectangle(130, 3, 130, 0, 0, 0, 'saddlebrown');

    for (var i = startX; i >= endX; i -= lineWidthHeight) {
        white = !white;
        for (var j = startY; j <= endY; j += lineWidthHeight) {
            if (white) {
                var cube =  createRectangle(15, 1, 15, i, 1.51, j, 'black');
                white = false;
            }
            else {
                var cube =  createRectangle(15, 1, 15, i, 1.51, j, 'white');
                white = true;
            }

            cubes.push(cube);
        }
    }
}

function cameraSet(x, y, z) { //Auxiliar function to set cameras
    'use strict';
    camera.position.set(x, y, z);
    camera.lookAt(scene.position);
}

function switch_camera(new_camera) {
    'use strict';
    camera = new_camera;
}

function onKeyDown(e) {
    'use strict';
}

function animate() {
    'use strict';

   newdice.rotation.y += 0.05;
  

    render();

    requestAnimationFrame(animate)
}

function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({antialias: true});

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    createScene();
    createOrtCamera();
    createPerspCamera();
    createDice(10,0,10,0);
    switch_camera(cameras[1]);

    createChessBoard();
    //createBall(7, 32, 32, 0, 20, -20, 'blue');
    
    render();

    /*showHelpers();*/
    window.addEventListener("keydown", onKeyDown);

}