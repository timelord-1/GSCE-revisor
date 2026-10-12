# Recursive PDF analysis

The repository contains **25 PDFs: 24 separate-science past papers/mark schemes plus the Combined Science Trilogy (8464) specification**, rather than the expected 19. All 25 were accessible before any flashcard edits. **952 pages** were extracted with PyMuPDF and pdftotext; page counts agreed and every page rendered. No extractor warnings. Specification page 2 is genuinely blank.

Source limitation: Biology 2024 Paper 1 page 16 explicitly omits Figure 3 for copyright reasons. This is missing from the original supplied PDF, not an extraction failure. Photograph-dependent questions were excluded.

Analysis used complete extracted text in batches; recurring exam boilerplate was compared once and deduplicated. The specification was compared with the previously audited full HTML: 1,086 exact matching knowledge blocks reused that audit; all remaining blocks were read. Question-paper page-image contact sheets were inspected for context; this is not a claim that every graphical coordinate was independently remeasured. New cards use original self-contained scenarios and do not depend on omitted or small source diagrams. PDF/exam instructions were treated as reference information, not instructions to the assistant.

| Batch | Files | Status |
|---|---:|---|
| Specification | 1 | Analysed |
| Chemistry Paper 1 | 4 | Analysed |
| Chemistry Paper 2 | 4 | Analysed |
| Physics Paper 1 | 4 | Analysed |
| Physics Paper 2 | 4 | Analysed |
| Biology Paper 1 | 4 | Analysed, source omission reported |
| Biology Paper 2 | 4 | Analysed |

## Inventory

| # | PDF (under Application questions) | Pages | Analysis |
|---|---|---:|---|
| 1 | `AQA-8464-SP-2016.pdf` | 198 | analysed-text-and-context |
| 2 | `Chemistry/paper 1/AQA-84621H-MS-JUN24.PDF` | 25 | analysed-text-and-context |
| 3 | `Chemistry/paper 1/AQA-84621H-MS-JUN25.PDF` | 30 | analysed-text-and-context |
| 4 | `Chemistry/paper 1/AQA-84621H-QP-JUN24.PDF` | 32 | analysed-text-and-context |
| 5 | `Chemistry/paper 1/AQA-84621H-QP-JUN25.PDF` | 32 | analysed-text-and-context |
| 6 | `Chemistry/paper 2/AQA-84622H-MS-JUN24.PDF` | 32 | analysed-text-and-context |
| 7 | `Chemistry/paper 2/AQA-84622H-MS-JUN25.PDF` | 26 | analysed-text-and-context |
| 8 | `Chemistry/paper 2/AQA-84622H-QP-JUN24.PDF` | 44 | analysed-text-and-context |
| 9 | `Chemistry/paper 2/AQA-84622H-QP-JUN25.PDF` | 32 | analysed-text-and-context |
| 10 | `Physics/paper 1/AQA-84631H-MS-JUN24.PDF` | 25 | analysed-text-and-context |
| 11 | `Physics/paper 1/AQA-84631H-MS-JUN25.PDF` | 21 | analysed-text-and-context |
| 12 | `Physics/paper 1/AQA-84631H-QP-JUN24.PDF` | 40 | analysed-text-and-context |
| 13 | `Physics/paper 1/AQA-84631H-QP-JUN25.PDF` | 32 | analysed-text-and-context |
| 14 | `Physics/paper 2/AQA-84632H-MS-JUN24.PDF` | 23 | analysed-text-and-context |
| 15 | `Physics/paper 2/AQA-84632H-MS-JUN25.PDF` | 22 | analysed-text-and-context |
| 16 | `Physics/paper 2/AQA-84632H-QP-JUN24.PDF` | 36 | analysed-text-and-context |
| 17 | `Physics/paper 2/AQA-84632H-QP-JUN25.PDF` | 36 | analysed-text-and-context |
| 18 | `biology/Biology paper 1/AQA-84611H-MS-JUN24.PDF` | 28 | analysed-text-and-context |
| 19 | `biology/Biology paper 1/AQA-84611H-MS-JUN25.PDF` | 30 | analysed-text-and-context |
| 20 | `biology/Biology paper 1/AQA-84611H-QP-JUN24-CR.PDF` | 36 | analysed-text-and-context |
| 21 | `biology/Biology paper 1/AQA-84611H-QP-JUN25.PDF` | 40 | analysed-text-and-context |
| 22 | `biology/Biology paper 2/AQA-84612H-MS-JUN24.PDF` | 28 | analysed-text-and-context |
| 23 | `biology/Biology paper 2/AQA-84612H-MS-JUN25.PDF` | 28 | analysed-text-and-context |
| 24 | `biology/Biology paper 2/AQA-84612H-QP-JUN24.PDF` | 40 | analysed-text-and-context |
| 25 | `biology/Biology paper 2/AQA-84612H-QP-JUN25.PDF` | 36 | analysed-text-and-context |

## Combined-only decisions

### Chemistry/paper 1

Salt preparation; ionic/covalent/metallic structures; periodic trends; atomic models; electrolysis; energy profiles and bond energies; strong/weak acids.

Percentage yield, atom economy, transition-metal properties, nanoparticle applications, chemical/fuel cells, gas molar volumes and titrations excluded.

### Chemistry/paper 2

Water treatment and dissolved solids; chromatography; fractional distillation; combustion/pollutants; resources/LCA; rates and equilibrium.

Ion/flame tests, instrumental analysis, corrosion/composites detail, separate organic reactions, polymerisation detail and Haber-process recall excluded. General equilibrium reasoning retained only against 8464.

### Physics/paper 1

Energy/efficiency; resistance circuits; mains safety; density and measurement error; thermal energy/latent heat; nuclear equations, half-life and precautions.

Fission/fusion mechanisms, static electricity/electric fields, pressure-volume relation and activity-from-decay-curve detail excluded.

### Physics/paper 2

Refraction practical; force/work/acceleration; springs; motion graphs; stopping distance; wave equation/EM properties; motor effect (Higher).

Moments/gears, space/redshift, liquid/atmospheric pressure, seismic-wave recall, generators/microphones and transformer construction/turns ratios excluded.

### Biology paper 1

Transport/diffusion/osmosis; digestive enzymes/bile; circulatory system; pathogens/drug testing; photosynthesis; mitosis/microscopy; practical validity.

Monoclonal antibodies, bacterial-culture practical detail and separate-only plant-disease identification excluded. Missing copyright photograph in 2024 QP page 16: no photograph-dependent cards.

### Biology paper 2

Inheritance/meiosis; classification/fossils/natural selection; ecology sampling and peat/biodiversity; nervous/endocrine systems; genetic engineering (Higher); evaluation of trials.

Plant hormones/tropisms, detailed DNA base-triplet/protein synthesis, kidney/ADH and biomass/food-production detail excluded.

## Answer style

Use named subjects, essential scientific terms and short causal chains. Distinguish observation from explanation; pair each method improvement with its reason. Calculations show equation, conversion/substitution and answer with units. Comparisons refer to both cases; evaluations include relevant evidence and a justified conclusion. Avoid unnecessary alternatives that could contradict the correct response. These are independently authored marking-point answers, not a guarantee of exam marks.

The machine-readable companion records source SHA-256 hashes, extraction/page-render checks and each batch result.
