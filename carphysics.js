

function checkButtons(gltf, keyboard, dt) {
    const car = gltf.scene // assuming the car is the first child object of the loaded GLTF

    const accel = 0.002; // acceleration
    const brake = 0.001; // braking force
    const steer = 0.0002; // steering angle
    const friction = 0.005; // friction coefficient
    const topSpeed = 0.4; // top speed

    let speed = gltf.userData.speed || 0;
    let steering = gltf.userData.steering || 0;

    // Accelerate when up arrow is pressed
    if (keyboard["ArrowUp"]) {
        speed += accel * dt;
        speed = Math.min(speed, topSpeed);
    } else {
        speed -= friction * dt;
        speed = Math.max(speed, 0);
    }

    // Apply understeer
    const understeer = Math.abs(speed) * 0.05;
    steering *= (1 - understeer);

    // Apply brakes when down arrow is pressed
    if (keyboard["ArrowDown"]) {
        speed -= brake * dt;
        speed = Math.max(speed, 0);
    }

    // Update car position and rotation based on speed and steering
    const deltaX = Math.sin(car.rotation.y + steering) * speed;
    const deltaZ = Math.cos(car.rotation.y + steering) * speed;
    car.position.x += deltaX;
    car.position.z += deltaZ;

    if (speed > 0) {
        // Steer when left or right arrow is pressed and the car is moving
        if (keyboard["ArrowLeft"]) {
            steering += steer * dt;
        } else if (keyboard["ArrowRight"]) {
            steering -= steer * dt;
        }
    }

    car.rotation.y += steering;

    // Save current speed and steering to gltf.userData for use in the next frame
    gltf.userData.speed = speed;
    gltf.userData.steering = steering;

    console.log('x: ' + car.position.x)
    console.log('z: '+ car.position.z)
}


function placeObject(scene, gltfObject, xPos, zPos) {
    gltfObject.position.x = xPos;
    gltfObject.position.z = zPos;
    scene.add(gltfObject.scene);
}





