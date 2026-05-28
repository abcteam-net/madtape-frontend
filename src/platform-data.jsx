import React from 'react';
// Madtape AI — platform data layer

export const CREATORS = [
  { id:"kira-motion", handle:"@kira.motion", name:"Kira Hoffmann", location:"Berlin", bio:"Sci-fi cinematographer, latent space explorer. Making short AI films since 2024.", category:"Sci-Fi", tools:["Seedance","Kling","Veo"], views:148200, likes:18400, films:24, wins:3, badges:["Challenge Winner","Staff Pick","Top 10 Weekly","Early Creator"], color:"#2C3E6B", plan:"creator" },
  { id:"nadeem-ai", handle:"@nadeem.ai", name:"Nadeem Youssef", location:"Cairo", bio:"Horror and atmosphere. Interested in what happens at the edge of the frame.", category:"Horror", tools:["Runway","Hailuo"], views:82100, likes:9600, films:17, wins:1, badges:["Early Creator","Storyteller"], color:"#1A2A1A", plan:"starter" },
  { id:"sun-young", handle:"@sun_young", name:"Sun-young Park", location:"Seoul", bio:"Fashion x AI film. The camera is the model, the prompt is the stylist.", category:"Fashion", tools:["Seedance","Pika"], views:231400, likes:31200, films:38, wins:5, badges:["Challenge Winner","Staff Pick","Top 10 Weekly","Seedance Creator","Visual Director"], color:"#C8956C", plan:"pro" },
  { id:"r-soderberg", handle:"@r.soderberg", name:"Rasmus Söderberg", location:"Stockholm", bio:"Documentary texture in generated worlds. Slow, deliberate, exact.", category:"Documentary", tools:["Veo","Kling"], views:57300, likes:6200, films:12, wins:0, badges:["Early Creator"], color:"#3D5A6D", plan:"starter" },
  { id:"wren-frames", handle:"@wren.frames", name:"Wren Okafor", location:"Lagos", bio:"Experimental. Loop-based, structure-first. The output is the score.", category:"Experimental", tools:["Runway","Pika","Luma"], views:34800, likes:4700, films:21, wins:2, badges:["Staff Pick","Storyteller"], color:"#4A3A6B", plan:"creator" },
  { id:"mira-vat", handle:"@mira.vat", name:"Mira Vatanen", location:"Helsinki", bio:"Drama in 15 seconds. Less dialogue than cinema; more truth.", category:"Drama", tools:["Seedance","Veo"], views:98400, likes:12100, films:19, wins:1, badges:["Staff Pick","Early Creator"], color:"#2B4A5B", plan:"creator" },
  { id:"eli-vasquez", handle:"@eli.vasquez", name:"Eli Vasquez", location:"Mexico City", bio:"Western and action. Big skies, slow cuts, actual stakes.", category:"Action", tools:["Seedance","Kling"], views:186200, likes:22700, films:31, wins:4, badges:["Challenge Winner","Top 10 Weekly","Early Creator"], color:"#5B3A2B", plan:"pro" },
  { id:"beatrice-yu", handle:"@beatrice.yu", name:"Beatrice Yu", location:"Taipei", bio:"Surreal animation on the edge of believable. Soft physics.", category:"Animation", tools:["Pika","Luma","Runway"], views:113400, likes:15800, films:27, wins:2, badges:["Staff Pick","Seedance Creator"], color:"#6B2B4A", plan:"creator" },
];

// Rootsapians panel images — 1:1 mapped to each video
const PANELS = [
  "uploads/panel 1-b5d859a2.png",   // OMEGA sign + soldier
  "uploads/panel 2-1754c0de.png",   // military village occupation
  "uploads/panel 3-e738eaab.png",   // man opening rifle cabinet
  "uploads/panel 4-3712a03e.png",   // hands loading bullets
  "uploads/panel 5-14767a3e.png",   // family departure
  "uploads/panel 6.png",            // man walking — "Grief does not need evidence"
  "uploads/panel 1-47a734d6.png",   // man walking toward lit house
  "uploads/panel 2-796fc74b.png",   // rainy path at night
  "uploads/panel 3-710ad43c.png",   // dark path scene
  "uploads/panel 4-bd0562ef.png",   // dark atmospheric
  "uploads/panel 5-490f8754.png",   // dark atmospheric 2
  "uploads/panel 1.png",            // cattle valley original
  "uploads/panel 2.png",            // boy watching cattle
  "uploads/panel 3.png",            // eye close-up
  "uploads/panel 4.png",            // boy into cave
  "uploads/panel 5.png",            // hooves in mud
];

export const VIDEOS = [
  { id:"last-train-eden",   title:"Last Train to Eden",   creator:"kira-motion",  duration:"00:15", model:"Seedance 2.0",  category:"Sci-Fi",       views:12400, likes:1800, color:"#2C3E6B", panel:PANELS[0],  challengeTag:"Sci-Fi Challenge", status:"published", prompt:"A lone passenger on a glowing night train passing through collapsed futures, slow lateral tracking shot, fog-lit windows, 35mm grain, melancholy score.", year:2026, featured:true, youtubeId: "B-lfTmZp1DE" },
  { id:"the-silent-city",   title:"The Silent City",      creator:"nadeem-ai",    duration:"00:15", model:"Runway Gen-4",  category:"Sci-Fi",       views:8200,  likes:640,  color:"#1A2A1A", panel:PANELS[1],  challengeTag:"Challenge Entry",  status:"published", prompt:"Abandoned city at dawn, no people, windows reflecting empty sky, handheld push forward, documentary grain, ambient hum.", year:2026, featured:true, youtubeId: "9oryIMNVtto" },
  { id:"glass-hour",        title:"Glass Hour",           creator:"sun-young",    duration:"00:15", model:"Seedance 2.0",  category:"Fashion",      views:23100, likes:4200, color:"#C8956C", panel:PANELS[2],  challengeTag:null,               status:"published", prompt:"High-fashion editorial, model in amber light, slow-motion fabric movement, shallow depth, wind effect, Helmut Newton reference.", year:2026, featured:true, youtubeId: "1TlY7jkyqz4" },
  { id:"northbound",        title:"Northbound",           creator:"r-soderberg",  duration:"00:14", model:"Veo 4",         category:"Documentary",  views:5700,  likes:480,  color:"#3D5A6D", panel:PANELS[3],  challengeTag:null,               status:"published", prompt:"Train window, Nordic winter, grey birch forest passing, observational camera, no music, natural sound design, Lumière Brothers pacing.", year:2026, featured:false, youtubeId: "DNyxZi9Gp_4" },
  { id:"loop-47",           title:"Loop 47",              creator:"wren-frames",  duration:"00:12", model:"Runway Gen-4",  category:"Experimental", views:3400,  likes:290,  color:"#4A3A6B", panel:PANELS[4],  challengeTag:"Silence Speaks",   status:"published", prompt:"A single room loops infinitely with micro-variations, fixed camera, structural decay, glitch artifacts, Brian Eno ambient.", year:2026, featured:false, youtubeId: "s1AXccDlm6A" },
  { id:"the-shore",         title:"The Shore",            creator:"mira-vat",     duration:"00:15", model:"Seedance 2.0",  category:"Drama",        views:9800,  likes:1120, color:"#2B4A5B", panel:PANELS[5],  challengeTag:"Silence Speaks",   status:"published", prompt:"Woman at cliff edge at golden hour, long lens, wind in coat, no dialogue, John Ford horizon line, emotional climax in final second.", year:2026, featured:true, youtubeId: "B-lfTmZp1DE" },
  { id:"canopy",            title:"Canopy",               creator:"r-soderberg",  duration:"00:15", model:"Veo 4",         category:"Nature",       views:7200,  likes:890,  color:"#2D4A2D", panel:PANELS[6],  challengeTag:null,               status:"published", prompt:"Forest canopy from below, slow upward drift, dappled light shifting, birdsong, no human presence, Werner Herzog reverence.", year:2026, featured:false, youtubeId: "9oryIMNVtto" },
  { id:"dusk-protocol",     title:"Dusk Protocol",        creator:"eli-vasquez",  duration:"00:15", model:"Seedance 2.0",  category:"Action",       views:18600, likes:2700, color:"#5B3A2B", panel:PANELS[7],  challengeTag:"Sci-Fi Challenge", status:"published", prompt:"Mercenary silhouette against burning horizon, golden hour dust, slow-motion debris, tactical camera, Sicario color grade.", year:2026, featured:true, youtubeId: "1TlY7jkyqz4" },
  { id:"soft-circuit",      title:"Soft Circuit",         creator:"beatrice-yu",  duration:"00:15", model:"Pika 2",        category:"Animation",    views:11300, likes:1580, color:"#6B2B4A", panel:PANELS[8],  challengeTag:null,               status:"published", prompt:"Biological circuitry growing through a glass sphere, microscopic scale, warm bioluminescence, no dialogue, Miyazaki patience.", year:2026, featured:false, youtubeId: "DNyxZi9Gp_4" },
  { id:"the-burning-map",   title:"The Burning Map",      creator:"eli-vasquez",  duration:"00:15", model:"Seedance 2.0",  category:"Western",      views:15200, likes:2100, color:"#8B4A1A", panel:PANELS[9],  challengeTag:"Urban Ritual",     status:"published", prompt:"Old map on a table catching fire at edges, extreme close-up, territorial borders dissolving, Morricone-paced silence.", year:2026, featured:false, youtubeId: "s1AXccDlm6A" },
  { id:"signal-01",         title:"Signal/01",            creator:"wren-frames",  duration:"00:11", model:"Runway Gen-4",  category:"Experimental", views:4700,  likes:390,  color:"#1A4A4A", panel:PANELS[10], challengeTag:null,               status:"published", prompt:"Television static resolving into distant face, analog warmth, CRT curvature, barely-there voice, 1978 found footage aesthetic.", year:2026, featured:false, youtubeId: "B-lfTmZp1DE" },
  { id:"sable-run",         title:"Sable Run",            creator:"kira-motion",  duration:"00:15", model:"Kling 2",       category:"Sci-Fi",       views:8900,  likes:1040, color:"#3A2A5B", panel:PANELS[11], challengeTag:"Sci-Fi Challenge", status:"published", prompt:"Courier in a dark cityscape between rain-soaked towers, neon reflection, low-angle fast dolly, Blade Runner rain but quieter.", year:2026, featured:false, youtubeId: "9oryIMNVtto" },
  { id:"third-floor-west",  title:"Third Floor, West",    creator:"r-soderberg",  duration:"00:15", model:"Veo 4",         category:"Drama",        views:7500,  likes:820,  color:"#3A3A4A", panel:PANELS[12], challengeTag:null,               status:"published", prompt:"Empty apartment at dusk, objects on table, off-camera sound of someone leaving, held shot, fading light, no music.", year:2026, featured:false, youtubeId: "1TlY7jkyqz4" },
  { id:"red-meridian",      title:"Red Meridian",         creator:"kira-motion",  duration:"00:15", model:"Seedance 2.0",  category:"Sci-Fi",       views:6800,  likes:780,  color:"#8B1A1A", panel:PANELS[13], challengeTag:null,               status:"published", prompt:"Lone satellite above a red planet, slow orbit, silence of deep space, no score, Kubrick patience, final frame reveals scale.", year:2026, featured:false, youtubeId: "DNyxZi9Gp_4" },
  { id:"glass-hour-ii",     title:"Glass Hour II",        creator:"sun-young",    duration:"00:15", model:"Seedance 2.0",  category:"Fashion",      views:19400, likes:3100, color:"#B8895A", panel:PANELS[14], challengeTag:null,               status:"published", prompt:"Second editorial: silver fabric in wind, overexposed midday light, slow-motion hair, high-key beauty, commercial tension.", year:2026, featured:false, youtubeId: "s1AXccDlm6A" },
  { id:"flicker",           title:"Flicker",              creator:"nadeem-ai",    duration:"00:08", model:"Hailuo",        category:"Horror",       views:2900,  likes:240,  color:"#1A1A1A", panel:PANELS[15], challengeTag:"Silence Speaks",   status:"published", prompt:"Candle in dark room, wind source unknown, flame bends left then extinguishes, one second of total darkness, no score.", year:2026, featured:false, youtubeId: "1TlY7jkyqz4" },
];

export const CHALLENGES = [
  {
    id:"15-seconds-tomorrow",
    title:"15 Seconds of Tomorrow",
    theme:"Sci-Fi",
    brief:"Create a 15-second cinematic AI film showing a world 100 years from now. Focus on atmosphere, story, camera movement, and emotional impact.",
    rules:["4–15 seconds", "16:9 widescreen preferred", "Must be AI-generated or AI-assisted", "Prompt disclosure required", "No stolen copyrighted footage", "One submission per creator per plan"],
    criteria:["Story clarity","Visual quality","Originality","Prompt craft","Cinematic composition","Emotional impact"],
    deadline:"2026-06-01",
    prize:"€500 + Staff Pick feature + Creator badge",
    entries:234,
    status:"open",
    daysLeft:7,
    tools:["Any"],
    maxDuration:"15s",
    aspect:"16:9",
    color:"#2C3E6B",
    sponsor:null,
    winners:[],
  },
  {
    id:"silence-speaks",
    title:"Silence Speaks",
    theme:"No dialogue / Pure visual",
    brief:"No voice. No text. No score. Tell a complete story in 15 seconds using only image, movement, and ambient sound.",
    rules:["4–15 seconds","No spoken dialogue","No text overlays","Only diegetic sound or silence","Prompt disclosure required"],
    criteria:["Narrative clarity without dialogue","Visual composition","Sound design","Emotional resonance"],
    deadline:"2026-05-28",
    prize:"Homepage feature slot for 2 weeks",
    entries:89,
    status:"closing",
    daysLeft:2,
    tools:["Any"],
    maxDuration:"15s",
    aspect:"16:9",
    color:"#2B4A5B",
    sponsor:null,
    winners:[],
  },
  {
    id:"urban-ritual",
    title:"Urban Ritual",
    theme:"City / Pattern / Repetition",
    brief:"Cities are full of invisible rituals. Find one. Film it. Show the pattern behind the ordinary.",
    rules:["4–15 seconds","Urban subject required","Must feel observational","Prompt disclosure required"],
    criteria:["Concept originality","Observational quality","Editing precision","Prompt ingenuity"],
    deadline:"2026-05-20",
    prize:"Community vote · €250 + badge",
    entries:312,
    status:"voting",
    daysLeft:0,
    tools:["Any"],
    maxDuration:"15s",
    aspect:"16:9",
    color:"#5B3A2B",
    sponsor:"UrbanAI Studio",
    winners:[],
  },
  {
    id:"ghost-light",
    title:"Ghost Light",
    theme:"Horror / Atmospheric",
    brief:"One location. One figure. One impossible thing happens. 15 seconds of pure dread.",
    rules:["4–15 seconds","No gore","Atmospheric rather than jump-scare","Prompt disclosure required"],
    criteria:["Atmosphere","Tension build","Sound design","Restraint"],
    deadline:"2026-05-10",
    prize:"€300 + Staff Pick",
    entries:178,
    status:"closed",
    daysLeft:0,
    tools:["Any"],
    maxDuration:"15s",
    aspect:"16:9",
    color:"#1A2A1A",
    sponsor:null,
    winners:["nadeem-ai","wren-frames","mira-vat"],
  },
];

export const LEADERBOARD = [
  { rank:1, videoId:"glass-hour", score:9840, editor:5 },
  { rank:2, videoId:"dusk-protocol", score:8720, editor:4 },
  { rank:3, videoId:"glass-hour-ii", score:8140, editor:3 },
  { rank:4, videoId:"last-train-eden", score:7620, editor:5 },
  { rank:5, videoId:"the-burning-map", score:7100, editor:4 },
  { rank:6, videoId:"soft-circuit", score:6480, editor:4 },
  { rank:7, videoId:"the-shore", score:6120, editor:3 },
  { rank:8, videoId:"sable-run", score:5640, editor:2 },
  { rank:9, videoId:"third-floor-west", score:5100, editor:3 },
  { rank:10, videoId:"the-silent-city", score:4820, editor:2 },
];

export const PLATFORM_PLANS = [
  {
    id:"free",
    name:"Free",
    price:0,
    period:"month",
    credits:0,
    color:"#333",
    perks:["Upload AI films (up to 3/month)","Browse and explore the feed","Join challenges (upload-based)","Basic creator profile","Like, comment, share"],
    limits:["No in-platform generation","No priority review","No challenge boosts"],
    cta:"Get Started Free",
  },
  {
    id:"starter",
    name:"Starter",
    price:9,
    period:"month",
    credits:10,
    color:"#3D5A6D",
    perks:["Upload AI films (up to 20/month)","10 generation credits/month","Faster moderation review","Creator badge","Challenge submissions × 2"],
    limits:["720p max generation","Standard queue priority"],
    cta:"Start Creating",
  },
  {
    id:"creator",
    name:"Creator",
    price:29,
    period:"month",
    credits:40,
    color:"#e50914",
    popular:true,
    perks:["Unlimited uploads","40 generation credits/month","1080p generation","Priority review queue","Challenge submissions × 5","Profile spotlight eligible","Revenue share on featured films"],
    limits:["No team accounts","No API access"],
    cta:"Become a Creator",
  },
  {
    id:"pro",
    name:"Pro",
    price:79,
    period:"month",
    credits:120,
    color:"#C8956C",
    perks:["Unlimited uploads","120 generation credits/month","1080p generation + 4K export","Priority queue + guaranteed 24h review","Unlimited challenge submissions","Sponsored challenge eligibility","Revenue share on all published films","Early access to new models"],
    limits:[],
    cta:"Go Pro",
  },
  {
    id:"studio",
    name:"Studio",
    price:null,
    period:"month",
    credits:null,
    color:"#4A3A6B",
    perks:["Team accounts (up to 10 seats)","Bulk generation packages","API access (Seedance)","Dedicated support","Custom challenge sponsorship","White-label options"],
    limits:[],
    cta:"Contact Us",
  },
];

export const CREDIT_COSTS = [
  { label:"4s video · 720p", credits:1 },
  { label:"8s video · 720p", credits:2 },
  { label:"15s video · 720p", credits:3 },
  { label:"15s video · 1080p", credits:5 },
  { label:"15s video · 4K (Pro only)", credits:10 },
  { label:"Image-to-video · 15s", credits:4 },
  { label:"Start+End frame · 15s", credits:5 },
];
