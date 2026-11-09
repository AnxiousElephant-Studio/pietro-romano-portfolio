import * as THREE from "three";
import { approachExponentially, clamp } from "@/core/lib/math";

export type LampTarget = { x: number; y: number; isActive: boolean };

export type LampSceneFrame = {
  baseX: number;
  baseY: number;
  lampScale: number;
  squash: number;
  target: LampTarget;
};

export type LampScene = {
  resize: (width: number, height: number) => void;
  render: (frame: LampSceneFrame, deltaSeconds: number) => void;
  dispose: () => void;
};

const COLORS = {
  body: 0xe9e4dc,
  base: 0xd6883c,
  joint: 0x8f8a84,
  light: 0xffc58a,
  shadeInner: 0xfff1de,
  bulbOff: 0xd9d2c6,
  ambient: 0xffffff,
  keyLight: 0xfaf9f6,
  rimLight: 0xff8a50,
};

const SCENE_LIGHTING = {
  ambientIntensity: 0.4,
  keyIntensity: 1.6,
  keyPosition: new THREE.Vector3(-300, 400, 600),
  rimIntensity: 0.8,
  rimPosition: new THREE.Vector3(400, 100, -300),
};

const RENDERER = { maxPixelRatio: 2, cameraDepth: 2000, cameraZ: 1000 };

const MATERIALS = {
  body: { roughness: 0.45, metalness: 0.15 },
  joint: { roughness: 0.4, metalness: 0.5 },
};

const GEOMETRY = {
  base: { topRadius: 40, bottomRadius: 46, height: 12, segments: 40 },
  shoulderHeight: 16,
  lowerArmLength: 120,
  upperArmLength: 108,
  armRod: { radius: 2.6, segments: 12, sideOffset: 6 },
  joint: { radius: 7, depth: 18, segments: 20 },
  shade: { mouthRadius: 36, neckRadius: 13, depth: 46, segments: 40, offsetZ: 30 },
  shadeBack: { radius: 14, widthSegments: 24, heightSegments: 16, offsetZ: 7 },
  bulb: { radius: 11, widthSegments: 24, heightSegments: 16, offsetZ: 34 },
  bulbLight: { offsetZ: 40, distance: 160, decay: 1.5 },
  mouthOffsetZ: 52,
  coneSegments: 48,
};

const POSE = {
  baseYaw: -0.35,
  shoulderRestAngle: 0.38,
  shoulderReachInfluence: 0.1,
  elbowRestAngle: -0.95,
  elbowReachInfluence: 0.3,
  verticalReachDistance: 400,
};

const MOTION_RATES = { aim: 5, pose: 4, lightSwitch: 22 };

const BEAM = {
  maxOpacity: 0.22,
  falloffExponent: 1.6,
  radiusToLengthRatio: 0.38,
  maxRadius: 190,
  minLength: 1,
  visibilityThreshold: 0.01,
};

const PEAK_INTENSITY = { bulbEmissive: 2.4, shadeInnerEmissive: 0.35, bulbLight: 2 };

const LIGHT_OFF_STRENGTH = 0;
const LIGHT_ON_STRENGTH = 1;

const coneVertexShader = `
  varying float coneDepth;

  void main() {
    coneDepth = position.z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const coneFragmentShader = `
  uniform vec3 lightColor;
  uniform float strength;
  uniform float maxOpacity;
  uniform float falloffExponent;
  varying float coneDepth;

  void main() {
    float falloff = pow(1.0 - clamp(coneDepth, 0.0, 1.0), falloffExponent);
    gl_FragColor = vec4(lightColor, falloff * maxOpacity * strength);
  }
`;

function createArm(material: THREE.Material, length: number) {
  const armGroup = new THREE.Group();
  const { radius, segments, sideOffset } = GEOMETRY.armRod;
  const rodGeometry = new THREE.CylinderGeometry(radius, radius, length, segments);

  [-sideOffset, sideOffset].forEach((rodOffset) => {
    const rod = new THREE.Mesh(rodGeometry, material);
    rod.position.set(0, length / 2, rodOffset);
    armGroup.add(rod);
  });

  return armGroup;
}

function createJoint(material: THREE.Material) {
  const { radius, depth, segments } = GEOMETRY.joint;
  const joint = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, depth, segments), material);
  joint.rotation.x = Math.PI / 2;

  return joint;
}

export function createLampScene(canvas: HTMLCanvasElement): LampScene {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, RENDERER.maxPixelRatio));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(0, 1, 0, -1, -RENDERER.cameraDepth, RENDERER.cameraDepth);
  camera.position.z = RENDERER.cameraZ;

  scene.add(new THREE.AmbientLight(COLORS.ambient, SCENE_LIGHTING.ambientIntensity));

  const keyLight = new THREE.DirectionalLight(COLORS.keyLight, SCENE_LIGHTING.keyIntensity);
  keyLight.position.copy(SCENE_LIGHTING.keyPosition);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(COLORS.rimLight, SCENE_LIGHTING.rimIntensity);
  rimLight.position.copy(SCENE_LIGHTING.rimPosition);
  scene.add(rimLight);

  const bodyMaterial = new THREE.MeshStandardMaterial({ color: COLORS.body, ...MATERIALS.body });
  const baseMaterial = new THREE.MeshStandardMaterial({ color: COLORS.base, ...MATERIALS.body });
  const jointMaterial = new THREE.MeshStandardMaterial({ color: COLORS.joint, ...MATERIALS.joint });
  const shadeInnerMaterial = new THREE.MeshStandardMaterial({
    color: COLORS.shadeInner,
    emissive: COLORS.light,
    emissiveIntensity: LIGHT_OFF_STRENGTH,
    side: THREE.BackSide,
  });
  const bulbMaterial = new THREE.MeshStandardMaterial({
    color: COLORS.bulbOff,
    emissive: COLORS.light,
    emissiveIntensity: LIGHT_OFF_STRENGTH,
  });

  const lampRoot = new THREE.Group();
  lampRoot.rotation.y = POSE.baseYaw;
  scene.add(lampRoot);

  const { topRadius, bottomRadius, height: baseHeight, segments: baseSegments } = GEOMETRY.base;
  const base = new THREE.Mesh(new THREE.CylinderGeometry(topRadius, bottomRadius, baseHeight, baseSegments), baseMaterial);
  base.position.y = baseHeight / 2;
  lampRoot.add(base);

  const shoulder = new THREE.Group();
  shoulder.position.y = GEOMETRY.shoulderHeight;
  shoulder.add(createJoint(jointMaterial));
  shoulder.add(createArm(bodyMaterial, GEOMETRY.lowerArmLength));
  lampRoot.add(shoulder);

  const elbow = new THREE.Group();
  elbow.position.y = GEOMETRY.lowerArmLength;
  elbow.add(createJoint(jointMaterial));
  elbow.add(createArm(bodyMaterial, GEOMETRY.upperArmLength));
  shoulder.add(elbow);

  const wrist = new THREE.Group();
  wrist.position.y = GEOMETRY.upperArmLength;
  wrist.add(createJoint(jointMaterial));
  elbow.add(wrist);

  const head = new THREE.Group();
  wrist.add(head);

  const { mouthRadius, neckRadius, depth: shadeDepth, segments: shadeSegments, offsetZ: shadeOffsetZ } = GEOMETRY.shade;
  const shadeGeometry = new THREE.CylinderGeometry(mouthRadius, neckRadius, shadeDepth, shadeSegments, 1, true);
  shadeGeometry.rotateX(Math.PI / 2);
  shadeGeometry.translate(0, 0, shadeOffsetZ);
  head.add(new THREE.Mesh(shadeGeometry, bodyMaterial));
  head.add(new THREE.Mesh(shadeGeometry, shadeInnerMaterial));

  const shadeBackSpec = GEOMETRY.shadeBack;
  const shadeBack = new THREE.Mesh(
    new THREE.SphereGeometry(
      shadeBackSpec.radius,
      shadeBackSpec.widthSegments,
      shadeBackSpec.heightSegments,
      0,
      Math.PI * 2,
      0,
      Math.PI / 2,
    ),
    bodyMaterial,
  );
  shadeBack.rotation.x = -Math.PI / 2;
  shadeBack.position.z = shadeBackSpec.offsetZ;
  head.add(shadeBack);

  const bulbSpec = GEOMETRY.bulb;
  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(bulbSpec.radius, bulbSpec.widthSegments, bulbSpec.heightSegments),
    bulbMaterial,
  );
  bulb.position.z = bulbSpec.offsetZ;
  head.add(bulb);

  const bulbLightSpec = GEOMETRY.bulbLight;
  const bulbLight = new THREE.PointLight(COLORS.light, LIGHT_OFF_STRENGTH, bulbLightSpec.distance, bulbLightSpec.decay);
  bulbLight.position.z = bulbLightSpec.offsetZ;
  head.add(bulbLight);

  const mouthAnchor = new THREE.Object3D();
  mouthAnchor.position.z = GEOMETRY.mouthOffsetZ;
  head.add(mouthAnchor);

  const coneGeometry = new THREE.ConeGeometry(1, 1, GEOMETRY.coneSegments, 1, true);
  coneGeometry.translate(0, -0.5, 0);
  coneGeometry.rotateX(-Math.PI / 2);
  const coneMaterial = new THREE.ShaderMaterial({
    uniforms: {
      lightColor: { value: new THREE.Color(COLORS.light) },
      strength: { value: LIGHT_OFF_STRENGTH },
      maxOpacity: { value: BEAM.maxOpacity },
      falloffExponent: { value: BEAM.falloffExponent },
    },
    vertexShader: coneVertexShader,
    fragmentShader: coneFragmentShader,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const lightCone = new THREE.Mesh(coneGeometry, coneMaterial);
  scene.add(lightCone);

  const smoothedTarget = new THREE.Vector3();
  const mouthPosition = new THREE.Vector3();
  const desiredTarget = new THREE.Vector3();
  let hasSmoothedTarget = false;
  let lightStrength = LIGHT_OFF_STRENGTH;

  const resize = (width: number, height: number) => {
    renderer.setSize(width, height, false);
    camera.left = 0;
    camera.right = width;
    camera.top = 0;
    camera.bottom = -height;
    camera.updateProjectionMatrix();
  };

  const applyBaseTransform = (frame: LampSceneFrame) => {
    const volumePreservingScale = frame.lampScale / Math.sqrt(frame.squash);

    lampRoot.position.set(frame.baseX, -frame.baseY, 0);
    lampRoot.scale.set(volumePreservingScale, frame.lampScale * frame.squash, volumePreservingScale);
  };

  const updateAim = (frame: LampSceneFrame, deltaSeconds: number) => {
    desiredTarget.set(frame.target.x, -frame.target.y, 0);

    if (!hasSmoothedTarget) {
      smoothedTarget.copy(desiredTarget);
      hasSmoothedTarget = true;
    }

    smoothedTarget.x = approachExponentially(smoothedTarget.x, desiredTarget.x, MOTION_RATES.aim, deltaSeconds);
    smoothedTarget.y = approachExponentially(smoothedTarget.y, desiredTarget.y, MOTION_RATES.aim, deltaSeconds);
  };

  const updatePose = (frame: LampSceneFrame, deltaSeconds: number) => {
    const verticalReach = clamp((frame.baseY - frame.target.y) / POSE.verticalReachDistance, -1, 1);
    const shoulderAngle = POSE.shoulderRestAngle - verticalReach * POSE.shoulderReachInfluence;
    const elbowAngle = POSE.elbowRestAngle + verticalReach * POSE.elbowReachInfluence;

    shoulder.rotation.z = approachExponentially(shoulder.rotation.z, shoulderAngle, MOTION_RATES.pose, deltaSeconds);
    elbow.rotation.z = approachExponentially(elbow.rotation.z, elbowAngle, MOTION_RATES.pose, deltaSeconds);

    lampRoot.updateMatrixWorld(true);
    head.lookAt(smoothedTarget);
    head.updateMatrixWorld(true);
  };

  const updateBeam = () => {
    mouthAnchor.getWorldPosition(mouthPosition);

    const beamLength = Math.max(mouthPosition.distanceTo(smoothedTarget), BEAM.minLength);
    const beamRadius = Math.min(beamLength * BEAM.radiusToLengthRatio, BEAM.maxRadius);

    lightCone.position.copy(mouthPosition);
    lightCone.lookAt(smoothedTarget);
    lightCone.scale.set(beamRadius, beamRadius, beamLength);
  };

  const updateLightStrength = (frame: LampSceneFrame, deltaSeconds: number) => {
    const targetStrength = frame.target.isActive ? LIGHT_ON_STRENGTH : LIGHT_OFF_STRENGTH;
    lightStrength = approachExponentially(lightStrength, targetStrength, MOTION_RATES.lightSwitch, deltaSeconds);

    coneMaterial.uniforms.strength.value = lightStrength;
    coneMaterial.visible = lightStrength > BEAM.visibilityThreshold;
    bulbMaterial.emissiveIntensity = PEAK_INTENSITY.bulbEmissive * lightStrength;
    shadeInnerMaterial.emissiveIntensity = PEAK_INTENSITY.shadeInnerEmissive * lightStrength;
    bulbLight.intensity = PEAK_INTENSITY.bulbLight * lightStrength;
  };

  const render = (frame: LampSceneFrame, deltaSeconds: number) => {
    applyBaseTransform(frame);
    updateAim(frame, deltaSeconds);
    updatePose(frame, deltaSeconds);
    updateBeam();
    updateLightStrength(frame, deltaSeconds);
    renderer.render(scene, camera);
  };

  const dispose = () => {
    scene.traverse((sceneObject) => {
      if (sceneObject instanceof THREE.Mesh) {
        sceneObject.geometry.dispose();
      }
    });

    [bodyMaterial, jointMaterial, shadeInnerMaterial, bulbMaterial, coneMaterial].forEach((material) =>
      material.dispose(),
    );
    renderer.dispose();
  };

  return { resize, render, dispose };
}
