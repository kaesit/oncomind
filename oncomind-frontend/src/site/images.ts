/* Free-licence Unsplash imagery only (no Unsplash+ / paid stock). */

const BASE = "https://images.unsplash.com/";

export const photo = (id: string, w = 1600) => `${BASE}${id}?auto=format&fit=crop&w=${w}&q=80`;
export const photoSrcSet = (id: string) => [1200, 1800, 2400, 3200].map((w) => `${photo(id, w)} ${w}w`).join(", ");

export const IMG = {
     lightWave: "photo-1701926948435-9e964c90df3c", // multicoloured light wave on black
     fluidSwirl: "photo-1636690581110-a512fed05fd3", // vivid violet/red fluid swirl
     iridescent: "photo-1636690598773-c50645a47aeb", // iridescent liquid metal
     microscopeSilhouette: "photo-1630959305606-3123a081dada", // researcher at a microscope, violet
     cellsFluorescent: "photo-1576086639808-ddfd21aa668c", // fluorescent cells, multicolour
     cellsGreen: "photo-1576086476234-1103be98f096", // fluorescent cytoskeleton, green/blue
     nucleiPurple: "photo-1576086213369-97a306d36557", // purple/blue nuclei
     cellsPink: "photo-1631049130508-62b282ea5262", // pink cells, cyan nuclei
     cellPurple: "photo-1707079917481-b0d32393008b", // single purple cell on black
     dandelionsSunset: "photo-1735931802155-399f547ca5c1", // dandelions blowing at sunset
     dandelionSun: "photo-1653481016154-28931ef0c34f", // sun behind a dandelion
     wildflowersSunset: "photo-1707560664078-a88a7d07892d", // sunset over wildflowers
};
