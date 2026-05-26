// Madtape — streaming + funding data layer
// Adds funding state and fictional users on top of the existing FILMS array.

const ACCENTS = ["#e50914","#46d369","#f5c518","#5851db","#ff7e5f","#00b8d9","#9b51e0","#f25c54"];

// extend each film with funding info
const FILMS_X = window.FILMS.map((f, i) => {
  const goal = [180000, 90000, 540000, 60000, 240000, 30000, 380000, 720000, 18000, 110000, 290000, 420000, 45000, 610000, 95000, 280000][i] || 200000;
  const raisedPct = [0.78, 1.0, 0.46, 1.0, 0.92, 1.0, 0.34, 0.21, 1.0, 0.67, 0.55, 0.72, 1.0, 0.88, 0.41, 0.29][i];
  return {
    ...f,
    goal,
    raised: Math.round(goal * raisedPct),
    backers: [840, 320, 2140, 410, 1280, 180, 1620, 3200, 90, 740, 1180, 1900, 220, 2680, 530, 1340][i] || 500,
    daysLeft: [12, 0, 28, 0, 9, 0, 41, 47, 0, 17, 24, 14, 0, 6, 32, 38][i] || 14,
    funded: raisedPct >= 1,
    director: ["Adaeze Iroh","R. Søderberg","Mira Vatanen","T. Halloran-West","Sun-young Park","ANON-04","Eli Vasquez","Karim el-Bayoumi","Studio Aoki","M. & K. Lindqvist","Wren Okafor","Giulia Marchetti","SIGNAL/01","Iona MacKenzie","Beatrice Yu","Cassia Ohara"][i] || "Anonymous",
    status: raisedPct >= 1 ? "FULLY FUNDED · IN POST" : raisedPct > 0.7 ? "FUNDING · CLOSING SOON" : "FUNDING · OPEN",
  };
});
window.FILMS_X = FILMS_X;

// Rails grouping
window.RAILS = [
  { title: "Madtape Originals", filmIds: ["longwave","kestrel-protocol","vesper-arc","sundown-arithmetic","north-of-rain","argon-sleep"] },
  { title: "Funding Now · Back a Film", filmIds: ["kestrel-protocol","longwave","hyperion-fragments","sundown-arithmetic","vesper-arc","fieldwork","argon-sleep","telegraph-hill","halogen-summer"] },
  { title: "Trending in Synthetic Cinema", filmIds: ["longwave","halogen-summer","kestrel-protocol","north-of-rain","cellar-door","fieldwork","rind","sundown-arithmetic"] },
  { title: "Shorts & Experimental", filmIds: ["still-life-with-static","marble-eye","the-letter-c","the-quiet-format","rind","telegraph-hill"] },
  { title: "Because you watched 'Longwave'", filmIds: ["north-of-rain","argon-sleep","sundown-arithmetic","hyperion-fragments","cellar-door","kestrel-protocol"] },
];

// fake live backer events (cycled)
window.LIVE_EVENTS = [
  { name: "carlos.m", city: "Mexico City", amt: 25 },
  { name: "delphine87", city: "Lyon", amt: 100 },
  { name: "anonymous", city: "—", amt: 5 },
  { name: "wong_a", city: "Taipei", amt: 250 },
  { name: "j.holm", city: "Oslo", amt: 50 },
  { name: "ravi.s", city: "Bangalore", amt: 75 },
  { name: "patreon_bot", city: "—", amt: 10 },
  { name: "k.tanaka", city: "Osaka", amt: 500 },
];

// recent backers shown statically
window.BACKERS = [
  { name: "Mara K.",   amt: 250, time: "2m ago", color: "#46d369" },
  { name: "ali_88",    amt: 50,  time: "8m ago", color: "#5851db" },
  { name: "Anonymous", amt: 1000,time: "21m ago", color: "#e50914" },
  { name: "j.holm",    amt: 25,  time: "34m ago", color: "#f5c518" },
  { name: "wong_a",    amt: 100, time: "1h ago",  color: "#00b8d9" },
];
