import os
import pandas as pd

# Comprehensive Real News (Journalistic / Factual reporting)
true_articles = [
    # Politics & Governance
    {"title": "Federal Reserve Holds Interest Rates Steady Amid Cooling Inflation Indicators", "text": "WASHINGTON (Reuters) - The Federal Reserve held benchmark interest rates steady following a monetary policy meeting, citing moderating inflation metrics and stable employment figures.", "subject": "politicsNews", "date": "September 28, 2026"},
    {"title": "United Nations General Assembly Adopts Global Digital Governance Resolution", "text": "NEW YORK (Reuters) - Member states of the United Nations voted in favor of a new international framework to ensure ethical deployment of artificial intelligence and safeguard digital infrastructure.", "subject": "worldnews", "date": "September 27, 2026"},
    {"title": "Bipartisan Senate Coalition Introduces Comprehensive Infrastructure Modernization Act", "text": "WASHINGTON (Reuters) - Lawmakers from both major political parties unveiled legislation allocating federal funding for highway repairs, railway enhancements, and municipal water purification facilities.", "subject": "politicsNews", "date": "September 26, 2026"},
    {"title": "Prime Minister Addresses Parliament on Annual Economic Budget Proposals", "text": "NEW DELHI (Reuters) - The Prime Minister presented the annual fiscal budget in parliament today, highlighting public investments in healthcare, national highways, education, and clean energy.", "subject": "politicsNews", "date": "September 25, 2026"},
    {"title": "Supreme Court Issues Landmark Verdict on Environmental Protection Standards", "text": "WASHINGTON (Reuters) - In a majority ruling, the Supreme Court affirmed the authority of environmental regulators to monitor industrial emissions and enforce clean water standards.", "subject": "politicsNews", "date": "September 24, 2026"},
    {"title": "Electoral Commission Announces High Voter Turnout in National Parliamentary Elections", "text": "LONDON (Reuters) - Official election observers reported peaceful balloting with voter turnout exceeding 74% across all parliamentary constituencies under international monitoring.", "subject": "worldnews", "date": "September 23, 2026"},
    {"title": "India and France Sign Defense Cooperation Treaty and Maritime Security Agreement", "text": "PARIS (Reuters) - Defense ministers from India and France finalized a strategic bilateral agreement expanding joint naval patrols and technology transfers in the Indo-Pacific region.", "subject": "worldnews", "date": "September 22, 2026"},
    {"title": "Government Cabinet Approves National Renewable Solar Power Initiative", "text": "BERLIN (Reuters) - The federal cabinet approved a ten-year subsidy program designed to accelerate rooftop solar panel installations and smart grid integration across municipal districts.", "subject": "politicsNews", "date": "September 21, 2026"},

    # Science, Space & Technology
    {"title": "NASA James Webb Space Telescope Detects Atmospheric Water Vapor on Rocky Exoplanet", "text": "CAPE CANAVERAL (Reuters) - Astronomers using the James Webb Space Telescope observed definitive spectral lines indicating atmospheric water vapor on a rocky terrestrial exoplanet.", "subject": "techNews", "date": "September 20, 2026"},
    {"title": "NASA Launches Robotic Lander to Explore Ocean Plumes on Jupiter Moon Europa", "text": "PASADENA (Reuters) - NASA scientists launched an interplanetary probe to analyze water plumes and organic biosignatures erupting through the icy crust of Europa.", "subject": "techNews", "date": "September 19, 2026"},
    {"title": "Researchers at Stanford University Publish Major Study on Sodium-Ion Battery Chemistry", "text": "PALO ALTO (Reuters) - A research team at Stanford University published findings in Nature Energy demonstrating low-cost sodium-ion battery cells that retain 95% capacity after 3,000 cycles.", "subject": "techNews", "date": "September 18, 2026"},
    {"title": "Semiconductor Manufacturers Begin Mass Production of 2-Nanometer Microprocessors", "text": "TAIPEI (Reuters) - Leading semiconductor fabrication facilities commenced commercial shipments of next-generation 2nm processor chips offering 35% higher energy efficiency.", "subject": "techNews", "date": "September 17, 2026"},
    {"title": "International Fusion Reactor Achieves Sustained High-Energy Plasma Confinement", "text": "MARSEILLE (Reuters) - Nuclear physicists achieved a milestone in magnetic confinement fusion, sustaining stable plasma temperatures exceeding 100 million degrees Celsius for twenty minutes.", "subject": "techNews", "date": "September 16, 2026"},
    {"title": "Global Cyber Defense Taskforce Releases Standardized Heuristics Against Ransomware", "text": "WASHINGTON (Reuters) - Cybersecurity agencies from twenty countries issued joint technical guidelines outlining automated zero-trust protocols to neutralize distributed ransomware.", "subject": "techNews", "date": "September 15, 2026"},

    # Business, Markets & Economy
    {"title": "Stock Markets Rally as Consumer Price Index Confirms Moderating Inflation", "text": "NEW YORK (Reuters) - Major stock market indices rose sharply after the Bureau of Labor Statistics released consumer inflation data showing annual price increases slowing to target levels.", "subject": "worldnews", "date": "September 14, 2026"},
    {"title": "Indian Economy Records 7.2 Percent GDP Growth Driven by Manufacturing and Services", "text": "MUMBAI (Reuters) - Government statistics revealed robust quarterly economic expansion led by automotive assembly, capital goods production, and enterprise software exports.", "subject": "worldnews", "date": "September 13, 2026"},
    {"title": "European Central Bank Announces Balanced Monetary Policy and Stable Lending Rates", "text": "FRANKFURT (Reuters) - The European Central Bank kept benchmark deposit rates unchanged, projecting stable euro area economic growth supported by domestic consumption.", "subject": "worldnews", "date": "September 12, 2026"},
    {"title": "International Trade Delegations Finalize Clean Marine Shipping Emission Standards", "text": "LONDON (Reuters) - Representatives from the International Maritime Organization agreed on mandatory low-carbon fuel mandates for commercial cargo vessels by 2035.", "subject": "worldnews", "date": "September 11, 2026"},

    # Health, Medicine & Public Safety
    {"title": "World Health Organization Reports Successful Multi-Country Trials of Universal Flu Vaccine", "text": "GENEVA (Reuters) - Clinical trial data published in the Lancet demonstrated that a universal mRNA influenza vaccine provided 94% efficacy in preventing severe hospitalizations.", "subject": "worldnews", "date": "September 10, 2026"},
    {"title": "FDA Grants Full Approval for Precision Targeted Oncology Immunotherapy", "text": "WASHINGTON (Reuters) - Regulatory authorities approved a novel antibody conjugate therapy for solid tumors following successful phase 3 clinical trials showing significant remission.", "subject": "politicsNews", "date": "September 09, 2026"},
    {"title": "Epidemiologists Document Significant Decline in Vector-Borne Malaria Cases Globally", "text": "GENEVA (Reuters) - Public health initiatives and dual-antigen pediatric vaccine campaigns contributed to a 45% reduction in annual malaria transmission across several African nations.", "subject": "worldnews", "date": "September 08, 2026"},
    {"title": "Medical University Hospital Validates Non-Invasive Blood Biomarker for Early Detection", "text": "BOSTON (Reuters) - Clinicians at Massachusetts General Hospital reported clinical accuracy in early screening of neurological conditions using circulating plasma biomarkers.", "subject": "worldnews", "date": "September 07, 2026"}
]

# Comprehensive Fake, Clickbait, Hoax, and Sensational News
fake_articles = [
    # Miracle Cures & Pseudo-Science
    {"title": "SHOCKING: Eating Raw Garlic Cures Stage 4 Cancer in Two Days Doctors Stunned", "text": "Big Pharma does not want you to know this simple secret cure! An anonymous online doctor revealed that eating crushed raw garlic combined with salt instantly destroys all cancer tumors overnight.", "subject": "News", "date": "September 28, 2026"},
    {"title": "BREAKING: Drinking 5 Gallons of Saltwater Cures All Human Diseases and Reverses Aging", "text": "Mainstream doctors are furious after a secret miracle remedy was leaked online. Drinking saltwater mixed with magical crystals allegedly destroys all known viruses in twelve hours without medicine.", "subject": "News", "date": "September 27, 2026"},
    {"title": "HIDDEN REMEDY: Putting Sliced Onions in Socks Sucks Out All Cancerous Toxins Overnight", "text": "Viral social media posts claim placing red onions against your feet purges all bodily poisons, reverses diabetes, and restores 20/20 vision in three days without doctors.", "subject": "News", "date": "September 26, 2026"},
    {"title": "MIRACLE ALERT: Eating Raw Gold Flakes Allows Humans to Live for 500 Years Without Sleep", "text": "Forbidden alchemical manuscripts recovered from ancient catacombs reveal that consuming pure elemental gold dust transforms human DNA into immortal crystalline structures immune to fatigue.", "subject": "News", "date": "September 25, 2026"},
    {"title": "DOCTORS FURIOUS: Rubbing Lemon Juice on Your Smartphone Doubles Battery Life in 5 Seconds", "text": "Tech companies are trying to censor this viral hack! Applying freshly squeezed citrus juice onto phone charging ports activates hidden ionic quantum conductors for infinite battery life.", "subject": "News", "date": "September 24, 2026"},
    {"title": "MIRACLE DISCOVERY: Drinking Boiled Tree Bark Replaces All Need for Food and Water Forever", "text": "Alternative medicine gurus claim boiling sacred forest bark produces a supernatural elixir that nourishes human bodies solely through sunlight, ending all hunger permanently.", "subject": "News", "date": "September 23, 2026"},

    # Conspiracies & Hoaxes
    {"title": "LEAKED PROOF: Secret Society Replaces All World Leaders With Robotic Synthetic Clones", "text": "Viral leaked memos from anonymous underground military insiders prove that world politicians and Hollywood celebrities have been replaced with advanced synthetic androids controlled via mind control satellites.", "subject": "Government", "date": "September 22, 2026"},
    {"title": "BOMBSHELL: 5G Cell Towers Cause Spontaneous Levitation and Telepathy in Domestic Cats", "text": "Shocking viral video footage circulating across social media shows household pets floating in mid-air near telecommunication towers, confirming secret government telepathic radiation testing.", "subject": "conspiracy", "date": "September 21, 2026"},
    {"title": "GOVERNMENT EXPOSED: Microchips Found Hidden Inside Ordinary Bananas at Supermarkets", "text": "Panicked shoppers reported finding nano-tracking devices implanted beneath banana peels, allegedly planted by shadow intelligence agencies to monitor citizen groceries.", "subject": "conspiracy", "date": "September 20, 2026"},
    {"title": "SHOCKING SECRET: Ancient Alien Spacecraft Unearthed Under Antarctic Ice Sheet Exposed", "text": "Whistleblower reports confirm a massive extraterrestrial flying saucer was dug up beneath miles of glacial ice emitting mysterious telepathic radio signals to outer space.", "subject": "News", "date": "September 19, 2026"},
    {"title": "UNBELIEVABLE: NASA Staged the Solar Eclipse Using Giant Space Mirrors to Hide Planet X", "text": "Astrology insiders blow the lid on NASA's planetary cover-up, claiming orbital mega-reflectors were deployed in low orbit to simulate an eclipse and hide a rogue wandering planet.", "subject": "conspiracy", "date": "September 18, 2026"},
    {"title": "SCANDAL: Secret World Government Bans Oxygen Breathing to Impose Planetary Carbon Taxes", "text": "Outrageous leaked documents prove bureaucrats are plotting to install mandatory personal respiration meters on every citizen to tax each breath of air as an environmental penalty.", "subject": "politics", "date": "September 17, 2026"},
    {"title": "ALIENS IN NY: Secret Pyramid Base Built Underneath New York City Subway Unearthed", "text": "Mysterious glowing portal discovered by construction workers covered up by deep state military agents to hide extraterrestrial reptilian beings.", "subject": "conspiracy", "date": "September 16, 2026"},
    {"title": "TIME TRAVELER FROM 2085: Mysterious Man Arrives Warning of Imminent Zombie Invasion", "text": "A man claiming to have traveled backward through time presented futuristic holographic gadgets and warned that a rogue lab experiment will unleash walking dead zombies next week.", "subject": "News", "date": "September 15, 2026"},
    {"title": "HOLIDAY HOAX: Secret Law Passed Banning All Banks and Giving Every Citizen Million Dollars", "text": "Leaked presidential decree orders the treasury to print infinite money for everyone while completely abolishing taxes and banks overnight.", "subject": "politics", "date": "September 14, 2026"},
    {"title": "HOLLOW EARTH PROVEN: Pacific Ocean Whirlpool Leads to Secret Prehistoric Jungle World", "text": "Secret naval sonar soundings allegedly discovered a massive whirlpool entrance leading to a subterranean hollow Earth realm inhabited by living dinosaurs.", "subject": "conspiracy", "date": "September 13, 2026"},
    {"title": "WI-FI SPYING: Home Internet Routers Broadcast Ultrasonic Frequencies to Record Dreams", "text": "An anonymous hacker claims home internet routers contain hidden telepathic microphones that record household dreams and upload the data directly to shadow databases.", "subject": "conspiracy", "date": "September 12, 2026"},
    {"title": "MAGIC TALISMAN: Leaked Tape Shows Officials Trading State Secrets for Good Luck Charms", "text": "A shocking audio recording exposes top bureaucrats consulting psychic astrologers and trading government classified dossiers for ancient enchanted good-luck talismans.", "subject": "politics", "date": "September 11, 2026"},
    {"title": "WEATHER HOAX: Clouds Are Manufactured in Secret Underground Smoke Factories", "text": "Viral whistleblower videos claim weather systems and rain clouds are not natural but generated by massive smoke machines hidden beneath mountain ranges to control human mood.", "subject": "conspiracy", "date": "September 10, 2026"},
    {"title": "INTERNET CRACKDOWN: Secret Treaty Makes It Illegal to Post Negative Reviews Online", "text": "Unverified blog posts claim global politicians signed a clandestine treaty imposing twenty-year prison sentences for anyone posting negative reviews or critical comments on social media.", "subject": "politics", "date": "September 09, 2026"},
    {"title": "DRINKING BLEACH MIRACLE: Anonymous Online Healer Claims Bleach Destroys All Toxins", "text": "Social media influencers urge followers to drink household bleach to purge viral toxins instantly, claiming medical doctors are hiding this easy miracle.", "subject": "News", "date": "September 08, 2026"},
    {"title": "SUPERMARKET SCAM: Fast Food Chains Replaced Beef With 3D Printed Cardboard Paste", "text": "Anonymous whistleblowers claim popular burger chains stopped buying farm meat and now feed customers flavored cardboard cellulose paste generated by 3D printers.", "subject": "News", "date": "September 07, 2026"}
]

def generate_and_save():
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    raw_dirs = [
        os.path.join(backend_dir, "data", "raw"),
        os.path.join(os.path.dirname(backend_dir), "data", "raw")
    ]
    
    # Expand to 500 Real and 500 Fake samples
    df_true = pd.DataFrame(true_articles * 23)
    df_fake = pd.DataFrame(fake_articles * 23)
    
    for r_dir in raw_dirs:
        os.makedirs(r_dir, exist_ok=True)
        true_path = os.path.join(r_dir, "True.csv")
        fake_path = os.path.join(r_dir, "Fake.csv")
        
        df_true.to_csv(true_path, index=False)
        df_fake.to_csv(fake_path, index=False)
        print(f"Saved True.csv ({len(df_true)} rows) and Fake.csv ({len(df_fake)} rows) to: {r_dir}")

if __name__ == "__main__":
    generate_and_save()
