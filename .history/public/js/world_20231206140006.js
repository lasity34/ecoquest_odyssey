let objectPositions = []
var correctAnswers = 10; // Set to the number of correct answers
let lastCorrectAnswers = 0;

var plantNames = ["Protea", "Silver Tree", "Cape Daisy"];

// checks overlapping
function isOverlapping(newPosition, existingObjects, size) {
  for (let obj of existingObjects) {
    let distanceX = Math.abs(newPosition.x - obj.x); // Use obj.x directly
    let distanceZ = Math.abs(newPosition.z - obj.z); // Use obj.z directly
    if (distanceX < size && distanceZ < size) {
      console.log(`Overlap detected: New Position ${newPosition.x}, ${newPosition.z} with Existing Position ${obj.x}, ${obj.z} - Size: ${size}`);
      return true; // There is an overlap
    }
  }
  console.log(`No overlap found for position: ${newPosition.x}, ${newPosition.z}`);
  return false; // No overlap
}


// makes ure items are placed properly
function placeObjectSafely(scene, objectType, objectName, maxAttempts = 200) {
  loadPositions();

  let existingObject = objectPositions.find(p => p.type === objectType && p.name === objectName);
  if (existingObject) {
    console.log(`Using existing position for ${objectType}: ${objectName}`, existingObject.position);
    return existingObject.position;
  }

  for (let attempts = 0; attempts < maxAttempts; attempts++) {
    let x = (Math.random() - 0.5) * 200;
    let z = (Math.random() - 0.5) * 200;
    let overlapSize = objectType === "tree" ? 5 : 15;

    let position = new BABYLON.Vector3(x, 0, z);
    console.log(`Attempt ${attempts}: Trying position for ${objectType}: ${x}, ${z}`);

    if (!isOverlapping(position, objectPositions, overlapSize)) {
      console.log(`Placed new ${objectType}: ${objectName} at position: ${x}, ${z}`);
      return position;
    }
  }

  console.log(`Unable to place ${objectType} after ${maxAttempts} attempts.`);
  return null;
}

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

    objectPositions.push({
      x: position.x, 
      y: position.y, 
      z: position.z, 
      type: "mountain"
    });
    savePositions();
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
        objectPositions.push({
          x: position.x, 
          y: position.y, 
          z: position.z, 
          type: "lake"
        });
        savePositions();
        return lake;
    } else {
        console.log("Overlap detected. Lake not created.");
    }
};



// Tree Creation Function with Labels and Click Events
var createTree = function (scene, advancedTexture, x, z, treeName) {
    // Find a saved position or generate a new one
 // Check if a tree with this name and type already exists in objectPositions
 let savedPosition = objectPositions.find(p => p.type === "tree" && p.name === treeName);

 // Convert spherical coordinates (latitude, longitude) to Cartesian coordinates (x, y, z)
 let radius = 200; // Assuming the radius of your spherical world
 let phi = BABYLON.Tools.ToRadians(90 - latitude); // Convert latitude to radians
 let theta = BABYLON.Tools.ToRadians(longitude); // Convert longitude to radians

 let x = radius * Math.sin(phi) * Math.cos(theta);
 let y = radius * Math.cos(phi);
 let z = radius * Math.sin(phi) * Math.sin(theta);

 let position = new BABYLON.Vector3(x, y, z);

 if (!savedPosition) {
     // If no saved position, check for overlap and potentially push new position
     if (isOverlapping(position, objectPositions, 10)) {
         console.log("Overlap detected. Tree not created.");
         return; // Skip tree creation due to overlap
     }

     // Record position of the new tree
     console.log("Position being pushed:", position);
     objectPositions.push({
         x: position.x, 
         y: position.y, 
         z: position.z, 
         type: "tree", 
         name: treeName
     });

     savePositions();
 } else {
     // Use the saved position
     position = new BABYLON.Vector3(savedPosition.x, savedPosition.y, savedPosition.z);
 }

 // Adjust the position to account for tree height
 position = position.normalize().scale(radius + 2); // 2 is half the height of the tree

 // Create the trunk
 var trunk = BABYLON.MeshBuilder.CreateCylinder("trunk", { height: 4, diameter: 1 }, scene);
 trunk.position = position;
 trunk.position.y += 2; // Raise trunk to sit on the sphere's surface

 // Orient the trunk to stand upright on the sphere
 let up = position.subtract(new BABYLON.Vector3(0, 0, 0)).normalize();
 let right = BABYLON.Vector3.Cross(up, new BABYLON.Vector3(0, 1, 0)).normalize();
 let forward = BABYLON.Vector3.Cross(right, up).normalize();
 trunk.rotationQuaternion = BABYLON.Quaternion.RotationQuaternionFromAxis(right, up, forward);

 // Create the leaves
 var leaves = BABYLON.MeshBuilder.CreateSphere("leaves", { diameter: 6, segments: 8 }, scene);
 leaves.parent = trunk; // Parent leaves to trunk
 leaves.position = new BABYLON.Vector3(0, 5, 0); // Position leaves 

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


function savePositions() {
    const positionsToSave = objectPositions.map(pos => ({
        x: pos.x,
        y: pos.y,
        z: pos.z,
        type: pos.type,
        name: pos.name
    }));
    console.log("Saving positions to local storage:", positionsToSave);
    localStorage.setItem("objectPositions", JSON.stringify(positionsToSave));
}

function loadPositions() {
    let savedPositions = localStorage.getItem("objectPositions");
    if (savedPositions) {
        objectPositions = JSON.parse(savedPositions).map(pos => ({
            x: pos.x,
            y: pos.y,
            z: pos.z,
            type: pos.type,
            name: pos.name
        }));
        console.log("Loaded positions from local storage:", objectPositions);
    } else {
        console.log("No positions found in local storage. Initializing with an empty array.");
        objectPositions = [];
    }
}



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

function updateEnvironment(scene, advancedTexture) {
  if (correctAnswers === lastCorrectAnswers) {
    // No change in correctAnswers, no need to update environment
    return;
  }

  // Update lastCorrectAnswers
  lastCorrectAnswers = correctAnswers;

  // Create trees for each correct answer if they don't already exist
  for (let i = 0; i < correctAnswers; i++) {
    var treeName = plantNames[i % plantNames.length];
    let position = placeObjectSafely(scene, "tree", treeName);
    if (position) {
      createTree(scene, advancedTexture, position.x, position.z, treeName);
;
      // Check if the position was already in objectPositions to avoid duplicates
      if (!objectPositions.some(p => p.type === "tree" && p.name === treeName)) {
        objectPositions.push({ position: position, type: "tree", name: treeName });
        savePositions();
      }
    }
  }

  // Similar logic for mountains and lakes
  if (correctAnswers >= 5 && !objectPositions.some(p => p.type === "mountain")) {
    let position = placeObjectSafely(scene, "mountain", "Mountain");
    if (position) {
      createMountain(scene, position.x, position.z, "Mountain");
      objectPositions.push({ position: position, type: "mountain", name: "Mountain" });
      savePositions();
    }
  }

  if (correctAnswers >= 10 && !objectPositions.some(p => p.type === "lake")) {
    let position = placeObjectSafely(scene, "lake", "Lake");
    if (position) {
      createLake(scene, position.x, position.z, "Lake");
      objectPositions.push({ position: position, type: "lake", name: "Lake" });
      savePositions();
    }
  }
}

function createScene(engine, canvas) {
  var scene = new BABYLON.Scene(engine);

  // Camera setup
  var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2.5, 50, new BABYLON.Vector3(0, 0, 0), scene);
  camera.attachControl(canvas, true);
  camera.upperBetaLimit = Math.PI / 2; // Limit camera angle so we don't see under the sphere

  // Light setup
  var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(1, 1, 0), scene);

  // Spherical world setup
  var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 400, segments: 32}, scene);
  var sphereMaterial = new BABYLON.StandardMaterial("sphereMat", scene);
  sphereMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.1);
  sphere.material = sphereMaterial;

  // Make the sphere inverted so we can see it from the inside
  sphereMaterial.backFaceCulling = false;

  var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

  return { scene, advancedTexture };
}


window.addEventListener("DOMContentLoaded", function() {
  var canvas = document.getElementById("renderCanvas");
  var engine = new BABYLON.Engine(canvas, true);

  var { scene, advancedTexture } = createScene(engine, canvas); // Destructure to get scene and advancedTexture
  updateEnvironment(scene, advancedTexture);// Update the environment

  engine.runRenderLoop(function() {
    scene.render();
  });

 

  // Add clickable behavior to the meshes
  var addClickBehavior = function(mesh) {
    mesh.actionManager = new BABYLON.ActionManager(scene);
    mesh.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPickTrigger,
        function() {
          console.log("Clicked on:", mesh.name);
        }
      )
    );
  };

  scene.meshes.forEach((mesh) => {
    if (!mesh.name.startsWith("trunk") && !mesh.name.startsWith("leaves")) {
      addClickBehavior(mesh);
    }
  });

  // Resize event listener
  window.addEventListener("resize", function() {
    engine.resize();
  });

  // Click event listener for modal
  window.addEventListener("click", function(event) {
    var modal = document.getElementById("plantModal");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });


});