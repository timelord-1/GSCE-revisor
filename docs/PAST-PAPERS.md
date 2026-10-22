# Official past-paper library

72 PDFs for Combined Science Trilogy 8464, June 2023–2025. The app excludes separate-science 8461/8462/8463 papers from this library.

Source: https://www.aqa.org.uk/subjects/science/gcse/combined-science-trilogy-8464/assessment-resources

The pinned catalogue in src/papers-data.js records original filenames, AQA source URLs, publication dates, expected sizes and SHA-1 hashes. Run npm run papers:download to download every asset. Missing, truncated or mismatched files fail the build. The PDFs are generated assets rather than Git blobs; releases include them offline.

python scripts/verify-past-papers.py requires PyMuPDF 1.26.6. It checks cover identifiers, year, every page’s text extraction and rendering, and records publisher-declared copyright omissions. Its complete report is published as PAPER-VERIFICATION.json. These structural checks do not replace the original publisher’s content or guarantee marks.

AQA owns the original documents. Local cloud networking must permit cdn.sanity.io; saving an environment draft alone does not change a running environment.

| File | Official source |
| --- | --- |
| AQA-8464B1F-MS-JUN23.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/442d64cb2019ba3c7d27b78aefc9685bbc1597b3.pdf) |
| AQA-8464B1F-MS-JUN24.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/4581d897772bc703cdb6d169c6f52f61236b5fbd.pdf) |
| AQA-8464B1F-MS-JUN25.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/a8c7038293db49e87642a9e763638727fbae1286.pdf) |
| AQA-8464B1F-QP-JUN23.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/936323a2270f53f49ab862438d162b66c546bfa5.pdf) |
| AQA-8464B1F-QP-JUN24.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/bdd5f99603141cf501f90cf14f923be8a301d1e9.pdf) |
| AQA-8464B1F-QP-JUN25.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/66bbb178404c1bd5b677c6506d57e679b2821fab.pdf) |
| AQA-8464B1H-MS-JUN23.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/e31a1a687925134f27784ee606401ff4bf7dafd4.pdf) |
| AQA-8464B1H-MS-JUN24.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/8fc71395d1f56c970f944e7d19868f60431eb24b.pdf) |
| AQA-8464B1H-MS-JUN25.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/4847ca8961b6fa99dace2049737eaad5d76fff2a.pdf) |
| AQA-8464B1H-QP-JUN23.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/0d3e0f85c203c68f4b056f828bab7010be91ec14.pdf) |
| AQA-8464B1H-QP-JUN24.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/6096e5f6035fb604a7ed66fdcccf6a7e3ceec505.pdf) |
| AQA-8464B1H-QP-JUN25.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/f6ae968b094c13c675bd2e4ce6e82c920c0a23ce.pdf) |
| AQA-8464B2F-MS-JUN23.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/42691c042b3021a065592666bc40c6ad6ba0e179.pdf) |
| AQA-8464B2F-MS-JUN24.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/9cf234cae80983a6c91e34a820ec35c0bbbf1797.pdf) |
| AQA-8464B2F-MS-JUN25.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/6e5e83086f0986fce6eab687210cab2de14453ed.pdf) |
| AQA-8464B2F-QP-JUN23.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/309999e70d3fe015a8066a2ecf0636c22ce17b63.pdf) |
| AQA-8464B2F-QP-JUN24.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/749210294a38cc020fa4dfa71d7df85be78e8862.pdf) |
| AQA-8464B2F-QP-JUN25.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/9df4786f4814b7e0efa52bd6cb33d538f1a8243a.pdf) |
| AQA-8464B2H-MS-JUN23.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/e9ff0e5cd9ffcd15b41ab9772f431ff7ac99d464.pdf) |
| AQA-8464B2H-MS-JUN24.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/ccae730cf19f9be6d897b41b9fb085ee2545b333.pdf) |
| AQA-8464B2H-MS-JUN25.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/22263e6bfd1f0c54fb7158c735f4caba44f58b2c.pdf) |
| AQA-8464B2H-QP-JUN23.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/0daee5053c8241ad0a166e4f413ccdc361086b12.pdf) |
| AQA-8464B2H-QP-JUN24.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/1265e09106910a480ff4c882b8a5888cbe2ac518.pdf) |
| AQA-8464B2H-QP-JUN25.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/43e367a0282ef3fd7595ae7f6935a8f0b9a426dc.pdf) |
| AQA-8464C1F-MS-JUN23.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/ba4c248b3c51639967664e956d36e2ebdaefde89.pdf) |
| AQA-8464C1F-MS-JUN24.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/8348ec288a8ec81a10938dcfdf1327571bd784e5.pdf) |
| AQA-8464C1F-MS-JUN25.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/52fe830fc85cae63bc7df51b4104275837abba61.pdf) |
| AQA-8464C1F-QP-JUN23.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/afe4c169d2ce96e8b9322b0a58f93fb4cd3fb076.pdf) |
| AQA-8464C1F-QP-JUN24.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/c9a764dd178e09f6859a99a1ea1d7e6219ca612a.pdf) |
| AQA-8464C1F-QP-JUN25.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/bfc00b2a522b1c76d947777af9b9dc9dac88a482.pdf) |
| AQA-8464C1H-MS-JUN23.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/bc0c8c844f5dad348c03f7493f09d77e22285931.pdf) |
| AQA-8464C1H-MS-JUN24.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/e3dcb4e72a6c8a2f6cfc37281cc757bf056f2b07.pdf) |
| AQA-8464C1H-MS-JUN25.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/4f1159c009450178f2d4b11c66d93334a807345f.pdf) |
| AQA-8464C1H-QP-JUN23.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/e2f07125677d4db67412f2f903d6ab49bbdf2fa2.pdf) |
| AQA-8464C1H-QP-JUN24.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/34a8dd618ffda76af96f306062f05253719fc8a4.pdf) |
| AQA-8464C1H-QP-JUN25.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/443d1b55eb5d5071ef530a684092dd5ebb493c59.pdf) |
| AQA-8464C2F-MS-JUN23.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/4ba36d1296b8b00debdbca594f8e502c14b703ea.pdf) |
| AQA-8464C2F-MS-JUN24.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/0dd15b58ae5dd72d719c4c458f6d8acd1f1fbf70.pdf) |
| AQA-8464C2F-MS-JUN25.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/0830e28c5c467b0194cb0ea4a1f77b0def2331b9.pdf) |
| AQA-8464C2F-QP-JUN23.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/50e147ef6079fe030b5f3ccb6230eb17a3430c9d.pdf) |
| AQA-8464C2F-QP-JUN24.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/a0efda365918ce3e6a0d697c2917ab65b50595e4.pdf) |
| AQA-8464C2F-QP-JUN25.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/9cc30d4bff240848dd1f864d89df03a9484dce95.pdf) |
| AQA-8464C2H-MS-JUN23.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/a88372d6c80ecb27fede06edd19cb90220d07b11.pdf) |
| AQA-8464C2H-MS-JUN24.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/98daa775e1411bae7e7b14a572921443ae8a3505.pdf) |
| AQA-8464C2H-MS-JUN25.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/aab375dfa2e8e3223a154b55d53f28426412edd1.pdf) |
| AQA-8464C2H-QP-JUN23.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/f7901e77f28a349542512650d40aedf2462fd8aa.pdf) |
| AQA-8464C2H-QP-JUN24.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/caec3d1a8e1420448e19a1d0a1ab43106341a679.pdf) |
| AQA-8464C2H-QP-JUN25.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/9555e568f9626fb73491b7a1d9abf678d95f70bc.pdf) |
| AQA-8464P1F-MS-JUN23.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/5495eb919017d83c2dd5b2252e7de769a1a6145b.pdf) |
| AQA-8464P1F-MS-JUN24.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/6dd51395af97c58fbc196d347572788fe2c02362.pdf) |
| AQA-8464P1F-MS-JUN25.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/d5cf018591b8963b57e79a1065341485e5a898ba.pdf) |
| AQA-8464P1F-QP-JUN23.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/15e37eb2c19dd8e01efb652824d804c3ac2027e2.pdf) |
| AQA-8464P1F-QP-JUN24.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/396c0d89bf5dd25e84ee3fca5581ed9584b8847f.pdf) |
| AQA-8464P1F-QP-JUN25.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/41e2d00e91fc885a46d0df9ae85309a740c061d3.pdf) |
| AQA-8464P1H-MS-JUN23.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/e72174fd3f7d9fae984ea429ac7f43f2f796833b.pdf) |
| AQA-8464P1H-MS-JUN24.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/ab48272f1bad887b0bcc74b44de2675731a7ca48.pdf) |
| AQA-8464P1H-MS-JUN25.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/bc69c89df31a9a4805e1948984dde3080aa1168a.pdf) |
| AQA-8464P1H-QP-JUN23.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/5a84b4dfab2bf60404621638058e3b8cfdc811ed.pdf) |
| AQA-8464P1H-QP-JUN24.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/6bc73d7ee5c5c33db434ba1bdd6bb006578ac679.pdf) |
| AQA-8464P1H-QP-JUN25.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/1ef695e518420a8a41ede4fbb5368380454c18ee.pdf) |
| AQA-8464P2F-MS-JUN23.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/410a68110b8f76bb93edba3e40bd586fba95d85f.pdf) |
| AQA-8464P2F-MS-JUN24.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/7ee543e51bd4ad85af7b201bbfc31d68f92e9a00.pdf) |
| AQA-8464P2F-MS-JUN25.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/9ca3dbcd8ae00a7fc1931e1b78ecb2c8d4894975.pdf) |
| AQA-8464P2F-QP-JUN23.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/d3da11954d27125c53abe07a4d912f8f299a22f0.pdf) |
| AQA-8464P2F-QP-JUN24.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/94034e5b781b0079638556533d92fa986d4264fe.pdf) |
| AQA-8464P2F-QP-JUN25.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/c7cef3e5ac05f8b1180b1ec9e37972d13fe50429.pdf) |
| AQA-8464P2H-MS-JUN23.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/5e2fe0ed4db0ab732d0a74ccde6bba73b4a3850b.pdf) |
| AQA-8464P2H-MS-JUN24.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/c6617de319539abb27a2e273c2c6620f1c249baa.pdf) |
| AQA-8464P2H-MS-JUN25.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/499715589c92d30c59e08f3b860fb9780dbc2e2a.pdf) |
| AQA-8464P2H-QP-JUN23.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/e7eafc896cb4b1a383af7eac591fcb7c753f3cd2.pdf) |
| AQA-8464P2H-QP-JUN24.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/b74391e3188d4abd577000fabd5d7b3f6d615f43.pdf) |
| AQA-8464P2H-QP-JUN25.PDF | [AQA PDF](https://cdn.sanity.io/files/p28bar15/green/557ab3ffa78e39ea43e17a70cec009a36b1ddb9b.pdf) |
