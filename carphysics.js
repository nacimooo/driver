
function checkButtons(gltf, keyboard, speed) {

    // Move the GLTF model with arrow keys
    if (keyboard["ArrowUp"]) {
        if ((gltf.scene.rotation.y > 1.6 && gltf.scene.rotation.y < 4.6) || (gltf.scene.rotation.y < -1.6 && gltf.scene.rotation.y > -4.6)) {
            console.log('backward')
            gltf.scene.position.z -= speed
        } else {
            console.log('forward')
            gltf.scene.position.z += speed
        }

        if (!((gltf.scene.rotation.y > -0.2 && gltf.scene.rotation.y < 0.2) ||
            (gltf.scene.rotation.y > -3.2 && gltf.scene.rotation.y < -2.9) ||
            (gltf.scene.rotation.y > 2.9 && gltf.scene.rotation.y < 3.2))) {
                
            if ((gltf.scene.rotation.y > 0.2 && gltf.scene.rotation.y < 3.1) || (gltf.scene.rotation.y < -0.2 && gltf.scene.rotation.y < -3.1)) {
                console.log('left')
                gltf.scene.position.x += speed
            } else {
                console.log('right')
                gltf.scene.position.x -= speed
            }
        }

    }

    if (keyboard["ArrowDown"]) {
        gltf.scene.position.z -= speed
    }

    if (keyboard["ArrowLeft"]) {
        gltf.scene.rotation.y += 0.01
    }

    if (keyboard["ArrowRight"]) {
        gltf.scene.rotation.y -= 0.01
    }

    if (Math.abs(gltf.scene.rotation.y) > 6) {
        gltf.scene.rotation.y = 0
    }

    console.log(gltf.scene.rotation.y)
}




