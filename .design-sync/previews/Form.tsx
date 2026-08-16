import { Form } from "medirevs-v2";

/**
 * The contact form, ported from src/app/contact/page.tsx — the canonical
 * composition. `half: true` puts two fields on one row above `sm`.
 */
export const Contact = () => (
  <div className="max-w-2xl">
    <Form
      source="contact"
      submitLabel="Send message"
      successTitle="Message sent."
      successBody="Thanks. We will get back to you shortly."
      fields={[
        { name: "name", label: "Full name", required: true, half: true, autoComplete: "name" },
        { name: "email", label: "Email", type: "email", required: true, half: true, autoComplete: "email" },
        { name: "organisation", label: "Facility or organisation", half: true },
        { name: "role", label: "Your role", half: true },
        {
          name: "product",
          label: "What is this about?",
          type: "select",
          half: true,
          options: [
            "DoctoRevs",
            "Medirevs EHR",
            "Data Solutions & AI",
            "Medirevs Labs",
            "Press",
            "Something else",
          ],
        },
        { name: "message", label: "Message", type: "textarea", required: true },
      ]}
    />
  </div>
);

/** A short capture form — the shape the demo and waitlist pages use. */
export const Demo = () => (
  <div className="max-w-2xl">
    <Form
      source="demo"
      submitLabel="Request a demo"
      successTitle="Request received."
      successBody="We will be in touch to arrange a walkthrough."
      fields={[
        { name: "name", label: "Full name", required: true, half: true, autoComplete: "name" },
        { name: "email", label: "Work email", type: "email", required: true, half: true, autoComplete: "email" },
        { name: "facility", label: "Facility", half: true },
        { name: "phone", label: "Phone", type: "tel", half: true, autoComplete: "tel" },
      ]}
    />
  </div>
);

/** `dark` inverts the field chrome for placement on a lab or navy band. */
export const OnDark = () => (
  <div className="bg-lab p-12">
    <div className="max-w-2xl">
      <Form
        dark
        source="beta"
        submitLabel="Join the beta"
        successTitle="You are on the list."
        successBody="We will email you when the next round of invitations goes out."
        fields={[
          { name: "name", label: "Full name", required: true, half: true, autoComplete: "name" },
          { name: "email", label: "Email", type: "email", required: true, half: true, autoComplete: "email" },
          { name: "note", label: "What would you use it for?", type: "textarea" },
        ]}
      />
    </div>
  </div>
);
