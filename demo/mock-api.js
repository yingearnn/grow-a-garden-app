/* GitHub Pages browser-only demo API. NOT real authentication or a shared server. */
(function () {
  'use strict';
  const KEY = 'garden_pages_demo_v1';
  const PLANTS = [{"plant_id": 1, "name": "Sunflower", "rarity": "common", "points": 10, "value": 100, "stock": 10, "plantImage": "frontendpixel_plantssunflower.png"}, {"plant_id": 2, "name": "Tulip", "rarity": "common", "points": 15, "value": 150, "stock": 10, "plantImage": "frontendpixel_plantstulip.png"}, {"plant_id": 3, "name": "Rose", "rarity": "rare", "points": 30, "value": 400, "stock": 5, "plantImage": "frontendpixel_plantsrose.png"}, {"plant_id": 4, "name": "Orchid", "rarity": "special", "points": 50, "value": 800, "stock": 3, "plantImage": "frontendpixel_plantsorchid.png"}, {"plant_id": 5, "name": "Bonsai", "rarity": "legendary", "points": 100, "value": 2000, "stock": 1, "plantImage": "frontendpixel_plantsbonsai.png"}, {"plant_id": 6, "name": "Cactus", "rarity": "common", "points": 12, "value": 120, "stock": 10, "plantImage": "frontendpixel_plantscactus.png"}, {"plant_id": 7, "name": "Lavender", "rarity": "rare", "points": 35, "value": 500, "stock": 5, "plantImage": "frontendpixel_plantslavender.png"}, {"plant_id": 8, "name": "Venus Flytrap", "rarity": "special", "points": 60, "value": 1000, "stock": 3, "plantImage": "frontendpixel_plantsvenus_flytrap.png"}, {"plant_id": 9, "name": "Cherry Blossom", "rarity": "legendary", "points": 120, "value": 3000, "stock": 1, "plantImage": "frontendpixel_plantscherry_blossom.png"}, {"plant_id": 10, "name": "Daisy", "rarity": "common", "points": 8, "value": 80, "stock": 10, "plantImage": "frontendpixel_plantsdaisy.png"}, {"plant_id": 11, "name": "Mint", "rarity": "common", "points": 11, "value": 110, "stock": 10, "plantImage": "frontendpixel_plantsmint.png"}, {"plant_id": 12, "name": "Aloe Vera", "rarity": "rare", "points": 28, "value": 380, "stock": 5, "plantImage": "frontendpixel_plantsaloe_vera.png"}, {"plant_id": 13, "name": "Peony", "rarity": "rare", "points": 40, "value": 550, "stock": 5, "plantImage": "frontendpixel_plantspeony.png"}, {"plant_id": 14, "name": "Pitcher Plant", "rarity": "special", "points": 55, "value": 900, "stock": 3, "plantImage": "frontendpixel_plantspitcher_plant.png"}, {"plant_id": 15, "name": "Blue Rose", "rarity": "special", "points": 70, "value": 1200, "stock": 3, "plantImage": "frontendpixel_plantsblue_rose.png"}, {"plant_id": 16, "name": "Golden Bamboo", "rarity": "legendary", "points": 150, "value": 4000, "stock": 1, "plantImage": "frontendpixel_plantsgolden_bamboo.png"}, {"plant_id": 17, "name": "Moon Orchid", "rarity": "legendary", "points": 180, "value": 5000, "stock": 1, "plantImage": "frontendpixel_plantsmoon_orchid.png"}, {"plant_id": 18, "name": "Fern", "rarity": "common", "points": 9, "value": 90, "stock": 10, "plantImage": "frontendpixel_plantsfern.png"}, {"plant_id": 19, "name": "Jade Plant", "rarity": "rare", "points": 32, "value": 450, "stock": 5, "plantImage": "frontendpixel_plantsjade_plant.png"}, {"plant_id": 20, "name": "Lotus", "rarity": "special", "points": 65, "value": 1100, "stock": 3, "plantImage": "frontendpixel_plantslotus.png"}];
  const TOOLS = [{"item_id": 1, "name": "Basic Fertiliser", "multiplier": 1.5, "cost": 30, "stock": 10}, {"item_id": 2, "name": "Silver Fertiliser", "multiplier": 2.0, "cost": 60, "stock": 8}, {"item_id": 3, "name": "Golden Fertiliser", "multiplier": 3.0, "cost": 120, "stock": 5}, {"item_id": 4, "name": "Diamond Fertiliser", "multiplier": 4.0, "cost": 180, "stock": 2}, {"item_id": 5, "name": "Jade Fertiliser", "multiplier": 5.0, "cost": 240, "stock": 1}];
  const seed = () => ({ users: [], plants: PLANTS, tools: TOOLS, inventory: [], garden: [], challenges: [
    { challenge_id: 1, creator_id: 0, description: 'Water your garden', points: 15 },
    { challenge_id: 2, creator_id: 0, description: 'Plant a new flower', points: 20 },
    { challenge_id: 3, creator_id: 0, description: 'Harvest a plant', points: 25 }
  ], completions: [], nextInventory: 1, nextChallenge: 4 });
  function load() { try { return Object.assign(seed(), JSON.parse(localStorage.getItem(KEY)) || {}); } catch { return seed(); } }
  function save(db) { localStorage.setItem(KEY, JSON.stringify(db)); }
  function result(body, status = 200) {
    if (status === 204) return new Response(null, { status });
    return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
  }
  const err = (message, status = 400) => result({message}, status);
  const nativeFetch = window.fetch.bind(window);
  function sessionUser(db) { const id = Number(localStorage.getItem('userId')); return db.users.find(u => u.user_id === id && localStorage.getItem('token') === 'pages-demo-' + id); }
  function bodyOf(opts) { try { return JSON.parse(opts.body || '{}'); } catch { return {}; } }
  const urlPath = u => { try { return new URL(u, location.href).pathname.replace(/\/+$/, '') || '/'; } catch { return ''; } };
  window.fetch = async function (input, opts = {}) {
    const path = urlPath(typeof input === 'string' ? input : input.url);
    const method = (opts.method || 'GET').toUpperCase();
    const segments = path.split('/').filter(Boolean);
    const known = ['register', 'login', 'user', 'plants', 'tools', 'garden', 'challenges'];
    const routePos = segments.findIndex(s => known.includes(s));
    if (routePos < 0) return nativeFetch(input, opts);
    const p = segments.slice(routePos), data = bodyOf(opts), db = load();
    try {
      if (p[0] === 'register' && method === 'POST') {
        const username = String(data.username || '').trim(), email = String(data.email || '').trim();
        if (!username || !email || !data.password) return err('Fill in all registration fields.');
        if (db.users.some(u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase())) return err('Username or email already exists.', 409);
        const id = Math.max(0, ...db.users.map(u => u.user_id)) + 1;
        // This is only a local demo. Passwords are not stored or securely authenticated.
        db.users.push({user_id:id, username, email, points:300, net_worth:0}); save(db);
        return result({token:'pages-demo-' + id, userId:id}, 200);
      }
      if (p[0] === 'login' && method === 'POST') {
        const u = db.users.find(u => u.username.toLowerCase() === String(data.username || '').toLowerCase());
        if (!u) return err('Demo account not found in this browser. Please register first.',401);
        // No password validation. Never enter a real password in this demonstration.
        return result({token:'pages-demo-' + u.user_id, userId:u.user_id});
      }
      const user = sessionUser(db); if (!user) return err('Please log in to this demo.',401);
      const uid = user.user_id;
      if (p[0] === 'user' && p[1] === 'top10') return result([...db.users].sort((a,b) => b.net_worth - a.net_worth).slice(0,10));
      if (p[0] === 'user' && method === 'GET') return result([user]);
      if (p[0] === 'plants' && p.length === 1 && method === 'GET') return result(db.plants.filter(x => x.stock > 0).sort(() => Math.random()-.5).slice(0,3));
      if (p[0] === 'tools' && p.length === 1 && method === 'GET') return result(db.tools.filter(x => x.stock > 0).sort(() => Math.random()-.5).slice(0,3));
      if (['plants','tools'].includes(p[0]) && p[2] === 'buy' && method === 'POST') {
        const item = (p[0] === 'plants' ? db.plants : db.tools).find(x => (x.plant_id || x.item_id) === Number(p[1]));
        if (!item || item.stock < 1) return err('Out of stock.');
        const cost = item.points ?? item.cost;
        if (user.points < cost) return err('Insufficient points.');
        user.points -= cost; item.stock--;
        if (p[0] === 'plants') db.inventory.push({user_plant_id:db.nextInventory++, user_id:uid, plant_id:item.plant_id, acquired_on:new Date().toISOString(), is_planted:false});
        save(db);return result({message:'Purchase successful!', stock:item.stock});
      }
      if (p[0] === 'plants' && p.length === 2 && method === 'GET') return result(db.inventory.filter(i=>i.user_id === uid && !i.is_planted).map(i=>({...i, ...db.plants.find(x=>x.plant_id===i.plant_id)})));
      if (p[0] === 'garden' && method === 'GET') return result(db.garden.filter(g=>g.user_id===uid).map(g=>({...g, ...((()=>{const i=db.inventory.find(x=>x.user_plant_id===g.plant_id);return i ? db.plants.find(x=>x.plant_id===i.plant_id) : {};})() || {}) ,plot_number:g.plot_number,plant_id:g.plant_id,value:g.value})));
      if (p[0] === 'garden' && p[1] === 'plant' && method === 'POST') {
        const item=db.inventory.find(x=>x.user_plant_id===Number(data.user_plant_id) && x.user_id===uid && !x.is_planted), n=Number(data.plot_number);
        if (!item) return err('Plant not found in inventory.');
        if (!Number.isInteger(n) || n<1 || n>20 || db.garden.some(g=>g.user_id===uid && g.plot_number===n)) return err('Choose an empty plot number from 1 to 20.');
        item.is_planted=true;const plant=db.plants.find(x=>x.plant_id===item.plant_id);
        db.garden.push({user_id:uid,plot_number:n,plant_id:item.user_plant_id,value:plant.value,planted_on:new Date().toISOString()});save(db);
        return result({message:'Planted successfully!'});
      }
      if (p[0] === 'garden' && p[1] === 'sell' && method === 'POST') {
        const n=Number(data.plot_number), index=db.garden.findIndex(g=>g.user_id===uid && g.plot_number===n);
        if (index===-1) return err('Nothing to harvest on that plot.');
        const plot=db.garden.splice(index,1)[0];user.net_worth+=plot.value;user.points+=Math.max(1,Math.floor(plot.value/10));
        db.inventory=db.inventory.filter(x=>x.user_plant_id!==plot.plant_id);save(db);
        return result({message:'Harvested! Earned $'+plot.value+'.'});
      }
      if (p[0] === 'challenges' && p.length === 1) {
        if (method === 'GET') return result(db.challenges.map(c=>({...c,effective_points:c.points,has_bonus:false})));
        if (method === 'POST') {
          const description=String(data.description||'').trim(), points=Number(data.points);
          if (!description || !Number.isInteger(points) || points<1 || points>50) return err('Enter a description and 1–50 points.');
          const c={challenge_id:db.nextChallenge++,creator_id:uid,description,points}; db.challenges.push(c);save(db);return result(c,201);
        }
      }
      if (p[0] === 'challenges' && p[1]) {
        const id=Number(p[1]),c=db.challenges.find(x=>x.challenge_id===id);
        if (!c) return err('Challenge not found.',404);
        if (p[2] === 'complete' && method === 'POST') {
          if (db.completions.some(x=>x.challenge_id===id && x.user_id===uid)) return err('You already completed this challenge.');
          if (!String(data.details||'').trim()) return err('Enter completion details.');
          db.completions.push({challenge_id:id,user_id:uid,details:String(data.details),completed_on:new Date().toISOString()});user.points+=c.points;save(db);return result({points_awarded:c.points,message:'Challenge completed!'});
        }
        if (method === 'GET') return result(db.completions.filter(x=>x.challenge_id===id));
        if (c.creator_id!==uid) return err('Only the creator can edit or delete this challenge.',403);
        if (method === 'DELETE') {db.challenges=db.challenges.filter(x=>x.challenge_id!==id);save(db);return result(null,204);}
        if (method === 'PUT') {if (String(data.description||'').trim()) c.description=String(data.description).trim();if(Number(data.points)>0 && Number(data.points)<=50)c.points=Number(data.points);save(db);return result({message:'Challenge updated.'});}
      }
      return err('Feature not implemented in browser demo.',404);
    } catch (e) {console.error('Garden demo API:',e);return err('Demo request failed.');}
  };
  console.info('Garden Game GitHub Pages DEMO API enabled. Saves locally to this browser only.');
})();
