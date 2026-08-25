-- Dados exclusivamente demonstrativos. Preços e especificações não são informações oficiais.
insert into public.brands (id, name, slug) values
  ('10000000-0000-4000-8000-000000000001','Toyota','toyota'),
  ('10000000-0000-4000-8000-000000000002','Jeep','jeep'),
  ('10000000-0000-4000-8000-000000000003','BMW','bmw'),
  ('10000000-0000-4000-8000-000000000004','Porsche','porsche'),
  ('10000000-0000-4000-8000-000000000005','Volkswagen','volkswagen'),
  ('10000000-0000-4000-8000-000000000006','Honda','honda'),
  ('10000000-0000-4000-8000-000000000007','Ford','ford'),
  ('10000000-0000-4000-8000-000000000008','Mercedes-Benz','mercedes-benz'),
  ('10000000-0000-4000-8000-000000000009','Audi','audi')
on conflict (id) do nothing;

insert into public.categories (id, name, slug) values
  ('20000000-0000-4000-8000-000000000001','Sedã','seda'),
  ('20000000-0000-4000-8000-000000000002','SUV','suv'),
  ('20000000-0000-4000-8000-000000000003','Picape','picape'),
  ('20000000-0000-4000-8000-000000000004','Esportivo','esportivo')
on conflict (id) do nothing;

insert into public.vehicle_models (brand_id, name, slug) values
  ('10000000-0000-4000-8000-000000000001','Corolla','corolla'),
  ('10000000-0000-4000-8000-000000000001','Hilux','hilux'),
  ('10000000-0000-4000-8000-000000000002','Compass','compass'),
  ('10000000-0000-4000-8000-000000000003','320i','320i'),
  ('10000000-0000-4000-8000-000000000004','911','911'),
  ('10000000-0000-4000-8000-000000000005','T-Cross','t-cross'),
  ('10000000-0000-4000-8000-000000000006','Civic','civic'),
  ('10000000-0000-4000-8000-000000000007','Ranger','ranger'),
  ('10000000-0000-4000-8000-000000000008','C 200','c-200'),
  ('10000000-0000-4000-8000-000000000009','Q5','q5')
on conflict (brand_id, slug) do nothing;

insert into public.vehicles (id,title,slug,brand,model,version,brand_id,category_id,manufacture_year,model_year,price,daily_price,mileage,fuel,transmission,color,doors,engine,power,category,purpose,status,description,location,featured,is_launch,show_price,price_on_request,created_at) values
('d1f601ba-f59c-45da-82cb-515855f88101','Porsche 911 Carrera','porsche-911-carrera-2026','Porsche','911','Carrera PDK','10000000-0000-4000-8000-000000000004','20000000-0000-4000-8000-000000000004',2025,2026,879900,null,1200,'Gasolina','Automático','Cinza Ágata',2,'3.0 biturbo','385 cv','Esportivo','sale','available','Um ícone reinterpretado com precisão. Configuração de baixa quilometragem e histórico documentado.','Fortaleza, CE',true,true,true,false,'2026-08-18'),
('d1f601ba-f59c-45da-82cb-515855f88102','Toyota Corolla XEi','toyota-corolla-xei-2026','Toyota','Corolla','XEi 2.0 Flex','10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001',2025,2026,169900,null,8400,'Flex','Automático CVT','Branco Pérola',4,'2.0 Dynamic Force','175 cv','Sedã','sale','available','Sedã equilibrado para quem exige conforto, confiabilidade e tecnologia.','Fortaleza, CE',true,false,true,false,'2026-08-16'),
('d1f601ba-f59c-45da-82cb-515855f88103','Toyota Hilux SRX','toyota-hilux-srx-2026','Toyota','Hilux','SRX 2.8 4x4','10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000003',2025,2026,349900,890,2600,'Diesel','Automático','Preto Attitude',4,'2.8 Turbo Diesel','204 cv','Picape','both','reserved','Força para longas distâncias e acabamento para uma rotina confortável.','Fortaleza, CE',true,true,true,false,'2026-08-14'),
('d1f601ba-f59c-45da-82cb-515855f88104','Jeep Compass Limited','jeep-compass-limited-2026','Jeep','Compass','Limited T270','10000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000002',2025,2026,224900,490,7300,'Flex','Automático','Cinza Sting',4,'1.3 Turbo','185 cv','SUV','both','available','SUV versátil com pacote completo de assistência e conectividade.','Fortaleza, CE',false,false,true,false,'2026-08-12'),
('d1f601ba-f59c-45da-82cb-515855f88105','BMW 320i M Sport','bmw-320i-m-sport-2025','BMW','320i','M Sport','10000000-0000-4000-8000-000000000003','20000000-0000-4000-8000-000000000001',2024,2025,329900,null,11900,'Gasolina','Automático','Azul Portimão',4,'2.0 TwinPower Turbo','184 cv','Sedã','sale','available','Proporção clássica, condução precisa e configuração M Sport.','Fortaleza, CE',true,false,false,true,'2026-08-10'),
('d1f601ba-f59c-45da-82cb-515855f88106','Volkswagen T-Cross','volkswagen-t-cross-highline-2025','Volkswagen','T-Cross','Highline 250 TSI','10000000-0000-4000-8000-000000000005','20000000-0000-4000-8000-000000000002',2024,2025,159900,360,16400,'Flex','Automático','Prata Pyrit',4,'1.4 TSI','150 cv','SUV','rental','available','SUV compacto e confortável para viagens ou rotina executiva.','Fortaleza, CE',false,false,true,false,'2026-08-08'),
('d1f601ba-f59c-45da-82cb-515855f88107','Honda Civic Advanced','honda-civic-advanced-hybrid-2025','Honda','Civic','Advanced Hybrid','10000000-0000-4000-8000-000000000006','20000000-0000-4000-8000-000000000001',2024,2025,274900,null,9800,'Híbrido','Automático e-CVT','Cinza Basalto',4,'2.0 Hybrid','184 cv','Sedã','sale','available','Tecnologia híbrida com resposta imediata e cabine minimalista.','Fortaleza, CE',false,true,true,false,'2026-08-06'),
('d1f601ba-f59c-45da-82cb-515855f88108','Ford Ranger Limited','ford-ranger-limited-2025','Ford','Ranger','Limited 3.0 V6','10000000-0000-4000-8000-000000000007','20000000-0000-4000-8000-000000000003',2024,2025,359900,null,18900,'Diesel','Automático','Laranja Delhi',4,'3.0 V6 Turbo Diesel','250 cv','Picape','sale','available','Desempenho V6, tecnologia e robustez para qualquer terreno.','Fortaleza, CE',false,false,true,false,'2026-08-04'),
('d1f601ba-f59c-45da-82cb-515855f88109','Mercedes-Benz C 200','mercedes-c200-amg-line-2025','Mercedes-Benz','C 200','AMG Line','10000000-0000-4000-8000-000000000008','20000000-0000-4000-8000-000000000001',2024,2025,389900,null,6700,'Híbrido leve','Automático','Preto Obsidiana',4,'1.5 Turbo EQ Boost','204 cv','Sedã','sale','sold','Cabine digital, acabamento AMG Line e refinamento executivo.','Fortaleza, CE',false,false,true,false,'2026-08-02'),
('d1f601ba-f59c-45da-82cb-515855f88110','Audi Q5 Performance','audi-q5-performance-2025','Audi','Q5','S line quattro','10000000-0000-4000-8000-000000000009','20000000-0000-4000-8000-000000000002',2024,2025,419900,990,10200,'Gasolina','S tronic','Verde Distrito',4,'2.0 TFSI','265 cv','SUV','both','rented','SUV equilibrado, tração quattro e cabine silenciosa.','Fortaleza, CE',false,false,false,true,'2026-07-30')
on conflict (id) do nothing;

insert into public.vehicle_images (vehicle_id,url,alt_text,is_cover,position) values
('d1f601ba-f59c-45da-82cb-515855f88101','/images/hero-velocity.png','Cupê esportivo premium',true,0),
('d1f601ba-f59c-45da-82cb-515855f88101','https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=88','Esportivo em estrada',false,1),
('d1f601ba-f59c-45da-82cb-515855f88101','https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=1800&q=88','Detalhe automotivo',false,2),
('d1f601ba-f59c-45da-82cb-515855f88102','https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1800&q=88','Sedã branco',true,0),
('d1f601ba-f59c-45da-82cb-515855f88103','https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1800&q=88','Picape em estrada',true,0),
('d1f601ba-f59c-45da-82cb-515855f88104','https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1800&q=88','SUV cinza',true,0),
('d1f601ba-f59c-45da-82cb-515855f88105','https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1800&q=88','Sedã esportivo azul',true,0),
('d1f601ba-f59c-45da-82cb-515855f88106','https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1800&q=88','SUV compacto prata',true,0),
('d1f601ba-f59c-45da-82cb-515855f88107','https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1800&q=88','Sedã moderno cinza',true,0),
('d1f601ba-f59c-45da-82cb-515855f88108','https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1800&q=88','Picape em paisagem aberta',true,0),
('d1f601ba-f59c-45da-82cb-515855f88109','https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1800&q=88','Sedã executivo preto',true,0),
('d1f601ba-f59c-45da-82cb-515855f88110','https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1800&q=88','SUV premium verde',true,0)
on conflict do nothing;

insert into public.vehicle_features (vehicle_id,name,position)
select vehicle_id, name, position from (values
('d1f601ba-f59c-45da-82cb-515855f88101'::uuid,'Bancos esportivos elétricos',0),('d1f601ba-f59c-45da-82cb-515855f88101'::uuid,'Câmera 360°',1),('d1f601ba-f59c-45da-82cb-515855f88101'::uuid,'Apple CarPlay',2),
('d1f601ba-f59c-45da-82cb-515855f88102'::uuid,'Toyota Safety Sense',0),('d1f601ba-f59c-45da-82cb-515855f88102'::uuid,'Bancos em couro',1),('d1f601ba-f59c-45da-82cb-515855f88102'::uuid,'Android Auto',2),
('d1f601ba-f59c-45da-82cb-515855f88103'::uuid,'Tração 4x4',0),('d1f601ba-f59c-45da-82cb-515855f88103'::uuid,'Controle de descida',1),('d1f601ba-f59c-45da-82cb-515855f88103'::uuid,'Câmera 360°',2),
('d1f601ba-f59c-45da-82cb-515855f88104'::uuid,'Teto panorâmico',0),('d1f601ba-f59c-45da-82cb-515855f88104'::uuid,'Park Assist',1),('d1f601ba-f59c-45da-82cb-515855f88104'::uuid,'Carregador por indução',2),
('d1f601ba-f59c-45da-82cb-515855f88105'::uuid,'Head-up display',0),('d1f601ba-f59c-45da-82cb-515855f88105'::uuid,'Bancos elétricos',1),('d1f601ba-f59c-45da-82cb-515855f88105'::uuid,'Assistente de faixa',2),
('d1f601ba-f59c-45da-82cb-515855f88106'::uuid,'Painel digital',0),('d1f601ba-f59c-45da-82cb-515855f88106'::uuid,'Piloto adaptativo',1),('d1f601ba-f59c-45da-82cb-515855f88106'::uuid,'Chave presencial',2),
('d1f601ba-f59c-45da-82cb-515855f88107'::uuid,'Honda Sensing',0),('d1f601ba-f59c-45da-82cb-515855f88107'::uuid,'Teto solar',1),('d1f601ba-f59c-45da-82cb-515855f88107'::uuid,'Câmera multivisão',2),
('d1f601ba-f59c-45da-82cb-515855f88108'::uuid,'Matriz LED',0),('d1f601ba-f59c-45da-82cb-515855f88108'::uuid,'Bloqueio diferencial',1),('d1f601ba-f59c-45da-82cb-515855f88108'::uuid,'Câmera 360°',2),
('d1f601ba-f59c-45da-82cb-515855f88109'::uuid,'MBUX',0),('d1f601ba-f59c-45da-82cb-515855f88109'::uuid,'Burmester',1),('d1f601ba-f59c-45da-82cb-515855f88109'::uuid,'Pacote AMG Line',2),
('d1f601ba-f59c-45da-82cb-515855f88110'::uuid,'Virtual Cockpit',0),('d1f601ba-f59c-45da-82cb-515855f88110'::uuid,'Bang & Olufsen',1),('d1f601ba-f59c-45da-82cb-515855f88110'::uuid,'Matrix LED',2)
) as data(vehicle_id,name,position)
on conflict (vehicle_id,name) do nothing;

insert into public.launches (id,title,slug,subtitle,excerpt,content,cover_image_url,vehicle_id,published_at,featured) values
('30000000-0000-4000-8000-000000000001','A nova era do 911','a-nova-era-do-911','Precisão que atravessa gerações','O desenho permanece inconfundível. A tecnologia muda tudo o que acontece por baixo dele.','Editorial demonstrativo sobre design, engenharia e condução.','/images/hero-velocity.png','d1f601ba-f59c-45da-82cb-515855f88101','2026-08-18',true),
('30000000-0000-4000-8000-000000000002','Eficiência com resposta','hibridos-sem-abrir-mao-do-prazer','A condução híbrida amadureceu','Uma seleção que combina silêncio urbano, autonomia e resposta.','Editorial demonstrativo sobre tecnologias híbridas.','https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=1800&q=88','d1f601ba-f59c-45da-82cb-515855f88107','2026-08-06',true),
('30000000-0000-4000-8000-000000000003','Força com outro acabamento','picapes-para-alem-do-trabalho','Picapes que também são cabine executiva','Capacidade real para estrada e conforto suficiente para atravessar o país.','Editorial demonstrativo sobre picapes premium.','https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1800&q=88','d1f601ba-f59c-45da-82cb-515855f88108','2026-07-28',false)
on conflict (id) do nothing;

insert into public.banners (id,title,subtitle,desktop_image_url,mobile_image_url,cta_label,cta_url,active,position) values
('40000000-0000-4000-8000-000000000001','Porsche 911 Carrera','Um ícone, precisamente agora.','/images/hero-velocity.png','/images/hero-velocity.png','Conhecer veículo','/veiculos/porsche-911-carrera-2026',true,1),
('40000000-0000-4000-8000-000000000002','Mobilidade sem intervalo','Locação para cada distância.','https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=1800&q=88','https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=900&q=88','Ver locações','/veiculos?finalidade=rental',true,2),
('40000000-0000-4000-8000-000000000003','Curadoria executiva','Sedãs escolhidos por configuração.','https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1800&q=88','https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=88','Explorar','/veiculos',true,3)
on conflict (id) do nothing;

insert into public.whatsapp_numbers (id,name,responsible,number,sector,default_message,active,is_primary,priority) values
('50000000-0000-4000-8000-000000000001','Vendas','Rafael','+55 85 99999-1001','sales','Olá! Quero falar com um especialista em vendas.',true,true,1),
('50000000-0000-4000-8000-000000000002','Locação','Marina','+55 85 99999-1002','rental','Olá! Quero conhecer as opções de locação.',true,false,2),
('50000000-0000-4000-8000-000000000003','Atendimento','Equipe Wellington','+55 85 99999-1003','support','Olá! Preciso de atendimento.',true,false,3)
on conflict (id) do nothing;

insert into public.site_settings (key,value,is_public) values
('company_name','"Wellington Veículos"',true),('trade_name','"Wellington Veículos e Locações"',true),('slogan','"Curadoria para quem escolhe a estrada."',true),('address','"Av. Washington Soares, 3200"',true),('city','"Fortaleza"',true),('state','"CE"',true),('phone','"+55 85 3200-2026"',true),('email','"contato@wellingtonveiculos.com.br"',true),('hours','"Seg a sex, 8h às 18h · Sáb, 8h às 13h"',true),('about','"Selecionamos automóveis com procedência, configuração relevante e atendimento à altura de cada escolha."',true),('logo_url','""',true),('alternate_logo_url','""',true),('favicon_url','""',true),('maps_url','""',true),('hero_url','"/images/hero-velocity.png"',true),('primary_color','"#08090A"',true),('accent_color','"#DFFF3F"',true),('show_sold_vehicles','false',true)
on conflict (key) do nothing;

insert into public.social_links (platform,url,active,position) values
('instagram','https://instagram.com',true,1),('facebook','https://facebook.com',true,2),('tiktok','https://tiktok.com',true,3),('youtube','https://youtube.com',true,4)
on conflict (platform) do nothing;
