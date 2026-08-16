import type { SceneFactory, SceneLabel } from "../types";

/**
 * The care network in three dimensions.
 *
 * Five roles orbit a shared record at the centre. Edges are drawn as thin
 * tubes so they catch light rather than reading as flat lines, and a signal
 * travels each spoke on its own cycle. Scrolling turns the whole assembly and
 * pulls the camera through it, so the depth is legible rather than decorative.
 *
 * Labels are real HTML, positioned by projecting these anchors each frame, so
 * the type stays crisp and selectable instead of becoming a texture.
 *
 * Roles are spaced evenly around the ring so none of them ever projects on top
 * of the hub, with a small height offset each so it reads as a ring rather than
 * a flat circle.
 */
const ROLES = ["Patient", "Clinician", "Pharmacy", "Laboratory", "Health facility"].map(
  (text, index, all) => ({
    text,
    angle: -0.55 + (index / all.length) * Math.PI * 2,
    lift: [0.55, -0.35, 0.7, -0.6, 0.25][index],
  }),
);

const BRAND = 0x289d90;
const OPTIC = 0x55b0df;
const SIGNAL = 0x27c030;

export const network: SceneFactory = (THREE, scene, camera) => {
  const root = new THREE.Group();
  scene.add(root);

  camera.position.set(0, 0.3, 8.2);

  scene.add(new THREE.AmbientLight(0xffffff, 1.5));

  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(4, 6, 6);
  scene.add(key);

  const rim = new THREE.DirectionalLight(OPTIC, 1.4);
  rim.position.set(-6, -2, -4);
  scene.add(rim);

  // ---- Central record ----
  const hub = new THREE.Group();
  root.add(hub);

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.52, 3),
    new THREE.MeshStandardMaterial({
      color: BRAND,
      roughness: 0.28,
      metalness: 0.55,
      emissive: BRAND,
      emissiveIntensity: 0.35,
    }),
  );
  hub.add(core);

  // Two calibration rings, echoing the optical motif used everywhere else.
  const ringMaterial = new THREE.MeshStandardMaterial({
    color: BRAND,
    roughness: 0.35,
    metalness: 0.8,
    transparent: true,
    opacity: 0.55,
  });
  const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.012, 12, 128), ringMaterial);
  const ringB = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.008, 12, 128), ringMaterial);
  ringA.rotation.x = Math.PI / 2.6;
  ringB.rotation.x = Math.PI / 1.9;
  ringB.rotation.y = 0.5;
  hub.add(ringA, ringB);

  // ---- Role nodes ----
  const RADIUS = 3.9;
  const nodes: import("three").Vector3[] = [];
  const labels: SceneLabel[] = [];
  const nodeMeshes: import("three").Mesh[] = [];

  const nodeGeometry = new THREE.IcosahedronGeometry(0.23, 2);
  const nodeMaterial = new THREE.MeshStandardMaterial({
    color: 0xf2f6f5,
    roughness: 0.18,
    metalness: 0.85,
    emissive: BRAND,
    emissiveIntensity: 0.22,
  });
  const collarMaterial = new THREE.MeshStandardMaterial({
    color: BRAND,
    roughness: 0.3,
    metalness: 0.9,
    transparent: true,
    opacity: 0.5,
  });
  const collarGeometry = new THREE.TorusGeometry(0.42, 0.008, 8, 48);

  ROLES.forEach((role, index) => {
    const position = new THREE.Vector3(
      Math.cos(role.angle) * RADIUS,
      role.lift,
      Math.sin(role.angle) * RADIUS * 0.3,
    );
    nodes.push(position);

    const mesh = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
    mesh.position.copy(position);
    root.add(mesh);
    nodeMeshes.push(mesh);

    // Each role gets its own small field of view.
    const collar = new THREE.Mesh(collarGeometry, collarMaterial);
    collar.position.copy(position);
    collar.rotation.x = Math.PI / 2.3;
    collar.rotation.y = role.angle;
    root.add(collar);

    // Labels sit outboard along the spoke, so they can never land on the hub.
    labels.push({
      id: `role-${index}`,
      text: role.text,
      anchor: position.clone().multiplyScalar(1.2).add(new THREE.Vector3(0, 0.45, 0)),
    });
  });

  labels.push({
    id: "hub",
    text: "One record",
    anchor: new THREE.Vector3(0, -1.85, 0),
  });

  // ---- Edges ----
  const edgeMaterial = new THREE.MeshStandardMaterial({
    color: BRAND,
    roughness: 0.4,
    metalness: 0.3,
    transparent: true,
    opacity: 0.45,
  });
  const peerMaterial = new THREE.MeshStandardMaterial({
    color: OPTIC,
    roughness: 0.4,
    metalness: 0.3,
    transparent: true,
    opacity: 0.22,
  });

  const tube = (from: import("three").Vector3, to: import("three").Vector3, thin: boolean) => {
    const curve = new THREE.LineCurve3(from, to);
    const geometry = new THREE.TubeGeometry(curve, 1, thin ? 0.006 : 0.011, 6, false);
    return new THREE.Mesh(geometry, thin ? peerMaterial : edgeMaterial);
  };

  const centre = new THREE.Vector3(0, 0, 0);
  const worldPoint = new THREE.Vector3();
  const outward = new THREE.Vector3();
  const spokes: import("three").Mesh[] = [];
  nodes.forEach((node) => {
    const mesh = tube(centre, node, false);
    root.add(mesh);
    spokes.push(mesh);
  });

  // A few relationships that skip the hub entirely.
  ([
    [0, 1],
    [1, 3],
    [2, 3],
    [0, 4],
  ] as const).forEach(([a, b]) => root.add(tube(nodes[a], nodes[b], true)));

  // ---- Travelling signals ----
  const signalGeometry = new THREE.SphereGeometry(0.07, 12, 12);
  const signalMaterial = new THREE.MeshBasicMaterial({ color: SIGNAL });
  const signals = nodes.map((node, index) => {
    const mesh = new THREE.Mesh(signalGeometry, signalMaterial);
    root.add(mesh);
    return { mesh, from: node, offset: index * 0.72 };
  });

  const disposables: { dispose: () => void }[] = [
    nodeGeometry,
    signalGeometry,
    edgeMaterial,
    peerMaterial,
    nodeMaterial,
    signalMaterial,
    ringMaterial,
    collarMaterial,
    collarGeometry,
  ];

  return {
    labels,
    update(progress, elapsed) {
      // Scroll turns the assembly and tilts it. Ambient drift keeps it alive
      // when the page is still.
      root.rotation.y = -0.2 + progress * 0.5 + Math.sin(elapsed * 0.12) * 0.04;
      root.rotation.x = 0.26 - progress * 0.4;
      root.position.z = -0.9 + progress * 1.7;

      hub.rotation.y = elapsed * 0.22;
      ringA.rotation.z = elapsed * 0.16;
      ringB.rotation.z = -elapsed * 0.11;

      const pulse = 1 + Math.sin(elapsed * 1.6) * 0.03;
      core.scale.setScalar(pulse);

      nodeMeshes.forEach((mesh, index) => {
        mesh.rotation.y = elapsed * 0.3 + index;
        mesh.position.y = nodes[index].y + Math.sin(elapsed * 0.7 + index * 1.3) * 0.05;

        // Keep each label glued to its node in world space. The group is
        // rotating, so a fixed local anchor would slide off.
        mesh.getWorldPosition(worldPoint);
        labels[index].anchor.copy(worldPoint).addScaledVector(outward.copy(worldPoint).normalize(), 0.95);
        labels[index].anchor.y += 0.34;
      });

      hub.getWorldPosition(worldPoint);
      labels[labels.length - 1].anchor.copy(worldPoint).setY(worldPoint.y - 1.9);

      signals.forEach((signal) => {
        const t = ((elapsed * 0.42 + signal.offset) % 1);
        signal.mesh.position.lerpVectors(signal.from, centre, t);
        const fade = Math.sin(t * Math.PI);
        signal.mesh.scale.setScalar(0.6 + fade * 0.9);
      });

      spokes.forEach((spoke, index) => {
        const material = spoke.material as import("three").MeshStandardMaterial;
        material.opacity = 0.3 + Math.sin(elapsed * 0.9 + index) * 0.12 + progress * 0.15;
      });
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
      disposables.forEach((item) => item.dispose());
      scene.remove(root);
    },
  };
};
