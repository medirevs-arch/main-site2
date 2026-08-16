import type * as THREE from "three";

/** A label anchored to a point in the 3D scene and drawn as real HTML. */
export type SceneLabel = {
  id: string;
  text: string;
  /** Where the label sits in world space. Projected to screen every frame. */
  anchor: THREE.Vector3;
};

export type SceneHandle = {
  /**
   * Called once per frame.
   * @param progress 0 when the section enters the viewport, 1 when it leaves.
   * @param elapsed  seconds since the scene started, for ambient motion.
   */
  update: (progress: number, elapsed: number) => void;
  dispose: () => void;
  labels?: SceneLabel[];
};

export type SceneFactory = (
  three: typeof THREE,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
) => SceneHandle;
