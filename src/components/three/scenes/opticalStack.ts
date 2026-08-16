import type { SceneFactory, SceneLabel } from "../types";

/**
 * The optical stack, exploded.
 *
 * Scrolling pulls the elements apart and then lets them settle back together,
 * which is the clearest way to show how a transmitted-light microscope is
 * arranged. A shaft of illumination runs up the optical axis through all of it.
 *
 * As with the SVG this replaces, it is a general arrangement rather than the
 * Medirevs Labs prototype, and it carries no dimensions or magnifications
 * because none are confirmed.
 */
const OPTIC = 0x55b0df;
const BRAND = 0x289d90;

type Part = {
  id: string;
  label: string;
  /** Resting height on the optical axis. */
  y: number;
  /** How far this part travels when the stack is pulled apart. */
  spread: number;
  radius: number;
  thickness: number;
  kind: "metal" | "glass" | "plate" | "light";
};

const PARTS: Part[] = [
  { id: "eyepiece", label: "Eyepiece", y: 2.55, spread: 1.5, radius: 0.62, thickness: 0.78, kind: "metal" },
  { id: "tube", label: "Tube", y: 1.35, spread: 0.85, radius: 0.44, thickness: 1.25, kind: "metal" },
  { id: "objective", label: "Objective", y: 0.2, spread: 0.25, radius: 0.5, thickness: 0.72, kind: "glass" },
  { id: "stage", label: "Stage", y: -0.85, spread: -0.35, radius: 1.85, thickness: 0.1, kind: "plate" },
  { id: "condenser", label: "Condenser", y: -1.75, spread: -1.0, radius: 0.6, thickness: 0.5, kind: "glass" },
  { id: "illumination", label: "Illumination", y: -2.75, spread: -1.7, radius: 0.42, thickness: 0.3, kind: "light" },
];

export const opticalStack: SceneFactory = (THREE, scene, camera, renderer) => {
  const root = new THREE.Group();
  scene.add(root);

  camera.position.set(0, 0, 9.5);

  // Procedural bench lighting, no HDRI download.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environmentScene = new THREE.Scene();
  const addPanel = (w: number, h: number, color: number, gain: number, x: number, y: number, z: number) => {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, 0.1),
      new THREE.MeshBasicMaterial({ color }),
    );
    mesh.material.color.multiplyScalar(gain);
    mesh.position.set(x, y, z);
    environmentScene.add(mesh);
  };
  addPanel(24, 24, 0x0a1211, 1, 0, 0, -12);
  addPanel(12, 8, 0xffffff, 2.6, -6, 5, 4);
  addPanel(10, 10, 0xcfe8e3, 1.2, 7, 0, 3);
  const environment = pmrem.fromScene(environmentScene, 0.05).texture;
  scene.environment = environment;

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 2.1);
  key.position.set(5, 6, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(OPTIC, 1.5);
  rim.position.set(-6, -2, -3);
  scene.add(rim);

  const metal = new THREE.MeshStandardMaterial({
    color: 0x22282a,
    roughness: 0.32,
    metalness: 1,
    envMapIntensity: 1.15,
  });
  const plate = new THREE.MeshStandardMaterial({
    color: 0x161b1c,
    roughness: 0.5,
    metalness: 0.85,
  });
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x9fe6d8,
    roughness: 0.04,
    metalness: 0,
    transmission: 0.9,
    thickness: 0.6,
    ior: 1.5,
    clearcoat: 1,
    transparent: true,
    envMapIntensity: 1.3,
  });
  const emitter = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xdff6ef,
    emissiveIntensity: 2.4,
    roughness: 0.4,
  });

  const labels: SceneLabel[] = [];
  const assemblies: { part: Part; group: import("three").Group }[] = [];
  const worldPoint = new THREE.Vector3();
  const sideways = new THREE.Vector3();

  PARTS.forEach((part) => {
    const group = new THREE.Group();
    group.position.y = part.y;
    root.add(group);

    const material =
      part.kind === "glass" ? glass : part.kind === "plate" ? plate : part.kind === "light" ? emitter : metal;

    if (part.kind === "plate") {
      // The stage: a flat plate with a central aperture.
      const shape = new THREE.Shape();
      shape.absarc(0, 0, part.radius, 0, Math.PI * 2, false);
      const hole = new THREE.Path();
      hole.absarc(0, 0, 0.34, 0, Math.PI * 2, true);
      shape.holes.push(hole);
      const mesh = new THREE.Mesh(
        new THREE.ExtrudeGeometry(shape, { depth: part.thickness, bevelEnabled: false }),
        material,
      );
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = part.thickness / 2;
      group.add(mesh);

      // Specimen slide sitting on the stage.
      const slide = new THREE.Mesh(
        new THREE.BoxGeometry(1.05, 0.02, 0.42),
        new THREE.MeshPhysicalMaterial({
          color: 0xbfe9df,
          transmission: 0.85,
          roughness: 0.06,
          thickness: 0.1,
          ior: 1.5,
          transparent: true,
        }),
      );
      slide.position.y = part.thickness + 0.02;
      group.add(slide);
    } else {
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(part.radius, part.radius * 0.86, part.thickness, 64, 1, false),
        material,
      );
      group.add(body);

      if (part.kind === "metal") {
        // Knurled grip band.
        const band = new THREE.Mesh(
          new THREE.TorusGeometry(part.radius * 1.02, 0.055, 12, 64),
          metal,
        );
        band.rotation.x = Math.PI / 2;
        group.add(band);

        const collar = new THREE.Mesh(
          new THREE.CylinderGeometry(part.radius * 1.12, part.radius * 1.12, 0.09, 64),
          plate,
        );
        collar.position.y = part.thickness / 2;
        group.add(collar);
      }

      if (part.kind === "glass") {
        const element = new THREE.Mesh(new THREE.SphereGeometry(part.radius * 0.82, 48, 32), glass);
        element.scale.y = 0.42;
        element.position.y = -part.thickness / 2 + 0.06;
        group.add(element);

        const coating = new THREE.Mesh(
          new THREE.CircleGeometry(part.radius * 0.7, 48),
          new THREE.MeshStandardMaterial({
            color: BRAND,
            emissive: BRAND,
            emissiveIntensity: 0.3,
            roughness: 0.1,
            metalness: 0.9,
          }),
        );
        coating.rotation.x = -Math.PI / 2;
        coating.position.y = -part.thickness / 2 + 0.02;
        group.add(coating);
      }
    }

    assemblies.push({ part, group });
    labels.push({
      id: part.id,
      text: part.label,
      anchor: new THREE.Vector3(part.radius + 0.9, part.y, 0),
    });
  });

  // ---- Optical axis and the beam that travels it ----
  const axis = new THREE.Mesh(
    new THREE.CylinderGeometry(0.006, 0.006, 9, 8),
    new THREE.MeshBasicMaterial({ color: OPTIC, transparent: true, opacity: 0.35 }),
  );
  root.add(axis);

  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.06, 5.6, 32, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0xdff6ef,
      transparent: true,
      opacity: 0.09,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  beam.position.y = -0.2;
  root.add(beam);

  return {
    labels,
    update(progress, elapsed) {
      // 0 to 0.5 pulls the stack apart, 0.5 to 1 lets it close again.
      const explode = Math.sin(Math.min(Math.max(progress, 0), 1) * Math.PI);

      assemblies.forEach(({ part, group }, index) => {
        group.position.y = part.y + part.spread * explode * 1.5;
        group.rotation.y = elapsed * 0.16 + index * 0.2;

        // Anchor each label to the part in world space and push it out to the
        // right of the stack, clear of the geometry.
        group.getWorldPosition(worldPoint);
        sideways.set(part.radius + 1.15, 0, 0).applyQuaternion(root.quaternion);
        labels[index].anchor.copy(worldPoint).add(sideways);
      });

      root.rotation.y = -0.45 + progress * 0.9 + Math.sin(elapsed * 0.1) * 0.03;
      root.rotation.x = 0.16 - progress * 0.3;

      axis.material.opacity = 0.16 + explode * 0.3;
      beam.material.opacity = 0.05 + explode * 0.1 + Math.sin(elapsed * 1.1) * 0.015;
      beam.scale.y = 1 + explode * 0.5;
    },
    dispose() {
      // Dispose everything the traversal can reach, including per-node
      // material clones and materials created inline above.
      root.traverse((object) => {
        const mesh = object as import("three").Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const material = mesh.material as
          | import("three").Material
          | import("three").Material[]
          | undefined;
        if (Array.isArray(material)) material.forEach((item) => item.dispose());
        else material?.dispose();
      });
      [metal, plate, glass, emitter].forEach((material) => material.dispose());
      environment.dispose();
      pmrem.dispose();
      scene.environment = null;
      scene.remove(root);
    },
  };
};
