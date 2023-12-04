window.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('renderCanvas');
    var engine = new BABYLON.Engine(canvas, true);

    var createScene = function () {
        var scene = new BABYLON.Scene(engine);

        // Camera
        var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2.5, 50, new BABYLON.Vector3(0, 15, -30), scene);
        camera.attachControl(canvas, true);

        // Light
        var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(1, 1, 0), scene);

        // Ground
        var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 300, height: 300}, scene);
        var groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.1); // Earthy brown color
        ground.material = groundMaterial;

        // Mountains
        var createMountain = function(scene, x, z, height) {
            var mountain = BABYLON.MeshBuilder.CreateCylinder("mountain", {diameterTop: 0, diameterBottom: 20, tessellation: 6, height: height}, scene);
            mountain.position.x = x;
            mountain.position.z = z;
            mountain.material = new BABYLON.StandardMaterial("mountainMat", scene);
            mountain.material.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.3); // Mountain color
        };

        // Create some mountains
        createMountain(scene, 30, -30, 20);
        createMountain(scene, -30, 30, 15);

        // Lake
        var createLake = function(scene, x, z) {
            var lake = BABYLON.MeshBuilder.CreateGround("lake", {width: 30, height: 30}, scene);
            lake.position.x = x;
            lake.position.z = z;
            lake.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
            lake.material = new BABYLON.StandardMaterial("waterMat", scene);
            lake.material.diffuseColor = new BABYLON.Color3(0, 0.8, 0.5); // Clean water color
        };

        // Create some lakes
        createLake(scene, -40, -40);
        createLake(scene, 40, 40);

        // Trees
        var createTree = function(scene, x, z) {
            var trunk = BABYLON.MeshBuilder.CreateCylinder("trunk", {height: 4, diameter: 1}, scene);
            trunk.position.x = x;
            trunk.position.y = 2; // Half of the trunk's height
            trunk.position.z = z;
            trunk.material = new BABYLON.StandardMaterial("trunkMat", scene);
            trunk.material.diffuseColor = new BABYLON.Color3(0.4, 0.3, 0.3); // Trunk color

            var leaves = BABYLON.MeshBuilder.CreateSphere("leaves", {diameter: 6, segments: 8}, scene);
            leaves.position = new BABYLON.Vector3(x, 7, z);
            leaves.material = new BABYLON.StandardMaterial("leavesMat", scene);
            leaves.material.diffuseColor = new BABYLON.Color3(0.1, 0.8, 0.1); // Bright green for healthy leaves
        };

        // Create some trees
        for (let i = 0; i < 20; i++) {
            createTree(scene, Math.random() * 100 - 50, Math.random() * 100 - 50);
        }

        // Function to plant a new tree (additional implementation needed)
        var plantTree = function(x, z) {
            createTree(scene, x, z);
        };

        // Function to clean a lake (additional implementation needed)
        var cleanLake = function(lake) {
            lake.material.diffuseColor = new BABYLON.Color3(0, 0.5, 1);
        };

        // Adding clickable behavior (additional implementation needed)
        var addClickBehavior = function(mesh) {
            mesh.actionManager = new BABYLON.ActionManager(scene);
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function () {
                // Interaction logic
            }));
        };

        // Make the elements clickable
        scene.meshes.forEach(mesh => {
            if (mesh.name === "trunk" || mesh.name === "leaves" || mesh.name === "mountain" || mesh.name === "lake") {
                addClickBehavior(mesh);
            }
        });

        return scene;
    };

    var scene = createScene();

    engine.runRenderLoop(function () {
        scene.render();
    });

    window.addEventListener('resize', function () {
        engine.resize();
    });
});
