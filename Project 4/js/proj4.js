/*  * 4nd CG Project
    * Group 48
    * Diogo Pacheco
    * Guilherme Peixoto
    * João Gonçalves
*/ 

//Global THREE
var pauseScreen = 'https://i.imgur.com/GyJiCXi.png';
var woodtexture = 'https://img.freepik.com/vetores-gratis/textura-de-madeira_1083-21.jpg?size=338&ext=jpg';
var woodbumpmap = 'https://static.turbosquid.com/Preview/2014/08/01__14_02_41/Wood_bump.PNGed984dd1-2843-4796-a71e-d228d1174bf7Large.jpg';
var pointbumpmap = 'https://st.mngbcn.com/static/assets/img/landings/blackFriday/black_shop.jpg';
var mona = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg';
var dicetexture = 'https://www.toptal.com/designers/subtlepatterns/patterns/solid.png'

var camera, scene, renderer;

var scale = 40;

var scale_width = null;

var scale_height = null;

var last_height = null;

var last_width = null;

var cameras = new Array(2);

var cubes = [];

var white_cubes_mats = new Array(2);

var black_cubes_mats = new Array(2);

var pause;

var points = [];

var points_mats = new Array(2);

var dice = null;

var dice_mats = new Array(2);

var newdice = null;

var ball = null;

var ball_mats = new Array(2);

var ball_pivot = null;

var ball_rotate_flag = true;

var boardChess = null;

var board_mats = new Array(2);

var directionalLight = null;

var pointlight = null;

var calculateLighting = true;

var min_speed = 0;
var max_speed = 0.05;
var acceleration = 0.00025;
var current_speed = min_speed;

var game_paused = false;

var wires = false;

function render() { //Function to render the scene
    'use strict';

    renderer.render(scene, camera);
}

function createOrtCamera() { //Function to create a Ort camera
    'use strict';

    cameras[0] = new THREE.OrthographicCamera( -window.innerWidth / scale, window.innerWidth / scale, window.innerHeight / scale, -window.innerHeight / scale, -500, 1000);
    
    last_width = window.innerWidth;
    last_height = window.innerHeight;
    

    cameras[0].position.set(100, 100, 100); 

    cameras[0].lookAt(scene.position);
}

function createPerspCamera() { //Function to create a Persp camera
    'use strict';

    cameras[1] = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 1000);
    
    cameras[1].position.set(70, 70, 70); 
    //cameras[1].position.set(0, 25, 0); 
    //cameras[1].position.set(0, 10, 25); 



    cameras[1].lookAt(scene.position);
}

function createScene() { //Function to create the scene
    'use strict';

    scene = new THREE.Scene();
    scene.background = new THREE.Color("black");
}

function createPauseScreen(){
    var geometry = new THREE.PlaneGeometry(50,25,0);

    var texture = new THREE.TextureLoader().load(pauseScreen);

    var material = new THREE.MeshBasicMaterial({map : texture});

    pause = new THREE.Mesh(geometry, material);
    
    pause.position.set(0,50,35);

    pause.visible = false;

    scene.add(pause);
}

function togglePauseScreen(visi){
    pause.visible = visi;
}

function createRectangle(width, height, depth, x, y, z, colorr, flag = true) {

    var geometry = new THREE.BoxGeometry(width, height, depth);
    var texture_loader = new THREE.TextureLoader();
    var texture = texture_loader.load(woodtexture);
    var texture_bumpmap = texture_loader.load(woodbumpmap);

    var material = new THREE.MeshPhongMaterial( {color: colorr, map: texture, bumpMap: texture_bumpmap, side: THREE.DoubleSide, wireframe: wires} );
    var cube = new THREE.Mesh( geometry, material );
    
    cube.position.set(x, y, z);
    
    if(flag)
        scene.add(cube);

    return cube;
}

function createRectangleDice(width, height, depth, x, y, z, colorr) {

    var geometry = new THREE.BoxGeometry(width, height, depth);
    var texture_loader = new THREE.TextureLoader();
    var texture = texture_loader.load(dicetexture);

    var material = new THREE.MeshPhongMaterial( {color: colorr, map: texture, side: THREE.DoubleSide, wireframe: wires} );
    var cube = new THREE.Mesh( geometry, material );
    
    cube.position.set(x, y, z);

    return cube;
}

function createDice(edgeSize,x,y,z){
    'use strict';
    
    dice = createRectangleDice(edgeSize,edgeSize,edgeSize, x,y,z, 'white');

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
    var texture_loader = new THREE.TextureLoader();
    var pointbumpMap = texture_loader.load(pointbumpmap);

    var material = new THREE.MeshPhongMaterial( { color: 'black', bumpMap: pointbumpMap, side : THREE.DoubleSide, wireframe : wires } );
    var circle = new THREE.Mesh( geometry, material );

    circle.position.set(x,y,z);
    dice.add(circle);

    return circle;
}

function createBall(radius, widthSegments, heightSegments, x, y, z) {
    'use strict';

    var geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

    var texture_loader = new THREE.TextureLoader();
    var texture = texture_loader.load(mona);

    var material = new THREE.MeshPhongMaterial( {map: texture, side : THREE.DoubleSide, wireframe: wires, specular: 0xd4d4d4} );
    var sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(x, y, z);

    return sphere;
}

function rotateBall() {
    if (ball_rotate_flag) {
        if (current_speed < max_speed) {
            current_speed += acceleration;
        }
    }

    else {
        if (current_speed > min_speed) {
            current_speed -= acceleration;
        }
    }

    ball_pivot.rotation.y += current_speed;

    if (current_speed > 0)
        ball.rotation.x -= 0.05;
}

function toggleWireframe() {
    wires = !wires;

    boardChess.material.wireframe = wires;

    dice.material.wireframe = wires;


    for (var i = 0; i < cubes.length; i++) {
        cubes[i].material.wireframe = wires;
    }

    for (var i = 0; i < points.length; i++) {
        points[i].material.wireframe = wires;
    }

    ball.material.wireframe = wires;
}

function createChessBoard() {
    'use strict';

    var lineWidthHeight = 15;
    var startX = 52.5;
    var startY = -52.5;

    var endX = -52.5;
    var endY = 52.5;

    var white = false;

    boardChess = createRectangle(130, 3, 130, 0, 0, 0, 'sienna');

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

function createMaterials() {
    'use strict';

    var texture = null;
    var texture_bumpmap = null;
    var pointbumpMap = null;
    var dicetexture1 = null;
    var texture_loader = new THREE.TextureLoader();

    texture = texture_loader.load(woodtexture);
    texture_bumpmap = texture_loader.load(woodbumpmap);
    pointbumpMap = texture_loader.load(pointbumpmap);
    dicetexture1 = texture_loader.load(dicetexture);

    white_cubes_mats[0] = new THREE.MeshBasicMaterial( { color: "white", side : THREE.DoubleSide, map: texture, wireframe: wires} );
    white_cubes_mats[1] = new THREE.MeshPhongMaterial( {color: "white", map: texture, bumpMap: texture_bumpmap, side: THREE.DoubleSide, wireframe: wires} );

    black_cubes_mats[0] = new THREE.MeshBasicMaterial( { color: "black", side : THREE.DoubleSide, map: texture, wireframe: wires} );
    black_cubes_mats[1] = new THREE.MeshPhongMaterial( {color: "black", map: texture, side: THREE.DoubleSide, wireframe: wires} );

    dice_mats[0] = new THREE.MeshBasicMaterial( { color: 'white', side : THREE.DoubleSide, map: dicetexture1, wireframe: wires} );
    dice_mats[1] = new THREE.MeshPhongMaterial( {color: 'white', map: dicetexture1, side: THREE.DoubleSide, wireframe: wires} );

    points_mats[0] = new THREE.MeshBasicMaterial( { color: 'black', side : THREE.DoubleSide, wireframe : wires } );
    points_mats[1] = new THREE.MeshPhongMaterial( { color: 'black', bumpMap: pointbumpMap, side : THREE.DoubleSide, wireframe : wires } );

    board_mats[0] = new THREE.MeshBasicMaterial( { color: "sienna", map: texture, side: THREE.DoubleSide, wireframe: wires} );
    board_mats[1] = new THREE.MeshPhongMaterial( {color: "sienna", map: texture, bumpMap: texture_bumpmap, side: THREE.DoubleSide, wireframe: wires} );

    texture = texture_loader.load(mona);

    ball_mats[0] = new THREE.MeshBasicMaterial( {map: texture, side : THREE.DoubleSide, wireframe: wires} );
    ball_mats[1] = new THREE.MeshPhongMaterial( {map: texture, side : THREE.DoubleSide, wireframe: wires, specular: 0xd4d4d4} );

}

function changeMaterials() {
    'use strict';
    
    calculateLighting = !calculateLighting;
    
    var i_material = calculateLighting ? 1 : 0;

    for (var i = 0; i < cubes.length; i++) {
        if (cubes[i].material.color.equals(new THREE.Color("black"))) {
            cubes[i].material = black_cubes_mats[i_material];
        }

        else {
            cubes[i].material = white_cubes_mats[i_material];
        }

        cubes[i].material.needsUpdate = true;
    }

    for (var i = 0; i < points.length; i++) {
        points[i].material = points_mats[i_material];
        points[i].material.needsUpdate = true;
    }

    dice.material = dice_mats[i_material];
    dice.material.needsUpdate = true;

    boardChess.material = board_mats[i_material];
    boardChess.material.needsUpdate = true;

    ball.material = ball_mats[i_material];
    ball.material.needsUpdate = true;
}

function createDLight() {
    directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 50, 0);
    directionalLight.target.position.set(10,0,10);
    scene.add(directionalLight.target);
    scene.add( directionalLight );
    directionalLight.visible = false;
}

function createPLight() {
    pointlight = new THREE.PointLight(0xff0000, 1, 100);
    pointlight.position.set( 0, 50, 0 );
    scene.add(pointlight);
    pointlight.visible = true;
}

function onResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);

    scale_width = (window.innerWidth * scale_width) / last_width;
    scale_height = (window.innerHeight * scale_height) / last_height;

    if (scale_width / window.innerWidth > scale_height / window.innerHeight)
        scale = scale_height / window.innerHeight;
    else 
        scale = scale_width / window.innerWidth;
    
    last_height = window.innerHeight;
    last_width = window.innerWidth;
    
	//OrthographicCamera
	resizeOrtCamera(scale);

	//PerspectiveCameras
	resizePerspCamera(1);
	
}

function resizeOrtCamera(scale) {
	cameras[0].left = -window.innerWidth / scale;
	cameras[0].right = window.innerWidth / scale;
	cameras[0].top = window.innerHeight / scale;
	cameras[0].bottom = -window.innerHeight / scale;
    cameras[0].updateProjectionMatrix();
}

function resizePerspCamera() {
	cameras[1].aspect = window.innerWidth / window.innerHeight;
	cameras[1].updateProjectionMatrix();
}

function cameraSet(x, y, z, test) { //Auxiliar function to set cameras
    'use strict';
    camera.position.set(x, y, z);
    camera.lookAt(test.position);
}

function switch_camera(new_camera) {
    'use strict';
    camera = new_camera;
}

function onKeyDown(e) {
    'use strict';

    if (e.code == "KeyB")
        ball_rotate_flag = !ball_rotate_flag;
    
    if (e.code == "KeyW")
        toggleWireframe();

    if (e.code == "KeyD")
        directionalLight.visible = !directionalLight.visible; 

    if (e.code == "KeyP")
        pointlight.visible = !pointlight.visible;

    if (e.code == "KeyS"){
        game_paused = !game_paused;

        if (game_paused) {
            switch_camera(cameras[0]);
            togglePauseScreen(true);
            cameraSet(0,50,70,pause);
        } else {
            switch_camera(cameras[1]);
            togglePauseScreen(false);
            cameraSet(70,70,70, scene);
        }
    }

    if (e.code == "KeyR") {
        if (game_paused) {
            game_paused = !game_paused;

            togglePauseScreen(false);
            switch_camera(cameras[1]);
            cameraSet(70,70,70, scene);

            ball.position.set(50, 0, 0);
            ball_pivot.rotation.y = 0;
            current_speed = 0;

            pointlight.visible = true;
            directionalLight.visible = false;

            calculateLighting = false;
            changeMaterials();
        }
    }

    if (e.code == "KeyL") {
        changeMaterials();
    }
}

function animate() {
    'use strict';

    if (!game_paused) {
        newdice.rotation.y += 0.005;
        rotateBall();
    }
  
    render();

    requestAnimationFrame(animate)
}

function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({antialias: true});

    renderer.setSize(window.innerWidth, window.innerHeight);

    scale_width = window.innerWidth * scale;
	scale_height = window.innerHeight * scale;

    document.body.appendChild(renderer.domElement);

    createScene();
    createOrtCamera();
    createPerspCamera();
    createDice(10,0,10,0);
    switch_camera(cameras[1]);
    createPauseScreen();

    createChessBoard();
    createDLight();
    createPLight();
    createMaterials();
    
    ball = createBall(7, 32, 32, 50, 0, 0);

    ball_pivot = new THREE.Object3D();
    ball_pivot.position.set(0, 9, 0);

    ball_pivot.add(ball);

    scene.add(ball_pivot);

    render();

    /* showHelpers();*/
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);

}