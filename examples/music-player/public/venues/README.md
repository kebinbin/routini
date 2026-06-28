# Venue images

Photos shown on venue pins (the Map page) and in the event page's venue popup.
Venues without a photo just show the map — nothing breaks.

**To add / replace one:**

1. Save a small landscape image here as `<venue-slug>.webp` (jpg/png also work —
   just match the path).
2. Point that venue's `photo` at it in the `VENUES` array in
   `scripts/gen-data.mjs` — each venue is
   `{ id, name, lat, lng, photo?, description? }`.
3. Re-run `node scripts/gen-data.mjs`.

Use **Creative Commons / properly licensed** images only — same policy as the
rest of the demo's assets (the music is all CC).

**Venue slugs:** `plaza-del-mercado-santurce`, `corredor-de-la-plena-loiza`,
`casa-aboy-miramar`, `nuyorican-cafe-viejo-san-juan`, `coliseo-de-puerto-rico`,
`la-respuesta-santurce`, `balneario-el-escambron`, `teatro-tapia`,
`surfin-aguadilla`, `hacienda-carabali-luquillo`, `museo-de-arte-de-pr`,
`conservatorio-de-musica`.

Current photos are from **Pexels** (free to use, no attribution required).
