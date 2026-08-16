import { ProductEcosystem } from "medirevs-v2";

/**
 * The products section: a hoverable index on the left, one live panel on the
 * right, driven entirely by PRODUCTS in src/lib/site.ts. It opens on the
 * first product (DoctoRevs) — switching panels is pointer/focus driven, so a
 * still can only show the resting state.
 */
export const Default = () => (
  <div className="shell py-12">
    <ProductEcosystem />
  </div>
);
