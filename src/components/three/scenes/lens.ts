import type { SceneFactory } from "../types";

/**
 * A machined optical assembly: barrel, knurled focus ring, aperture blades and
 * a glass element that actually refracts what is behind it.
 *
 * Lighting comes from a procedurally generated room environment rather than an
 * HDRI file, so the reflections are real but nothing is downloaded.
 *
 * Scroll opens the aperture and rolls the barrel over, which is the same idea
 * as the SVG version it replaces, with depth and real material response.
 */
const BRAND = 0x289d90;
const OPTIC = 0x55b0df;

const BLADES = 10;

export const lens: SceneFactory = (THREE, scene, camera, renderer) => {
  const root = new THREE.Group();
  scene.add(root);

  camera.position.set(0, 0, 7.2);

  // Procedural studio environment. Costs a little GPU once, no network at all.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environmentScene = new THREE.Scene();

  // A simple box of emissive panels stands in for a softbox rig.
  const panel = (
    w: number,
    h: number,
    d: number,
    color: number,
    intensity: number,
    x: number,
    y: number,
    z: number,
  ) => {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshBasicMaterial({ color }),
    );
    mesh.material.color.multiplyScalar(intensity);
    mesh.position.set(x, y, z);
    environmentScene.add(mesh);
  };

  panel(20, 20, 0.1, 0x0d1614, 1, 0, 0, -10);
  panel(12, 6, 0.1, 0xffffff, 3.2, -5, 4, 3);
  panel(9, 9, 0.1, 0xdff3ef, 1.5, 6, -1, 2);
  panel(14, 3, 0.1, OPTIC, 1.1, 0, -6, 1);

  const environment = pmrem.fromScene(environmentScene, 0.04).texture;
  scene.environment = environment;

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(4, 5, 6);
  scene.add(key);
  const fill = new THREE.DirectionalLight(OPTIC, 1.2);
  fill.position.set(-5, -3, 2);
  scene.add(fill);

  const barrelMaterial = new THREE.MeshStandardMaterial({
    color: 0x23282a,
    roughness: 0.34,
    metalness: 1,
    envMapIntensity: 1.1,
  });

  const darkMaterial = new THREE.MeshStandardMaterial({
    color: 0x0e1211,
    roughness: 0.55,
    metalness: 0.8,
  });

  // ---- Barrel ----
  const barrel = new THREE.Group();
  root.add(barrel);

  const body = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 1.5, 96, 1, true), barrelMaterial);
  body.rotation.x = Math.PI / 2;
  barrel.add(body);

  const shoulder = new THREE.Mesh(new THREE.CylinderGeometry(1.72, 1.5, 0.34, 96), barrelMaterial);
  shoulder.rotation.x = Math.PI / 2;
  shoulder.position.z = 0.75;
  barrel.add(shoulder);

  // Knurling: a ring of fine flutes, cheap to make and reads as machined metal.
  const knurl = new THREE.Group();
  const fluteGeometry = new THREE.BoxGeometry(0.045, 0.55, 0.045);
  for (let i = 0; i < 96; i += 1) {
    const angle = (i / 96) * Math.PI * 2;
    const flute = new THREE.Mesh(fluteGeometry, barrelMaterial);
    flute.position.set(Math.cos(angle) * 1.61, Math.sin(angle) * 1.61, -0.35);
    flute.rotation.z = angle;
    knurl.add(flute);
  }
  barrel.add(knurl);

  const rearRing = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.09, 16, 96), darkMaterial);
  rearRing.position.z = -0.78;
  barrel.add(rearRing);

  // ---- Glass ----
  const glass = new THREE.Mesh(
    new THREE.SphereGeometry(1.62, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.32),
    new THREE.MeshPhysicalMaterial({
      color: 0x8fe0d2,
      roughness: 0.03,
      metalness: 0,
      transmission: 0.92,
      thickness: 1.1,
      ior: 1.52,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
      envMapIntensity: 1.4,
      transparent: true,
    }),
  );
  glass.rotation.x = -Math.PI / 2;
  glass.position.z = 0.62;
  barrel.add(glass);

  // A tinted coating disc behind the glass gives the green flash.
  const coating = new THREE.Mesh(
    new THREE.CircleGeometry(1.44, 64),
    new THREE.MeshStandardMaterial({
      color: BRAND,
      roughness: 0.12,
      metalness: 0.9,
      emissive: BRAND,
      emissiveIntensity: 0.22,
    }),
  );
  coating.position.z = 0.2;
  barrel.add(coating);

  // ---- Aperture blades ----
  const bladeGroup = new THREE.Group();
  bladeGroup.position.z = 0.44;
  barrel.add(bladeGroup);

  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(0, 0);
  bladeShape.lineTo(1.6, 0.34);
  bladeShape.lineTo(1.6, -0.34);
  bladeShape.lineTo(0, -0.06);
  const bladeGeometry = new THREE.ExtrudeGeometry(bladeShape, {
    depth: 0.02,
    bevelEnabled: false,
  });
  const bladeMaterial = new THREE.MeshStandardMaterial({
    color: 0x161b1a,
    roughness: 0.4,
    metalness: 0.9,
    side: THREE.DoubleSide,
  });

  const blades: import("three").Group[] = [];
  for (let i = 0; i < BLADES; i += 1) {
    const pivot = new THREE.Group();
    pivot.rotation.z = (i / BLADES) * Math.PI * 2;
    const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
    blade.position.x = 1.5;
    pivot.add(blade);
    bladeGroup.add(pivot);
    blades.push(pivot);
  }

  // ---- Outer calibration ring ----
  const ticks = new THREE.Group();
  const tickGeometry = new THREE.BoxGeometry(0.02, 0.16, 0.02);
  const tickMaterial = new THREE.MeshBasicMaterial({ color: OPTIC, transparent: true, opacity: 0.5 });
  for (let i = 0; i < 72; i += 1) {
    const angle = (i / 72) * Math.PI * 2;
    const long = i % 6 === 0;
    const tick = new THREE.Mesh(tickGeometry, tickMaterial);
    tick.scale.y = long ? 1.8 : 1;
    tick.position.set(Math.cos(angle) * 2.15, Math.sin(angle) * 2.15, 0.4);
    tick.rotation.z = angle;
    ticks.add(tick);
  }
  root.add(ticks);

  return {
    update(progress, elapsed) {
      root.rotation.y = -0.5 + progress * 1.0 + Math.sin(elapsed * 0.15) * 0.04;
      root.rotation.x = 0.22 - progress * 0.42;
      root.position.y = 0.2 - progress * 0.4;
      camera.position.z = 7.6 - progress * 1.4;

      ticks.rotation.z = elapsed * 0.06;

      // Aperture opens as the section is scrolled through.
      const open = 0.28 + progress * 0.72;
      blades.forEach((pivot, index) => {
        pivot.rotation.z = (index / BLADES) * Math.PI * 2 + (1 - open) * 0.8;
        const blade = pivot.children[0] as import("three").Mesh;
        blade.position.x = 1.05 + open * 0.75;
      });

      coating.material.emissiveIntensity = 0.18 + Math.sin(elapsed * 0.9) * 0.06;
    },
    dispose() {
      root.traverse((object) => {
        const mesh = object as import("three").Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const material = mesh.material as import("three").Material | undefined;
        if (material && !Array.isArray(material)) material.dispose();
      });
      environment.dispose();
      pmrem.dispose();
      scene.environment = null;
      scene.remove(root);
    },
  };
};
