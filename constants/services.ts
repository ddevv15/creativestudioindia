/**
 * The three disciplines. `description` is the one-liner from spec 13, shown on
 * the homepage and the Services page. `includes` is our own draft of each
 * service's scope, awaiting the studio's confirmation (client question 6.1).
 */
export const SERVICES = [
  {
    number: "01",
    name: "Architecture",
    description: "Commercial, residential, and mixed-use design from concept to completion.",
    includes: [
      "Site analysis and feasibility",
      "Concept design and development",
      "Working drawings and documentation",
      "Local authority approvals",
      "Construction oversight",
    ],
  },
  {
    number: "02",
    name: "3D Visualization",
    description:
      "Photorealistic renders and walkthroughs that bring designs to life before they are built.",
    includes: [
      "Exterior renders",
      "Interior renders",
      "Day and night views",
      "Animated walkthroughs",
      "Virtual reality-ready files",
    ],
  },
  {
    number: "03",
    name: "CAD & Documentation",
    description:
      "Precise technical drawings and construction documentation for every project stage.",
    includes: [
      "AutoCAD floor plans",
      "Elevation and section drawings",
      "3D CAD modelling",
      "As-built documentation",
      "Coordination drawings",
    ],
  },
] as const;
