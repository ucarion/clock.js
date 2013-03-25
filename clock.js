var renderer, scene, camera, controls;

var hourHand, minuteHand, secondHand;
var clockFace, pendulum;

var radius = 100;
var thickness = 25;

var woodColor = 0xCC6600;

var centerSphereRadius = 5;
var centerSphereColor = 0xFFFFFF;

var handRadius = 5;

var hourHandLength = 50;
var minuteHandLength = 75;
var secondHandLength = 80;

var hourHandColor = 0xFF0000;
var minuteHandColor = 0x009900;
var secondHandColor = 0x0000CC;

var bigTickWidth = 3;
var bigTickLength = 15;

var lilTickWidth = 2;
var lilTickLength = 5;

var tickColor = 0xFFFFFF;

var pendulumLength = 500;
var pendulumWidth = 25;
var pendulumDepth = 10;
var bobRadius = 25;
var bobAmplitude = 3 * Math.PI / 180;

var bodyThickness = 20;
var bodyWidth = 250;
var upperBodyHeight = 250;
var middleBodyHeight = 150;
var sideBodyWidth = 50;
var sideBodyHeight = 300;
var bottomBodyHeight = 50;

var totalHeight = upperBodyHeight + middleBodyHeight + sideBodyHeight + bottomBodyHeight;

function init() {
  // set the scene size
  var WIDTH = $(window).width() - 30,
      HEIGHT = $(window).height() - 70,
      VIEW_ANGLE = 45,
      ASPECT = WIDTH / HEIGHT,
      NEAR = 0.1,
      FAR = 10000;

  // create a WebGL renderer, camera
  // and a scene
  renderer = new THREE.WebGLRenderer();
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene = new THREE.Scene();

  camera.position.y = -pendulumLength / 2;
  camera.position.z = 200;
  camera.lookAt(new THREE.Vector3(0, -pendulumLength, 0)); // look at origin

  // start the renderer
  renderer.setSize(WIDTH, HEIGHT);

  // attach the render-supplied DOM element
  $('#container').append(renderer.domElement);

  // and the camera
  scene.add(camera);

  addControls();

  // draw!
  renderer.render(scene, camera);
}

function fillShapes() {
  // scene.add(new THREE.AxisHelper(100));

  var mesh = new THREE.Mesh( 
    new THREE.CylinderGeometry(radius, radius, thickness, 50, 50, false),
    new THREE.MeshPhongMaterial({
      color: woodColor
    })
  );

  // scene.add(mesh);

  var light1 = new THREE.PointLight( 0xFFFFFF );

  light1.position.x = 0;
  light1.position.y = pendulumLength / 2;
  light1.position.z = 100;

  scene.add(light1);

  var light2 = new THREE.PointLight( 0xFFFFFF );

  light2.position.x = 0;
  light2.position.y = -pendulumLength / 2;
  light2.position.z = 100;

  scene.add(light2);

  var center = new THREE.Mesh(
    new THREE.SphereGeometry(centerSphereRadius, 16, 16),
    new THREE.MeshPhongMaterial({
      color: centerSphereColor
    })
  );

  center.position.y = thickness / 2;

  // scene.add(center);

  hourHand = new THREE.Object3D();
  hourHand.add(makeHand(hourHandColor, hourHandLength));

  // scene.add(hourHand);

  minuteHand = new THREE.Object3D();
  minuteHand.add(makeHand(minuteHandColor, minuteHandLength));

  // scene.add(minuteHand);

  secondHand = new THREE.Object3D();
  secondHand.add(makeHand(secondHandColor, secondHandLength));

  // scene.add(secondHand);

  clockFace = new THREE.Object3D();
  clockFace.add(mesh);
  clockFace.add(center);
  clockFace.add(hourHand);
  clockFace.add(minuteHand);
  clockFace.add(secondHand);

  // do the tick marks around the circle
  var tickGeom = new THREE.CubeGeometry(bigTickWidth, 1, bigTickLength);
  var tickMaterial = new THREE.MeshPhongMaterial({ color: tickColor });

  for (var i = 0; i < 12; i++) {
    var tick = new THREE.Mesh(tickGeom, tickMaterial);

    tick.position.z = -radius + bigTickLength / 2;
    tick.position.y = thickness / 2;
    
    var obj = new THREE.Object3D();
    obj.add(tick);
    obj.rotation.y = -i * Math.PI / 6;

    clockFace.add(obj);
  }

  tickGeom = new THREE.CubeGeometry(lilTickWidth, 1, lilTickLength);
  for (var i = 0; i < 60; i++) {
    // skip ones with big ticks
    if (i % 5 == 0)
      continue;

    var tick = new THREE.Mesh(tickGeom, tickMaterial);

    tick.position.z = -radius + lilTickLength / 2;
    tick.position.y = thickness / 2;
    
    var obj = new THREE.Object3D();
    obj.add(tick);
    obj.rotation.y = -i * Math.PI / 30;

    clockFace.add(obj);
  }

  clockFace.rotation.x = Math.PI / 2;

  var stick = new THREE.Mesh(
    new THREE.CubeGeometry(pendulumWidth, pendulumLength, pendulumDepth),
    new THREE.MeshPhongMaterial({
      color: woodColor
    })
  );

  stick.position.y = -pendulumLength / 2;

  var ball = new THREE.Mesh(
    new THREE.CylinderGeometry(bobRadius, bobRadius, pendulumDepth, 50, 50, false),
    new THREE.MeshPhongMaterial({
      color: woodColor
    })
  );

  ball.position.y = -pendulumLength;
  ball.rotation.x = Math.PI / 2;

  pendulum = new THREE.Object3D();
  pendulum.add(stick);
  pendulum.add(ball);

  var upperBody = new THREE.Mesh(
    new THREE.CubeGeometry(bodyWidth, upperBodyHeight, bodyThickness),
    new THREE.MeshPhongMaterial({
      color: woodColor
    })
  );

  var middleBody = new THREE.Mesh(
    new THREE.CubeGeometry(bodyWidth, middleBodyHeight, bodyThickness),
    new THREE.MeshPhongMaterial({
      color: woodColor
    })
  );

  middleBody.position.y = -upperBodyHeight / 2 - middleBodyHeight / 2;

  var leftSideBody = new THREE.Mesh(
    new THREE.CubeGeometry(sideBodyWidth, sideBodyHeight, bodyThickness),
    new THREE.MeshPhongMaterial({
      color: woodColor
    })
  );

  leftSideBody.position.x = - (bodyWidth - sideBodyWidth) / 2;
  leftSideBody.position.y = -upperBodyHeight / 2 - middleBodyHeight - sideBodyHeight / 2;

  var rightSideBody = new THREE.Mesh(
    new THREE.CubeGeometry(sideBodyWidth, sideBodyHeight, bodyThickness),
    new THREE.MeshPhongMaterial({
      color: woodColor
    })
  );

  rightSideBody.position.x = (bodyWidth - sideBodyWidth) / 2;
  rightSideBody.position.y = -upperBodyHeight / 2 - middleBodyHeight - sideBodyHeight / 2;

  var bottomBody = new THREE.Mesh(
    new THREE.CubeGeometry(bodyWidth, bottomBodyHeight, bodyThickness),
    new THREE.MeshPhongMaterial({
      color: woodColor
    })
  );

  bottomBody.position.y = -upperBodyHeight / 2 - middleBodyHeight - sideBodyHeight - bottomBodyHeight / 2;

  var backPanel = new THREE.Mesh(
    new THREE.CubeGeometry(bodyWidth, totalHeight, bodyThickness),
    new THREE.MeshPhongMaterial({
      color: woodColor
    })
  );

  backPanel.position.z = -bodyThickness;
  backPanel.position.y = upperBodyHeight / 2 - totalHeight / 2;

  var body = new THREE.Object3D();
  body.add(upperBody);
  body.add(middleBody);
  body.add(leftSideBody);
  body.add(rightSideBody);
  body.add(bottomBody);
  body.add(backPanel);

  var grandfatherClock = new THREE.Object3D();
  grandfatherClock.add(clockFace);
  grandfatherClock.add(pendulum);
  grandfatherClock.add(body);

  grandfatherClock.position.y = pendulumLength / 2;

  scene.add(grandfatherClock);

  renderer.render(scene, camera);
}

function makeHand(color, length) {
  var hand = new THREE.Mesh(
    new THREE.CubeGeometry(handRadius, handRadius, length),
    new THREE.MeshPhongMaterial({
      color: color
    })
  );

  hand.position.z = -length / 2;
  hand.position.y = thickness / 2;

  return hand;
}

function addControls() {
    controls = new THREE.TrackballControls(camera, renderer.domElement);
    var radius = pendulumLength * 0.75; // scalar value used to determine relative zoom distances
    controls.rotateSpeed = 1;
    controls.zoomSpeed = .5;
    controls.panSpeed = 1;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = false;
    controls.dynamicDampingFactor = 0.3;

    controls.minDistance = radius * 1.1;
    controls.maxDistance = radius * 25;

    controls.keys = [65, 83, 68]; // [ rotateKey, zoomKey, panKey ]
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  var time = new Date();

  hourHand.rotation.y = -time.getHours() * Math.PI / 12;
  minuteHand.rotation.y = -time.getMinutes() * Math.PI / 30;
  secondHand.rotation.y = -time.getSeconds() * Math.PI / 30;

  var pendulumAngle = Math.PI * time.getMilliseconds() / 1000;
  if (time.getSeconds() % 2 == 0) {
    pendulumAngle *= -1;
  }

  pendulum.rotation.z = Math.sin(pendulumAngle) * bobAmplitude;

  renderer.render(scene, camera);
}

init();
fillShapes();
animate();