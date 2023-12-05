
var objectPositions = [];


function getPlantFact(plantName) {
    var facts = {
        "Protea": "The Protea, also known as the 'Sugarbush', is native to South Africa and symbolizes change and hope. It's a unique flower with a striking appearance, often found in the fynbos region.",
        "Silver Tree": "The Silver Tree is a rare plant native to the Table Mountain area of Cape Town. Known for its distinctive silver-gray leaves, it's a member of the Protea family and thrives in a Mediterranean climate.",
        "Cape Daisy": "Cape Daisy, or Osteospermum, is a popular garden plant in South Africa. It's known for its bright, daisy-like flowers and is commonly used in borders and containers."
    };
    return facts[plantName] || "No fact available for this plant.";
}

function isOverlapping(newPosition, existingObjects, size) {
    for (let obj of existingObjects) {
        if (Math.abs(newPosition.x - obj.position.x) < size && Math.abs(newPosition.z - obj.position.z) < size) {
            return true; // There is an overlap
        }
    }
    return false; // No overlap
}

function placeObjectSafely(createFunc, scene, treeName) {
    let attempts = 0;
    let maxAttempts = 50;
    while (attempts < maxAttempts) {
        let x = Math.random() * 100 - 50; // Adjust the range based on your scene
        let z = Math.random() * 100 - 50;
        if (!isOverlapping(new BABYLON.Vector3(x, 0, z), objectPositions, 10)) { // Adjust the size
            createFunc(scene, x, z, treeName);
            break;
        }
        attempts++;
    }
}




window.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('renderCanvas');
    var engine = new BABYLON.Engine(canvas, true);
 
    var createScene = function () {
        var scene = new BABYLON.Scene(engine);

        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
        var objectPositions = [];

        // Camera
        var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2.5, 50, new BABYLON.Vector3(0, 15, -30), scene);
        camera.attachControl(canvas, true);

        // Light
        var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(1, 1, 0), scene);

        // Ground
        var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 400, height: 400}, scene);
        var groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.1);
        ground.material = groundMaterial;

        // Mountain Creation Function
        var createMountain = function (scene, x, z) {
            // Parameters for the mountain
            var width = 50; // Width of the mountain
            var depth = 50; // Depth of the mountain
            var subdivisions = 100; // Number of subdivisions
            var minHeight = 0; // Minimum height
            var maxHeight = 20; // Maximum height of the mountain
        
            // URL to a height map image (You need to replace this with your height map URL)
            var heightMapURL = 'https://img2.cgtrader.com/items/3224810/e3fbec995c/large/belarus-high-resolution-10k-displacement-and-geometry-3d-model-obj.jpg';
        
            // Create a mountain using a height map
            var mountain = BABYLON.MeshBuilder.CreateGroundFromHeightMap("mountain", heightMapURL, {
                width: width,
                height: depth,
                subdivisions: subdivisions,
                minHeight: minHeight,
                maxHeight: maxHeight
            }, scene);
        
            // Position the mountain
            mountain.position.x = x;
            mountain.position.z = z;
        
            // Optional: Add material to the mountain for better appearance
            var mountainMaterial = new BABYLON.StandardMaterial("mountainMat", scene);
            mountainMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.3); // Mountain color
            mountain.material = mountainMaterial;
        
            return mountain;
        };
        

        // Lake Creation Function
        var createLake = function (scene, x, z) {
            var lake = BABYLON.MeshBuilder.CreateGround("lake", {width: 20, height: 20}, scene);
            lake.position.x = x;
            lake.position.z = z;
            // lake.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
            lake.material = new BABYLON.StandardMaterial("waterMat", scene);
            lake.material.diffuseColor = new BABYLON.Color3(0, 0.8, 0.5);
        };

        // Tree Creation Function with Labels and Click Events
        var createTree = function (scene, x, z, treeName) {
            let position = new BABYLON.Vector3(x, 0, z);
            if (!isOverlapping(position, objectPositions, 10)) {
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
        
                var label = new BABYLON.GUI.Rectangle("label for " + treeName);
                label.background = "black";
                label.height = "30px";
                label.alpha = 1;
                label.width = "100px";
                label.cornerRadius = 20;
                label.thickness = 1;
                label.linkOffsetY = 30;
                advancedTexture.addControl(label);
                label.linkWithMesh(trunk);
        
                var text1 = new BABYLON.GUI.TextBlock();
                text1.text = treeName;
                text1.color = "white";
                text1.fontSize = 14;
                label.addControl(text1);
        
                var onTreeClicked = function () {
                    var fact = getPlantFact(treeName);
                    document.getElementById('plantTitle').innerText = "Tree: " + treeName;
                    document.getElementById('plantInfo').innerText = fact;
                    document.getElementById('plantModal').style.display = 'block';
                };
        
                trunk.actionManager = new BABYLON.ActionManager(scene);
                trunk.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, onTreeClicked));
        
                leaves.actionManager = new BABYLON.ActionManager(scene);
                leaves.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, onTreeClicked));
        
                // Record position of the new tree
                objectPositions.push({position: position, type: 'tree'});
            } else {
                console.log('Overlap detected. Tree not created.');
            }
        };
        
     

        var correctAnswers = 10; // Set to the number of correct answers

        var plantNames = ["Protea", "Silver Tree", "Cape Daisy"];

        // Function to update environment based on correct answers
        function updateEnvironment() {
            for (let i = 0; i < correctAnswers; i++) {
                var treeName = plantNames[i % plantNames.length];
                placeObjectSafely(createTree, scene, treeName);
            }
        
            if (correctAnswers >= 5) {
                placeObjectSafely(createMountain, scene); // No treeName needed for mountains
            }
        
            if (correctAnswers >= 10) {
                placeObjectSafely(createLake, scene); // No treeName needed for lakes
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

        scene.meshes.forEach(mesh => {
            if (!mesh.name.startsWith("trunk") && !mesh.name.startsWith("leaves")) {
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



        window.addEventListener('click', function(event) {
            var modal = document.getElementById('plantModal');
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });
        
   
});



