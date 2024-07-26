import * as CANNON from 'cannon-es';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreeJSContainer {
    private scene: THREE.Scene;
    private light: THREE.Light;
    private vehicle: CANNON.RigidVehicle;
    private camera: THREE.PerspectiveCamera;
    private orbitControls: OrbitControls;
    private world: CANNON.World;
    private obstacles: { mesh: THREE.Mesh, body: CANNON.Body }[] = [];

    constructor() {}

    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x495ed));
        renderer.shadowMap.enabled = true;

        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
        this.camera.position.copy(cameraPos);

        this.orbitControls = new OrbitControls(this.camera, renderer.domElement);
        this.orbitControls.enableDamping = true;
        this.orbitControls.dampingFactor = 0.25;
        this.orbitControls.enableZoom = true;

        this.createScene();

        const render: FrameRequestCallback = (time) => {
            this.orbitControls.update();
            renderer.render(this.scene, this.camera);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);

        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    }

    private createScene = () => {
        this.scene = new THREE.Scene();

        this.world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0)});
        this.world.defaultContactMaterial.restitution = 0.8;
        this.world.defaultContactMaterial.friction = 0.03;

        // 床の生成(Three.js)
        const phongMaterial = new THREE.MeshPhongMaterial();
        const planeGeometry = new THREE.PlaneGeometry(100, 100);
        const planeMesh = new THREE.Mesh(planeGeometry, phongMaterial);
        planeMesh.material.side = THREE.DoubleSide; // 両面
        planeMesh.rotateX(-Math.PI / 2);

        // 床の生成(Cannon.js)
        const planeShape = new CANNON.Plane();
        const planeBody = new CANNON.Body({ mass: 0 });
        planeBody.addShape(planeShape);
        planeBody.position.set(planeMesh.position.x, planeMesh.position.y, planeMesh.position.z);
        planeBody.quaternion.set(planeMesh.quaternion.x, planeMesh.quaternion.y, planeMesh.quaternion.z, planeMesh.quaternion.w);
        this.world.addBody(planeBody);
        this.scene.add(planeMesh);

        // 障害物の追加
        const obstacleShapes = ['box', 'sphere', 'cylinder'];
        for (let i = 0; i < 10; i++) {
            const shapeType = obstacleShapes[Math.floor(Math.random() * obstacleShapes.length)];
            let obstacleMesh: THREE.Mesh;
            let obstacleBody: CANNON.Body;

            const x = Math.random() * 50 - 25;
            const y = 2;
            const z = Math.random() * 50 - 25;

            switch (shapeType) {
                case 'box':
                    const boxGeometry = new THREE.BoxGeometry(4, 4, 4);
                    const boxMaterial = new THREE.MeshNormalMaterial();
                    obstacleMesh = new THREE.Mesh(boxGeometry, boxMaterial);
                    this.scene.add(obstacleMesh);

                    const boxShape = new CANNON.Box(new CANNON.Vec3(2, 2, 2));
                    obstacleBody = new CANNON.Body({ mass: 0 });
                    obstacleBody.addShape(boxShape);
                    break;
                case 'sphere':
                    const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
                    const sphereMaterial = new THREE.MeshNormalMaterial();
                    obstacleMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
                    this.scene.add(obstacleMesh);

                    const sphereShape = new CANNON.Sphere(2);
                    obstacleBody = new CANNON.Body({ mass: 0 });
                    obstacleBody.addShape(sphereShape);
                    break;
                case 'cylinder':
                    const cylinderGeometry = new THREE.CylinderGeometry(2, 2, 6, 32);
                    const cylinderMaterial = new THREE.MeshNormalMaterial();
                    obstacleMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
                    this.scene.add(obstacleMesh);

                    const cylinderShape = new CANNON.Cylinder(2, 2, 6, 32);
                    obstacleBody = new CANNON.Body({ mass: 0 });
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
        const carBody = new CANNON.Body({ mass: 5 });
        const carBodyShape = new CANNON.Box(new CANNON.Vec3(4, 0.5, 2));
        carBody.addShape(carBodyShape);
        carBody.position.y = 1;
        const vehicle = new CANNON.RigidVehicle({ chassisBody: carBody });
        this.vehicle = vehicle;

        // 左前輪の作成
        const wheelShape = new CANNON.Sphere(1);
        const frontLeftWheelBody = new CANNON.Body({ mass: 1 });
        frontLeftWheelBody.addShape(wheelShape);
        frontLeftWheelBody.angularDamping = 0.4;
        vehicle.addWheel({
            body: frontLeftWheelBody,
            position: new CANNON.Vec3(-2, 0, 2.5)
        });

        // 右前輪
        const frontRightWheelBody = new CANNON.Body({ mass: 1 });
        frontRightWheelBody.addShape(wheelShape);
        frontRightWheelBody.angularDamping = 0.4;
        vehicle.addWheel({
            body: frontRightWheelBody,
            position: new CANNON.Vec3(-2, 0, -2.5)
        });

        // 左後輪
        const rearLeftWheelBody = new CANNON.Body({ mass: 1 });
        rearLeftWheelBody.addShape(wheelShape);
        rearLeftWheelBody.angularDamping = 0.4;
        vehicle.addWheel({
            body: rearLeftWheelBody,
            position: new CANNON.Vec3(2, 0, 2.5)
        });

        // 右後輪
        const rearRightWheelBody = new CANNON.Body({ mass: 1 });
        rearRightWheelBody.addShape(wheelShape);
        rearRightWheelBody.angularDamping = 0.4;
        vehicle.addWheel({
            body: rearRightWheelBody,
            position: new CANNON.Vec3(2, 0, -2.5)
        });

        // Three.js側での生成
        // 車体
        vehicle.addToWorld(this.world);
        const boxGeometry = new THREE.BoxGeometry(8, 1, 4);
        const boxMaterial = new THREE.MeshNormalMaterial();
        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        this.scene.add(boxMesh);

        // 左前輪
        const wheelGeometry = new THREE.SphereGeometry(1);
        const wheelMaterial = new THREE.MeshNormalMaterial();
        const frontLeftMesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
        this.scene.add(frontLeftMesh);

        // 右前輪
        const frontRightMesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
        this.scene.add(frontRightMesh);

        // 左後輪
        const rearLeftMesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
        this.scene.add(rearLeftMesh);

        // 右後輪
        const rearRightMesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
        this.scene.add(rearRightMesh);

        // グリッド表示
        const gridHelper = new THREE.GridHelper(100, 100);
        this.scene.add(gridHelper);

        // 軸表示
        const axesHelper = new THREE.AxesHelper(50);
        this.scene.add(axesHelper);

        // ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        const lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);

        // キーボードイベントの設定
        const handleKeyDown = (event: KeyboardEvent) => {
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

        const handleKeyUp = (event: KeyboardEvent) => {
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

        let update: FrameRequestCallback = (time) => {
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
            this.camera.position.set(
                carBody.position.x - 10 * Math.sin(carBody.quaternion.y),
                carBody.position.y + 5,
                carBody.position.z - 10 * Math.cos(carBody.quaternion.y)
            );

            // 車の位置を見つめる
            const carPosition = new THREE.Vector3(carBody.position.x, carBody.position.y, carBody.position.z);
            this.camera.lookAt(carPosition);

            // OrbitControls のターゲットも更新
            this.orbitControls.target.copy(carPosition);
        }

        requestAnimationFrame(update);
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(800, 600, new THREE.Vector3(5, 5, 5));
    document.body.appendChild(viewport);
}
