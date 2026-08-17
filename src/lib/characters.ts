export type Character = {
  id: string;
  name: string;
  series: string;
  quote: string;
  swatch: string;
  accent: string;
  skin: string;
};

export const ROSTER: Character[] = [
  { id: "mario", name: "Mario", series: "Super Mario", quote: "It's-a me, Mario!", swatch: "#E52521", accent: "#2A5CAA", skin: "#E39B6B" },
  { id: "luigi", name: "Luigi", series: "Super Mario", quote: "Let's-a go!", swatch: "#43B047", accent: "#1E6B32", skin: "#E8B48A" },
  { id: "peach", name: "Peach", series: "Super Mario", quote: "Dear Mario…", swatch: "#F4A4C4", accent: "#F7D35E", skin: "#F0C4A0" },
  { id: "bowser", name: "Bowser", series: "Super Mario", quote: "Gwa ha ha!", swatch: "#E8A030", accent: "#C41E1E", skin: "#E8A030" },
  { id: "toad", name: "Toad", series: "Super Mario", quote: "I'm sorry!", swatch: "#F4F4F4", accent: "#E52521", skin: "#F5D5B8" },
  { id: "wario", name: "Wario", series: "WarioWare", quote: "Wario time!", swatch: "#F5D000", accent: "#6B2CA0", skin: "#E8B070" },
  { id: "dk", name: "D. Kong", series: "Donkey Kong", quote: "OK!", swatch: "#6B3A1F", accent: "#E52521", skin: "#8B4A28" },
  { id: "link", name: "Link", series: "The Legend of Zelda", quote: "Hiyah!", swatch: "#2E8B3A", accent: "#C4A035", skin: "#E8B898" },
  { id: "zelda", name: "Zelda", series: "The Legend of Zelda", quote: "Hero of Time…", swatch: "#F4D56A", accent: "#7BC4C8", skin: "#F0C8A8" },
  { id: "ganondorf", name: "Ganon", series: "The Legend of Zelda", quote: "Useless!", swatch: "#5A2A10", accent: "#E8C84A", skin: "#C48A58" },
  { id: "samus", name: "Samus", series: "Metroid", quote: "…", swatch: "#E87820", accent: "#3ECF6A", skin: "#E87820" },
  { id: "yoshi", name: "Yoshi", series: "Yoshi's Island", quote: "Yoshi!", swatch: "#7CCB4A", accent: "#E52521", skin: "#7CCB4A" },
  { id: "kirby", name: "Kirby", series: "Kirby", quote: "Poyo!", swatch: "#FFB6C8", accent: "#E52521", skin: "#FFB6C8" },
  { id: "fox", name: "Fox", series: "Star Fox", quote: "Let's do this!", swatch: "#E87830", accent: "#4A5560", skin: "#E87830" },
  { id: "pikachu", name: "Pikachu", series: "Pokémon", quote: "Pika pika!", swatch: "#F7D133", accent: "#E52521", skin: "#F7D133" },
  { id: "jigglypuff", name: "Jigglypuff", series: "Pokémon", quote: "Jiggly~", swatch: "#FFC0D4", accent: "#E080A0", skin: "#FFC0D4" },
  { id: "falcon", name: "Falcon", series: "F-Zero", quote: "Show me your moves!", swatch: "#1E4A9C", accent: "#F5C400", skin: "#E8B898" },
  { id: "ness", name: "Ness", series: "EarthBound", quote: "OK!", swatch: "#E52521", accent: "#F6D44A", skin: "#F0C4A0" },
  { id: "pikmin", name: "Pikmin", series: "Pikmin", quote: "…!", swatch: "#E52521", accent: "#5CB85C", skin: "#E52521" },
];

export function getCharacter(id: string): Character {
  return ROSTER.find((c) => c.id === id) ?? ROSTER[0]!;
}
