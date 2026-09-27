// One-off script used to produce supabase/seed.sql from the original
// demo data in the v1 travel-portal.html file. Not needed at runtime —
// kept here for transparency/reproducibility only.
const fs = require('fs');

const DESTINATIONS = [
  {id:1,name:'Goa',country:'India',img:'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80',badge:'Beach',rating:4.7,season:'Oct–Mar',climate:'Tropical',lang:'Konkani',currency:'INR',visa:'No',safety:'8.2',food:['Fish Curry','Bebinca','Prawn Xacuti','Vindaloo'],insta:['Baga Beach','Dudhsagar Falls','Old Goa Churches','Anjuna Market'],tips:['Visit beaches early morning','Rent a scooter for local travel','Try the local fish curry'],gems:['Chorao Island','Querim Beach','Fontainhas Latin Quarter'],lat:15.2993,lng:74.124},
  {id:2,name:'Manali',country:'India',img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',badge:'Hills',rating:4.8,season:'Mar–Jun',climate:'Alpine',lang:'Hindi/Pahari',currency:'INR',visa:'No',safety:'8.7',food:['Sidu','Trout Fish','Thukpa'],insta:['Rohtang Pass','Solang Valley','Hadimba Temple','Beas River'],tips:['Carry warm clothes even in summer','Book hotels in advance'],gems:['Malana Village','Naggar Castle','Khirganga Trek'],lat:32.2432,lng:77.1892},
  {id:3,name:'Kerala',country:'India',img:'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80',badge:'Backwaters',rating:4.9,season:'Oct–Feb',climate:'Tropical Wet',lang:'Malayalam',currency:'INR',visa:'No',safety:'9.0',food:['Karimeen Pollichathu','Appam','Sadya','Puttu'],insta:['Alleppey Backwaters','Munnar Tea Gardens','Fort Kochi','Varkala Cliff'],tips:['Book houseboat in advance','Try ayurvedic massage'],gems:['Thenmala','Bekal Fort','Wayanad Wildlife'],lat:9.9312,lng:76.2673},
  {id:4,name:'Rajasthan',country:'India',img:'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80',badge:'Heritage',rating:4.6,season:'Oct–Mar',climate:'Desert/Arid',lang:'Rajasthani/Hindi',currency:'INR',visa:'No',safety:'7.8',food:['Dal Baati','Ghewar','Laal Maas'],insta:['Hawa Mahal','Mehrangarh Fort','Jaisalmer Dunes'],tips:['Hire a local guide for forts','Bargain at bazaars'],gems:['Bundi','Osian Desert Temple','Bhangarh Fort'],lat:26.9124,lng:75.7873},
  {id:5,name:'Maldives',country:'Maldives',img:'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80',badge:'Luxury',rating:4.9,season:'Nov–Apr',climate:'Tropical',lang:'Dhivehi',currency:'MVR',visa:'Visa on Arrival',safety:'9.2',food:['Mas Huni','Garudhiya','Rihaakuru'],insta:['Overwater Bungalows','Coral Reefs','Sandbanks'],tips:['Snorkel at sunrise','Book transfers in advance'],gems:['Addu Atoll','Maafushi Island','Hanifaru Bay'],lat:3.2028,lng:73.2207},
  {id:6,name:'Bali',country:'Indonesia',img:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',badge:'Island',rating:4.8,season:'Apr–Oct',climate:'Tropical',lang:'Balinese/Indonesian',currency:'IDR',visa:'Visa on Arrival',safety:'8.5',food:['Nasi Goreng','Babi Guling','Lawar'],insta:['Tanah Lot','Tegalalang Terraces','Mount Batur'],tips:['Respect temple dress codes','Negotiate taxi fares'],gems:['Sidemen Valley','Candidasa','Nyang Nyang Beach'],lat:-8.3405,lng:115.092},
  {id:7,name:'Tokyo',country:'Japan',img:'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80',badge:'Culture',rating:4.9,season:'Mar–May',climate:'Temperate',lang:'Japanese',currency:'JPY',visa:'e-Visa',safety:'9.6',food:['Sushi','Ramen','Tempura','Wagyu'],insta:['Shibuya Crossing','Senso-ji Temple','Akihabara'],tips:['Get a JR rail pass','Carry cash — many places are card-free'],gems:['Yanaka Ginza','Nezu Shrine','Shimokitazawa'],lat:35.6762,lng:139.6503},
  {id:8,name:'Switzerland',country:'Switzerland',img:'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600&q=80',badge:'Alps',rating:4.9,season:'Jun–Sep',climate:'Alpine',lang:'German/French/Italian',currency:'CHF',visa:'Schengen',safety:'9.5',food:['Fondue','Raclette','Rösti'],insta:['Matterhorn','Lake Lucerne','Jungfraujoch'],tips:['Buy a Swiss Travel Pass','Pack layers for changing weather'],gems:['Lauterbrunnen Valley','Appenzell','Val Verzasca'],lat:46.8182,lng:8.2275},
  {id:9,name:'Dubai',country:'UAE',img:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',badge:'City',rating:4.7,season:'Nov–Mar',climate:'Desert',lang:'Arabic/English',currency:'AED',visa:'Visa on Arrival',safety:'9.1',food:['Shawarma','Al Machboos','Luqaimat'],insta:['Burj Khalifa','Palm Jumeirah','Dubai Marina'],tips:['Dress modestly in public areas','Book desert safari in advance'],gems:['Al Fahidi District','Alserkal Avenue','Hatta Mountains'],lat:25.2048,lng:55.2708},
  {id:10,name:'Vietnam',country:'Vietnam',img:'https://images.unsplash.com/photo-1528127269322-539801943592?w=600&q=80',badge:'Bay',rating:4.7,season:'Nov–Apr',climate:'Tropical',lang:'Vietnamese',currency:'VND',visa:'e-Visa',safety:'8.4',food:['Pho','Banh Mi','Bun Cha'],insta:['Ha Long Bay','Hoi An Lanterns','Cu Chi Tunnels'],tips:['Try street food from busy stalls','Carry a light rain jacket'],gems:['Phong Nha Caves','Mai Chau Valley','Con Dao Islands'],lat:14.0583,lng:108.2772},
  {id:11,name:'Andaman Islands',country:'India',img:'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&q=80',badge:'Beach',rating:4.8,season:'Oct–May',climate:'Tropical',lang:'Hindi/English',currency:'INR',visa:'No',safety:'8.9',food:['Fish Amritsari','Coconut Prawn Curry','Lobster'],insta:['Radhanagar Beach','Cellular Jail','Havelock Island'],tips:['Book ferries between islands early','Try scuba diving at Havelock'],gems:['Ross Island','Lakshmanpur Beach','Chidiya Tapu'],lat:11.7401,lng:92.6586},
  {id:12,name:'Ladakh',country:'India',img:'https://images.unsplash.com/photo-1589554566402-fe6c30589bfa?w=600&q=80',badge:'Desert Hills',rating:4.9,season:'May–Sep',climate:'Cold Desert',lang:'Ladakhi/Hindi',currency:'INR',visa:'No',safety:'8.6',food:['Thukpa','Momos','Butter Tea'],insta:['Pangong Lake','Nubra Valley','Magnetic Hill'],tips:['Acclimatize for 2 days before altitude gain','Book stays early in peak season'],gems:['Turtuk Village','Tso Moriri','Zanskar Valley'],lat:34.1526,lng:77.5771},
];

const PACKAGES = [
  {name:'Goa Beach Escape',destName:'Goa',img:'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=700&q=80',days:4,price:11499,incl:['Flights','Hotel','Breakfast','Airport Transfers']},
  {name:'Manali Snow Adventure',destName:'Manali',img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80',days:5,price:15999,incl:['Hotel','All Meals','Adventure Activities','Cab']},
  {name:'Kerala Backwaters Bliss',destName:'Kerala',img:'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=700&q=80',days:5,price:18999,incl:['Houseboat Stay','All Meals','Sightseeing','Ayurveda Session']},
  {name:'Royal Rajasthan Heritage Trail',destName:'Rajasthan',img:'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=700&q=80',days:7,price:27999,incl:['Hotel','Breakfast','Private Guide','Fort Entry Tickets']},
  {name:'Maldives Overwater Villa',destName:'Maldives',img:'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=700&q=80',days:5,price:89999,incl:['Flights','Overwater Villa','All Meals','Snorkeling']},
  {name:'Bali Island Getaway',destName:'Bali',img:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=700&q=80',days:6,price:52999,incl:['Flights','Villa Stay','Breakfast','Temple Tours']},
  {name:'Tokyo City Lights',destName:'Tokyo',img:'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=700&q=80',days:6,price:98999,incl:['Flights','Hotel','JR Rail Pass','City Tour']},
  {name:'Swiss Alps Panorama',destName:'Switzerland',img:'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=700&q=80',days:8,price:145999,incl:['Flights','4-Star Hotel','Scenic Train Pass','Breakfast']},
  {name:'Dubai Desert & Skyline',destName:'Dubai',img:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=700&q=80',days:4,price:42999,incl:['Flights','Hotel','Desert Safari','Burj Khalifa Tickets']},
  {name:'Ladakh Bike Expedition',destName:'Ladakh',img:'https://images.unsplash.com/photo-1589554566402-fe6c30589bfa?w=700&q=80',days:7,price:32999,incl:['Royal Enfield Rental','Camps & Hotels','All Meals','Permits']},
  {name:'Andaman Island Hopper',destName:'Andaman Islands',img:'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=700&q=80',days:5,price:24999,incl:['Flights','Hotel','Ferry Transfers','Scuba Session']},
];

const ACTIVITIES = [
  {name:'Paragliding',destName:'Manali',price:2500,img:'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80'},
  {name:'Scuba Diving',destName:'Andaman Islands',price:3800,img:'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=400&q=80'},
  {name:'Trekking',destName:'Ladakh',price:1200,img:'https://images.unsplash.com/photo-1501554728187-ce583db33af7?w=400&q=80'},
  {name:'Camping',destName:'Rajasthan',price:1800,img:'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?w=400&q=80'},
  {name:'Backwater Safari',destName:'Kerala',price:4200,img:'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&q=80'},
  {name:'Zipline',destName:'Goa',price:1500,img:'https://images.unsplash.com/photo-1526459879853-6b2e0f07f1b8?w=400&q=80'},
];

const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
const esc = s => (s === undefined || s === null) ? 'null' : `'${String(s).replace(/'/g,"''")}'`;
const arr = a => `ARRAY[${(a||[]).map(esc).join(',')}]::text[]`;

let sql = `-- Auto-generated demo seed data (real content taken from the v1 site)\n-- Safe to run once against a fresh schema.sql. Uses slugs as stable keys\n-- so re-running just updates existing rows instead of duplicating them.\n\n`;

sql += `-- DESTINATIONS\n`;
DESTINATIONS.forEach(d => {
  const slug = slugify(d.name);
  sql += `insert into public.destinations (slug,name,country,description,cover_image,latitude,longitude,best_season,climate,currency,language,visa_info,safety_info,food_info,hidden_gems,attractions,travel_tips,status)\n` +
    `values (${esc(slug)},${esc(d.name)},${esc(d.country)},${esc(d.badge + ' destination in ' + d.country)},${esc(d.img)},${d.lat},${d.lng},${esc(d.season)},${esc(d.climate)},${esc(d.currency)},${esc(d.lang)},${esc(d.visa)},${esc(d.safety)},${esc(d.food.join(', '))},${arr(d.gems)},${arr(d.insta)},${arr(d.tips)},'published')\n` +
    `on conflict (slug) do update set name=excluded.name, cover_image=excluded.cover_image;\n\n`;
});

sql += `-- TRAVEL PACKAGES\n`;
PACKAGES.forEach(p => {
  const slug = slugify(p.name);
  const destSlug = slugify(p.destName);
  sql += `insert into public.travel_packages (slug,destination_id,title,description,duration_days,base_price,max_travelers,inclusions,status)\n` +
    `select ${esc(slug)}, d.id, ${esc(p.name)}, ${esc('A ' + p.days + '-day curated trip to ' + p.destName + '.')}, ${p.days}, ${p.price}, 10, ${arr(p.incl)}, 'published'\n` +
    `from public.destinations d where d.slug = ${esc(destSlug)}\n` +
    `on conflict (slug) do update set base_price=excluded.base_price;\n\n` +
    `insert into public.package_images (package_id,url,sort_order)\n` +
    `select id, ${esc(p.img)}, 0 from public.travel_packages where slug=${esc(slug)}\n` +
    `on conflict do nothing;\n\n`;
});

sql += `-- ACTIVITIES\n`;
ACTIVITIES.forEach(a => {
  const slug = slugify(a.name) + '-' + slugify(a.destName);
  const destSlug = slugify(a.destName);
  sql += `insert into public.activities (slug,destination_id,title,description,location,duration,price,capacity,status)\n` +
    `select ${esc(slug)}, d.id, ${esc(a.name)}, ${esc(a.name + ' experience in ' + a.destName + '.')}, ${esc(a.destName)}, '2-3 hours', ${a.price}, 15, 'published'\n` +
    `from public.destinations d where d.slug = ${esc(destSlug)}\n` +
    `on conflict (slug) do update set price=excluded.price;\n\n` +
    `insert into public.activity_images (activity_id,url,sort_order)\n` +
    `select id, ${esc(a.img)}, 0 from public.activities where slug=${esc(slug)}\n` +
    `on conflict do nothing;\n\n`;
});

sql += `-- SAMPLE COUPON\n`;
sql += `insert into public.coupons (code,description,discount_type,discount_value,min_purchase,max_discount,expires_at,usage_limit,per_user_limit,status)\n` +
  `values ('GOA500','₹500 off on any Goa booking','fixed',500,10000,500, now() + interval '90 days', 1000, 1, 'active')\n` +
  `on conflict (code) do nothing;\n`;

fs.writeFileSync(require('path').join(__dirname, 'seed.sql'), sql);
console.log('Wrote seed.sql, ' + sql.length + ' bytes');
