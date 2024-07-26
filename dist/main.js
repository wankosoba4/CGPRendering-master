/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var cannon_es__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! cannon-es */ "./node_modules/cannon-es/dist/cannon-es.js");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");



class ThreeJSContainer {
    scene;
    light;
    vehicle;
    camera;
    orbitControls;
    world;
    obstacles = [];
    constructor() { }
    createRendererDOM = (width, height, cameraPos) => {
        const renderer = new three__WEBPACK_IMPORTED_MODULE_1__.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_1__.Color(0x495ed));
        renderer.shadowMap.enabled = true;
        this.camera = new three__WEBPACK_IMPORTED_MODULE_1__.PerspectiveCamera(75, width / height, 0.1, 2000);
        this.camera.position.copy(cameraPos);
        this.orbitControls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__.OrbitControls(this.camera, renderer.domElement);
        this.orbitControls.enableDamping = true;
        this.orbitControls.dampingFactor = 0.25;
        this.orbitControls.enableZoom = true;
        this.createScene();
        const render = (time) => {
            this.orbitControls.update();
            renderer.render(this.scene, this.camera);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    };
    createScene = () => {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();
        this.world = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.World({ gravity: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(0, -9.82, 0) });
        this.world.defaultContactMaterial.restitution = 0.8;
        this.world.defaultContactMaterial.friction = 0.03;
        // 床の生成(Three.js)
        const phongMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshPhongMaterial();
        const planeGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.PlaneGeometry(100, 100);
        const planeMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(planeGeometry, phongMaterial);
        planeMesh.material.side = three__WEBPACK_IMPORTED_MODULE_1__.DoubleSide; // 両面
        planeMesh.rotateX(-Math.PI / 2);
        // 床の生成(Cannon.js)
        const planeShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Plane();
        const planeBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 0 });
        planeBody.addShape(planeShape);
        planeBody.position.set(planeMesh.position.x, planeMesh.position.y, planeMesh.position.z);
        planeBody.quaternion.set(planeMesh.quaternion.x, planeMesh.quaternion.y, planeMesh.quaternion.z, planeMesh.quaternion.w);
        this.world.addBody(planeBody);
        this.scene.add(planeMesh);
        // 障害物の追加
        const obstacleShapes = ['box', 'sphere', 'cylinder'];
        for (let i = 0; i < 10; i++) {
            const shapeType = obstacleShapes[Math.floor(Math.random() * obstacleShapes.length)];
            let obstacleMesh;
            let obstacleBody;
            const x = Math.random() * 50 - 25;
            const y = 2;
            const z = Math.random() * 50 - 25;
            switch (shapeType) {
                case 'box':
                    const boxGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(4, 4, 4);
                    const boxMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshNormalMaterial();
                    obstacleMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(boxGeometry, boxMaterial);
                    this.scene.add(obstacleMesh);
                    const boxShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(2, 2, 2));
                    obstacleBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 0 });
                    obstacleBody.addShape(boxShape);
                    break;
                case 'sphere':
                    const sphereGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.SphereGeometry(2, 32, 32);
                    const sphereMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshNormalMaterial();
                    obstacleMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(sphereGeometry, sphereMaterial);
                    this.scene.add(obstacleMesh);
                    const sphereShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Sphere(2);
                    obstacleBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 0 });
                    obstacleBody.addShape(sphereShape);
                    break;
                case 'cylinder':
                    const cylinderGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.CylinderGeometry(2, 2, 6, 32);
                    const cylinderMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshNormalMaterial();
                    obstacleMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(cylinderGeometry, cylinderMaterial);
                    this.scene.add(obstacleMesh);
                    const cylinderShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Cylinder(2, 2, 6, 32);
                    obstacleBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 0 });
                    obstacleBody.addShape(cylinderShape);
                    break;
            }
            obstacleMesh.position.set(x, y, z);
            obstacleBody.position.set(x, y, z);
            this.world.addBody(obstacleBody);
            // 障害物を配列に追加
            this.obstacles.push({ mesh: obstacleMesh, body: obstacleBody });
        }
        // 車の作成
        const carBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 5 });
        const carBodyShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(4, 0.5, 2));
        carBody.addShape(carBodyShape);
        carBody.position.y = 1;
        const vehicle = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.RigidVehicle({ chassisBody: carBody });
        this.vehicle = vehicle;
        // 左前輪の作成
        const wheelShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Sphere(1);
        const frontLeftWheelBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 1 });
        frontLeftWheelBody.addShape(wheelShape);
        frontLeftWheelBody.angularDamping = 0.4;
        vehicle.addWheel({
            body: frontLeftWheelBody,
            position: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(-2, 0, 2.5)
        });
        // 右前輪
        const frontRightWheelBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 1 });
        frontRightWheelBody.addShape(wheelShape);
        frontRightWheelBody.angularDamping = 0.4;
        vehicle.addWheel({
            body: frontRightWheelBody,
            position: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(-2, 0, -2.5)
        });
        // 左後輪
        const rearLeftWheelBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 1 });
        rearLeftWheelBody.addShape(wheelShape);
        rearLeftWheelBody.angularDamping = 0.4;
        vehicle.addWheel({
            body: rearLeftWheelBody,
            position: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(2, 0, 2.5)
        });
        // 右後輪
        const rearRightWheelBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 1 });
        rearRightWheelBody.addShape(wheelShape);
        rearRightWheelBody.angularDamping = 0.4;
        vehicle.addWheel({
            body: rearRightWheelBody,
            position: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(2, 0, -2.5)
        });
        // Three.js側での生成
        // 車体
        vehicle.addToWorld(this.world);
        const boxGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(8, 1, 4);
        const boxMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshNormalMaterial();
        const boxMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(boxGeometry, boxMaterial);
        this.scene.add(boxMesh);
        // 左前輪
        const wheelGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.SphereGeometry(1);
        const wheelMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshNormalMaterial();
        const frontLeftMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(wheelGeometry, wheelMaterial);
        this.scene.add(frontLeftMesh);
        // 右前輪
        const frontRightMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(wheelGeometry, wheelMaterial);
        this.scene.add(frontRightMesh);
        // 左後輪
        const rearLeftMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(wheelGeometry, wheelMaterial);
        this.scene.add(rearLeftMesh);
        // 右後輪
        const rearRightMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(wheelGeometry, wheelMaterial);
        this.scene.add(rearRightMesh);
        // グリッド表示
        const gridHelper = new three__WEBPACK_IMPORTED_MODULE_1__.GridHelper(100, 100);
        this.scene.add(gridHelper);
        // 軸表示
        const axesHelper = new three__WEBPACK_IMPORTED_MODULE_1__.AxesHelper(50);
        this.scene.add(axesHelper);
        // ライトの設定
        this.light = new three__WEBPACK_IMPORTED_MODULE_1__.DirectionalLight(0xffffff);
        const lvec = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(1, 1, 1).clone().normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
        // キーボードイベントの設定
        const handleKeyDown = (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    this.vehicle.setWheelForce(10, 2); // 後輪駆動
                    this.vehicle.setWheelForce(10, 3); // 後輪駆動
                    break;
                case 'ArrowDown':
                    this.vehicle.setWheelForce(-10, 2); // 後輪駆動
                    this.vehicle.setWheelForce(-10, 3); // 後輪駆動
                    break;
                case 'ArrowLeft':
                    this.vehicle.setSteeringValue(0.5, 0); // 左前輪
                    this.vehicle.setSteeringValue(0.5, 1); // 右前輪
                    break;
                case 'ArrowRight':
                    this.vehicle.setSteeringValue(-0.5, 0); // 左前輪
                    this.vehicle.setSteeringValue(-0.5, 1); // 右前輪
                    break;
            }
        };
        const handleKeyUp = (event) => {
            switch (event.key) {
                case 'ArrowUp':
                case 'ArrowDown':
                    this.vehicle.setWheelForce(0, 2);
                    this.vehicle.setWheelForce(0, 3);
                    break;
                case 'ArrowLeft':
                case 'ArrowRight':
                    this.vehicle.setSteeringValue(0, 0);
                    this.vehicle.setSteeringValue(0, 1);
                    break;
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        let update = (time) => {
            requestAnimationFrame(update);
            this.world.fixedStep(1 / 30);
            // 車の位置と回転を更新
            boxMesh.position.set(carBody.position.x, carBody.position.y, carBody.position.z);
            boxMesh.quaternion.set(carBody.quaternion.x, carBody.quaternion.y, carBody.quaternion.z, carBody.quaternion.w);
            frontLeftMesh.position.set(frontLeftWheelBody.position.x, frontLeftWheelBody.position.y, frontLeftWheelBody.position.z);
            frontLeftMesh.quaternion.set(frontLeftWheelBody.quaternion.x, frontLeftWheelBody.quaternion.y, frontLeftWheelBody.quaternion.z, frontLeftWheelBody.quaternion.w);
            frontRightMesh.position.set(frontRightWheelBody.position.x, frontRightWheelBody.position.y, frontRightWheelBody.position.z);
            frontRightMesh.quaternion.set(frontRightWheelBody.quaternion.x, frontRightWheelBody.quaternion.y, frontRightWheelBody.quaternion.z, frontRightWheelBody.quaternion.w);
            rearLeftMesh.position.set(rearLeftWheelBody.position.x, rearLeftWheelBody.position.y, rearLeftWheelBody.position.z);
            rearLeftMesh.quaternion.set(rearLeftWheelBody.quaternion.x, rearLeftWheelBody.quaternion.y, rearLeftWheelBody.quaternion.z, rearLeftWheelBody.quaternion.w);
            rearRightMesh.position.set(rearRightWheelBody.position.x, rearRightWheelBody.position.y, rearRightWheelBody.position.z);
            rearRightMesh.quaternion.set(rearRightWheelBody.quaternion.x, rearRightWheelBody.quaternion.y, rearRightWheelBody.quaternion.z, rearRightWheelBody.quaternion.w);
            // 障害物の位置と回転を更新
            this.obstacles.forEach(obstacle => {
                obstacle.mesh.position.set(obstacle.body.position.x, obstacle.body.position.y, obstacle.body.position.z);
                obstacle.mesh.quaternion.set(obstacle.body.quaternion.x, obstacle.body.quaternion.y, obstacle.body.quaternion.z, obstacle.body.quaternion.w);
            });
            // カメラの位置を車の後ろに設定
            this.camera.position.set(carBody.position.x - 10 * Math.sin(carBody.quaternion.y), carBody.position.y + 5, carBody.position.z - 10 * Math.cos(carBody.quaternion.y));
            // 車の位置を見つめる
            const carPosition = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(carBody.position.x, carBody.position.y, carBody.position.z);
            this.camera.lookAt(carPosition);
            // OrbitControls のターゲットも更新
            this.orbitControls.target.copy(carPosition);
        };
        requestAnimationFrame(update);
    };
}
window.addEventListener("DOMContentLoaded", init);
function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(800, 600, new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(5, 5, 5));
    document.body.appendChild(viewport);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_cannon-es_dist_cannon-es_js-node_modules_three_examples_jsm_controls_Orb-e58bd2"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFvQztBQUNMO0FBQzJDO0FBRTFFLE1BQU0sZ0JBQWdCO0lBQ1YsS0FBSyxDQUFjO0lBQ25CLEtBQUssQ0FBYztJQUNuQixPQUFPLENBQXNCO0lBQzdCLE1BQU0sQ0FBMEI7SUFDaEMsYUFBYSxDQUFnQjtJQUM3QixLQUFLLENBQWU7SUFDcEIsU0FBUyxHQUE4QyxFQUFFLENBQUM7SUFFbEUsZ0JBQWUsQ0FBQztJQUVULGlCQUFpQixHQUFHLENBQUMsS0FBYSxFQUFFLE1BQWMsRUFBRSxTQUF3QixFQUFFLEVBQUU7UUFDbkYsTUFBTSxRQUFRLEdBQUcsSUFBSSxnREFBbUIsRUFBRSxDQUFDO1FBQzNDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2hDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSx3Q0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDakQsUUFBUSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBRWxDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxvREFBdUIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxHQUFHLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDekUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRXJDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxvRkFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3pFLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUN4QyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7UUFDeEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBRXJDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUVuQixNQUFNLE1BQU0sR0FBeUIsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUMxQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQzVCLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDekMscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbEMsQ0FBQztRQUNELHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTlCLFFBQVEsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUM7UUFDNUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUMxQyxPQUFPLFFBQVEsQ0FBQyxVQUFVLENBQUM7SUFDL0IsQ0FBQztJQUVPLFdBQVcsR0FBRyxHQUFHLEVBQUU7UUFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLHdDQUFXLEVBQUUsQ0FBQztRQUUvQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksNENBQVksQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLDJDQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUN4RSxJQUFJLENBQUMsS0FBSyxDQUFDLHNCQUFzQixDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7UUFDcEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBRWxELGlCQUFpQjtRQUNqQixNQUFNLGFBQWEsR0FBRyxJQUFJLG9EQUF1QixFQUFFLENBQUM7UUFDcEQsTUFBTSxhQUFhLEdBQUcsSUFBSSxnREFBbUIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDeEQsTUFBTSxTQUFTLEdBQUcsSUFBSSx1Q0FBVSxDQUFDLGFBQWEsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUMvRCxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyw2Q0FBZ0IsQ0FBQyxDQUFDLEtBQUs7UUFDakQsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFaEMsa0JBQWtCO1FBQ2xCLE1BQU0sVUFBVSxHQUFHLElBQUksNENBQVksRUFBRSxDQUFDO1FBQ3RDLE1BQU0sU0FBUyxHQUFHLElBQUksMkNBQVcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQy9DLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDL0IsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6RixTQUFTLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pILElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTFCLFNBQVM7UUFDVCxNQUFNLGNBQWMsR0FBRyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDckQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN6QixNQUFNLFNBQVMsR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDcEYsSUFBSSxZQUF3QixDQUFDO1lBQzdCLElBQUksWUFBeUIsQ0FBQztZQUU5QixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztZQUNsQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDWixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztZQUVsQyxRQUFRLFNBQVMsRUFBRTtnQkFDZixLQUFLLEtBQUs7b0JBQ04sTUFBTSxXQUFXLEdBQUcsSUFBSSw4Q0FBaUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNuRCxNQUFNLFdBQVcsR0FBRyxJQUFJLHFEQUF3QixFQUFFLENBQUM7b0JBQ25ELFlBQVksR0FBRyxJQUFJLHVDQUFVLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO29CQUN4RCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkFFN0IsTUFBTSxRQUFRLEdBQUcsSUFBSSwwQ0FBVSxDQUFDLElBQUksMkNBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzFELFlBQVksR0FBRyxJQUFJLDJDQUFXLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDNUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDaEMsTUFBTTtnQkFDVixLQUFLLFFBQVE7b0JBQ1QsTUFBTSxjQUFjLEdBQUcsSUFBSSxpREFBb0IsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUMzRCxNQUFNLGNBQWMsR0FBRyxJQUFJLHFEQUF3QixFQUFFLENBQUM7b0JBQ3RELFlBQVksR0FBRyxJQUFJLHVDQUFVLENBQUMsY0FBYyxFQUFFLGNBQWMsQ0FBQyxDQUFDO29CQUM5RCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkFFN0IsTUFBTSxXQUFXLEdBQUcsSUFBSSw2Q0FBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN6QyxZQUFZLEdBQUcsSUFBSSwyQ0FBVyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQzVDLFlBQVksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQ25DLE1BQU07Z0JBQ1YsS0FBSyxVQUFVO29CQUNYLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxtREFBc0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDakUsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLHFEQUF3QixFQUFFLENBQUM7b0JBQ3hELFlBQVksR0FBRyxJQUFJLHVDQUFVLENBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztvQkFDbEUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7b0JBRTdCLE1BQU0sYUFBYSxHQUFHLElBQUksK0NBQWUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDdkQsWUFBWSxHQUFHLElBQUksMkNBQVcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUM1QyxZQUFZLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUNyQyxNQUFNO2FBQ2I7WUFFRCxZQUFZLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ25DLFlBQVksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFakMsWUFBWTtZQUNaLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQztTQUNuRTtRQUVELE9BQU87UUFDUCxNQUFNLE9BQU8sR0FBRyxJQUFJLDJDQUFXLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM3QyxNQUFNLFlBQVksR0FBRyxJQUFJLDBDQUFVLENBQUMsSUFBSSwyQ0FBVyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRSxPQUFPLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQy9CLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2QixNQUFNLE9BQU8sR0FBRyxJQUFJLG1EQUFtQixDQUFDLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFFdkIsU0FBUztRQUNULE1BQU0sVUFBVSxHQUFHLElBQUksNkNBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QyxNQUFNLGtCQUFrQixHQUFHLElBQUksMkNBQVcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3hELGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN4QyxrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDO1FBQ3hDLE9BQU8sQ0FBQyxRQUFRLENBQUM7WUFDYixJQUFJLEVBQUUsa0JBQWtCO1lBQ3hCLFFBQVEsRUFBRSxJQUFJLDJDQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQztTQUN4QyxDQUFDLENBQUM7UUFFSCxNQUFNO1FBQ04sTUFBTSxtQkFBbUIsR0FBRyxJQUFJLDJDQUFXLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6RCxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDekMsbUJBQW1CLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQztRQUN6QyxPQUFPLENBQUMsUUFBUSxDQUFDO1lBQ2IsSUFBSSxFQUFFLG1CQUFtQjtZQUN6QixRQUFRLEVBQUUsSUFBSSwyQ0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQztTQUN6QyxDQUFDLENBQUM7UUFFSCxNQUFNO1FBQ04sTUFBTSxpQkFBaUIsR0FBRyxJQUFJLDJDQUFXLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN2RCxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDdkMsaUJBQWlCLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQztRQUN2QyxPQUFPLENBQUMsUUFBUSxDQUFDO1lBQ2IsSUFBSSxFQUFFLGlCQUFpQjtZQUN2QixRQUFRLEVBQUUsSUFBSSwyQ0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDO1NBQ3ZDLENBQUMsQ0FBQztRQUVILE1BQU07UUFDTixNQUFNLGtCQUFrQixHQUFHLElBQUksMkNBQVcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3hELGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN4QyxrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDO1FBQ3hDLE9BQU8sQ0FBQyxRQUFRLENBQUM7WUFDYixJQUFJLEVBQUUsa0JBQWtCO1lBQ3hCLFFBQVEsRUFBRSxJQUFJLDJDQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQztTQUN4QyxDQUFDLENBQUM7UUFFSCxnQkFBZ0I7UUFDaEIsS0FBSztRQUNMLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9CLE1BQU0sV0FBVyxHQUFHLElBQUksOENBQWlCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNuRCxNQUFNLFdBQVcsR0FBRyxJQUFJLHFEQUF3QixFQUFFLENBQUM7UUFDbkQsTUFBTSxPQUFPLEdBQUcsSUFBSSx1Q0FBVSxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV4QixNQUFNO1FBQ04sTUFBTSxhQUFhLEdBQUcsSUFBSSxpREFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRCxNQUFNLGFBQWEsR0FBRyxJQUFJLHFEQUF3QixFQUFFLENBQUM7UUFDckQsTUFBTSxhQUFhLEdBQUcsSUFBSSx1Q0FBVSxDQUFDLGFBQWEsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNuRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUU5QixNQUFNO1FBQ04sTUFBTSxjQUFjLEdBQUcsSUFBSSx1Q0FBVSxDQUFDLGFBQWEsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNwRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUUvQixNQUFNO1FBQ04sTUFBTSxZQUFZLEdBQUcsSUFBSSx1Q0FBVSxDQUFDLGFBQWEsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUU3QixNQUFNO1FBQ04sTUFBTSxhQUFhLEdBQUcsSUFBSSx1Q0FBVSxDQUFDLGFBQWEsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNuRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUU5QixTQUFTO1FBQ1QsTUFBTSxVQUFVLEdBQUcsSUFBSSw2Q0FBZ0IsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFM0IsTUFBTTtRQUNOLE1BQU0sVUFBVSxHQUFHLElBQUksNkNBQWdCLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFM0IsU0FBUztRQUNULElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxtREFBc0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNsRCxNQUFNLElBQUksR0FBRyxJQUFJLDBDQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNwRCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFM0IsZUFBZTtRQUNmLE1BQU0sYUFBYSxHQUFHLENBQUMsS0FBb0IsRUFBRSxFQUFFO1lBQzNDLFFBQVEsS0FBSyxDQUFDLEdBQUcsRUFBRTtnQkFDZixLQUFLLFNBQVM7b0JBQ1YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTztvQkFDMUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTztvQkFDMUMsTUFBTTtnQkFDVixLQUFLLFdBQVc7b0JBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPO29CQUMzQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU87b0JBQzNDLE1BQU07Z0JBQ1YsS0FBSyxXQUFXO29CQUNaLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTTtvQkFDN0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNO29CQUM3QyxNQUFNO2dCQUNWLEtBQUssWUFBWTtvQkFDYixJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTTtvQkFDOUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU07b0JBQzlDLE1BQU07YUFDYjtRQUNMLENBQUMsQ0FBQztRQUVGLE1BQU0sV0FBVyxHQUFHLENBQUMsS0FBb0IsRUFBRSxFQUFFO1lBQ3pDLFFBQVEsS0FBSyxDQUFDLEdBQUcsRUFBRTtnQkFDZixLQUFLLFNBQVMsQ0FBQztnQkFDZixLQUFLLFdBQVc7b0JBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNqQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ2pDLE1BQU07Z0JBQ1YsS0FBSyxXQUFXLENBQUM7Z0JBQ2pCLEtBQUssWUFBWTtvQkFDYixJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDcEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ3BDLE1BQU07YUFDYjtRQUNMLENBQUMsQ0FBQztRQUVGLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDcEQsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztRQUVoRCxJQUFJLE1BQU0sR0FBeUIsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUN4QyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFFN0IsYUFBYTtZQUNiLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakYsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUUvRyxhQUFhLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hILGFBQWEsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVqSyxjQUFjLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVILGNBQWMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsbUJBQW1CLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV0SyxZQUFZLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BILFlBQVksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUU1SixhQUFhLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hILGFBQWEsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVqSyxlQUFlO1lBQ2YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQzlCLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6RyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakosQ0FBQyxDQUFDLENBQUM7WUFFSCxpQkFBaUI7WUFDakIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUNwQixPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUN4RCxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQ3RCLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQzNELENBQUM7WUFFRixZQUFZO1lBQ1osTUFBTSxXQUFXLEdBQUcsSUFBSSwwQ0FBYSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFaEMsMEJBQTBCO1lBQzFCLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNoRCxDQUFDO1FBRUQscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbEMsQ0FBQztDQUNKO0FBRUQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxDQUFDO0FBRWxELFNBQVMsSUFBSTtJQUNULElBQUksU0FBUyxHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztJQUN2QyxJQUFJLFFBQVEsR0FBRyxTQUFTLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLDBDQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pGLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3hDLENBQUM7Ozs7Ozs7VUN0U0Q7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOzs7OztXQ3pCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLCtCQUErQix3Q0FBd0M7V0FDdkU7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQkFBaUIscUJBQXFCO1dBQ3RDO1dBQ0E7V0FDQSxrQkFBa0IscUJBQXFCO1dBQ3ZDO1dBQ0E7V0FDQSxLQUFLO1dBQ0w7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQzNCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTSxxQkFBcUI7V0FDM0I7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7Ozs7O1VFaERBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvLi9zcmMvYXBwLnRzIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgQ0FOTk9OIGZyb20gJ2Nhbm5vbi1lcyc7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHNcIjtcblxuY2xhc3MgVGhyZWVKU0NvbnRhaW5lciB7XG4gICAgcHJpdmF0ZSBzY2VuZTogVEhSRUUuU2NlbmU7XG4gICAgcHJpdmF0ZSBsaWdodDogVEhSRUUuTGlnaHQ7XG4gICAgcHJpdmF0ZSB2ZWhpY2xlOiBDQU5OT04uUmlnaWRWZWhpY2xlO1xuICAgIHByaXZhdGUgY2FtZXJhOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYTtcbiAgICBwcml2YXRlIG9yYml0Q29udHJvbHM6IE9yYml0Q29udHJvbHM7XG4gICAgcHJpdmF0ZSB3b3JsZDogQ0FOTk9OLldvcmxkO1xuICAgIHByaXZhdGUgb2JzdGFjbGVzOiB7IG1lc2g6IFRIUkVFLk1lc2gsIGJvZHk6IENBTk5PTi5Cb2R5IH1bXSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IoKSB7fVxuXG4gICAgcHVibGljIGNyZWF0ZVJlbmRlcmVyRE9NID0gKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBjYW1lcmFQb3M6IFRIUkVFLlZlY3RvcjMpID0+IHtcbiAgICAgICAgY29uc3QgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcigpO1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICByZW5kZXJlci5zZXRDbGVhckNvbG9yKG5ldyBUSFJFRS5Db2xvcigweDQ5NWVkKSk7XG4gICAgICAgIHJlbmRlcmVyLnNoYWRvd01hcC5lbmFibGVkID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLmNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgd2lkdGggLyBoZWlnaHQsIDAuMSwgMjAwMCk7XG4gICAgICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLmNvcHkoY2FtZXJhUG9zKTtcblxuICAgICAgICB0aGlzLm9yYml0Q29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyh0aGlzLmNhbWVyYSwgcmVuZGVyZXIuZG9tRWxlbWVudCk7XG4gICAgICAgIHRoaXMub3JiaXRDb250cm9scy5lbmFibGVEYW1waW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5vcmJpdENvbnRyb2xzLmRhbXBpbmdGYWN0b3IgPSAwLjI1O1xuICAgICAgICB0aGlzLm9yYml0Q29udHJvbHMuZW5hYmxlWm9vbSA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5jcmVhdGVTY2VuZSgpO1xuXG4gICAgICAgIGNvbnN0IHJlbmRlcjogRnJhbWVSZXF1ZXN0Q2FsbGJhY2sgPSAodGltZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vcmJpdENvbnRyb2xzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgcmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIHRoaXMuY2FtZXJhKTtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuXG4gICAgICAgIHJlbmRlcmVyLmRvbUVsZW1lbnQuc3R5bGUuY3NzRmxvYXQgPSBcImxlZnRcIjtcbiAgICAgICAgcmVuZGVyZXIuZG9tRWxlbWVudC5zdHlsZS5tYXJnaW4gPSBcIjEwcHhcIjtcbiAgICAgICAgcmV0dXJuIHJlbmRlcmVyLmRvbUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVTY2VuZSA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuXG4gICAgICAgIHRoaXMud29ybGQgPSBuZXcgQ0FOTk9OLldvcmxkKHsgZ3Jhdml0eTogbmV3IENBTk5PTi5WZWMzKDAsIC05LjgyLCAwKX0pO1xuICAgICAgICB0aGlzLndvcmxkLmRlZmF1bHRDb250YWN0TWF0ZXJpYWwucmVzdGl0dXRpb24gPSAwLjg7XG4gICAgICAgIHRoaXMud29ybGQuZGVmYXVsdENvbnRhY3RNYXRlcmlhbC5mcmljdGlvbiA9IDAuMDM7XG5cbiAgICAgICAgLy8g5bqK44Gu55Sf5oiQKFRocmVlLmpzKVxuICAgICAgICBjb25zdCBwaG9uZ01hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKCk7XG4gICAgICAgIGNvbnN0IHBsYW5lR2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSgxMDAsIDEwMCk7XG4gICAgICAgIGNvbnN0IHBsYW5lTWVzaCA9IG5ldyBUSFJFRS5NZXNoKHBsYW5lR2VvbWV0cnksIHBob25nTWF0ZXJpYWwpO1xuICAgICAgICBwbGFuZU1lc2gubWF0ZXJpYWwuc2lkZSA9IFRIUkVFLkRvdWJsZVNpZGU7IC8vIOS4oemdolxuICAgICAgICBwbGFuZU1lc2gucm90YXRlWCgtTWF0aC5QSSAvIDIpO1xuXG4gICAgICAgIC8vIOW6iuOBrueUn+aIkChDYW5ub24uanMpXG4gICAgICAgIGNvbnN0IHBsYW5lU2hhcGUgPSBuZXcgQ0FOTk9OLlBsYW5lKCk7XG4gICAgICAgIGNvbnN0IHBsYW5lQm9keSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDAgfSk7XG4gICAgICAgIHBsYW5lQm9keS5hZGRTaGFwZShwbGFuZVNoYXBlKTtcbiAgICAgICAgcGxhbmVCb2R5LnBvc2l0aW9uLnNldChwbGFuZU1lc2gucG9zaXRpb24ueCwgcGxhbmVNZXNoLnBvc2l0aW9uLnksIHBsYW5lTWVzaC5wb3NpdGlvbi56KTtcbiAgICAgICAgcGxhbmVCb2R5LnF1YXRlcm5pb24uc2V0KHBsYW5lTWVzaC5xdWF0ZXJuaW9uLngsIHBsYW5lTWVzaC5xdWF0ZXJuaW9uLnksIHBsYW5lTWVzaC5xdWF0ZXJuaW9uLnosIHBsYW5lTWVzaC5xdWF0ZXJuaW9uLncpO1xuICAgICAgICB0aGlzLndvcmxkLmFkZEJvZHkocGxhbmVCb2R5KTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQocGxhbmVNZXNoKTtcblxuICAgICAgICAvLyDpmpzlrrPnianjga7ov73liqBcbiAgICAgICAgY29uc3Qgb2JzdGFjbGVTaGFwZXMgPSBbJ2JveCcsICdzcGhlcmUnLCAnY3lsaW5kZXInXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBzaGFwZVR5cGUgPSBvYnN0YWNsZVNoYXBlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBvYnN0YWNsZVNoYXBlcy5sZW5ndGgpXTtcbiAgICAgICAgICAgIGxldCBvYnN0YWNsZU1lc2g6IFRIUkVFLk1lc2g7XG4gICAgICAgICAgICBsZXQgb2JzdGFjbGVCb2R5OiBDQU5OT04uQm9keTtcblxuICAgICAgICAgICAgY29uc3QgeCA9IE1hdGgucmFuZG9tKCkgKiA1MCAtIDI1O1xuICAgICAgICAgICAgY29uc3QgeSA9IDI7XG4gICAgICAgICAgICBjb25zdCB6ID0gTWF0aC5yYW5kb20oKSAqIDUwIC0gMjU7XG5cbiAgICAgICAgICAgIHN3aXRjaCAoc2hhcGVUeXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnYm94JzpcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYm94R2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoNCwgNCwgNCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJveE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hOb3JtYWxNYXRlcmlhbCgpO1xuICAgICAgICAgICAgICAgICAgICBvYnN0YWNsZU1lc2ggPSBuZXcgVEhSRUUuTWVzaChib3hHZW9tZXRyeSwgYm94TWF0ZXJpYWwpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmFkZChvYnN0YWNsZU1lc2gpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJveFNoYXBlID0gbmV3IENBTk5PTi5Cb3gobmV3IENBTk5PTi5WZWMzKDIsIDIsIDIpKTtcbiAgICAgICAgICAgICAgICAgICAgb2JzdGFjbGVCb2R5ID0gbmV3IENBTk5PTi5Cb2R5KHsgbWFzczogMCB9KTtcbiAgICAgICAgICAgICAgICAgICAgb2JzdGFjbGVCb2R5LmFkZFNoYXBlKGJveFNoYXBlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnc3BoZXJlJzpcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3BoZXJlR2VvbWV0cnkgPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoMiwgMzIsIDMyKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3BoZXJlTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaE5vcm1hbE1hdGVyaWFsKCk7XG4gICAgICAgICAgICAgICAgICAgIG9ic3RhY2xlTWVzaCA9IG5ldyBUSFJFRS5NZXNoKHNwaGVyZUdlb21ldHJ5LCBzcGhlcmVNYXRlcmlhbCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkKG9ic3RhY2xlTWVzaCk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3BoZXJlU2hhcGUgPSBuZXcgQ0FOTk9OLlNwaGVyZSgyKTtcbiAgICAgICAgICAgICAgICAgICAgb2JzdGFjbGVCb2R5ID0gbmV3IENBTk5PTi5Cb2R5KHsgbWFzczogMCB9KTtcbiAgICAgICAgICAgICAgICAgICAgb2JzdGFjbGVCb2R5LmFkZFNoYXBlKHNwaGVyZVNoYXBlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnY3lsaW5kZXInOlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjeWxpbmRlckdlb21ldHJ5ID0gbmV3IFRIUkVFLkN5bGluZGVyR2VvbWV0cnkoMiwgMiwgNiwgMzIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjeWxpbmRlck1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hOb3JtYWxNYXRlcmlhbCgpO1xuICAgICAgICAgICAgICAgICAgICBvYnN0YWNsZU1lc2ggPSBuZXcgVEhSRUUuTWVzaChjeWxpbmRlckdlb21ldHJ5LCBjeWxpbmRlck1hdGVyaWFsKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQob2JzdGFjbGVNZXNoKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjeWxpbmRlclNoYXBlID0gbmV3IENBTk5PTi5DeWxpbmRlcigyLCAyLCA2LCAzMik7XG4gICAgICAgICAgICAgICAgICAgIG9ic3RhY2xlQm9keSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDAgfSk7XG4gICAgICAgICAgICAgICAgICAgIG9ic3RhY2xlQm9keS5hZGRTaGFwZShjeWxpbmRlclNoYXBlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG9ic3RhY2xlTWVzaC5wb3NpdGlvbi5zZXQoeCwgeSwgeik7XG4gICAgICAgICAgICBvYnN0YWNsZUJvZHkucG9zaXRpb24uc2V0KHgsIHksIHopO1xuICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRCb2R5KG9ic3RhY2xlQm9keSk7XG5cbiAgICAgICAgICAgIC8vIOmanOWus+eJqeOCkumFjeWIl+OBq+i/veWKoFxuICAgICAgICAgICAgdGhpcy5vYnN0YWNsZXMucHVzaCh7IG1lc2g6IG9ic3RhY2xlTWVzaCwgYm9keTogb2JzdGFjbGVCb2R5IH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g6LuK44Gu5L2c5oiQXG4gICAgICAgIGNvbnN0IGNhckJvZHkgPSBuZXcgQ0FOTk9OLkJvZHkoeyBtYXNzOiA1IH0pO1xuICAgICAgICBjb25zdCBjYXJCb2R5U2hhcGUgPSBuZXcgQ0FOTk9OLkJveChuZXcgQ0FOTk9OLlZlYzMoNCwgMC41LCAyKSk7XG4gICAgICAgIGNhckJvZHkuYWRkU2hhcGUoY2FyQm9keVNoYXBlKTtcbiAgICAgICAgY2FyQm9keS5wb3NpdGlvbi55ID0gMTtcbiAgICAgICAgY29uc3QgdmVoaWNsZSA9IG5ldyBDQU5OT04uUmlnaWRWZWhpY2xlKHsgY2hhc3Npc0JvZHk6IGNhckJvZHkgfSk7XG4gICAgICAgIHRoaXMudmVoaWNsZSA9IHZlaGljbGU7XG5cbiAgICAgICAgLy8g5bem5YmN6Lyq44Gu5L2c5oiQXG4gICAgICAgIGNvbnN0IHdoZWVsU2hhcGUgPSBuZXcgQ0FOTk9OLlNwaGVyZSgxKTtcbiAgICAgICAgY29uc3QgZnJvbnRMZWZ0V2hlZWxCb2R5ID0gbmV3IENBTk5PTi5Cb2R5KHsgbWFzczogMSB9KTtcbiAgICAgICAgZnJvbnRMZWZ0V2hlZWxCb2R5LmFkZFNoYXBlKHdoZWVsU2hhcGUpO1xuICAgICAgICBmcm9udExlZnRXaGVlbEJvZHkuYW5ndWxhckRhbXBpbmcgPSAwLjQ7XG4gICAgICAgIHZlaGljbGUuYWRkV2hlZWwoe1xuICAgICAgICAgICAgYm9keTogZnJvbnRMZWZ0V2hlZWxCb2R5LFxuICAgICAgICAgICAgcG9zaXRpb246IG5ldyBDQU5OT04uVmVjMygtMiwgMCwgMi41KVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyDlj7PliY3ovKpcbiAgICAgICAgY29uc3QgZnJvbnRSaWdodFdoZWVsQm9keSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDEgfSk7XG4gICAgICAgIGZyb250UmlnaHRXaGVlbEJvZHkuYWRkU2hhcGUod2hlZWxTaGFwZSk7XG4gICAgICAgIGZyb250UmlnaHRXaGVlbEJvZHkuYW5ndWxhckRhbXBpbmcgPSAwLjQ7XG4gICAgICAgIHZlaGljbGUuYWRkV2hlZWwoe1xuICAgICAgICAgICAgYm9keTogZnJvbnRSaWdodFdoZWVsQm9keSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBuZXcgQ0FOTk9OLlZlYzMoLTIsIDAsIC0yLjUpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIOW3puW+jOi8qlxuICAgICAgICBjb25zdCByZWFyTGVmdFdoZWVsQm9keSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDEgfSk7XG4gICAgICAgIHJlYXJMZWZ0V2hlZWxCb2R5LmFkZFNoYXBlKHdoZWVsU2hhcGUpO1xuICAgICAgICByZWFyTGVmdFdoZWVsQm9keS5hbmd1bGFyRGFtcGluZyA9IDAuNDtcbiAgICAgICAgdmVoaWNsZS5hZGRXaGVlbCh7XG4gICAgICAgICAgICBib2R5OiByZWFyTGVmdFdoZWVsQm9keSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBuZXcgQ0FOTk9OLlZlYzMoMiwgMCwgMi41KVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyDlj7PlvozovKpcbiAgICAgICAgY29uc3QgcmVhclJpZ2h0V2hlZWxCb2R5ID0gbmV3IENBTk5PTi5Cb2R5KHsgbWFzczogMSB9KTtcbiAgICAgICAgcmVhclJpZ2h0V2hlZWxCb2R5LmFkZFNoYXBlKHdoZWVsU2hhcGUpO1xuICAgICAgICByZWFyUmlnaHRXaGVlbEJvZHkuYW5ndWxhckRhbXBpbmcgPSAwLjQ7XG4gICAgICAgIHZlaGljbGUuYWRkV2hlZWwoe1xuICAgICAgICAgICAgYm9keTogcmVhclJpZ2h0V2hlZWxCb2R5LFxuICAgICAgICAgICAgcG9zaXRpb246IG5ldyBDQU5OT04uVmVjMygyLCAwLCAtMi41KVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUaHJlZS5qc+WBtOOBp+OBrueUn+aIkFxuICAgICAgICAvLyDou4rkvZNcbiAgICAgICAgdmVoaWNsZS5hZGRUb1dvcmxkKHRoaXMud29ybGQpO1xuICAgICAgICBjb25zdCBib3hHZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSg4LCAxLCA0KTtcbiAgICAgICAgY29uc3QgYm94TWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaE5vcm1hbE1hdGVyaWFsKCk7XG4gICAgICAgIGNvbnN0IGJveE1lc2ggPSBuZXcgVEhSRUUuTWVzaChib3hHZW9tZXRyeSwgYm94TWF0ZXJpYWwpO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChib3hNZXNoKTtcblxuICAgICAgICAvLyDlt6bliY3ovKpcbiAgICAgICAgY29uc3Qgd2hlZWxHZW9tZXRyeSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgxKTtcbiAgICAgICAgY29uc3Qgd2hlZWxNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTm9ybWFsTWF0ZXJpYWwoKTtcbiAgICAgICAgY29uc3QgZnJvbnRMZWZ0TWVzaCA9IG5ldyBUSFJFRS5NZXNoKHdoZWVsR2VvbWV0cnksIHdoZWVsTWF0ZXJpYWwpO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChmcm9udExlZnRNZXNoKTtcblxuICAgICAgICAvLyDlj7PliY3ovKpcbiAgICAgICAgY29uc3QgZnJvbnRSaWdodE1lc2ggPSBuZXcgVEhSRUUuTWVzaCh3aGVlbEdlb21ldHJ5LCB3aGVlbE1hdGVyaWFsKTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoZnJvbnRSaWdodE1lc2gpO1xuXG4gICAgICAgIC8vIOW3puW+jOi8qlxuICAgICAgICBjb25zdCByZWFyTGVmdE1lc2ggPSBuZXcgVEhSRUUuTWVzaCh3aGVlbEdlb21ldHJ5LCB3aGVlbE1hdGVyaWFsKTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQocmVhckxlZnRNZXNoKTtcblxuICAgICAgICAvLyDlj7PlvozovKpcbiAgICAgICAgY29uc3QgcmVhclJpZ2h0TWVzaCA9IG5ldyBUSFJFRS5NZXNoKHdoZWVsR2VvbWV0cnksIHdoZWVsTWF0ZXJpYWwpO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChyZWFyUmlnaHRNZXNoKTtcblxuICAgICAgICAvLyDjgrDjg6rjg4Pjg4nooajnpLpcbiAgICAgICAgY29uc3QgZ3JpZEhlbHBlciA9IG5ldyBUSFJFRS5HcmlkSGVscGVyKDEwMCwgMTAwKTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoZ3JpZEhlbHBlcik7XG5cbiAgICAgICAgLy8g6Lu46KGo56S6XG4gICAgICAgIGNvbnN0IGF4ZXNIZWxwZXIgPSBuZXcgVEhSRUUuQXhlc0hlbHBlcig1MCk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGF4ZXNIZWxwZXIpO1xuXG4gICAgICAgIC8vIOODqeOCpOODiOOBruioreWumlxuICAgICAgICB0aGlzLmxpZ2h0ID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYpO1xuICAgICAgICBjb25zdCBsdmVjID0gbmV3IFRIUkVFLlZlY3RvcjMoMSwgMSwgMSkubm9ybWFsaXplKCk7XG4gICAgICAgIHRoaXMubGlnaHQucG9zaXRpb24uc2V0KGx2ZWMueCwgbHZlYy55LCBsdmVjLnopO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLmxpZ2h0KTtcblxuICAgICAgICAvLyDjgq3jg7zjg5zjg7zjg4njgqTjg5njg7Pjg4jjga7oqK3lrppcbiAgICAgICAgY29uc3QgaGFuZGxlS2V5RG93biA9IChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgICAgICAgc3dpdGNoIChldmVudC5rZXkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd1VwJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZWhpY2xlLnNldFdoZWVsRm9yY2UoMTAsIDIpOyAvLyDlvozovKrpp4bli5VcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZWhpY2xlLnNldFdoZWVsRm9yY2UoMTAsIDMpOyAvLyDlvozovKrpp4bli5VcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dEb3duJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZWhpY2xlLnNldFdoZWVsRm9yY2UoLTEwLCAyKTsgLy8g5b6M6Lyq6aeG5YuVXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVoaWNsZS5zZXRXaGVlbEZvcmNlKC0xMCwgMyk7IC8vIOW+jOi8qumnhuWLlVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd0xlZnQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZlaGljbGUuc2V0U3RlZXJpbmdWYWx1ZSgwLjUsIDApOyAvLyDlt6bliY3ovKpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZWhpY2xlLnNldFN0ZWVyaW5nVmFsdWUoMC41LCAxKTsgLy8g5Y+z5YmN6LyqXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93UmlnaHQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZlaGljbGUuc2V0U3RlZXJpbmdWYWx1ZSgtMC41LCAwKTsgLy8g5bem5YmN6LyqXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVoaWNsZS5zZXRTdGVlcmluZ1ZhbHVlKC0wLjUsIDEpOyAvLyDlj7PliY3ovKpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgaGFuZGxlS2V5VXAgPSAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAoZXZlbnQua2V5KSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dVcCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dEb3duJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZWhpY2xlLnNldFdoZWVsRm9yY2UoMCwgMik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVoaWNsZS5zZXRXaGVlbEZvcmNlKDAsIDMpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd0xlZnQnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93UmlnaHQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZlaGljbGUuc2V0U3RlZXJpbmdWYWx1ZSgwLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZWhpY2xlLnNldFN0ZWVyaW5nVmFsdWUoMCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBoYW5kbGVLZXlVcCk7XG5cbiAgICAgICAgbGV0IHVwZGF0ZTogRnJhbWVSZXF1ZXN0Q2FsbGJhY2sgPSAodGltZSkgPT4ge1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XG4gICAgICAgICAgICB0aGlzLndvcmxkLmZpeGVkU3RlcCgxIC8gMzApO1xuXG4gICAgICAgICAgICAvLyDou4rjga7kvY3nva7jgajlm57ou6LjgpLmm7TmlrBcbiAgICAgICAgICAgIGJveE1lc2gucG9zaXRpb24uc2V0KGNhckJvZHkucG9zaXRpb24ueCwgY2FyQm9keS5wb3NpdGlvbi55LCBjYXJCb2R5LnBvc2l0aW9uLnopO1xuICAgICAgICAgICAgYm94TWVzaC5xdWF0ZXJuaW9uLnNldChjYXJCb2R5LnF1YXRlcm5pb24ueCwgY2FyQm9keS5xdWF0ZXJuaW9uLnksIGNhckJvZHkucXVhdGVybmlvbi56LCBjYXJCb2R5LnF1YXRlcm5pb24udyk7XG5cbiAgICAgICAgICAgIGZyb250TGVmdE1lc2gucG9zaXRpb24uc2V0KGZyb250TGVmdFdoZWVsQm9keS5wb3NpdGlvbi54LCBmcm9udExlZnRXaGVlbEJvZHkucG9zaXRpb24ueSwgZnJvbnRMZWZ0V2hlZWxCb2R5LnBvc2l0aW9uLnopO1xuICAgICAgICAgICAgZnJvbnRMZWZ0TWVzaC5xdWF0ZXJuaW9uLnNldChmcm9udExlZnRXaGVlbEJvZHkucXVhdGVybmlvbi54LCBmcm9udExlZnRXaGVlbEJvZHkucXVhdGVybmlvbi55LCBmcm9udExlZnRXaGVlbEJvZHkucXVhdGVybmlvbi56LCBmcm9udExlZnRXaGVlbEJvZHkucXVhdGVybmlvbi53KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZnJvbnRSaWdodE1lc2gucG9zaXRpb24uc2V0KGZyb250UmlnaHRXaGVlbEJvZHkucG9zaXRpb24ueCwgZnJvbnRSaWdodFdoZWVsQm9keS5wb3NpdGlvbi55LCBmcm9udFJpZ2h0V2hlZWxCb2R5LnBvc2l0aW9uLnopO1xuICAgICAgICAgICAgZnJvbnRSaWdodE1lc2gucXVhdGVybmlvbi5zZXQoZnJvbnRSaWdodFdoZWVsQm9keS5xdWF0ZXJuaW9uLngsIGZyb250UmlnaHRXaGVlbEJvZHkucXVhdGVybmlvbi55LCBmcm9udFJpZ2h0V2hlZWxCb2R5LnF1YXRlcm5pb24ueiwgZnJvbnRSaWdodFdoZWVsQm9keS5xdWF0ZXJuaW9uLncpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZWFyTGVmdE1lc2gucG9zaXRpb24uc2V0KHJlYXJMZWZ0V2hlZWxCb2R5LnBvc2l0aW9uLngsIHJlYXJMZWZ0V2hlZWxCb2R5LnBvc2l0aW9uLnksIHJlYXJMZWZ0V2hlZWxCb2R5LnBvc2l0aW9uLnopO1xuICAgICAgICAgICAgcmVhckxlZnRNZXNoLnF1YXRlcm5pb24uc2V0KHJlYXJMZWZ0V2hlZWxCb2R5LnF1YXRlcm5pb24ueCwgcmVhckxlZnRXaGVlbEJvZHkucXVhdGVybmlvbi55LCByZWFyTGVmdFdoZWVsQm9keS5xdWF0ZXJuaW9uLnosIHJlYXJMZWZ0V2hlZWxCb2R5LnF1YXRlcm5pb24udyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJlYXJSaWdodE1lc2gucG9zaXRpb24uc2V0KHJlYXJSaWdodFdoZWVsQm9keS5wb3NpdGlvbi54LCByZWFyUmlnaHRXaGVlbEJvZHkucG9zaXRpb24ueSwgcmVhclJpZ2h0V2hlZWxCb2R5LnBvc2l0aW9uLnopO1xuICAgICAgICAgICAgcmVhclJpZ2h0TWVzaC5xdWF0ZXJuaW9uLnNldChyZWFyUmlnaHRXaGVlbEJvZHkucXVhdGVybmlvbi54LCByZWFyUmlnaHRXaGVlbEJvZHkucXVhdGVybmlvbi55LCByZWFyUmlnaHRXaGVlbEJvZHkucXVhdGVybmlvbi56LCByZWFyUmlnaHRXaGVlbEJvZHkucXVhdGVybmlvbi53KTtcblxuICAgICAgICAgICAgLy8g6Zqc5a6z54mp44Gu5L2N572u44Go5Zue6Lui44KS5pu05pawXG4gICAgICAgICAgICB0aGlzLm9ic3RhY2xlcy5mb3JFYWNoKG9ic3RhY2xlID0+IHtcbiAgICAgICAgICAgICAgICBvYnN0YWNsZS5tZXNoLnBvc2l0aW9uLnNldChvYnN0YWNsZS5ib2R5LnBvc2l0aW9uLngsIG9ic3RhY2xlLmJvZHkucG9zaXRpb24ueSwgb2JzdGFjbGUuYm9keS5wb3NpdGlvbi56KTtcbiAgICAgICAgICAgICAgICBvYnN0YWNsZS5tZXNoLnF1YXRlcm5pb24uc2V0KG9ic3RhY2xlLmJvZHkucXVhdGVybmlvbi54LCBvYnN0YWNsZS5ib2R5LnF1YXRlcm5pb24ueSwgb2JzdGFjbGUuYm9keS5xdWF0ZXJuaW9uLnosIG9ic3RhY2xlLmJvZHkucXVhdGVybmlvbi53KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyDjgqvjg6Hjg6njga7kvY3nva7jgpLou4rjga7lvozjgo3jgavoqK3lrppcbiAgICAgICAgICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLnNldChcbiAgICAgICAgICAgICAgICBjYXJCb2R5LnBvc2l0aW9uLnggLSAxMCAqIE1hdGguc2luKGNhckJvZHkucXVhdGVybmlvbi55KSxcbiAgICAgICAgICAgICAgICBjYXJCb2R5LnBvc2l0aW9uLnkgKyA1LFxuICAgICAgICAgICAgICAgIGNhckJvZHkucG9zaXRpb24ueiAtIDEwICogTWF0aC5jb3MoY2FyQm9keS5xdWF0ZXJuaW9uLnkpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvLyDou4rjga7kvY3nva7jgpLopovjgaTjgoHjgotcbiAgICAgICAgICAgIGNvbnN0IGNhclBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoY2FyQm9keS5wb3NpdGlvbi54LCBjYXJCb2R5LnBvc2l0aW9uLnksIGNhckJvZHkucG9zaXRpb24ueik7XG4gICAgICAgICAgICB0aGlzLmNhbWVyYS5sb29rQXQoY2FyUG9zaXRpb24pO1xuXG4gICAgICAgICAgICAvLyBPcmJpdENvbnRyb2xzIOOBruOCv+ODvOOCsuODg+ODiOOCguabtOaWsFxuICAgICAgICAgICAgdGhpcy5vcmJpdENvbnRyb2xzLnRhcmdldC5jb3B5KGNhclBvc2l0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xuICAgIH1cbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGluaXQpO1xuXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIGxldCBjb250YWluZXIgPSBuZXcgVGhyZWVKU0NvbnRhaW5lcigpO1xuICAgIGxldCB2aWV3cG9ydCA9IGNvbnRhaW5lci5jcmVhdGVSZW5kZXJlckRPTSg4MDAsIDYwMCwgbmV3IFRIUkVFLlZlY3RvcjMoNSwgNSwgNSkpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodmlld3BvcnQpO1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjZ3ByZW5kZXJpbmdcIl0gPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JzLW5vZGVfbW9kdWxlc19jYW5ub24tZXNfZGlzdF9jYW5ub24tZXNfanMtbm9kZV9tb2R1bGVzX3RocmVlX2V4YW1wbGVzX2pzbV9jb250cm9sc19PcmItZTU4YmQyXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2FwcC50c1wiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9