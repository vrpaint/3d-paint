import * as BABYLON from 'babylonjs';

interface IParticleSettings {
    color1: string;
    color2: string;
    minSize?: number;
    maxSize?: number;
    minLifeTime?: number;
    maxLifeTime?: number;
}

export default function createParticles(
    fountainMesh: BABYLON.AbstractMesh,
    settings: IParticleSettings,
    scene: BABYLON.Scene,
): BABYLON.ParticleSystem {
    // Create a particle system
    var particleSystem = new BABYLON.ParticleSystem('particles', 1000, scene);

    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture(
        './assets/particles/flare.png',
        scene,
    );

    // Where the particles come from
    particleSystem.emitter = fountainMesh; // the starting object, the emitter
    particleSystem.minEmitBox = new BABYLON.Vector3(0, 0, 0); // Starting all from
    particleSystem.maxEmitBox = new BABYLON.Vector3(0, 0, 0); // To...

    // Colors of all particles
    particleSystem.color1 = BABYLON.Color4.FromHexString(
        settings.color1 + 'FF',
    );
    particleSystem.color2 = BABYLON.Color4.FromHexString(
        settings.color2 + 'FF',
    );
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0);

    // Size of each particle (random between...
    particleSystem.minSize = settings.minSize || 0.1;
    particleSystem.maxSize = settings.maxSize || 2;

    // Life time of each particle (random between...
    particleSystem.minLifeTime = settings.minLifeTime || 0.1;
    particleSystem.maxLifeTime = settings.maxLifeTime || 2;

    // Emission rate
    particleSystem.emitRate = 1000;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    // Set the gravity of all particles
    //particleSystem.gravity = new BABYLON.Vector3(0, -100, 0);

    // Direction of each particle after it has been emitted
    particleSystem.direction1 = new BABYLON.Vector3(1, 1, 1);
    particleSystem.direction2 = new BABYLON.Vector3(-1, -1, -1);

    // Angular speed, in radians
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;

    // Speed
    particleSystem.minEmitPower = 0;
    particleSystem.maxEmitPower = 1;
    particleSystem.updateSpeed = 0.1;

    // Start the particle system
    particleSystem.start();

    return particleSystem;
}
