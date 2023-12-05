
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

function placeObjectSafely(createFunc, scene, objectType) {
    let attempts = 0;
    let maxAttempts = 50;
    let success = false;

    while (attempts < maxAttempts && !success) {
        let x = Math.random() * 100 - 50; // Adjust the range based on your scene
        let z = Math.random() * 100 - 50;
        let position = new BABYLON.Vector3(x, 0, z);

        if (!isOverlapping(position, objectPositions, 10)) { // Adjust the size for checking overlap
            createFunc(scene, x, z, objectType);
            success = true;
        }
        attempts++;
    }

    if (!success) {
        // If a non-overlapping position is not found, move the object to a new random location
        console.log(`Could not place ${objectType} without overlap. Moving to a new location.`);
        let newX = Math.random() * 100 - 50;
        let newZ = Math.random() * 100 - 50;
        createFunc(scene, newX, newZ, objectType);
    }
}


function savePositions() {
    localStorage.setItem('objectPositions', JSON.stringify(objectPositions));
}

// Loading positions from local storage
function loadPositions() {
    let savedPositions = JSON.parse(localStorage.getItem('objectPositions'));
    if (savedPositions) {
        objectPositions = savedPositions;
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
        loadPositions();
        // Light
        var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(1, 1, 0), scene);

        // Ground
        var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 400, height: 400}, scene);
        var groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.1);
        ground.material = groundMaterial;

        // Mountain Creation Function
        var createMountain = function (scene, x, z) {
            let position = new BABYLON.Vector3(x, 0, z);
            if (!isOverlapping(position, objectPositions, 20)) { // Adjust size for checking mountain overlap
                // URL to a height map image
                var heightMapURL = 'https://europe1.discourse-cdn.com/unity/original/3X/9/2/923865a1dc2e6807b8ea7a21d6ff07442b64e61d.png'; // Replace with your height map URL
        
                var mountain = BABYLON.MeshBuilder.CreateGroundFromHeightMap("mountain", heightMapURL, {
                    width: 50,
                    height: 50,
                    subdivisions: 100,
                    minHeight: 0,
                    maxHeight: 20
                }, scene);
        
                mountain.position = position;
                
                var mountainMaterial = new BABYLON.StandardMaterial("mountainMat", scene);
                mountainMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.3);
                mountain.material = mountainMaterial;
                
                objectPositions.push({position: position, type: 'mountain'});
                return mountain;
            } else {
                console.log('Overlap detected. Mountain not created.');
            }
        };
        
        
        

        // Lake Creation Function
        var createLake = function (scene, x, z) {
            let position = new BABYLON.Vector3(x, 0, z);
            if (!isOverlapping(position, objectPositions, 20)) { // Adjust size for checking lake overlap
                var lake = BABYLON.MeshBuilder.CreateGround("lake", {width: 20, height: 20}, scene);
                lake.position = position;
                
                var lakeMaterial = new BABYLON.StandardMaterial("waterMat", scene);
                lakeMaterial.diffuseColor = new BABYLON.Color3(0, 0.8, 0.5);
                lake.material = lakeMaterial;
        
                objectPositions.push({position: position, type: 'lake'});
                return lake;
            } else {
                console.log('Overlap detected. Lake not created.');
            }
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
                placeObjectSafely(createMountain, scene);
            }
        
            if (correctAnswers >= 10) {
                placeObjectSafely(createLake, scene);
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



