/**
 * Scene registry. Everything here is loaded through one dynamic import in
 * Scene3D, so none of it reaches a browser that is not going to render it.
 */
export { network } from "./network";
export { lens } from "./lens";
export { opticalStack } from "./opticalStack";
