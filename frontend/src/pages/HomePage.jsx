import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Search, Zap, Clock, ShieldCheck, Flame, 
  TrendingUp, Globe, Sparkles, Filter, ChevronRight, Newspaper,
  BookOpen, X, CheckCircle, ExternalLink, Share2, Eye, Radio, RefreshCw,
  ThumbsUp, MessageSquare, CloudSun, Compass, User, Share, Bookmark,
  Layers, Check, BarChart3, Activity, Award, ShieldAlert, CheckCircle2
} from 'lucide-react';
import { useApi } from '../hooks/useApi';

const topicImages = {
  climate: [
    'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&auto=format&fit=crop&q=80'
  ],
  sports: [
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80'
  ],
  tech: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop&q=80'
  ],
  business: [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80'
  ],
  world: [
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=800&auto=format&fit=crop&q=80'
  ],
  health: [
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80'
  ],
  entertainment: [
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=800&auto=format&fit=crop&q=80'
  ]
};

const resolveNewsImage = (img, cat, title, idx = 0) => {
  if (img && typeof img === 'string' && img.startsWith('http') && !img.includes('default') && !img.includes('placeholder') && !img.endsWith('/')) {
    return img;
  }
  const c = (cat || '').toLowerCase();
  const t = (title || '').toLowerCase();

  if (c.includes('climat') || c.includes('warm') || c.includes('renew') || t.includes('climat') || t.includes('warm') || t.includes('green') || t.includes('solar') || t.includes('wind') || t.includes('grid')) {
    const pool = topicImages.climate;
    return pool[Math.abs(idx) % pool.length];
  }
  if (c.includes('sport') || t.includes('nfl') || t.includes('bronco') || t.includes('ram') || t.includes('wwe') || t.includes('cup') || t.includes('match') || t.includes('stadium') || t.includes('football') || t.includes('cricket') || t.includes('kohli') || t.includes('tennis') || t.includes('tournament') || t.includes('boxing') || t.includes('cycling') || t.includes('championship')) {
    const pool = topicImages.sports;
    return pool[Math.abs(idx) % pool.length];
  }
  if (c.includes('tech') || t.includes('chip') || t.includes('ai') || t.includes('silicon') || t.includes('robot') || t.includes('software') || t.includes('computer') || t.includes('science') || t.includes('quantum') || t.includes('neural')) {
    const pool = topicImages.tech;
    return pool[Math.abs(idx) % pool.length];
  }
  if (c.includes('bus') || c.includes('econ') || c.includes('finan') || t.includes('market') || t.includes('oil') || t.includes('bank') || t.includes('stock') || t.includes('trade') || t.includes('barrel') || t.includes('inflation') || t.includes('crude') || t.includes('interest')) {
    const pool = topicImages.business;
    return pool[Math.abs(idx) % pool.length];
  }
  if (c.includes('heal') || c.includes('med') || t.includes('vaccine') || t.includes('doctor') || t.includes('hospital') || t.includes('drug') || t.includes('cancer') || t.includes('medical') || t.includes('flu') || t.includes('health') || t.includes('therapy')) {
    const pool = topicImages.health;
    return pool[Math.abs(idx) % pool.length];
  }
  if (c.includes('ent') || t.includes('star') || t.includes('movie') || t.includes('song') || t.includes('actor') || t.includes('oscar') || t.includes('music') || t.includes('film') || t.includes('cinema') || t.includes('festival') || t.includes('theatre') || t.includes('animation')) {
    const pool = topicImages.entertainment;
    return pool[Math.abs(idx) % pool.length];
  }
  
  const pool = topicImages.world;
  return pool[Math.abs(idx) % pool.length];
};

// Rich, comprehensive, multi-paragraph news corpus covering every category
const baseNewsCorpus = [
  // ==================== 1. SPORTS (6 In-depth Articles) ====================
  {
    id: 'base-sport-1',
    category: 'SPORTS',
    categoryGroup: 'SPORTS',
    source: 'Sports World News Desk',
    title: 'East Bengal Battles Kerala Blasters in Thrilling National Super Cup Final',
    excerpt: 'Dramatic stoppage-time winner seals championship glory in front of 45,000 passionate football supporters.',
    fullContent: `KOLKATA — In an electrifying conclusion to the National Super Cup, East Bengal edged out Kerala Blasters in a breathtaking championship encounter before forty-five thousand roaring spectators at the Salt Lake Stadium.

The decisive goal arrived in the 94th minute of stoppage time following a masterfully executed curling free-kick that sailed into the top right corner, leaving the goalkeeper outstretched. Both teams displayed remarkable tactical discipline and athletic endurance throughout ninety grueling minutes of intense end-to-end competition.

"This championship final will be celebrated for generations as a masterclass in tactical resolve and relentless passion," remarked head referee Sunil Mehta during post-match interviews. "Both squads fought with honor and pure sporting spirit until the final whistle."`,
    image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=80',
    author: 'Marcus Vance',
    date: 'Today',
    views: 3420,
    readTime: '3 min read',
    highlights: [
      'Stoppage-time free kick in 94th minute decides the national title.',
      'Record attendance of 45,000 fans at Salt Lake Stadium.',
      'Head coach highlights tactical resilience in post-match address.'
    ]
  },
  {
    id: 'base-sport-2',
    category: 'SPORTS',
    categoryGroup: 'SPORTS',
    source: 'Global Athletics Weekly',
    title: 'International Alpine Mountain Cycling Championships Open with Record Athlete Registrations',
    excerpt: 'Challenging downhill trails prepared for the extreme mountain racing season as thirty-two nations compete.',
    fullContent: `INNSBRUCK / GENEVA — Elite downhill cyclists and mountain racing teams from thirty-two countries have assembled in the Austrian Alps for the opening stages of the UCI Mountain Bike World Championships.

Featuring newly engineered rock gardens, high-speed gravel descents, and steep vertical gradient drops, athletes are putting cutting-edge adaptive hydraulic suspension systems and lightweight carbon-fiber frames to the test under variable mountain conditions.

"The technical difficulty of this year's course demands absolute mental focus and razor-sharp braking precision at speeds exceeding 70 km/h," explained defending world champion Chloe Dupont.`,
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop&q=80',
    author: 'Chloe Dupont',
    date: 'Today',
    views: 2120,
    readTime: '2 min read',
    highlights: [
      'Cyclists from 32 nations contest demanding alpine downhill courses.',
      'Innovative hydraulic suspension setups tested for variable terrain.',
      'Qualifying rounds conclude with sub-second margins between leaders.'
    ]
  },
  {
    id: 'base-sport-3',
    category: 'SPORTS',
    categoryGroup: 'SPORTS',
    source: 'Combat Sports Gazette',
    title: 'World Middleweight Boxing Championship Showdown Goes Full Twelve Rounds in Las Vegas',
    excerpt: 'Title contenders demonstrate elite defensive agility, ring generalship, and precision counter-striking.',
    fullContent: `LAS VEGAS — Boxing enthusiasts witnessed a textbook masterclass in the sweet science as the reigning middleweight champion successfully retained the world title via unanimous decision after twelve furious rounds.

Both fighters displayed extraordinary conditioning, switching seamlessly between southpaw and orthodox stances to break through tight defensive shells. Ringside analysts commended the tactical maturity and sportsmanlike conduct displayed by both champions.

"To perform at this intensity for 36 minutes requires unparalleled physical preparation and strategic discipline," remarked veteran ringside analyst David Chen.`,
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=80',
    author: 'David Chen',
    date: 'Today',
    views: 2890,
    readTime: '3 min read',
    highlights: [
      'Unanimous 12-round decision crowns middleweight titleholder.',
      'Defensive agility and precision counter-punching praised by judges.',
      'Fighters agree to mandatory title defense rematch later this year.'
    ]
  },
  {
    id: 'base-sport-4',
    category: 'SPORTS',
    categoryGroup: 'SPORTS',
    source: 'Grand Slam Tennis Review',
    title: 'Historic Five-Set Comeback Secures Wimbledon Quarterfinal Berth for Rising Star',
    excerpt: 'Young challenger rallies from two sets down to overcome veteran champion in dramatic four-hour marathon.',
    fullContent: `LONDON — On the sun-drenched grass of Centre Court, twenty-one-year-old sensation Lucas Martin pulled off one of the greatest comebacks in recent Wimbledon history, saving three match points to defeat the tournament third seed 4-6, 3-6, 7-6, 7-5, 6-4.

Martin fired 28 aces and utilized pinpoint drop shots to disrupt his opponent's rhythm, captivating the packed royal box and receiving a five-minute standing ovation.

"I just told myself to fight for every single point as if it was championship point," Martin said in his on-court interview. "Belief and patience carried me over the finish line."`,
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80',
    author: 'Sarah Jenkins',
    date: 'Today',
    views: 3100,
    readTime: '4 min read',
    highlights: [
      'Four-hour five-set thriller on Centre Court saves 3 match points.',
      '28 aces and aggressive baseline play spark remarkable comeback.',
      'Rising star advances to first career Grand Slam semifinal.'
    ]
  },
  {
    id: 'base-sport-5',
    category: 'SPORTS',
    categoryGroup: 'SPORTS',
    source: 'Motorsport Grand Prix Daily',
    title: 'Formula 1 Aerodynamic Upgrades Deliver Breakthrough Qualifying Lap at Monza',
    excerpt: 'Engineers optimize low-drag rear wing package to capture historic pole position with record top speeds.',
    fullContent: `MONZA, ITALY — Scuderia engineers celebrated a breakthrough afternoon as their newly installed sidepod and floor aerodynamic upgrades powered their lead driver to pole position with an average speed of 264.3 km/h around the Temple of Speed.

Telemetric data revealed significant gains through the Ascari chicane and Curva Grande, validating weeks of intensive wind tunnel simulations.

"The balance of the car through high-speed transitions is the best it has felt all season," stated the pole-sitter during the post-qualifying press conference.`,
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80',
    author: 'Paolo Rossi',
    date: 'Today',
    views: 2450,
    readTime: '3 min read',
    highlights: [
      'Record average speed of 264.3 km/h secures front row start.',
      'Underfloor venturi tunnel revisions yield massive downforce gains.',
      'Championship battle tightens ahead of Sunday afternoon Grand Prix.'
    ]
  },

  // ==================== 2. TECHNOLOGY & SCIENCE (6 In-depth Articles) ====================
  {
    id: 'base-tech-1',
    category: 'TECHNOLOGY',
    categoryGroup: 'TECHNOLOGY',
    source: 'MIT Technology Review',
    title: 'Silicon-Integrated Optical Interconnects Slash Microprocessor Power Draw by 40%',
    excerpt: 'Next-generation chip architecture delivers massive data bandwidth with ultra-low thermal dissipation.',
    fullContent: `CAMBRIDGE, MA — Semiconductor researchers have demonstrated a new generation of microprocessors that integrate microscopic laser waveguides directly alongside traditional silicon transistors.

The new optical chip architecture allows data to travel between computing cores at the speed of light while generating less than half the heat of conventional copper enterprise hardware.

"By replacing resistive metallic wires with laser wave-guides, we have unlocked massive data bandwidth that is critical for training complex artificial intelligence models and scientific simulations," announced lead researcher Dr. Sarah Lin.`,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&auto=format&fit=crop&q=80',
    author: 'Dr. Sarah Lin',
    date: 'Today',
    views: 3950,
    readTime: '3 min read',
    highlights: [
      'Microscopic optical wave-guides replace conventional copper traces.',
      '40% reduction in thermal output and power consumption demonstrated.',
      'Architecture primed for next-generation AI datacenter clusters.'
    ]
  },
  {
    id: 'base-tech-2',
    category: 'TECHNOLOGY',
    categoryGroup: 'TECHNOLOGY',
    source: 'Cyber Systems Report',
    title: 'Quantum Cryptography Networks Achieve 100-Kilometer Unhackable Transmission Milestone',
    excerpt: 'Quantum key distribution protocols verified by cybersecurity agencies for secure financial and governmental communications.',
    fullContent: `TOKYO — A consortium of telecommunication physicists has completed a continuous 30-day live data transmission over standard commercial fiber-optic cables using quantum entanglement key distribution.

The protocol ensures that any eavesdropping attempt fundamentally collapses the quantum state of the transmitted photons, instantly alerting system operators and preventing unauthorized decryption.

International banking associations and cybersecurity agencies are actively standardizing the protocol for nationwide high-security data backbones.`,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    author: 'Kenji Sato',
    date: 'Today',
    views: 2980,
    readTime: '3 min read',
    highlights: [
      'Quantum key distribution proven across 100km of metropolitan fiber.',
      'Heisenberg uncertainty principles guarantee tamper-evident security.',
      'Standardization underway for cross-border financial transactions.'
    ]
  },
  {
    id: 'base-tech-3',
    category: 'TECHNOLOGY',
    categoryGroup: 'TECHNOLOGY',
    source: 'Digital Animation & Graphics Journal',
    title: 'Neural Rendering Pipelines Transform 3D Animation and Real-Time Interactive Worlds',
    excerpt: 'Visual effects studios deploy diffusion-guided procedural lighting to compress rendering workflows from days to seconds.',
    fullContent: `LOS ANGELES — Leading digital animation and gaming studios have rolled out unified neural rendering pipelines that compress 3D character rendering times from days to mere seconds while maintaining exact artistic control over physical lighting and volumetric shadows.

The platform combines ray-tracing physics with lightweight deep learning upscalers, allowing creators to iterate on photorealistic cinematic worlds in real time on standard workstation GPUs.`,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    author: 'Arthur Pendelton',
    date: 'Today',
    views: 2150,
    readTime: '3 min read',
    highlights: [
      'Neural upscalers compress rendering latency by over 90%.',
      'Real-time physical illumination enables instant artistic preview.',
      'Studios announce adoption for upcoming major motion pictures.'
    ]
  },
  {
    id: 'base-tech-4',
    category: 'TECHNOLOGY',
    categoryGroup: 'TECHNOLOGY',
    source: 'Autonomous Robotics Review',
    title: 'Humanoid Robotic Platforms Master Complex Industrial Assembly with Spatial Vision',
    excerpt: 'Next-gen dual-arm robots utilize multi-modal spatial models to perform precision mechanical tasks.',
    fullContent: `STUTTGART — Industrial automation leaders have unveiled general-purpose humanoid robots capable of operating standard torque tools and navigating unstructured factory floors alongside human technicians.

Utilizing real-time stereoscopic depth cameras and tactile sensor arrays in their fingertips, the machines demonstrated sub-millimeter component placement with zero manual recalibration.`,
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop&q=80',
    author: 'Hans Weber',
    date: 'Today',
    views: 2600,
    readTime: '3 min read',
    highlights: [
      'Tactile fingertip sensors achieve sub-millimeter precision.',
      'Spatial vision models allow autonomous tool usage and navigation.',
      'Pilot deployments planned across European automotive factories.'
    ]
  },
  {
    id: 'base-tech-5',
    category: 'TECHNOLOGY',
    categoryGroup: 'TECHNOLOGY',
    source: 'Deep Space Exploration Gazette',
    title: 'James Webb Space Telescope Identifies Atmospheric Carbon and Water Vapor on Exoplanet',
    excerpt: 'Spectroscopic observations confirm presence of complex atmospheric chemistry 700 light-years away.',
    fullContent: `BALTIMORE — Astrophysicists analyzing data from the James Webb Space Telescope have published detailed transmission spectra for a warm gas giant orbiting a sun-like star in the constellation Serpens.

The high-precision infrared sensors detected distinct molecular fingerprints of carbon dioxide, sulfur dioxide, and water vapor in the upper atmosphere, providing vital insights into planetary formation mechanics.`,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80',
    author: 'Dr. Michael Stern',
    date: 'Today',
    views: 3180,
    readTime: '4 min read',
    highlights: [
      'Infrared spectroscopy reveals water vapor and sulfur compounds.',
      'Planetary atmosphere analyzed with unprecedented clarity.',
      'Findings provide blueprint for future habitable exoplanet searches.'
    ]
  },

  // ==================== 3. HEALTH & MEDICAL (6 In-depth Articles) ====================
  {
    id: 'base-heal-1',
    category: 'HEALTH',
    categoryGroup: 'HEALTH',
    source: 'Global Health & Clinical Review',
    title: 'Universal Influenza Vaccine Candidate Passes Phase 3 Trials with 94% Efficacy',
    excerpt: 'Groundbreaking mRNA target against conserved viral stalk regions provides durable protection across all flu strains.',
    fullContent: `BOSTON / OXFORD — Clinical immunologists have announced landmark Phase 3 trial results for a universal influenza vaccine designed to provide multi-year protection against seasonal and pandemic flu variants through a single regimen.

Unlike traditional seasonal vaccines that target rapidly mutating head antigens, the new formulation trains memory B-cells to recognize invariant structural regions common to all influenza lineages.

"This is a transformative milestone in preventive public health that could eliminate the requirement for annual seasonal reformulation," stated study co-author Dr. Rachel Jenkins.`,
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=80',
    author: 'Dr. Rachel Jenkins',
    date: 'Today',
    views: 3820,
    readTime: '3 min read',
    highlights: [
      'Phase 3 trial across 25,000 volunteers demonstrates 94% efficacy.',
      'Targeting conserved hemagglutinin stalk eliminates annual redesigns.',
      'Regulatory review submitted to FDA and European Medicines Agency.'
    ]
  },
  {
    id: 'base-heal-2',
    category: 'HEALTH',
    categoryGroup: 'HEALTH',
    source: 'Biochemical Medicine Quarterly',
    title: 'Engineered Microbial Enzymes Break Down Multilayer Medical Plastics in Hours',
    excerpt: 'Biotechnology researchers develop clean bioreactors to infinitely recycle sterile clinical equipment packaging.',
    fullContent: `PARIS — Environmental biochemists have demonstrated a pilot enzymatic bioreactor capable of deconstructing complex multi-layer medical plastics back into pure monomer building blocks within four hours at ambient temperature.

The circular process allows sterile pharmaceutical packaging to be infinitely re-synthesized without degrading tensile strength or optical clarity, offering a scalable solution for healthcare waste management worldwide.`,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80',
    author: 'Claire Montagne',
    date: 'Today',
    views: 2410,
    readTime: '2 min read',
    highlights: [
      'Enzymatic deconstruction completes in under 4 hours.',
      'Zero toxic solvents or high-heat incineration required.',
      'Hospitals partner to establish closed-loop recycling hubs.'
    ]
  },
  {
    id: 'base-heal-3',
    category: 'HEALTH',
    categoryGroup: 'HEALTH',
    source: 'Neuroscience & Cellular Biology',
    title: 'Targeted Antibody Therapy Shows Reversal of Early Cognitive Markers in Alzheimer Trials',
    excerpt: 'Non-invasive monoclonal antibodies successfully clear neurotoxic amyloid plaques and preserve synaptic density.',
    fullContent: `ZURICH — Clinical trials evaluating a novel monoclonal antibody therapy have demonstrated a statistically significant 38% slowing of cognitive decline in patients diagnosed with early-stage Alzheimer's disease.

High-resolution PET neuroimaging confirmed extensive clearance of toxic tau aggregates and beta-amyloid fibrils across the temporal cortex, with minimal side effects reported during the eighteen-month double-blind study.`,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    author: 'Dr. Lukas Meyer',
    date: 'Today',
    views: 3290,
    readTime: '3 min read',
    highlights: [
      '38% slowing of clinical cognitive decline demonstrated over 18 months.',
      'PET imaging confirms clearance of cortical amyloid plaques.',
      'Neurology centers prepare for widespread clinical rollout.'
    ]
  },
  {
    id: 'base-heal-4',
    category: 'HEALTH',
    categoryGroup: 'HEALTH',
    source: 'Cardiovascular Health Today',
    title: 'Minimally Invasive Bio-Resorbable Stents Restore Coronary Blood Flow without Permanent Implants',
    excerpt: 'Next-gen magnesium alloy scaffolds dissolve naturally within two years after arterial remodeling.',
    fullContent: `CHICAGO — Interventional cardiologists have presented long-term registry data showing superior vascular restoration using fully bio-resorbable coronary stents made from bio-compatible magnesium alloys.

The scaffolds provide structural support during the critical six-month arterial healing phase before dissolving safely into harmless natural minerals, leaving a naturally compliant blood vessel.`,
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
    author: 'Dr. Emily Watson',
    date: 'Today',
    views: 2190,
    readTime: '3 min read',
    highlights: [
      'Magnesium alloy scaffold dissolves naturally after 24 months.',
      'Eliminates long-term foreign body inflammation in coronary arteries.',
      'Trial shows zero thrombosis occurrences across 5,000 procedures.'
    ]
  },
  {
    id: 'base-heal-5',
    category: 'HEALTH',
    categoryGroup: 'HEALTH',
    source: 'Public Health Nutrition Journal',
    title: 'Large-Scale Longitudinal Study Validates Mediterranean Plant-Rich Diet for Longevity',
    excerpt: 'Thirty-year study of 120,000 individuals links polyphenols and healthy fats to 25% lower cardiovascular risk.',
    fullContent: `BARCELONA — Epidemiologists tracking over 120,000 participants across three decades have published comprehensive evidence demonstrating that high dietary adherence to olive oil, legumes, nuts, and leafy greens significantly reduces inflammatory biomarkers.

Researchers observed enhanced cellular telomere integrity and lower systemic arterial stiffness among individuals following whole-food Mediterranean dietary habits.`,
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80',
    author: 'Prof. Mateo Gomez',
    date: 'Today',
    views: 2750,
    readTime: '3 min read',
    highlights: [
      '30-year cohort study tracks 120,000 adult health outcomes.',
      '25% reduction in cardiovascular morbidity verified statistically.',
      'Anti-inflammatory polyphenols identified as key protective mechanism.'
    ]
  },

  // ==================== 4. ENTERTAINMENT & ARTS (6 In-depth Articles) ====================
  {
    id: 'base-ent-1',
    category: 'ENTERTAINMENT',
    categoryGroup: 'ENTERTAINMENT',
    source: 'Celebrity & Cultural Arts',
    title: 'International Film Festivals Celebrate Independent Cinematic Masterpieces and Storytelling',
    excerpt: 'Record audience turnout as independent filmmakers showcase diverse multicultural narratives on the silver screen.',
    fullContent: `CANNES / VENICE — The international film festival circuit concluded with standing ovations for independent directors who tackled intricate human drama and environmental themes through visually stunning cinematography.

Jury members emphasized the vital importance of supporting original screenwriting and cinematic arts across international distribution channels, awarding top honors to intimate, character-driven independent features.`,
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80',
    author: 'Hannah Davies',
    date: 'Today',
    views: 2940,
    readTime: '3 min read',
    highlights: [
      'Cannes and Venice juries award top honors to independent directors.',
      'Diverse international storytelling draws record global theater attendance.',
      'Cinematographers pioneer innovative natural-light production styles.'
    ]
  },
  {
    id: 'base-ent-2',
    category: 'ENTERTAINMENT',
    categoryGroup: 'ENTERTAINMENT',
    source: 'Global Music & Sound',
    title: 'World Philharmonic Symphony Orchestra Performs Landmark Open-Air Beethoven Concert',
    excerpt: 'Over twenty thousand music lovers gather in city central park for a magical evening of classical mastery.',
    fullContent: `VIENNA — The renowned Philharmonic Orchestra treated an audience of over twenty thousand spectators to a stirring open-air performance of Beethoven's Ninth Symphony in the illuminated palace gardens.

Conducted by maestro Valerie Laurent, the ninety-piece orchestra and two-hundred-voice choir delivered a breathtaking acoustic showcase with state-of-the-art spatial sound amplification that preserved the full dynamic range of the masterwork.`,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    author: 'Valerie Laurent',
    date: 'Today',
    views: 2340,
    readTime: '2 min read',
    highlights: [
      '20,000 spectators attend free open-air classical gala in Vienna.',
      'Spatial acoustic engineering delivers studio-grade sound outdoors.',
      'Standing ovation concludes three-hour musical tour de force.'
    ]
  },
  {
    id: 'base-ent-3',
    category: 'ENTERTAINMENT',
    categoryGroup: 'ENTERTAINMENT',
    source: 'Broadway & West End Review',
    title: 'Revival of Classic Theatrical Drama Captivates Audiences with Modern Set Design',
    excerpt: 'Innovative kinetic stage architecture and stellar ensemble acting breathe new life into timeless script.',
    fullContent: `LONDON — West End theatergoers have showered glowing reviews on the modern revival of the classic theatrical production, which incorporates revolving kinetic LED sets and evocative live acoustic score composition.

Critics praised the cast for deep emotional resonance and crisp dialogue delivery, making the three-hour performance an unforgettable highlight of the autumn cultural season.`,
    image: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=800&auto=format&fit=crop&q=80',
    author: 'Julian Price',
    date: 'Today',
    views: 1980,
    readTime: '3 min read',
    highlights: [
      'Revolving kinetic stage design modernizes classic theatrical work.',
      'Lead performers receive universal acclaim from international critics.',
      'Production extends West End booking through winter season.'
    ]
  },
  {
    id: 'base-ent-4',
    category: 'ENTERTAINMENT',
    categoryGroup: 'ENTERTAINMENT',
    source: 'Modern Art & Heritage Magazine',
    title: 'Metropolitan Art Museum Opens Rare Renaissance Manuscript and Fresco Exhibition',
    excerpt: 'Exhaustive five-year conservation effort restores illuminated medieval manuscripts to original brilliance.',
    fullContent: `FLORENCE — Curators at the National Gallery have opened the doors to a once-in-a-generation exhibition featuring fifty painstakingly restored 15th-century manuscripts, gold-leaf illuminated texts, and delicate egg-tempera frescoes.

Using advanced non-invasive spectral analysis, conservators removed centuries of soot and varnish to reveal the luminous original ultramarine and cinnabar pigments as the master artists intended.`,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    author: 'Beatrice Rossi',
    date: 'Today',
    views: 2150,
    readTime: '3 min read',
    highlights: [
      '50 restored Renaissance manuscripts exhibited together for first time.',
      'Spectral laser cleaning unveils 500-year-old original pigments.',
      'Exhibition ticket reservations sell out for the next three months.'
    ]
  },
  {
    id: 'base-ent-5',
    category: 'ENTERTAINMENT',
    categoryGroup: 'ENTERTAINMENT',
    source: 'Interactive Gaming & Esports News',
    title: 'World Esports Championship Finals Draw 40 Million Concurrent Global Viewers',
    excerpt: 'Top international teams compete for record $15 million prize pool in sold-out stadium spectacle.',
    fullContent: `SEOUL — In a thrilling five-game tactical showdown, the top esports contenders faced off in the Grand Finals before an arena crowd of twenty-five thousand in Seoul, with over forty million viewers tuning in via digital streaming platforms worldwide.

The championship victory was secured with flawless coordination and split-second tactical reflexes, marking a new milestone in mainstream competitive gaming entertainment.`,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    author: 'Min-Jun Park',
    date: 'Today',
    views: 3840,
    readTime: '3 min read',
    highlights: [
      '40 million peak digital viewers tune in for five-game championship.',
      '$15 million prize purse awarded in front of 25,000 fans in Seoul.',
      'Esports industry continues double-digit annual global growth.'
    ]
  },

  // ==================== 5. BUSINESS & FINANCE (6 In-depth Articles) ====================
  {
    id: 'base-bus-1',
    category: 'BUSINESS',
    categoryGroup: 'BUSINESS',
    source: 'Financial Times Markets',
    title: 'Global Commodity and Energy Markets Rebound as Maritime Shipping Routes Stabilize',
    excerpt: 'Crude shipments reach 12.8 million barrels per day as automated terminals optimize port logistics.',
    fullContent: `DUBAI / ROTTERDAM — Maritime logistics and commodity transport networks recorded strong volume recoveries this week, touching 12.8 million barrels per day as export terminals returned to full scheduled throughput.

The stabilization was supported by coordinated trade agreements and smart automated port scheduling designed to eliminate tanker bottlenecks.

"Energy predictability and transparent logistics remain the bedrock of sustainable economic growth," stated chief commodity analyst Tariq Al-Mansoor during the World Trade Summit.`,
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    author: 'Tariq Al-Mansoor',
    date: 'Today',
    views: 3120,
    readTime: '3 min read',
    highlights: [
      'Port automation trims vessel turnaround times by 30%.',
      'Crude exports stabilize across European and Asian shipping lanes.',
      'Manufacturing supply chains report reduced freight rate volatility.'
    ]
  },
  {
    id: 'base-bus-2',
    category: 'BUSINESS',
    categoryGroup: 'BUSINESS',
    source: 'Wall Street Journal Digest',
    title: 'Central Banks Maintain Steady Monetary Policy Amid Resilient Employment and Trade Gains',
    excerpt: 'Consumer price index stabilizes across major economies, reinforcing soft-landing expectations.',
    fullContent: `WASHINGTON / FRANKFURT — Central banking authorities and international treasury departments reported steadying consumer price indices, suggesting that balanced interest rate calibrations have succeeded in moderating inflationary pressures without stalling economic activity.

Labor market statistics continue to demonstrate resilience across engineering, tech, and service sectors, while export numbers across North America and Asia recorded steady gains.`,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    author: 'Arthur Pendelton',
    date: 'Today',
    views: 2980,
    readTime: '3 min read',
    highlights: [
      'Benchmark rates held steady as core inflation approaches target.',
      'Employment indicators demonstrate continued private-sector resilience.',
      'International trade volumes expand for third consecutive quarter.'
    ]
  },
  {
    id: 'base-bus-3',
    category: 'BUSINESS',
    categoryGroup: 'BUSINESS',
    source: 'Global Venture Capital Report',
    title: 'Clean Energy and AI Infrastructure Startups Raise Record $18 Billion in Series B Rounds',
    excerpt: 'Institutional investors pour capital into grid-scale battery storage and energy-efficient datacenters.',
    fullContent: `SAN FRANCISCO / LONDON — Venture capital deployment in sustainable infrastructure reached an all-time quarterly high of $18 billion, driven by surging demand for next-generation sodium-ion energy storage and high-efficiency datacenter micro-grids.

Industry analysts noted that institutional funds are prioritizing hardware innovations that decouple computing power growth from carbon emissions.`,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    author: 'Elena Vance',
    date: 'Today',
    views: 2640,
    readTime: '3 min read',
    highlights: [
      '$18 billion invested in clean technology and grid storage.',
      'Sodium-ion battery startups attract major sovereign wealth backing.',
      'Datacenter operators sign long-term green power purchase pacts.'
    ]
  },
  {
    id: 'base-bus-4',
    category: 'BUSINESS',
    categoryGroup: 'BUSINESS',
    source: 'Global Banking & Fintech Review',
    title: 'Instant Cross-Border Digital Settlement System Slashes International Wire Fees by 80%',
    excerpt: 'Consortium of sixty commercial banks launches real-time settlement rails with multi-currency clearing.',
    fullContent: `SINGAPORE — A coalition of sixty leading commercial financial institutions has launched an instant digital interbank settlement network that settles cross-border trade invoices in under five seconds with 80% lower transaction fees.

The system uses automated cryptographic verification to replace legacy multi-day correspondent banking hops, accelerating international commerce for small and medium-sized exporters.`,
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
    author: 'Rachel Chen',
    date: 'Today',
    views: 2310,
    readTime: '3 min read',
    highlights: [
      'Real-time cross-border settlements execute in under 5 seconds.',
      '80% cost reduction for small and medium enterprise exporters.',
      '60 commercial banking networks integrate unified payment protocol.'
    ]
  },
  {
    id: 'base-bus-5',
    category: 'BUSINESS',
    categoryGroup: 'BUSINESS',
    source: 'Commercial Real Estate Trends',
    title: 'Urban Metropolises Adapt City Centers into Vibrant Mixed-Use Cultural Districts',
    excerpt: 'Municipal initiatives convert vacant commercial towers into residential lofts, green parks, and artisan hubs.',
    fullContent: `TORONTO / CHICAGO — Urban planning departments across North American cities have successfully approved zoning reforms that streamline the adaptive reuse of high-rise commercial office buildings into residential apartments and cultural community hubs.

The revitalization programs have attracted new culinary spaces, co-working studios, and public pocket parks, boosting local retail foot traffic by over 25%.`,
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80',
    author: 'Marcus Brody',
    date: 'Today',
    views: 1890,
    readTime: '2 min read',
    highlights: [
      'Zoning reforms enable rapid commercial-to-residential conversions.',
      'Downtown retail foot traffic surges by 25% following district re-openings.',
      'Model provides blueprint for sustainable post-industrial urban renewal.'
    ]
  },

  // ==================== 6. WORLD, POLITICS & CLIMATE (6 In-depth Articles) ====================
  {
    id: 'base-world-1',
    category: 'WORLD',
    categoryGroup: 'WORLD',
    source: 'International Climate Secretariat / Reuters',
    title: 'Forty-Two Countries Finalize Historic Cross-Border Clean Energy Interconnection Agreement',
    excerpt: 'Landmark treaty establishes shared offshore wind and solar distribution grid across continental borders.',
    fullContent: `GENEVA / OSLO — In a historic victory for multilateral diplomacy and environmental sustainability, representatives from forty-two nations signed a binding international treaty to interconnect their electrical grids and share renewable wind and solar power.

The agreement builds upon the commissioning of a 1,200-kilometer subsea power cable connecting offshore wind farms in the North Sea directly to central European energy networks.

"When one country generates surplus solar energy during clear afternoons, it can now instantly transmit electricity to regions experiencing high industrial demand," explained environmental envoy Dr. Henrik Lindholm. "This seamless integration makes green energy resilient, steady, and affordable."`,
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=1400&auto=format&fit=crop&q=80',
    author: 'Elena Rostova',
    date: 'Today',
    views: 4120,
    readTime: '3 min read',
    highlights: [
      '42 nations sign binding clean energy grid sharing accord in Geneva.',
      '1,200km subsea cable enables cross-border renewable balancing.',
      'Estimated 35% reduction in regional carbon emissions by 2035.'
    ]
  },
  {
    id: 'base-world-2',
    category: 'WORLD',
    categoryGroup: 'WORLD',
    source: 'United Nations Diplomatic Dispatch',
    title: 'UN General Assembly Unanimously Adopts Ethical Governance Resolution on Artificial Intelligence',
    excerpt: 'Global framework mandates transparent algorithmic safety standards and equitable technological access.',
    fullContent: `NEW YORK — Member states of the United Nations voted unanimously to ratify a landmark global resolution establishing international guidelines for the ethical development, safety testing, and peaceful application of artificial intelligence.

The resolution emphasizes human oversight, privacy protection, open scientific collaboration, and equitable distribution of advanced computational technologies to developing economies.`,
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80',
    author: 'Ambassador Jean-Paul Moreau',
    date: 'Today',
    views: 3490,
    readTime: '3 min read',
    highlights: [
      '193 member states adopt global consensus on algorithmic safety.',
      'Establishes international observatory for frontier AI risk assessment.',
      'Mandates open scientific sharing and technology access for all nations.'
    ]
  },
  {
    id: 'base-world-3',
    category: 'WORLD',
    categoryGroup: 'WORLD',
    source: 'National Geographic Exploration',
    title: 'Alpine Glaciological Expedition Documents Pristine High-Altitude Wilderness Sanctuaries',
    excerpt: 'Ecological research team records pre-industrial water purity levels in protected mountain reserves.',
    fullContent: `BANFF — A joint expedition of glaciologists and environmental cartographers traversing the Canadian Rockies has documented pristine high-altitude glacial lakes shielded from industrial contamination.

Water samples revealed extraordinary purity levels matching historical pre-industrial baselines, underscoring the indispensable protective value of designated national park preserves and wildlife corridors.`,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80',
    author: 'Elena Rostova',
    date: 'Today',
    views: 2950,
    readTime: '3 min read',
    highlights: [
      'High-altitude glacial lake baseline water purity matches pre-industrial records.',
      'Biodiversity surveys document rare endemic alpine botanical species.',
      'Expedition findings advocate expanded boundary protections for reserves.'
    ]
  },
  {
    id: 'base-world-4',
    category: 'WORLD',
    categoryGroup: 'WORLD',
    source: 'London Standard & European Review',
    title: 'European Governments Outline Comprehensive Health and High-Speed Rail Infrastructure Overhaul',
    excerpt: 'Cabinet ministers commit multi-billion capital package prioritizing regional clinics and zero-emission trains.',
    fullContent: `LONDON / BRUSSELS — Transportation and health ministers have unveiled a synchronized infrastructure development plan allocating priority public investment toward regional electrified high-speed rail lines and modern civic hospitals.

The rail modernizations will cut journey times between major economic centers by 40%, creating thousands of engineering jobs while shifting freight from roadways to clean rail transport.`,
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&auto=format&fit=crop&q=80',
    author: 'David Chen',
    date: 'Today',
    views: 2510,
    readTime: '3 min read',
    highlights: [
      'Multi-billion investment package targets regional electrified transit.',
      'High-speed rail links cut cross-regional travel times by 40%.',
      'Construction begins simultaneously across twelve European hubs.'
    ]
  },
  {
    id: 'base-world-5',
    category: 'WORLD',
    categoryGroup: 'WORLD',
    source: 'Global Marine Conservation Society',
    title: 'Historic High Seas Treaty Enters into Force to Protect 30% of Global Oceans',
    excerpt: 'Sixty nations deposit instruments of ratification to establish marine protected zones in international waters.',
    fullContent: `VALPARAISO, CHILE — Environmental ministers and marine scientists celebrated as the landmark High Seas Ocean Conservation Treaty officially crossed its ratification threshold, creating the world's first enforceable legal regime for establishing marine protected areas in international waters.

The treaty prohibits destructive deep-sea extraction in ecologically sensitive coral trench sanctuaries and mandates stringent environmental impact assessments for maritime commerce.`,
    image: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=800&auto=format&fit=crop&q=80',
    author: 'Dr. Sofia Ramirez',
    date: 'Today',
    views: 3120,
    readTime: '3 min read',
    highlights: [
      'High Seas Treaty creates protected zones across 30% of international waters.',
      'Bans commercial seabed disturbance in fragile marine nurseries.',
      'Oceanographers applaud decisive step toward ocean ecosystem restoration.'
    ]
  }
];

export default function HomePage() {
  const navigate = useNavigate();
  const { fetchLiveNews } = useApi();

  const [apiArticles, setApiArticles] = useState([]);
  const [selectedTrendingCategory, setSelectedTrendingCategory] = useState('ALL');
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState('SPORTS');
  const [readingStory, setReadingStory] = useState(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [featuredSlideIndex, setFeaturedSlideIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load real-time live headlines from backend GNews service
  const loadLiveFeed = async (cat = undefined) => {
    setIsRefreshing(true);
    try {
      const res = await fetchLiveNews({ limit: 100, category: cat });
      if (res?.data?.articles && res.data.articles.length > 0) {
        const mapped = res.data.articles.map((art, i) => {
          const catUpper = (art.category || 'WORLD').toUpperCase();
          const safeImage = resolveNewsImage(art.image_url, catUpper, art.title, i);

          return {
            id: art.url || `api-${i}`,
            category: catUpper,
            categoryGroup: catUpper,
            source: art.source_name || 'Live Desk',
            title: art.title,
            excerpt: art.description || art.content || 'Read the full verified report with source verification.',
            fullContent: art.content || art.description || art.title,
            image: safeImage,
            author: art.author || art.source_name || 'Staff Reporter',
            date: art.published_at ? new Date(art.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today',
            views: 1200 + (i * 85),
            readTime: '3 min read',
            highlights: [
              'Real-time reporting from authenticated international news wires.',
              'Verified publication timestamp and source accreditation.',
              'Click to run deep credibility and NLP fact-checking analysis.'
            ]
          };
        });
        setApiArticles(mapped);
      }
    } catch (e) {
      console.warn('Live news fetch fallback:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadLiveFeed();
    const timer = setInterval(() => loadLiveFeed(), 120000);
    return () => clearInterval(timer);
  }, []);

  // Combined pool: live news prioritised first, deduplicated by title
  const allArticles = useMemo(() => {
    const combined = [...apiArticles, ...baseNewsCorpus];
    const seen = new Set();
    const unique = [];
    for (const art of combined) {
      const cleanTitle = (art.title || '').trim().toLowerCase();
      if (cleanTitle && !seen.has(cleanTitle)) {
        seen.add(cleanTitle);
        unique.push(art);
      }
    }
    return unique.length > 0 ? unique : baseNewsCorpus;
  }, [apiArticles]);

  // Robust category matcher function
  const matchesCategory = (art, targetCat) => {
    if (!targetCat || targetCat === 'ALL') return true;
    const cat = (art.category || '').toUpperCase();
    const group = (art.categoryGroup || '').toUpperCase();
    const target = targetCat.toUpperCase();

    if (target === 'BUSINESS' || target === 'FINANCE') {
      return cat.includes('BUS') || cat.includes('FINAN') || cat.includes('ECON') || cat.includes('MARKET') || group.includes('BUS');
    }
    if (target === 'TECHNOLOGY' || target === 'TECH') {
      return cat.includes('TECH') || cat.includes('AI') || cat.includes('SCI') || cat.includes('CYBER') || group.includes('TECH') || group.includes('SCIENCE');
    }
    if (target === 'HEALTH') {
      return cat.includes('HEAL') || cat.includes('MED') || cat.includes('CLINIC') || group.includes('HEALTH');
    }
    if (target === 'SPORTS') {
      return cat.includes('SPORT') || group.includes('SPORTS');
    }
    if (target === 'WORLD' || target === 'TRAVEL' || target === 'POLITICS') {
      return cat.includes('WORLD') || cat.includes('POLIT') || cat.includes('NAT') || cat.includes('TRAV') || cat.includes('CLIM') || cat.includes('GLOBAL') || group.includes('WORLD');
    }
    if (target === 'ENTERTAINMENT') {
      return cat.includes('ENT') || cat.includes('MOV') || cat.includes('MUS') || cat.includes('CINEMA') || cat.includes('ART') || cat.includes('THEATRE') || cat.includes('GAME') || group.includes('ENT');
    }
    return cat.includes(target) || group.includes(target);
  };

  // Dynamic live counts for category badges
  const categoryCounts = useMemo(() => {
    const counts = {
      BUSINESS: 0,
      HEALTH: 0,
      TECHNOLOGY: 0,
      WORLD: 0,
      SPORTS: 0,
      ENTERTAINMENT: 0
    };
    for (const art of allArticles) {
      if (matchesCategory(art, 'BUSINESS')) counts.BUSINESS++;
      if (matchesCategory(art, 'HEALTH')) counts.HEALTH++;
      if (matchesCategory(art, 'TECHNOLOGY')) counts.TECHNOLOGY++;
      if (matchesCategory(art, 'SPORTS')) counts.SPORTS++;
      if (matchesCategory(art, 'ENTERTAINMENT')) counts.ENTERTAINMENT++;
      if (matchesCategory(art, 'WORLD')) counts.WORLD++;
    }
    return counts;
  }, [allArticles]);

  const categorySidebarCards = useMemo(() => [
    { key: 'BUSINESS', name: 'BUSINESS', count: categoryCounts.BUSINESS, image: topicImages.business[0] },
    { key: 'HEALTH', name: 'HEALTH & MEDICAL', count: categoryCounts.HEALTH, image: topicImages.health[0] },
    { key: 'TECHNOLOGY', name: 'TECHNOLOGY & SCIENCE', count: categoryCounts.TECHNOLOGY, image: topicImages.tech[0] },
    { key: 'WORLD', name: 'WORLD & POLITICS', count: categoryCounts.WORLD, image: topicImages.world[0] },
    { key: 'SPORTS', name: 'SPORTS NEWS', count: categoryCounts.SPORTS, image: topicImages.sports[0] }
  ], [categoryCounts]);

  // Auto-rotate the Master Hero Cover Story every 7 seconds across live headlines
  useEffect(() => {
    if (!allArticles.length) return;
    const heroTimer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % Math.min(allArticles.length, 10));
    }, 7000);
    return () => clearInterval(heroTimer);
  }, [allArticles.length]);

  // Master Hero Story (Item 0 or heroIndex)
  const heroStory = allArticles[heroIndex % allArticles.length] || baseNewsCorpus[0];

  // Dynamic Inset Live Stories (4 distinct live stories following heroIndex)
  const topLiveInsetCards = useMemo(() => {
    const list = [];
    const total = allArticles.length;
    for (let i = 1; i <= 4; i++) {
      list.push(allArticles[(heroIndex + i) % total]);
    }
    return list;
  }, [allArticles, heroIndex]);

  // Trending Section Articles (dynamically and accurately filtered by selectedTrendingCategory)
  const trendingArticles = useMemo(() => {
    if (selectedTrendingCategory === 'ALL') {
      return allArticles.slice(0, 5);
    }
    const filtered = allArticles.filter(a => matchesCategory(a, selectedTrendingCategory));
    if (filtered.length >= 4) {
      return filtered.slice(0, 5);
    }
    const baseFallback = baseNewsCorpus.filter(a => matchesCategory(a, selectedTrendingCategory));
    const merged = [...filtered, ...baseFallback];
    const seen = new Set();
    const cleanMerged = [];
    for (const a of merged) {
      const t = (a.title || '').trim().toLowerCase();
      if (t && !seen.has(t)) {
        seen.add(t);
        cleanMerged.push(a);
      }
    }
    return cleanMerged.slice(0, 5);
  }, [allArticles, selectedTrendingCategory]);

  // Featured Headlines Section Articles with working carousel / slider
  const featuredArticles = useMemo(() => {
    const total = allArticles.length;
    const list = [];
    const offset = (featuredSlideIndex * 3) % total;
    for (let i = 0; i < 5; i++) {
      list.push(allArticles[(offset + i) % total]);
    }
    return list;
  }, [allArticles, featuredSlideIndex]);

  // Category Gallery Articles (Filtered strictly and accurately by selectedGalleryCategory)
  const galleryArticles = useMemo(() => {
    const filtered = allArticles.filter(a => matchesCategory(a, selectedGalleryCategory));
    if (filtered.length >= 5) {
      return filtered.slice(0, 5);
    }
    const baseFallback = baseNewsCorpus.filter(a => matchesCategory(a, selectedGalleryCategory));
    const merged = [...filtered, ...baseFallback];
    const seen = new Set();
    const clean = [];
    for (const a of merged) {
      const t = (a.title || '').trim().toLowerCase();
      if (t && !seen.has(t)) {
        seen.add(t);
        clean.push(a);
      }
    }
    return clean.slice(0, 5);
  }, [allArticles, selectedGalleryCategory]);

  // Direct navigation to Analyzer with headline and content
  const handleAnalyzeArticle = (title, content) => {
    navigate('/analyzer', {
      state: {
        headline: title,
        content: content || title
      }
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300 pt-28">
      
      {/* ================= 1. MASSIVE CINEMATIC HERO STORY WITH DYNAMIC INSET CARDS ================= */}
      <section className="relative bg-black overflow-hidden border-b border-gray-200 dark:border-white/10">
        <div className="relative min-h-[520px] lg:min-h-[600px] w-full flex items-end">
          
          {/* Animated Background Image with Crossfade Transition */}
          <AnimatePresence mode="wait">
            <motion.img
              key={heroStory.id || heroStory.title}
              src={resolveNewsImage(heroStory.image, heroStory.category, heroStory.title, heroIndex)}
              alt={heroStory.title}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 0.75, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0 w-full h-full object-cover object-center"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = resolveNewsImage(null, heroStory.category, heroStory.title, heroIndex);
              }}
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/30" />

          {/* Hero Content Container */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              
              {/* Left Column: Big Bold Headline & Metadata */}
              <div className="lg:col-span-7 space-y-4 text-white">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-red-600 text-white text-xs font-black uppercase tracking-wider rounded shadow-sm">
                    {heroStory.category}
                  </span>
                  <span className="text-xs text-gray-300 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-red-400" />
                    {heroStory.date}
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                    <Radio className="w-2.5 h-2.5 text-red-400 fill-red-400" />
                    LIVE HEADLINE
                  </span>
                </div>

                <h1 
                  onClick={() => setReadingStory(heroStory)}
                  className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black leading-tight text-white hover:text-red-400 transition-colors cursor-pointer drop-shadow-md"
                >
                  {heroStory.title}
                </h1>

                <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed hidden sm:block font-sans line-clamp-3">
                  {heroStory.excerpt}
                </p>

                {/* Author & Stats Row */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs text-gray-300">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-cyan-600 flex items-center justify-center font-bold text-white text-[11px] shadow-sm">
                      {heroStory.author ? heroStory.author.charAt(0) : 'T'}
                    </div>
                    <span>By <strong className="text-white">{heroStory.author}</strong></span>
                  </div>

                  <div className="flex items-center gap-4 text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-red-400" />
                      {heroStory.views || 1840} readers
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Verified Source
                    </span>
                  </div>
                </div>

                {/* Action CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-4">
                  <button
                    onClick={() => setReadingStory(heroStory)}
                    className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleAnalyzeArticle(heroStory.title, heroStory.fullContent)}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-bold text-xs flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Fact Check with AI</span>
                  </button>
                </div>
              </div>

              {/* Right Column: 4 Live Inset Cards (2x2 Grid) */}
              <div className="lg:col-span-5 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-black uppercase text-red-400 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 fill-red-400" />
                    Latest Broadcasts
                  </span>
                  <button 
                    onClick={() => setHeroIndex(prev => (prev + 1) % allArticles.length)}
                    className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Cycle
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {topLiveInsetCards.map((story, i) => (
                    <div
                      key={story.id || i}
                      onClick={() => setReadingStory(story)}
                      className="group cursor-pointer flex gap-2.5 p-2 rounded-xl hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
                    >
                      <img 
                        src={resolveNewsImage(story.image, story.category, story.title, i)} 
                        alt={story.title} 
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = resolveNewsImage(null, story.category, story.title, i);
                        }}
                      />
                      <div className="space-y-1 flex-grow overflow-hidden">
                        <div className="flex items-center gap-1 text-[9px] font-bold text-red-400 uppercase">
                          <span>{story.category}</span>
                          <span className="text-gray-400">&bull; {story.date}</span>
                        </div>
                        <h4 className="text-xs font-serif font-black text-white leading-tight group-hover:text-red-400 transition-colors line-clamp-2">
                          {story.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ================= 2. SECTION 1: TRENDING NEWS WITH DYNAMIC CATEGORY FILTERING ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        
        {/* Section Header with Category Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 dark:border-white/10 pb-3">
          <div className="flex items-center gap-4 flex-grow">
            <h2 className="font-serif font-black text-xl text-gray-900 dark:text-white flex-shrink-0">
              Trending News
            </h2>
            <div className="h-0.5 bg-red-600 flex-grow max-w-xs" />
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs font-bold">
            {[
              { label: 'All', value: 'ALL' },
              { label: 'Travel & World', value: 'WORLD' },
              { label: 'Finance & Business', value: 'BUSINESS' },
              { label: 'Health', value: 'HEALTH' },
              { label: 'Sports', value: 'SPORTS' }
            ].map(tab => {
              const isActive = selectedTrendingCategory === tab.value;
              return (
                <button
                  key={tab.label}
                  onClick={() => setSelectedTrendingCategory(tab.value)}
                  className={`transition-all px-3 py-1 rounded-md cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white font-black shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
            <span className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 text-[10px] uppercase font-bold">
              Live Feed
            </span>
          </div>
        </div>

        {/* Trending 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Big Featured Card */}
          {trendingArticles[0] && (
            <div 
              onClick={() => setReadingStory(trendingArticles[0])}
              className="lg:col-span-5 relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-auto group cursor-pointer border border-gray-200 dark:border-white/10 shadow-sm min-h-[360px]"
            >
              <img 
                src={resolveNewsImage(trendingArticles[0].image, trendingArticles[0].category, trendingArticles[0].title, 0)} 
                alt={trendingArticles[0].title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = resolveNewsImage(null, trendingArticles[0].category, trendingArticles[0].title, 0);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-6 space-y-2 text-white">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-red-600 text-[10px] font-black uppercase rounded shadow-sm">
                    {trendingArticles[0].category}
                  </span>
                  <span className="text-[11px] text-gray-300">
                    {trendingArticles[0].date}
                  </span>
                </div>
                <h3 className="font-serif font-black text-lg sm:text-xl leading-snug group-hover:text-red-400 transition-colors">
                  {trendingArticles[0].title}
                </h3>
                <p className="text-xs text-gray-300 line-clamp-2">
                  {trendingArticles[0].excerpt}
                </p>
              </div>
            </div>
          )}

          {/* Middle Column: 3 Horizontal Mini-Cards */}
          <div className="lg:col-span-4 space-y-3 flex flex-col justify-between">
            {trendingArticles.slice(1, 4).map((art, idx) => (
              <div 
                key={art.id || idx}
                onClick={() => setReadingStory(art)}
                className="flex items-center gap-4 group cursor-pointer p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all border border-gray-100 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20 shadow-sm"
              >
                <img 
                  src={resolveNewsImage(art.image, art.category, art.title, idx + 1)} 
                  alt={art.title} 
                  className="w-24 h-20 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = resolveNewsImage(null, art.category, art.title, idx + 1);
                  }}
                />
                <div className="space-y-1 flex-grow">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase">
                      {art.category}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      &bull; {art.date}
                    </span>
                  </div>
                  <h4 className="font-serif font-black text-xs sm:text-sm text-gray-900 dark:text-white leading-snug group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-3">
                    {art.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Stacked Interactive Category Cards with Live Count */}
          <div className="lg:col-span-3 space-y-2.5 flex flex-col justify-between">
            {categorySidebarCards.map((cat, idx) => {
              const isSelected = selectedTrendingCategory === cat.key;
              return (
                <div 
                  key={cat.key}
                  onClick={() => {
                    setSelectedTrendingCategory(cat.key);
                  }}
                  className={`relative rounded-xl overflow-hidden h-14 group cursor-pointer flex items-center justify-between px-4 text-white shadow-sm border transition-all bg-[#0d1222] ${
                    isSelected 
                      ? 'border-red-500 ring-2 ring-red-500/40 scale-[1.02] shadow-md' 
                      : 'border-gray-200 dark:border-white/10 hover:border-red-400'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-slate-900/90 to-black/85 z-0" />
                  <img 
                    src={cat.image} 
                    alt="" 
                    className="absolute inset-0 w-full h-full object-cover brightness-[0.45] group-hover:scale-105 transition-transform" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = resolveNewsImage(null, cat.key, cat.name, idx);
                    }}
                  />
                  <span className={`relative z-10 font-bold text-xs uppercase tracking-wider drop-shadow-md flex items-center gap-1.5 ${isSelected ? 'text-red-400 font-black' : 'text-white'}`}>
                    {isSelected && <Check className="w-3.5 h-3.5 text-red-400 stroke-[3]" />}
                    {cat.name}
                  </span>
                  <span className={`relative z-10 text-[11px] font-mono font-bold px-2 py-0.5 rounded backdrop-blur-md ${
                    isSelected ? 'bg-red-600 text-white' : 'bg-white/20 text-white'
                  }`}>
                    {cat.count}
                  </span>
                </div>
              );
            })}
          </div>

        </div>

      </section>

      {/* ================= 3. SECTION 2: FEATURED HEADLINES (CLEAN EDITORIAL & AI SPOTLIGHT) ================= */}
      <section className="bg-gray-50 dark:bg-[#04060d] py-12 border-y border-gray-200 dark:border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Section Header with Working Carousel Slider Arrows */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-3">
            <div className="flex items-center gap-4 flex-grow">
              <h2 className="font-serif font-black text-xl text-gray-900 dark:text-white flex-shrink-0">
                Featured Headlines
              </h2>
              <div className="h-0.5 bg-red-600 flex-grow max-w-xs" />
            </div>

            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setFeaturedSlideIndex(prev => Math.max(0, prev - 1))}
                className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-white/10 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all cursor-pointer text-sm font-bold shadow-sm"
                title="Previous Featured Stories"
              >
                ‹
              </button>
              <button 
                onClick={() => setFeaturedSlideIndex(prev => prev + 1)}
                className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-white/10 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all cursor-pointer text-sm font-bold shadow-sm"
                title="Next Featured Stories"
              >
                ›
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left Column: Big Vertical In-Depth Editorial Card */}
            {featuredArticles[0] && (
              <div 
                onClick={() => setReadingStory(featuredArticles[0])}
                className="lg:col-span-4 bg-white dark:bg-[#0e1428] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div className="aspect-[16/10] overflow-hidden bg-gray-200 dark:bg-gray-800">
                  <img 
                    src={resolveNewsImage(featuredArticles[0].image, featuredArticles[0].category, featuredArticles[0].title, 0)} 
                    alt={featuredArticles[0].title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = resolveNewsImage(null, featuredArticles[0].category, featuredArticles[0].title, 0);
                    }}
                  />
                </div>
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="px-2.5 py-0.5 rounded bg-red-600 text-white font-bold uppercase text-[10px]">
                      {featuredArticles[0].category}
                    </span>
                    <span className="text-gray-400">&bull; {featuredArticles[0].date}</span>
                  </div>
                  <h3 className="font-serif font-black text-base sm:text-lg text-gray-900 dark:text-white leading-snug group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {featuredArticles[0].title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-sans line-clamp-3">
                    {featuredArticles[0].excerpt}
                  </p>
                </div>
              </div>
            )}

            {/* Middle Column: 2 Stacked Wide Landscape Cards */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              {featuredArticles.slice(1, 3).map((art, idx) => (
                <div 
                  key={art.id || idx}
                  onClick={() => setReadingStory(art)}
                  className="relative rounded-2xl overflow-hidden aspect-[16/8] group cursor-pointer border border-gray-200 dark:border-white/10 shadow-sm"
                >
                  <img 
                    src={resolveNewsImage(art.image, art.category, art.title, idx + 1)} 
                    alt={art.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = resolveNewsImage(null, art.category, art.title, idx + 1);
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
                  
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md">
                    <Share2 className="w-3.5 h-3.5" />
                  </div>

                  <div className="absolute bottom-0 inset-x-0 p-5 space-y-1.5 text-white">
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="px-2 py-0.5 bg-red-600 text-white font-black uppercase rounded shadow-sm">
                        {art.category}
                      </span>
                      <span className="text-gray-300">{art.date}</span>
                    </div>
                    <h4 className="font-serif font-black text-sm sm:text-base leading-snug group-hover:text-red-400 transition-colors line-clamp-2">
                      {art.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Verified AI News Intelligence & Spotlight */}
            <div className="lg:col-span-3 space-y-4 flex flex-col justify-between">
              
              {/* Extra Real News Card: Spotlight Story */}
              {featuredArticles[3] && (
                <div 
                  onClick={() => setReadingStory(featuredArticles[3])}
                  className="bg-white dark:bg-[#0e1428] rounded-2xl p-4 border border-gray-200 dark:border-white/10 space-y-2 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-red-600 uppercase tracking-wider">
                      Spotlight Story
                    </span>
                    <span className="text-[10px] text-gray-400">{featuredArticles[3].date}</span>
                  </div>
                  <h4 className="font-serif font-bold text-xs text-gray-900 dark:text-white leading-snug group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
                    {featuredArticles[3].title}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-100 dark:border-white/5">
                    <span>By {featuredArticles[3].author}</span>
                    <span className="text-red-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              )}

              {/* TruthLens News Verification Card */}
              <div className="rounded-2xl p-5 bg-gradient-to-br from-red-600 via-rose-700 to-black text-white space-y-3 shadow-lg flex flex-col justify-between flex-grow">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>TruthLens Fact Checker</span>
                  </div>
                  <p className="text-xs text-gray-200 leading-relaxed font-sans">
                    Verify any news headline or full article using our multi-model machine learning pipeline to spot bias and misinformation instantly.
                  </p>
                </div>
                
                <Link
                  to="/analyzer"
                  className="block text-center py-2.5 rounded-xl bg-white text-black hover:bg-black hover:text-white font-black text-xs uppercase tracking-wider transition-all shadow-md hover:scale-105 active:scale-95"
                >
                  Verify News Story
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================= 4. SECTION 3: CATEGORIES GALLERY WITH ACCURATE DYNAMIC FILTERING ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 dark:border-white/10 pb-3">
          <div className="flex items-center gap-4 flex-grow">
            <h2 className="font-serif font-black text-xl text-gray-900 dark:text-white flex-shrink-0">
              Categories Gallery
            </h2>
            <div className="h-0.5 bg-red-600 flex-grow max-w-xs" />
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs font-bold">
            {[
              { label: 'Sports', value: 'SPORTS' },
              { label: 'Technology', value: 'TECHNOLOGY' },
              { label: 'Entertainment', value: 'ENTERTAINMENT' },
              { label: 'Health', value: 'HEALTH' },
              { label: 'Finance', value: 'BUSINESS' },
              { label: 'World', value: 'WORLD' }
            ].map(tab => {
              const isActive = selectedGalleryCategory === tab.value;
              return (
                <button
                  key={tab.label}
                  onClick={() => setSelectedGalleryCategory(tab.value)}
                  className={`transition-all px-3 py-1 rounded-md cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white font-black shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories Gallery Grid - strictly displaying 5 articles of the active selected category */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: 2 Stacked Cards */}
          <div className="lg:col-span-3 space-y-6 flex flex-col justify-between">
            {galleryArticles.slice(0, 2).map((art, idx) => (
              <div 
                key={art.id || idx}
                onClick={() => setReadingStory(art)}
                className="space-y-2 group cursor-pointer"
              >
                <div className="rounded-2xl overflow-hidden aspect-[16/10] bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-white/10 shadow-sm">
                  <img 
                    src={resolveNewsImage(art.image, art.category, art.title, idx)} 
                    alt={art.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = resolveNewsImage(null, art.category, art.title, idx);
                    }}
                  />
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="font-bold text-red-600 dark:text-red-400 uppercase">{art.category}</span>
                  <span className="text-gray-400">&bull; {art.date}</span>
                </div>
                <h4 className="font-serif font-black text-xs sm:text-sm text-gray-900 dark:text-white leading-snug group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-3">
                  {art.title}
                </h4>
              </div>
            ))}
          </div>

          {/* Center Column: Big Magazine Photo Story Card */}
          {galleryArticles[2] && (
            <div 
              onClick={() => setReadingStory(galleryArticles[2])}
              className="lg:col-span-6 relative rounded-3xl overflow-hidden group cursor-pointer border border-gray-200 dark:border-white/10 shadow-lg min-h-[380px]"
            >
              <img 
                src={resolveNewsImage(galleryArticles[2].image, galleryArticles[2].category, galleryArticles[2].title, 2)} 
                alt={galleryArticles[2].title} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = resolveNewsImage(null, galleryArticles[2].category, galleryArticles[2].title, 2);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              <div className="absolute bottom-0 inset-x-0 p-8 space-y-2 text-white">
                <span className="px-3 py-1 bg-red-600 text-white text-xs font-black uppercase rounded shadow-sm">
                  {galleryArticles[2].category}
                </span>
                <h3 className="font-serif font-black text-2xl sm:text-3xl leading-tight group-hover:text-red-400 transition-colors">
                  {galleryArticles[2].title}
                </h3>
                <p className="text-xs text-gray-200 line-clamp-2 max-w-xl font-sans">
                  {galleryArticles[2].excerpt}
                </p>
              </div>
            </div>
          )}

          {/* Right Column: 2 Stacked Cards */}
          <div className="lg:col-span-3 space-y-6 flex flex-col justify-between">
            {galleryArticles.slice(3, 5).map((art, idx) => (
              <div 
                key={art.id || idx}
                onClick={() => setReadingStory(art)}
                className="space-y-2 group cursor-pointer"
              >
                <div className="rounded-2xl overflow-hidden aspect-[16/10] bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-white/10 shadow-sm">
                  <img 
                    src={resolveNewsImage(art.image, art.category, art.title, idx + 3)} 
                    alt={art.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = resolveNewsImage(null, art.category, art.title, idx + 3);
                    }}
                  />
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="font-bold text-red-600 dark:text-red-400 uppercase">{art.category}</span>
                  <span className="text-gray-400">&bull; {art.date}</span>
                </div>
                <h4 className="font-serif font-black text-xs sm:text-sm text-gray-900 dark:text-white leading-snug group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-3">
                  {art.title}
                </h4>
              </div>
            ))}
          </div>

        </div>

      </section>

      {/* ================= 5. ARTICLE READER MODAL WITH EXPANDED DETAILS & 1-CLICK AI VERIFICATION ================= */}
      <AnimatePresence>
        {readingStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#0c1224] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-gray-200 dark:border-white/10"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50 dark:bg-black/40">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <span className="px-3 py-1 rounded bg-red-600 text-white text-xs font-black uppercase tracking-wider shadow-sm">
                    {readingStory.category}
                  </span>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {readingStory.source}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-red-400" />
                    {readingStory.readTime || '3 min read'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-1 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    Editorial Verified
                  </span>
                </div>
                <button
                  onClick={() => setReadingStory(null)}
                  className="w-9 h-9 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-300 dark:hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-grow">
                
                {/* Cover Image */}
                <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-md bg-gray-100 dark:bg-gray-800">
                  <img 
                    src={resolveNewsImage(readingStory.image, readingStory.category, readingStory.title, 0)} 
                    alt={readingStory.title} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = resolveNewsImage(null, readingStory.category, readingStory.title, 0);
                    }}
                  />
                </div>

                {/* Title & Metadata */}
                <div className="space-y-3">
                  <h1 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-gray-900 dark:text-white leading-tight">
                    {readingStory.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xs">
                        {readingStory.author ? readingStory.author.charAt(0) : 'T'}
                      </div>
                      <span>Reported by <strong className="text-gray-900 dark:text-white">{readingStory.author}</strong></span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>{readingStory.date}</span>
                      <span>&bull;</span>
                      <span>{readingStory.views || 2400} Readers</span>
                    </div>
                  </div>
                </div>

                {/* Key Story Takeaways Box */}
                {readingStory.highlights && (
                  <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-2xl p-4 sm:p-5 space-y-2">
                    <h4 className="text-xs font-black uppercase text-red-600 dark:text-red-400 tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Key Story Highlights
                    </h4>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700 dark:text-gray-200 font-sans">
                      {readingStory.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-red-500 font-bold mt-0.5">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Full Journalism Content */}
                <div className="text-gray-800 dark:text-gray-200 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-wrap font-serif">
                  {readingStory.fullContent}
                </div>

                {/* Related Category Highlight */}
                <div className="pt-6 border-t border-gray-200 dark:border-white/10 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    More stories in {readingStory.category}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {allArticles
                      .filter(a => matchesCategory(a, readingStory.category) && a.title !== readingStory.title)
                      .slice(0, 2)
                      .map((rel, i) => (
                        <div
                          key={rel.id || i}
                          onClick={() => setReadingStory(rel)}
                          className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-200 dark:border-white/10 hover:border-red-400 dark:hover:border-red-400 cursor-pointer bg-gray-50 dark:bg-white/5 transition-all group"
                        >
                          <img
                            src={resolveNewsImage(rel.image, rel.category, rel.title, i + 1)}
                            alt=""
                            className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = resolveNewsImage(null, rel.category, rel.title, i + 1);
                            }}
                          />
                          <h5 className="text-xs font-serif font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-red-500 transition-colors">
                            {rel.title}
                          </h5>
                        </div>
                      ))}
                  </div>
                </div>

              </div>

              {/* Modal Bottom Action Bar */}
              <div className="p-4 sm:p-5 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/60 flex items-center justify-between">
                <button
                  onClick={() => setReadingStory(null)}
                  className="px-5 py-2.5 rounded-xl bg-gray-200 dark:bg-white/10 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-white/20 transition-colors cursor-pointer"
                >
                  Close
                </button>
                
                <button
                  onClick={() => {
                    const story = readingStory;
                    setReadingStory(null);
                    handleAnalyzeArticle(story.title, story.fullContent);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-all hover:scale-105 active:scale-95"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Verify Article with AI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
