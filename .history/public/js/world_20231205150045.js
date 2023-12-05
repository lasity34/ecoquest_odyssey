var objectPositions = [];

function getPlantFact(plantName) {
  var facts = {
    Protea:
      "The Protea, also known as the 'Sugarbush', is native to South Africa and symbolizes change and hope. It's a unique flower with a striking appearance, often found in the fynbos region.",
    "Silver Tree":
      "The Silver Tree is a rare plant native to the Table Mountain area of Cape Town. Known for its distinctive silver-gray leaves, it's a member of the Protea family and thrives in a Mediterranean climate.",
    "Cape Daisy":
      "Cape Daisy, or Osteospermum, is a popular garden plant in South Africa. It's known for its bright, daisy-like flowers and is commonly used in borders and containers.",
  };
  return facts[plantName] || "No fact available for this plant.";
}

function isOverlapping(newPosition, existingObjects, size) {
  for (let obj of existingObjects) {
    let distanceX = Math.abs(newPosition.x - obj.position.x);
    let distanceZ = Math.abs(newPosition.z - obj.position.z);
    if (distanceX < size && distanceZ < size) {
      console.log(`Overlap detected: New Position ${newPosition.x}, ${newPosition.z} with Existing Position ${obj.position.x}, ${obj.position.z} - Size: ${size}`);
      return true; // There is an overlap
    }
  }
  return false; // No overlap
}


function placeObjectSafely(createFunc, scene, objectType, objectName, maxAttempts = 200) {
  // Load existing positions from local storage
 

  // Check if the specific object already exists
  let existingObject = objectPositions.find(p => p.type === objectType && p.name === objectName);
  if (existingObject) {
    // Object already exists, use the existing position
    createFunc(scene, existingObject.position.x, existingObject.position.z, objectName);
    console.log(`Using existing position for ${objectType}: ${objectName}`);
    return;
  }

  // Find a new position for new objects
  let success = false;
  let position;
  for (let attempts = 0; attempts < maxAttempts; attempts++) {
    let x = (Math.random() - 0.5) * 200;
    let z = (Math.random() - 0.5) * 200;
    let overlapSize = objectType === "tree" ? 5 : 15;

    position = new BABYLON.Vector3(x, 0, z);
    if (!isOverlapping(position, objectPositions, overlapSize)) {
      createFunc(scene, x, z, objectName);
      objectPositions.push({ position: position, type: objectType, name: objectName });
      savePositions();
      success = true;
      console.log(`Placed new ${objectType}: ${objectName}`);
      break;
    }
  }

  if (!success) {
    console.log(`Unable to place ${objectType} after ${objectName} attempts.`);
  }
}



function adjustPositionForCreation(
  scene,
  objectType,
  searchRadius = 100,
  step = 5
) {
  let position;
  let found = false;

  for (let radius = 1; radius <= searchRadius; radius += step) {
    for (let angle = 0; angle < 360; angle += 10) {
      // Adjust the angle step for finer search
      let x = radius * Math.cos((angle * Math.PI) / 180);
      let z = radius * Math.sin((angle * Math.PI) / 180);
      position = new BABYLON.Vector3(x, 0, z);

      if (
        !isOverlapping(
          position,
          objectPositions,
          objectType === "tree" ? 10 : 20
        )
      ) {
        found = true;
        break;
      }
    }

    if (found) break;
  }

  if (!found) {
    console.error(`Failed to find non-overlapping position for ${objectType}.`);
    return new BABYLON.Vector3(0, 0, 0); // Fallback to a default position
  }

  return position;
}

function adjustPosition(scene, objectType) {
  let x, z;
  do {
    x = Math.random() * 100 - 50;
    z = Math.random() * 100 - 50;
  } while (
    isOverlapping(
      new BABYLON.Vector3(x, 0, z),
      objectPositions,
      objectType === "tree" ? 10 : 20
    )
  );
  return new BABYLON.Vector3(x, 0, z);
}

function savePositions() {
  console.log("Saving positions to local storage:", objectPositions);
  localStorage.setItem("objectPositions", JSON.stringify(objectPositions));
}

function loadPositions() {
  let savedPositions = JSON.parse(localStorage.getItem("objectPositions"));
  if (savedPositions) {
    console.log("Loaded positions from local storage:", savedPositions);
    objectPositions = savedPositions;
  }
}


window.addEventListener("DOMContentLoaded", function () {
  var canvas = document.getElementById("renderCanvas");
  var engine = new BABYLON.Engine(canvas, true);

  var createScene = function () {
    var scene = new BABYLON.Scene(engine);
  
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
      "UI",
      true,
      scene
    );
    var objectPositions = [];
    loadPositions()
    // Camera
    var camera = new BABYLON.ArcRotateCamera(
      "Camera",
      -Math.PI / 2,
      Math.PI / 2.5,
      50,
      new BABYLON.Vector3(0, 15, -30),
      scene
    );
    camera.attachControl(canvas, true);
   
    // Light
    var light = new BABYLON.HemisphericLight(
      "hemiLight",
      new BABYLON.Vector3(1, 1, 0),
      scene
    );

    // Ground
    var ground = BABYLON.MeshBuilder.CreateGround(
      "ground",
      { width: 400, height: 400 },
      scene
    );
    var groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.1);
    ground.material = groundMaterial;

    // Mountain Creation Function
    var createMountain = function (scene, x, z) {
      let position = new BABYLON.Vector3(x, 0, z);
      if (!isOverlapping(position, objectPositions, 20)) {
        // Adjust size for checking mountain overlap
        // URL to a height map image
        var heightMapURL =
          "https://europe1.discourse-cdn.com/unity/original/3X/9/2/923865a1dc2e6807b8ea7a21d6ff07442b64e61d.png"; // Replace with your height map URL

        var mountain = BABYLON.MeshBuilder.CreateGroundFromHeightMap(
          "mountain",
          heightMapURL,
          {
            width: 20,
            height: 20,
            subdivisions: 100,
            minHeight: 0,
            maxHeight: 20,
          },
          scene
        );

        mountain.position = position;

        var mountainMaterial = new BABYLON.StandardMaterial(
          "mountainMat",
          scene
        );
        mountainMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.3);
        mountain.material = mountainMaterial;

        objectPositions.push({ position: position, type: "mountain" });
        return mountain;
      } else {
        console.log("Overlap detected. Mountain not created.");
      }
    };

    // Lake Creation Function
    var createLake = function (scene, x, z) {
        var position = new BABYLON.Vector3(x, 0, z);
        if (!isOverlapping(position, objectPositions, 20)) {
            var lake = BABYLON.MeshBuilder.CreateGround("lake", { width: 20, height: 20 }, scene);
            lake.position = position;
    
            // Creating water material
            var waterMaterial = new BABYLON.WaterMaterial("waterMat", scene, new BABYLON.Vector2(512, 512));
            waterMaterial.bumpTexture = new BABYLON.Texture("path_to_water_bump_texture.png", scene); // Replace with your water bump texture path
            waterMaterial.windForce = -10;
            waterMaterial.waveHeight = 0.5;
            waterMaterial.bumpHeight = 0.1;
            waterMaterial.waveLength = 0.1;
            waterMaterial.colorBlendFactor = 0;
    
            // Adjust water color and properties
            waterMaterial.waterColor = new BABYLON.Color3(0, 0.3, 0.5);
            waterMaterial.colorBlendFactor = 0.3;
            waterMaterial.waterColorLevel = 0.2;
    
            // Adding skybox and other elements to the water reflection list
            var skybox = scene.getMeshByName("skyBox"); // Assuming you have a skybox
            if (skybox) {
                waterMaterial.reflectionTexture.renderList.push(skybox);
            }
    
            // Add other meshes that should be reflected in the water
            scene.meshes.forEach(mesh => {
                if (mesh !== lake && mesh !== skybox) {
                    waterMaterial.reflectionTexture.renderList.push(mesh);
                    waterMaterial.refractionTexture.renderList.push(mesh);
                }
            });
    
            lake.material = waterMaterial;
            objectPositions.push({ position: position, type: "lake" });
            savePositions();
            return lake;
        } else {
            console.log("Overlap detected. Lake not created.");
        }
    };
    
    

    // Tree Creation Function with Labels and Click Events
    var createTree = function (scene, x, z, treeName) {
        // Find a saved position or generate a new one
        let savedPosition = objectPositions.find(p => p.type === "tree" && p.name === treeName);
        let position;
    
        if (savedPosition) {
            // Use the saved position
            position = new BABYLON.Vector3(savedPosition.position.x, 0, savedPosition.position.z);
        } else {
            // Generate a new position
            position = new BABYLON.Vector3(x, 0, z);
            if (isOverlapping(position, objectPositions, 10)) {
                console.log("Overlap detected. Tree not created.");
                return; // Skip tree creation due to overlap
            }
            // Record position of the new tree if it's not overlapping
            objectPositions.push({ position: position, type: "tree", name: treeName });
            savePositions(); // Save the updated positions
        }
    
        // Create the trunk
        var trunk = BABYLON.MeshBuilder.CreateCylinder(
            "trunk",
            { height: 4, diameter: 1 },
            scene
        );
        trunk.position = position;
        trunk.position.y = 2; // Set trunk height
        trunk.material = new BABYLON.StandardMaterial("trunkMat", scene);
        trunk.material.diffuseColor = new BABYLON.Color3(0.4, 0.3, 0.3);
    
        // Create the leaves
        var leaves = BABYLON.MeshBuilder.CreateSphere(
            "leaves",
            { diameter: 6, segments: 8 },
            scene
        );
        leaves.position = new BABYLON.Vector3(position.x, 7, position.z); // Place leaves above the trunk
        leaves.material = new BABYLON.StandardMaterial("leavesMat", scene);
        leaves.material.diffuseColor = new BABYLON.Color3(0.1, 0.8, 0.1);
    
        // Create label for the tree
        var label = new BABYLON.GUI.Rectangle("label for " + treeName);
        label.background = "black";
        label.height = "30px";
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
    
        // Click event for the tree
        var onTreeClicked = function () {
            var fact = getPlantFact(treeName);
            document.getElementById("plantTitle").innerText = "Tree: " + treeName;
            document.getElementById("plantInfo").innerText = fact;
            document.getElementById("plantModal").style.display = "block";
        };
    
        // Add action manager for interactivity
        trunk.actionManager = new BABYLON.ActionManager(scene);
        trunk.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                onTreeClicked
            )
        );
    
        leaves.actionManager = new BABYLON.ActionManager(scene);
        leaves.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                onTreeClicked
            )
        );
    };
    

    var correctAnswers = 10; // Set to the number of correct answers

    var plantNames = ["Protea", "Silver Tree", "Cape Daisy"];

    // Function to update environment based on correct answers
    function updateEnvironment() {
      // Load existing positions from local storage
      loadPositions();
    
      // Create trees for each correct answer if they don't already exist
      for (let i = 0; i < correctAnswers; i++) {
        var treeName = plantNames[i % plantNames.length];
    
        // Check if the tree for this answer already exists
        let existingTree = objectPositions.find(p => p.type === "tree" && p.name === treeName);
        if (!existingTree) {
          // Only place the tree if it does not exist
          placeObjectSafely(createTree, scene, "tree", treeName); // Adjusted to include treeName
        }
      }
    
      // Create a mountain if correct answers are 5 or more and it doesn't exist
      if (correctAnswers >= 5 && !objectPositions.some(p => p.type === "mountain")) {
        placeObjectSafely(createMountain, scene, "mountain", "Mountain"); // Included unique identifier
      }
    
      // Create a lake if correct answers are 10 or more and it doesn't exist
      if (correctAnswers >= 10 && !objectPositions.some(p => p.type === "lake")) {
        placeObjectSafely(createLake, scene, "lake", "Lake"); // Included unique identifier
      }
    }
    
    updateEnvironment(); // Set up the environment based on correct answers

    // Add clickable behavior to the meshes (if needed)
    var addClickBehavior = function (mesh) {
      mesh.actionManager = new BABYLON.ActionManager(scene);
      mesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnPickTrigger,
          function () {
            console.log("Clicked on:", mesh.name);
            // Interaction logic here (if necessary)
          }
        )
      );
    };

    scene.meshes.forEach((mesh) => {
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

  window.addEventListener("resize", function () {
    engine.resize();
  });

  window.addEventListener("click", function (event) {
    var modal = document.getElementById("plantModal");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});
