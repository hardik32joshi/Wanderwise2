-- Auto-generated demo seed data (real content taken from the v1 site)
-- Safe to run once against a fresh schema.sql. Uses slugs as stable keys
-- so re-running just updates existing rows instead of duplicating them.

-- DESTINATIONS
insert into public.destinations (slug,name,country,description,cover_image,latitude,longitude,best_season,climate,currency,language,visa_info,safety_info,food_info,hidden_gems,attractions,travel_tips,status)
values ('goa','Goa','India','Beach destination in India','https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80',15.2993,74.124,'Oct–Mar','Tropical','INR','Konkani','No','8.2','Fish Curry, Bebinca, Prawn Xacuti, Vindaloo',ARRAY['Chorao Island','Querim Beach','Fontainhas Latin Quarter']::text[],ARRAY['Baga Beach','Dudhsagar Falls','Old Goa Churches','Anjuna Market']::text[],ARRAY['Visit beaches early morning','Rent a scooter for local travel','Try the local fish curry']::text[],'published')
on conflict (slug) do update set name=excluded.name, cover_image=excluded.cover_image;

insert into public.destinations (slug,name,country,description,cover_image,latitude,longitude,best_season,climate,currency,language,visa_info,safety_info,food_info,hidden_gems,attractions,travel_tips,status)
values ('manali','Manali','India','Hills destination in India','https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',32.2432,77.1892,'Mar–Jun','Alpine','INR','Hindi/Pahari','No','8.7','Sidu, Trout Fish, Thukpa',ARRAY['Malana Village','Naggar Castle','Khirganga Trek']::text[],ARRAY['Rohtang Pass','Solang Valley','Hadimba Temple','Beas River']::text[],ARRAY['Carry warm clothes even in summer','Book hotels in advance']::text[],'published')
on conflict (slug) do update set name=excluded.name, cover_image=excluded.cover_image;

insert into public.destinations (slug,name,country,description,cover_image,latitude,longitude,best_season,climate,currency,language,visa_info,safety_info,food_info,hidden_gems,attractions,travel_tips,status)
values ('kerala','Kerala','India','Backwaters destination in India','https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80',9.9312,76.2673,'Oct–Feb','Tropical Wet','INR','Malayalam','No','9.0','Karimeen Pollichathu, Appam, Sadya, Puttu',ARRAY['Thenmala','Bekal Fort','Wayanad Wildlife']::text[],ARRAY['Alleppey Backwaters','Munnar Tea Gardens','Fort Kochi','Varkala Cliff']::text[],ARRAY['Book houseboat in advance','Try ayurvedic massage']::text[],'published')
on conflict (slug) do update set name=excluded.name, cover_image=excluded.cover_image;

insert into public.destinations (slug,name,country,description,cover_image,latitude,longitude,best_season,climate,currency,language,visa_info,safety_info,food_info,hidden_gems,attractions,travel_tips,status)
values ('rajasthan','Rajasthan','India','Heritage destination in India','https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80',26.9124,75.7873,'Oct–Mar','Desert/Arid','INR','Rajasthani/Hindi','No','7.8','Dal Baati, Ghewar, Laal Maas',ARRAY['Bundi','Osian Desert Temple','Bhangarh Fort']::text[],ARRAY['Hawa Mahal','Mehrangarh Fort','Jaisalmer Dunes']::text[],ARRAY['Hire a local guide for forts','Bargain at bazaars']::text[],'published')
on conflict (slug) do update set name=excluded.name, cover_image=excluded.cover_image;

insert into public.destinations (slug,name,country,description,cover_image,latitude,longitude,best_season,climate,currency,language,visa_info,safety_info,food_info,hidden_gems,attractions,travel_tips,status)
values ('maldives','Maldives','Maldives','Luxury destination in Maldives','https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80',3.2028,73.2207,'Nov–Apr','Tropical','MVR','Dhivehi','Visa on Arrival','9.2','Mas Huni, Garudhiya, Rihaakuru',ARRAY['Addu Atoll','Maafushi Island','Hanifaru Bay']::text[],ARRAY['Overwater Bungalows','Coral Reefs','Sandbanks']::text[],ARRAY['Snorkel at sunrise','Book transfers in advance']::text[],'published')
on conflict (slug) do update set name=excluded.name, cover_image=excluded.cover_image;

insert into public.destinations (slug,name,country,description,cover_image,latitude,longitude,best_season,climate,currency,language,visa_info,safety_info,food_info,hidden_gems,attractions,travel_tips,status)
values ('bali','Bali','Indonesia','Island destination in Indonesia','https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',-8.3405,115.092,'Apr–Oct','Tropical','IDR','Balinese/Indonesian','Visa on Arrival','8.5','Nasi Goreng, Babi Guling, Lawar',ARRAY['Sidemen Valley','Candidasa','Nyang Nyang Beach']::text[],ARRAY['Tanah Lot','Tegalalang Terraces','Mount Batur']::text[],ARRAY['Respect temple dress codes','Negotiate taxi fares']::text[],'published')
on conflict (slug) do update set name=excluded.name, cover_image=excluded.cover_image;

insert into public.destinations (slug,name,country,description,cover_image,latitude,longitude,best_season,climate,currency,language,visa_info,safety_info,food_info,hidden_gems,attractions,travel_tips,status)
values ('tokyo','Tokyo','Japan','Culture destination in Japan','https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80',35.6762,139.6503,'Mar–May','Temperate','JPY','Japanese','e-Visa','9.6','Sushi, Ramen, Tempura, Wagyu',ARRAY['Yanaka Ginza','Nezu Shrine','Shimokitazawa']::text[],ARRAY['Shibuya Crossing','Senso-ji Temple','Akihabara']::text[],ARRAY['Get a JR rail pass','Carry cash — many places are card-free']::text[],'published')
on conflict (slug) do update set name=excluded.name, cover_image=excluded.cover_image;

insert into public.destinations (slug,name,country,description,cover_image,latitude,longitude,best_season,climate,currency,language,visa_info,safety_info,food_info,hidden_gems,attractions,travel_tips,status)
values ('switzerland','Switzerland','Switzerland','Alps destination in Switzerland','https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600&q=80',46.8182,8.2275,'Jun–Sep','Alpine','CHF','German/French/Italian','Schengen','9.5','Fondue, Raclette, Rösti',ARRAY['Lauterbrunnen Valley','Appenzell','Val Verzasca']::text[],ARRAY['Matterhorn','Lake Lucerne','Jungfraujoch']::text[],ARRAY['Buy a Swiss Travel Pass','Pack layers for changing weather']::text[],'published')
on conflict (slug) do update set name=excluded.name, cover_image=excluded.cover_image;

insert into public.destinations (slug,name,country,description,cover_image,latitude,longitude,best_season,climate,currency,language,visa_info,safety_info,food_info,hidden_gems,attractions,travel_tips,status)
values ('dubai','Dubai','UAE','City destination in UAE','https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',25.2048,55.2708,'Nov–Mar','Desert','AED','Arabic/English','Visa on Arrival','9.1','Shawarma, Al Machboos, Luqaimat',ARRAY['Al Fahidi District','Alserkal Avenue','Hatta Mountains']::text[],ARRAY['Burj Khalifa','Palm Jumeirah','Dubai Marina']::text[],ARRAY['Dress modestly in public areas','Book desert safari in advance']::text[],'published')
on conflict (slug) do update set name=excluded.name, cover_image=excluded.cover_image;

insert into public.destinations (slug,name,country,description,cover_image,latitude,longitude,best_season,climate,currency,language,visa_info,safety_info,food_info,hidden_gems,attractions,travel_tips,status)
values ('vietnam','Vietnam','Vietnam','Bay destination in Vietnam','https://images.unsplash.com/photo-1528127269322-539801943592?w=600&q=80',14.0583,108.2772,'Nov–Apr','Tropical','VND','Vietnamese','e-Visa','8.4','Pho, Banh Mi, Bun Cha',ARRAY['Phong Nha Caves','Mai Chau Valley','Con Dao Islands']::text[],ARRAY['Ha Long Bay','Hoi An Lanterns','Cu Chi Tunnels']::text[],ARRAY['Try street food from busy stalls','Carry a light rain jacket']::text[],'published')
on conflict (slug) do update set name=excluded.name, cover_image=excluded.cover_image;

insert into public.destinations (slug,name,country,description,cover_image,latitude,longitude,best_season,climate,currency,language,visa_info,safety_info,food_info,hidden_gems,attractions,travel_tips,status)
values ('andaman-islands','Andaman Islands','India','Beach destination in India','https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&q=80',11.7401,92.6586,'Oct–May','Tropical','INR','Hindi/English','No','8.9','Fish Amritsari, Coconut Prawn Curry, Lobster',ARRAY['Ross Island','Lakshmanpur Beach','Chidiya Tapu']::text[],ARRAY['Radhanagar Beach','Cellular Jail','Havelock Island']::text[],ARRAY['Book ferries between islands early','Try scuba diving at Havelock']::text[],'published')
on conflict (slug) do update set name=excluded.name, cover_image=excluded.cover_image;

insert into public.destinations (slug,name,country,description,cover_image,latitude,longitude,best_season,climate,currency,language,visa_info,safety_info,food_info,hidden_gems,attractions,travel_tips,status)
values ('ladakh','Ladakh','India','Desert Hills destination in India','https://images.unsplash.com/photo-1589554566402-fe6c30589bfa?w=600&q=80',34.1526,77.5771,'May–Sep','Cold Desert','INR','Ladakhi/Hindi','No','8.6','Thukpa, Momos, Butter Tea',ARRAY['Turtuk Village','Tso Moriri','Zanskar Valley']::text[],ARRAY['Pangong Lake','Nubra Valley','Magnetic Hill']::text[],ARRAY['Acclimatize for 2 days before altitude gain','Book stays early in peak season']::text[],'published')
on conflict (slug) do update set name=excluded.name, cover_image=excluded.cover_image;

-- TRAVEL PACKAGES
insert into public.travel_packages (slug,destination_id,title,description,duration_days,base_price,max_travelers,inclusions,status)
select 'goa-beach-escape', d.id, 'Goa Beach Escape', 'A 4-day curated trip to Goa.', 4, 11499, 10, ARRAY['Flights','Hotel','Breakfast','Airport Transfers']::text[], 'published'
from public.destinations d where d.slug = 'goa'
on conflict (slug) do update set base_price=excluded.base_price;

insert into public.package_images (package_id,url,sort_order)
select id, 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=700&q=80', 0 from public.travel_packages where slug='goa-beach-escape'
on conflict do nothing;

insert into public.travel_packages (slug,destination_id,title,description,duration_days,base_price,max_travelers,inclusions,status)
select 'manali-snow-adventure', d.id, 'Manali Snow Adventure', 'A 5-day curated trip to Manali.', 5, 15999, 10, ARRAY['Hotel','All Meals','Adventure Activities','Cab']::text[], 'published'
from public.destinations d where d.slug = 'manali'
on conflict (slug) do update set base_price=excluded.base_price;

insert into public.package_images (package_id,url,sort_order)
select id, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80', 0 from public.travel_packages where slug='manali-snow-adventure'
on conflict do nothing;

insert into public.travel_packages (slug,destination_id,title,description,duration_days,base_price,max_travelers,inclusions,status)
select 'kerala-backwaters-bliss', d.id, 'Kerala Backwaters Bliss', 'A 5-day curated trip to Kerala.', 5, 18999, 10, ARRAY['Houseboat Stay','All Meals','Sightseeing','Ayurveda Session']::text[], 'published'
from public.destinations d where d.slug = 'kerala'
on conflict (slug) do update set base_price=excluded.base_price;

insert into public.package_images (package_id,url,sort_order)
select id, 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=700&q=80', 0 from public.travel_packages where slug='kerala-backwaters-bliss'
on conflict do nothing;

insert into public.travel_packages (slug,destination_id,title,description,duration_days,base_price,max_travelers,inclusions,status)
select 'royal-rajasthan-heritage-trail', d.id, 'Royal Rajasthan Heritage Trail', 'A 7-day curated trip to Rajasthan.', 7, 27999, 10, ARRAY['Hotel','Breakfast','Private Guide','Fort Entry Tickets']::text[], 'published'
from public.destinations d where d.slug = 'rajasthan'
on conflict (slug) do update set base_price=excluded.base_price;

insert into public.package_images (package_id,url,sort_order)
select id, 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=700&q=80', 0 from public.travel_packages where slug='royal-rajasthan-heritage-trail'
on conflict do nothing;

insert into public.travel_packages (slug,destination_id,title,description,duration_days,base_price,max_travelers,inclusions,status)
select 'maldives-overwater-villa', d.id, 'Maldives Overwater Villa', 'A 5-day curated trip to Maldives.', 5, 89999, 10, ARRAY['Flights','Overwater Villa','All Meals','Snorkeling']::text[], 'published'
from public.destinations d where d.slug = 'maldives'
on conflict (slug) do update set base_price=excluded.base_price;

insert into public.package_images (package_id,url,sort_order)
select id, 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=700&q=80', 0 from public.travel_packages where slug='maldives-overwater-villa'
on conflict do nothing;

insert into public.travel_packages (slug,destination_id,title,description,duration_days,base_price,max_travelers,inclusions,status)
select 'bali-island-getaway', d.id, 'Bali Island Getaway', 'A 6-day curated trip to Bali.', 6, 52999, 10, ARRAY['Flights','Villa Stay','Breakfast','Temple Tours']::text[], 'published'
from public.destinations d where d.slug = 'bali'
on conflict (slug) do update set base_price=excluded.base_price;

insert into public.package_images (package_id,url,sort_order)
select id, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=700&q=80', 0 from public.travel_packages where slug='bali-island-getaway'
on conflict do nothing;

insert into public.travel_packages (slug,destination_id,title,description,duration_days,base_price,max_travelers,inclusions,status)
select 'tokyo-city-lights', d.id, 'Tokyo City Lights', 'A 6-day curated trip to Tokyo.', 6, 98999, 10, ARRAY['Flights','Hotel','JR Rail Pass','City Tour']::text[], 'published'
from public.destinations d where d.slug = 'tokyo'
on conflict (slug) do update set base_price=excluded.base_price;

insert into public.package_images (package_id,url,sort_order)
select id, 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=700&q=80', 0 from public.travel_packages where slug='tokyo-city-lights'
on conflict do nothing;

insert into public.travel_packages (slug,destination_id,title,description,duration_days,base_price,max_travelers,inclusions,status)
select 'swiss-alps-panorama', d.id, 'Swiss Alps Panorama', 'A 8-day curated trip to Switzerland.', 8, 145999, 10, ARRAY['Flights','4-Star Hotel','Scenic Train Pass','Breakfast']::text[], 'published'
from public.destinations d where d.slug = 'switzerland'
on conflict (slug) do update set base_price=excluded.base_price;

insert into public.package_images (package_id,url,sort_order)
select id, 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=700&q=80', 0 from public.travel_packages where slug='swiss-alps-panorama'
on conflict do nothing;

insert into public.travel_packages (slug,destination_id,title,description,duration_days,base_price,max_travelers,inclusions,status)
select 'dubai-desert-skyline', d.id, 'Dubai Desert & Skyline', 'A 4-day curated trip to Dubai.', 4, 42999, 10, ARRAY['Flights','Hotel','Desert Safari','Burj Khalifa Tickets']::text[], 'published'
from public.destinations d where d.slug = 'dubai'
on conflict (slug) do update set base_price=excluded.base_price;

insert into public.package_images (package_id,url,sort_order)
select id, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=700&q=80', 0 from public.travel_packages where slug='dubai-desert-skyline'
on conflict do nothing;

insert into public.travel_packages (slug,destination_id,title,description,duration_days,base_price,max_travelers,inclusions,status)
select 'ladakh-bike-expedition', d.id, 'Ladakh Bike Expedition', 'A 7-day curated trip to Ladakh.', 7, 32999, 10, ARRAY['Royal Enfield Rental','Camps & Hotels','All Meals','Permits']::text[], 'published'
from public.destinations d where d.slug = 'ladakh'
on conflict (slug) do update set base_price=excluded.base_price;

insert into public.package_images (package_id,url,sort_order)
select id, 'https://images.unsplash.com/photo-1589554566402-fe6c30589bfa?w=700&q=80', 0 from public.travel_packages where slug='ladakh-bike-expedition'
on conflict do nothing;

insert into public.travel_packages (slug,destination_id,title,description,duration_days,base_price,max_travelers,inclusions,status)
select 'andaman-island-hopper', d.id, 'Andaman Island Hopper', 'A 5-day curated trip to Andaman Islands.', 5, 24999, 10, ARRAY['Flights','Hotel','Ferry Transfers','Scuba Session']::text[], 'published'
from public.destinations d where d.slug = 'andaman-islands'
on conflict (slug) do update set base_price=excluded.base_price;

insert into public.package_images (package_id,url,sort_order)
select id, 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=700&q=80', 0 from public.travel_packages where slug='andaman-island-hopper'
on conflict do nothing;

-- ACTIVITIES
insert into public.activities (slug,destination_id,title,description,location,duration,price,capacity,status)
select 'paragliding-manali', d.id, 'Paragliding', 'Paragliding experience in Manali.', 'Manali', '2-3 hours', 2500, 15, 'published'
from public.destinations d where d.slug = 'manali'
on conflict (slug) do update set price=excluded.price;

insert into public.activity_images (activity_id,url,sort_order)
select id, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80', 0 from public.activities where slug='paragliding-manali'
on conflict do nothing;

insert into public.activities (slug,destination_id,title,description,location,duration,price,capacity,status)
select 'scuba-diving-andaman-islands', d.id, 'Scuba Diving', 'Scuba Diving experience in Andaman Islands.', 'Andaman Islands', '2-3 hours', 3800, 15, 'published'
from public.destinations d where d.slug = 'andaman-islands'
on conflict (slug) do update set price=excluded.price;

insert into public.activity_images (activity_id,url,sort_order)
select id, 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=400&q=80', 0 from public.activities where slug='scuba-diving-andaman-islands'
on conflict do nothing;

insert into public.activities (slug,destination_id,title,description,location,duration,price,capacity,status)
select 'trekking-ladakh', d.id, 'Trekking', 'Trekking experience in Ladakh.', 'Ladakh', '2-3 hours', 1200, 15, 'published'
from public.destinations d where d.slug = 'ladakh'
on conflict (slug) do update set price=excluded.price;

insert into public.activity_images (activity_id,url,sort_order)
select id, 'https://images.unsplash.com/photo-1501554728187-ce583db33af7?w=400&q=80', 0 from public.activities where slug='trekking-ladakh'
on conflict do nothing;

insert into public.activities (slug,destination_id,title,description,location,duration,price,capacity,status)
select 'camping-rajasthan', d.id, 'Camping', 'Camping experience in Rajasthan.', 'Rajasthan', '2-3 hours', 1800, 15, 'published'
from public.destinations d where d.slug = 'rajasthan'
on conflict (slug) do update set price=excluded.price;

insert into public.activity_images (activity_id,url,sort_order)
select id, 'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?w=400&q=80', 0 from public.activities where slug='camping-rajasthan'
on conflict do nothing;

insert into public.activities (slug,destination_id,title,description,location,duration,price,capacity,status)
select 'backwater-safari-kerala', d.id, 'Backwater Safari', 'Backwater Safari experience in Kerala.', 'Kerala', '2-3 hours', 4200, 15, 'published'
from public.destinations d where d.slug = 'kerala'
on conflict (slug) do update set price=excluded.price;

insert into public.activity_images (activity_id,url,sort_order)
select id, 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&q=80', 0 from public.activities where slug='backwater-safari-kerala'
on conflict do nothing;

insert into public.activities (slug,destination_id,title,description,location,duration,price,capacity,status)
select 'zipline-goa', d.id, 'Zipline', 'Zipline experience in Goa.', 'Goa', '2-3 hours', 1500, 15, 'published'
from public.destinations d where d.slug = 'goa'
on conflict (slug) do update set price=excluded.price;

insert into public.activity_images (activity_id,url,sort_order)
select id, 'https://images.unsplash.com/photo-1526459879853-6b2e0f07f1b8?w=400&q=80', 0 from public.activities where slug='zipline-goa'
on conflict do nothing;

-- SAMPLE COUPON
insert into public.coupons (code,description,discount_type,discount_value,min_purchase,max_discount,expires_at,usage_limit,per_user_limit,status)
values ('GOA500','₹500 off on any Goa booking','fixed',500,10000,500, now() + interval '90 days', 1000, 1, 'active')
on conflict (code) do nothing;
