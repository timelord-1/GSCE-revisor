# AQA Trilogy specification audit

The 617-card deck was reviewed against the complete specification embedded in the user-provided saved AQA webpage, `GCSE Science 8464 _ Specification _ AQA.html`, on **12 October 2026**. The visible page shows the introduction, but the saved embedded data includes the subject-content and practical-assessment sections. It was parsed as data; no uploaded scripts were executed.

Official source: [AQA GCSE Combined Science: Trilogy (8464)](https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification).

The source file's SHA-256, 225 subject-content section references, section titles, 74 Higher-only cards and mappings for all 21 practical activities are recorded in [SPECIFICATION-MAP.md](SPECIFICATION-MAP.md). Every card cites at least one precise subject-content reference. Practical cards also cite their numbered activity in section 10.2.

This audit supersedes the earlier note that official-specification verification was blocked. It establishes alignment with the supplied official-page snapshot; it does not establish that an unseen later revision has been checked. The full copyrighted AQA text and the uploaded webpage are not redistributed in this repository.

## Paper organisation

| Subject | Paper 1 | Paper 2 |
|---|---|---|
| Biology | 4.1–4.4: Cell biology; Organisation; Infection and response; Bioenergetics | 4.5–4.7: Homeostasis and response; Inheritance, variation and evolution; Ecology |
| Chemistry | 5.1–5.5: Atomic structure and periodic table; Bonding; Quantitative chemistry; Chemical changes; Energy changes | 5.6–5.10: Rate and extent; Organic chemistry; Chemical analysis; Atmosphere; Resources |
| Physics | 6.1–6.4: Energy; Electricity; Particle model; Atomic structure | 6.5–6.7: Forces; Waves; Magnetism and electromagnetism |

Cards follow the main teaching-topic split in section 2.2. Questions can also draw on fundamental underlying concepts, mathematical skills and practical knowledge; topic boundaries are not absolute limits on an exam question. In particular, Chemistry Paper 2 may draw on sections 5.1–5.3.

## Corrections made in this audit

| Content | Result | AQA reference |
|---|---|---|
| Generic endocrine negative feedback | Higher-only | 4.5.3.2, 4.5.3.6 |
| FSH stimulating oestrogen | Moved out of the Foundation definition into Higher hormone interactions | 4.5.3.3 |
| Simple solid-sphere particle-model limitations | Higher-only; other bonding-diagram limitations remain both-tier | 5.2.2.1 versus 5.2.1.3–5.2.1.4 |
| Writing the neutralisation ionic equation | Higher-only; Foundation ion-based explanation retained | 5.1.1.1, 5.4.2.4 |
| Electron gain/loss at electrolysis electrodes | Split from the Foundation ion-movement card into Higher oxidation/reduction cards | 5.4.3.1, 5.4.3.5 |
| Reaction-rate units in mol/s | Separate Higher card; g/s and cm³/s retained for Foundation | 5.6.1.1 |
| Circular-motion velocity explanation | Separate Higher card; ordinary velocity definition retained for Foundation | 6.5.4.1.3 |
| Area under velocity–time graphs | Separate Higher card; gradients and constant velocity retained for Foundation | 6.5.4.1.5 |
| Refraction explanation using speed and wave fronts | Higher-only; ray-diagram construction retained for both tiers | 6.6.2.2 |
| Gamma-ray origin in the nucleus | Both tiers; only the electrical-circuit radio mechanism is Higher-only | 6.6.2.3 |
| Transformer equation | Added **VₚIₚ = VₛIₛ**, Higher-only, as explicitly stated in the supplied page | 6.2.4.3 |
| Transformer turns-ratio/induction theory | Excluded; not added from separate Physics | No corresponding Trilogy content requirement |
| Split-ring commutator detail | Removed; motor card explains opposite forces and coil rotation | 6.7.2.3 |
| Gamma sterilisation as a recalled application | Removed from EM-use card; medical imaging/treatment retained | 6.6.2.4 |
| Microscopy activity | Plant and animal cells, with labelled drawings and a magnification scale | 4.1.1.2, 10.2.1 |
| Amylase activity | Explicit 30-second sampling and controlled water-bath temperature | 4.2.2.1, 10.2.4 |
| Soluble-salt activity | Oxide/carbonate, heating dilute acid, controlled evaporation, filtration and drying | 5.4.2.3, 10.2.8 |
| Resistance activity | Added combinations in series and parallel as well as wire length | 6.2.1.3, 10.2.15 |

## Added coverage

The audit added 117 cards while preserving all 500 existing IDs for saved-progress compatibility. Additions include cell scale and exchange surfaces; lung structure and gas exchange; valve faults; cancer; meristems; practical precision; inheritance and polygenic traits; consumer levels; the first 20 element symbols; Group 1/7 reactions; ionic charges, state symbols and silica; reaction profiles; combustion equations; fossil-fuel/carbonate formation; comparative resource use; LCA; circuit-sensor applications; transformer power balance; heating curves; radiation range and data interpretation; motion-graph area, braking calculations and electromagnetic applications.

Original SVGs include 14 circuit-symbol cards, a Punnett-square completion card and a reaction-profile interpretation card. Diagrams supplement the deck; they do not replace drawing practice.

## Scope limits and validation

No separate-science space physics, monoclonal antibodies, detailed eye/brain topics, plant hormones, transition-metal or nanoparticle properties, titrations, percentage yield/atom economy, fuel cells, separate organic reactions, Haber-process production, food production, nuclear fission/fusion, moments, pressure equations, generators or transformer turns-ratio equations are taught. Polymer structure and alkene feedstock uses are included; detailed polymerisation chemistry is not.

Foundation cards exclude the identified Higher-only clauses. Higher includes Foundation material. Completing/interpreting a supplied Punnett square is both-tier; constructing a new genetic cross is Higher-only, as annotated in 4.6.1.4.

Automated checks verify that all cards have valid references, all 225 subject sections and all 21 practicals have mapped cards, wholly Higher sections contain no Foundation cards, selected mixed-section boundaries remain correct, exclusions are maintained and previous card IDs survive. They support the manual scientific review; they do not independently prove every answer or award marks. Answers are original concise revision points, not official AQA mark schemes, and require relevant selection, units and working for the actual question.

## Version 1.1.0 reference review

All 25 PDFs in `Application questions` were accessible before flashcard edits: 952 pages, two agreeing text extractors and rendered page images. The full recursive inventory, seven batch results, SHA-256 hashes and Combined-only exclusions are recorded in [PDF-ANALYSIS.md](PDF-ANALYSIS.md). Biology 2024 Paper 1 omits a copyright photograph in its original page 16; no photograph-dependent cards were added.

24 original application scenarios bring the deck to 641 cards. Together with 19 existing scenario/calculation/diagram cards they form 43 application cards, hidden until enabled in Settings. Custom decks collect built-in AQA cards; they do not introduce unverified course content. All previous card IDs, topic/paper boundaries and 225-section mapping remain intact.
