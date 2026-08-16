import { MedirevsMark } from "medirevs-v2";

/**
 * The "m" mark, drawn as vector geometry so it stays crisp at the 18px it
 * sits at inside the navigation pill. The teal-to-blue gradient is the
 * brand's own.
 */
export const Sizes = () => (
  <div className="flex items-end gap-10">
    <MedirevsMark size={18} title="Medirevs" />
    <MedirevsMark size={32} title="Medirevs" />
    <MedirevsMark size={64} title="Medirevs" />
    <MedirevsMark size={112} title="Medirevs" />
  </div>
);

/** How it actually appears: inside a pill, next to the wordmark. */
export const InPill = () => (
  <div className="flex flex-wrap items-center gap-6">
    <span className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-2.5">
      <MedirevsMark size={18} />
      <span className="text-[0.9375rem] font-medium text-ink">Medirevs</span>
    </span>
    <span className="glass-dark inline-flex items-center gap-2.5 rounded-full bg-lab px-4 py-2.5">
      <MedirevsMark size={18} />
      <span className="text-[0.9375rem] font-medium text-white">Medirevs</span>
    </span>
  </div>
);

/** The gradient is self-contained, so it holds on any surface. */
export const OnSurfaces = () => (
  <div className="flex items-center gap-px">
    <div className="flex-1 bg-page p-10">
      <MedirevsMark size={48} />
    </div>
    <div className="flex-1 bg-paper p-10">
      <MedirevsMark size={48} />
    </div>
    <div className="flex-1 bg-lab p-10">
      <MedirevsMark size={48} />
    </div>
    <div className="flex-1 bg-navy p-10">
      <MedirevsMark size={48} />
    </div>
  </div>
);
