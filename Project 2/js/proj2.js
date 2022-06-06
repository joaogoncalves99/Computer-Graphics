/*  * 2nd CG Project
    * Group 48
    * Diogo Pacheco
    * Guilherme Peixoto
    * João Gonçalves
*/ 

//Global THREE
var camera, scene, renderer;
var activeCanon = null;
var cannonBodys = new Map();
var cameras = new Array(3);
var currentBall = null;
var balls = [];
var balls_speed = [];
var balls_angles = [];
var balls_axes = [];
var r_flag = true;
var r_time = 0;
var newBall = true;
var walls = new Array(3);

var prev_animate = 0;

function render() { //Function to render the scene
    'use strict';
    renderer.render(scene, camera);
}

function createOrtCamera() { //Function to create a Ort camera
    'use strict';

    cameras[0] = new THREE.OrthographicCamera( window.innerWidth / -15, window.innerWidth / 15, window.innerHeight / 15, window.innerHeight / -15, - 500, 1000);
    
    cameras[0].position.set(0, 80, 0); // Vista de cima

    cameras[0].lookAt(scene.position);
}

function createPerspCamera() { //Function to create a Persp camera
    'use strict';

    cameras[1] = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 1000);
    
    cameras[1].position.set(80, 80, 80); // Vista todo o terreno

    cameras[1].lookAt(scene.position);
}

function createFollowCamera(){
    'use strict';

    cameras[2] =  new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 1000);

    cameras[2].position.set(80,0,0.43);

}

function createScene() { //Function to create the scene
    'use strict';

    scene = new THREE.Scene();

    createWalls(0,0,0);
    var c1 = createCannon(50,-0.43,-30);
    c1.name = "cannon1";
    var c2 = createCannon(50,-0.43,0);
    c2.name = "cannon2";
    var c3 = createCannon(50,-0.43,30);
    c3.name = "cannon3";

    var ball = null;

    for(var i = 0; i < Math.floor(Math.random() * 10) + 1  ; i++) {
        var dx = 5;
        var dz = 5;

        var flag = false;

        while (!flag) {
            var x = random(-32,32);
            var y = 0;
            var z = random(-35,35);

            flag = true;

            for (var i = 0; i < balls.length; i++) {
                var ball_i = balls[i];
                
                if (Math.abs(ball_i.position.x - x) <= dx && Math.abs(ball_i.position.z - z) <= dz) {
                    flag = false;
                    break;
                }
            }
        }

        ball = createBall(x, y, z); 
        balls.push(ball);
        balls_speed.push(0);
        balls_angles.push(0);
        balls_axes.push(new THREE.AxesHelper(5));
    }
}

function random(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function floatRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function createBall(x,y,z){
    'use strict';

    var geometry = new THREE.SphereGeometry( 2.5, 32, 32 );
    var material = new THREE.MeshBasicMaterial({color: 'blue'});
    var mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x,y,z);

    scene.add(mesh);

    return mesh;

}

function handleAxes(r_flag) {
    console.log(r_flag);
    if (r_flag)
        showBallAxes();
    else
        hideBallAxes();
}

function showBallAxes() {
    for (var i = 0; i < balls.length; i++) {
        var ball = balls[i];
        var ballAxis = balls_axes[i];

        ball.add(ballAxis);
    }
}

function hideBallAxes() {
    for (var i = 0; i < balls.length; i++) {
        var ball = balls[i];
        var ballAxis = balls_axes[i];

        ball.remove(ballAxis);
    }
}

function rotateBalls() {
    for (var i = 0; i < balls.length; i++) {
        var ball = balls[i];

        if (balls_speed[i] != 0) {
            ball.rotation.z += 0.1;
            ball.rotation.x += 0.1 * (balls_angles[i] / (Math.PI / 4));
        }
          
    }
}

function addWallHorizontal(obj,x, y,z){
    'use strict';

    var geometry = new THREE.BoxGeometry(80,7,5);
    var material = new THREE.MeshBasicMaterial( {color: 'red'} );
    var mesh = new THREE.Mesh( geometry, material );
 
    mesh.position.set(x, y, z);

    obj.add(mesh);
    return mesh;

}

function addWallVertical(obj, x,y,z){
    var geometry = new THREE.BoxGeometry(5,7,95);
    var material = new THREE.MeshBasicMaterial( {color: 'red'} );
    var mesh = new THREE.Mesh( geometry, material );
    
    mesh.position.set(x, y, z);

    obj.add( mesh );

    return mesh;

}

function createWalls(x,y,z){
    'use strict';

    var wall = new THREE.Object3D();

    walls[0] = addWallHorizontal(wall, 0,0,45);
    walls[1] = addWallHorizontal(wall, 0,0,-45);
    walls[2] = addWallVertical(wall,-42.5 ,0,0);
  
    wall.position.set(x,y,z);

    scene.add(wall);
}

function addCannonBody(obj, x, y, z) { 
    'use strict';

    var geometry = new THREE.CylinderGeometry(3, 3, 25, 30);
    var material = new THREE.MeshBasicMaterial({color: 'white', wireframe: false});
    var mesh = new THREE.Mesh(geometry, material);
   
    mesh.position.set(x, y, z);
    mesh.rotation.z = 0.5*Math.PI;
    obj.add(mesh)
    cannonBodys.set(obj, mesh);
}

function addCannonWheel(obj,x,y,z){
    'use strict';

    var geometry = new THREE.CylinderGeometry(3, 3, 1, 30);
    var material = new THREE.MeshBasicMaterial({color: 'blue', wireframe: false});
    var mesh = new THREE.Mesh(geometry, material);

    
    mesh.position.set(x, y, z);
    mesh.rotation.x = 0.5*Math.PI;
    obj.add(mesh)

}

function addWheelsEdge(obj,x,y,z){
    'use strict';

    var geometry = new THREE.BoxGeometry(1,1,7.7);
    var material = new THREE.MeshBasicMaterial({color: 'white', wireframe: false});
    var mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);
    obj.add(mesh)


}

function createCannon(x,y,z){
    'use strict';

    var cannon = new THREE.Object3D();

    addCannonBody(cannon,0,0,0);
    addCannonWheel(cannon,2,0,4.2);
    addCannonWheel(cannon,2,0,-4.2);
    addWheelsEdge(cannon,2,-0.5,0);

    cannon.position.set(x,y,z);

    scene.add(cannon);

    return cannon;
    
}

function spawnAndShoot() {
    if (!activeCanon)
        return;

    var c = 8;
    var speed = floatRandom(1, 1.5);

    var x = activeCanon.position.x + (-c * Math.cos(activeCanon.rotation.y));
    var z = activeCanon.position.z + (c * Math.sin(activeCanon.rotation.y));

    currentBall = createBall(x, activeCanon.position.y, z);
    
    balls.push(currentBall);
    balls_speed.push(speed);
    balls_angles.push(activeCanon.rotation.y);
    balls_axes.push(new THREE.AxesHelper(5));
}

function moveBalls(delta) {
    for(i = 0; i < balls.length; i++) {
        var ball = balls[i];
        var speed = balls_speed[i];
        var angle = balls_angles[i];
        
        var c = speed * delta;

        ball.position.x += (-c * Math.cos(angle));
        ball.position.z += (c * Math.sin(angle));
    }
}

function atrito(c) {
    for (i = 0; i < balls_speed.length; i++) {
        if (balls_speed[i] > 0) {
            if (balls_speed[i] >= c)
                balls_speed[i] -= c;
            else
                balls_speed[i] = 0;
        }

        else if (balls_speed[i] < 0) {
            if (balls_speed[i] <= -c)
                balls_speed[i] += c;
            else
                balls_speed[i] = 0;
        }
    }
}


function rotateCannonUp(){
    var cannon = activeCanon;

    if(cannon == null || cannon.rotation.y <= -Math.PI / 6)
        return;

    cannon.rotation.y -= 0.025;
}

function rotateCannonDown(){
    var cannon = activeCanon;

    if(cannon == null || cannon.rotation.y >= Math.PI / 6)
        return;
    
    cannon.rotation.y += 0.025;
}

function cameraSet(x, y, z) { //Auxiliar function to set cameras
    camera.position.set(x, y, z);
    camera.lookAt(scene.position);
}

function changeColor(color) {
    if (!activeCanon)
        return;

    var body = cannonBodys.get(activeCanon);
    body.material.color.set(color);
}

function switch_camera(new_camera) {
    camera = new_camera;
}

function collisionCalculate(wall_type, position) {
    if (wall_type == 1) {
        var speed = balls_speed[position];
        var angle = balls_angles[position];
        balls_speed[position] = -speed;
        balls_angles[position] = -angle;
    }

    else {
        var angle = balls_angles[position];
        balls_angles[position] = -angle;
    }
}

function collisionCalculate1(position1, position2) {
    var v1 = balls_speed[position1];
    var v2 = balls_speed[position2];

    var a1 = balls_angles[position1];
    var a2 = balls_angles[position2];

    var v1_abs = Math.abs(v1);
    var v2_abs = Math.abs(v2);

    if (v1_abs < v2_abs) {
        balls_speed[position1] = v2_abs;
        balls_angles[position1] = a2;

        balls_speed[position2] = -v2_abs;
    }

    else {
        balls_speed[position2] = v1_abs;
        balls_angles[position2] = a1;

        balls_speed[position1] = -v1_abs;
    }

}

function outOfBoundsDetection(limit) {
    balls_oob = [];

    for (var i = 0; i < balls.length; i++) {
        if (balls[i].position.x > limit)
            balls_oob.push(balls[i]);
    }

    for (var j = 0; j < balls_oob.length; j++) {
        balls_oob[j].position.set(10000, 0, 10000);
    }
}


function collisionWallsDetection(dx, dz) {
    var wall1 = walls[0];
    var wall2 = walls[1];
    var wall3 = walls[2];
    
    for(var j=0; j < balls.length; j++) {
        var ball = balls[j];
        
        if(Math.abs(ball.position.x - wall3.position.x) <= dx)
            collisionCalculate(1, j);
        
        else if (Math.abs(ball.position.z - wall1.position.z) <= dz || Math.abs(ball.position.z - wall2.position.z) <= dz)
            collisionCalculate(0, j);
    }
}

function collisionBallsDetection(dx, dz) {
    for (var i=0; i < balls.length; i++) {
        var ball1 = balls[i];
        for (var j=0; j < balls.length; j++) {
            var ball2 = balls[j];
            if (i == j) {
                continue;
            }
            
            if(Math.abs(ball1.position.x - ball2.position.x) <= dx && Math.abs(ball1.position.z - ball2.position.z) <= dz)
                collisionCalculate1(i, j);
        }
    }
}
  
var keyMap = {};

function onKeyDown(e) {
    'use strict';

    keyMap[e.code] = true;
}

function onKeyUp(e) {
    'use strict';

    if (e.code == "Space") {
        newBall = true;
    }

    keyMap[e.code] = false;

}


function animate() {
    'use strict';

    if(keyMap['ArrowRight']) {
        newBall = false;
        rotateCannonUp();
    }

    if(keyMap['ArrowLeft']) {
        newBall = false;
        rotateCannonDown();
    }

    if (keyMap['Digit1'])
        switch_camera(cameras[0]);
    
    if (keyMap['Digit2'])
        switch_camera(cameras[1]);

    if(keyMap['Digit3'])
        switch_camera(cameras[2]);

    
    if (keyMap['KeyR']) {
        var now_r = performance.now();
        var delta_r = now_r - r_time;

        if (delta_r > 400) {
            handleAxes(r_flag);
            r_flag = !r_flag;

            r_time = now_r;
        }
        
    }

    if (keyMap['KeyQ']) {
        changeColor('white');
        activeCanon = scene.getObjectByName("cannon1");
        changeColor('yellow');
    }
    
    if (keyMap['KeyW']) {
        changeColor('white');
        activeCanon = scene.getObjectByName("cannon2");
        changeColor('yellow');
    }
    
    if (keyMap['KeyE']) {
        changeColor('white');
        activeCanon = scene.getObjectByName("cannon3");
        changeColor('yellow');
    }
    if (keyMap['Space']) {
        if (newBall) {
            spawnAndShoot();
            newBall = false;
        }
    }

    cameras[2].position.set(balls[balls.length - 1].position.x + 15, balls[balls.length - 1].position.y, balls[balls.length - 1].position.z);

    cameras[2].lookAt(balls[balls.length-1].position);

    collisionWallsDetection(5.5, 5);
    collisionBallsDetection(4.35, 4.35);
    outOfBoundsDetection(50);

    var now = performance.now();

    var delta = now - prev_animate;

    delta *= 0.1;

    moveBalls(delta);
    rotateBalls();
    atrito(0.0045 * delta);

    render();

    prev_animate = now;

    requestAnimationFrame(animate);
}

function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({antialias: true});

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    createScene();
    createOrtCamera();
    createPerspCamera();
    createFollowCamera();
    switch_camera(cameras[0]);


    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

}