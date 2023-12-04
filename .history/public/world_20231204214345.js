
function getPlantFact(plantName) {
    var facts = {
        "Protea": "Fact about Protea...",
        "Silver Tree": "Fact about Silver Tree...",
        "Cape Daisy": "Fact about Cape Daisy..."
    };
    return facts[plantName] || "No fact available for this plant.";
}


window.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('renderCanvas');
    var engine = new BABYLON.Engine(canvas, true);
 
    var createScene = function () {
        var scene = new BABYLON.Scene(engine);

        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
        // Camera
        var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2.5, 50, new BABYLON.Vector3(0, 15, -30), scene);
        camera.attachControl(canvas, true);

        // Light
        var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(1, 1, 0), scene);

        // Ground
        var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 200, height: 200}, scene);
        var groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.1);
        ground.material = groundMaterial;

        // Mountain Creation Function
        var createMountain = function (scene, x, z, height) {
            var mountain = BABYLON.MeshBuilder.CreateCylinder("mountain", {diameterTop: 0, diameterBottom: 20, tessellation: 6, height: height}, scene);
            mountain.position.x = x;
            mountain.position.z = z;
            mountain.material = new BABYLON.StandardMaterial("mountainMat", scene);
            mountain.material.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.3);
        };

        // Lake Creation Function
        var createLake = function (scene, x, z) {
            var lake = BABYLON.MeshBuilder.CreateGround("lake", {width: 30, height: 30}, scene);
            lake.position.x = x;
            lake.position.z = z;
            lake.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
            lake.material = new BABYLON.StandardMaterial("waterMat", scene);
            lake.material.diffuseColor = new BABYLON.Color3(0, 0.8, 0.5);
        };

        // Tree Creation Function with Labels and Click Events
        var createTree = function (scene, x, z, treeName) {
            var trunk = BABYLON.MeshBuilder.CreateCylinder("trunk", {height: 4, diameter: 1}, scene);
            trunk.position.x = x;
            trunk.position.y = 2;
            trunk.position.z = z;
            trunk.material = new BABYLON.StandardMaterial("trunkMat", scene);
            trunk.material.diffuseColor = new BABYLON.Color3(0.4, 0.3, 0.3);

            var leaves = BABYLON.MeshBuilder.CreateSphere("leaves", {diameter: 6, segments: 8}, scene);
            leaves.position = new BABYLON.Vector3(x, 7, z);
            leaves.material = new BABYLON.StandardMaterial("leavesMat", scene);
            leaves.material.diffuseColor = new BABYLON.Color3(0.1, 0.8, 0.1);

            // Tree Label
            var label = new BABYLON.GUI.Rectangle("label for " + treeName);
            label.background = "black";
            label.height = "30px";
            label.alpha = 1;
            label.width = "100px";
            label.cornerRadius = 20;
            label.thickness = 1;
            label.linkOffsetY = 30;
            advancedTexture.addControl(label);
            label.linkWithMesh(trunk); // Link label with the trunk
            
            var text1 = new BABYLON.GUI.TextBlock();
            text1.text = treeName;
            text1.color = "white";
            text1.fontSize = 14;
            label.addControl(text1);
            

            // Click Event for Trees
            trunk.actionManager = new BABYLON.ActionManager(scene);
            trunk.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function () {
                // Set the content for the modal with dummy data
                var fact = getPlantFact(treeName);
                document.getElementById('plantTitle').innerText = "Tree: " + treeName;
                document.getElementById('plantInfo').innerText = fact; // Replace with actual facts from API

                // Show the modal
                document.getElementById('plantModal').style.display = 'block';
            }));
        };

     

        var correctAnswers = 3; // Set to the number of correct answers

        var plantNames = ["Protea", "Silver Tree", "Cape Daisy"];

        // Function to update environment based on correct answers
        function updateEnvironment() {
            // Add a tree for each correct answer
            for (let i = 0; i < correctAnswers; i++) {
                var treeName = plantNames[i % plantNames.length];
                createTree(scene, Math.random() * 100 - 50, Math.random() * 100 - 50, treeName);
            }

            // Add a mountain after 5 correct answers
            if (correctAnswers >= 5) {
                createMountain(scene, Math.random() * 100 - 50, Math.random() * 100 - 50, 20);
            }

            // Add a lake after 10 correct answers
            if (correctAnswers >= 10) {
                createLake(scene, Math.random() * 100 - 50, Math.random() * 100 - 50);
            }
        }

        updateEnvironment(); // Set up the environment based on correct answers

        // Add clickable behavior to the meshes (if needed)
        var addClickBehavior = function (mesh) {
            mesh.actionManager = new BABYLON.ActionManager(scene);
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function () {
                console.log('Clicked on:', mesh.name);
                // Interaction logic here (if necessary)
            }));
        };

        // Apply clickable behavior (if needed)
        scene.meshes.forEach(addClickBehavior);

        return scene;
    };
    var scene = createScene();

    engine.runRenderLoop(function () {
        scene.render();
    });

    window.addEventListener('resize', function () {
        engine.resize();
    });


    document.getElementById('closeModal').onclick = function() {
        document.getElementById('plantModal').style.display = 'none';
    };
});
