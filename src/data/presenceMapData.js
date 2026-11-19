export const PRESENCE_CAPABILITIES = [
  {
    id: 'API',
    label: 'API',
    fullName: 'Active Pharmaceutical Ingredients',
    colorKey: 'api',
    href: '/business/api',
  },
  {
    id: 'PFI',
    label: 'PFI',
    fullName: 'Pharmaceutical Formulation Intermediates',
    colorKey: 'pfi',
    href: '/business/pfi',
  },
  {
    id: 'FD',
    label: 'FD',
    fullName: 'Finished Dosages',
    colorKey: 'fd',
    href: '/business/fd',
  },
  {
    id: 'Peptide',
    label: 'PEPTIDE',
    fullName: 'Peptide CDMO',
    colorKey: 'peptide',
    href: '/business/peptides',
  },
];

export const PRESENCE_NETWORK_LOCATIONS = {
  manufacturing: [
    {
      id: 'virginia',
      label: 'VIRGINIA, USA',
      pin: { cx: 261, cy: 327, r: 7.5 },
      line: { x1: 261, y1: 327, x2: 245, y2: 252 },
      pill: { x: 175, y: 226, width: 140, height: 26, textX: 245, textY: 239.5, fontSize: 10 },
      anchor: { x: 245, y: 218 },
      units: [
        { name: 'Granules Pharmaceuticals, Inc.', capabilities: ['FD'] },
        { name: 'GPAK (Packaging & Distribution)', capabilities: ['FD'] },
      ],
    },
    {
      id: 'zurich',
      label: 'ZURICH, SWITZERLAND',
      pin: { cx: 498, cy: 315, r: 7 },
      line: { x1: 498, y1: 315, x2: 498, y2: 280 },
      pill: { x: 408, y: 254, width: 180, height: 26, textX: 498, textY: 267.5, fontSize: 10 },
      anchor: { x: 498, y: 246 },
      units: [
        { name: 'Senn Chemicals AG', capabilities: ['Peptide'] },
      ],
    },
    {
      id: 'hyderabad',
      label: 'HYDERABAD, INDIA',
      pin: { cx: 698, cy: 413, r: 6.5 },
      line: { x1: 698, y1: 413, x2: 650, y2: 442 },
      pill: { x: 580, y: 442, width: 140, height: 26, textX: 650, textY: 455.5, fontSize: 10 },
      anchor: { x: 698, y: 396 },
      units: [
        { name: 'Gagillapur', capabilities: ['PFI', 'FD'] },
        { name: 'Bonthapally (Unit I)', capabilities: ['API'] },
        { name: 'Bonthapally (Unit III)', capabilities: ['API'] },
        { name: 'Jeedimetla (Unit II)', capabilities: ['API', 'PFI'] },
        { name: 'Granules Life Sciences', capabilities: ['FD'] },
      ],
    },
    {
      id: 'visakhapatnam',
      label: 'VISAKHAPATNAM, INDIA',
      pin: { cx: 717, cy: 404, r: 6.5 },
      line: { x1: 717, y1: 404, x2: 748, y2: 375 },
      pill: { x: 748, y: 362, width: 176, height: 26, textX: 836, textY: 375.5, fontSize: 10 },
      anchor: { x: 836, y: 354 },
      units: [
        { name: 'Vizag (Unit-IV)', capabilities: ['API'] },
        { name: 'Vizag (Unit-V) (ONCO)', capabilities: ['API', 'FD'] },
      ],
    },
  ],
  rd: [
    {
      id: 'virginia',
      label: 'VIRGINIA, USA',
      pin: { cx: 261, cy: 327, r: 7.5 },
      line: { x1: 261, y1: 327, x2: 245, y2: 252 },
      pill: { x: 175, y: 226, width: 140, height: 26, textX: 245, textY: 239.5, fontSize: 10 },
      anchor: { x: 245, y: 218 },
      units: [
        { name: 'Virginia, USA', capabilities: ['FD'] },
      ],
    },
    {
      id: 'zurich',
      label: 'ZURICH, SWITZERLAND',
      pin: { cx: 498, cy: 315, r: 7 },
      line: { x1: 498, y1: 315, x2: 498, y2: 280 },
      pill: { x: 408, y: 254, width: 180, height: 26, textX: 498, textY: 267.5, fontSize: 10 },
      anchor: { x: 498, y: 246 },
      units: [
        { name: 'Senn Chemicals AG', capabilities: ['Peptide'] },
      ],
    },
    {
      id: 'hyderabad',
      label: 'HYDERABAD, INDIA',
      pin: { cx: 698, cy: 413, r: 6 },
      line: { x1: 698, y1: 413, x2: 740, y2: 375 },
      pill: { x: 740, y: 362, width: 150, height: 26, textX: 815, textY: 375.5, fontSize: 10 },
      anchor: { x: 698, y: 396 },
      units: [
        { name: 'Genome Valley', capabilities: ['API', 'FD'] },
        { name: 'Pragathi Nagar', capabilities: ['API', 'FD'] },
        { name: 'IIT Hyderabad', capabilities: ['Peptide'] },
      ],
    },
  ],
};
