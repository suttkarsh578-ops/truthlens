import pandas as pd
import os

os.makedirs("data/raw", exist_ok=True)

true_news = [
    {
        "title": "Federal Reserve Holds Interest Rates Steady Amid Cooling Inflation Indicators",
        "text": "WASHINGTON (Reuters) - The Federal Reserve held interest rates steady on Wednesday and indicated that borrowing costs would remain balanced as inflation numbers continue to moderate across industrial and consumer sectors.",
        "subject": "politicsNews",
        "date": "September 28, 2026"
    },
    {
        "title": "European Union Finalizes Major Cross-Border Renewable Energy Grid Accord",
        "text": "BRUSSELS (Reuters) - European energy ministers reached a consensus on a multi-billion dollar clean energy transmission network to link offshore wind parks with southern solar installations, ensuring steady regional power supplies.",
        "subject": "worldnews",
        "date": "September 27, 2026"
    },
    {
        "title": "NASA James Webb Space Telescope Detects Atmospheric Water Vapor on Rocky Exoplanet",
        "text": "CAPE CANAVERAL (Reuters) - Astronomers using the James Webb Space Telescope have identified definitive spectroscopic signatures of water vapor surrounding an Earth-sized rocky exoplanet orbiting within a habitable star system.",
        "subject": "worldnews",
        "date": "September 26, 2026"
    },
    {
        "title": "Indian Economy Expands by 7.2 Percent Led by Manufacturing and Tech Export Growth",
        "text": "NEW DELHI (Reuters) - India's gross domestic product expanded by 7.2% year-on-year in the latest quarter, driven by strong domestic consumption, automotive production, and rising software exports, the finance ministry announced.",
        "subject": "worldnews",
        "date": "September 25, 2026"
    },
    {
        "title": "Global Health Authorities Announce Successful Phase 3 Universal Influenza Vaccine Trials",
        "text": "GENEVA (Reuters) - The World Health Organization confirmed that a universal mRNA vaccine targeting invariant influenza stalk proteins demonstrated 94% efficacy in preventing severe hospitalizations across multi-continent clinical trials.",
        "subject": "worldnews",
        "date": "September 24, 2026"
    },
    {
        "title": "Semiconductor Manufacturers Unveil 2-Nanometer Energy Efficient Computing Nodes",
        "text": "TAIPEI (Reuters) - Leading semiconductor fabrication facilities have achieved volume production yields on next-generation 2-nanometer transistor architectures, providing 35% higher computing throughput at 40% reduced power.",
        "subject": "techNews",
        "date": "September 23, 2026"
    },
    {
        "title": "International Maritime Organization Agrees on Net Zero Shipping Emission Milestones",
        "text": "LONDON (Reuters) - International shipping delegations agreed on mandatory decarbonization targets requiring cargo vessels to transition to green methanol, ammonia, and wind-assisted propulsion systems by 2040.",
        "subject": "worldnews",
        "date": "September 22, 2026"
    },
    {
        "title": "Global Cyber Defense Agencies Release Unified Protocol Against Ransomware Threats",
        "text": "WASHINGTON (Reuters) - Cybersecurity directors from twenty nations published technical advisories detailing coordinated automated defense heuristics designed to counter decentralized extortion networks.",
        "subject": "politicsNews",
        "date": "September 21, 2026"
    }
] * 25  # Replicate for robust train/test split

fake_news = [
    {
        "title": "SHOCKING SECRET: Ancient Alien Spacecraft Unearthed Under Antarctic Ice Sheet Exposed",
        "text": "In a mind-blowing classified revelation that world governments have tried desperately to suppress, whistleblower reports confirm a massive extraterrestrial flying saucer was dug up beneath miles of glacial ice emitting mysterious radio signals.",
        "subject": "News",
        "date": "September 28, 2026"
    },
    {
        "title": "BREAKING: Scientists Confirm Drinking 5 Gallons of Saltwater Cures All Human Diseases Overnight",
        "text": "Mainstream medical doctors do not want you to know this simple secret remedy! A miracle natural mixture of heavy saltwater and crushed crystals miraculously reverses aging and destroys every known virus in twelve hours without prescription medication.",
        "subject": "News",
        "date": "September 27, 2026"
    },
    {
        "title": "LEAKED PROOF: Secret Society Replaces All World Leaders With Robotic Synthetic Clones",
        "text": "Viral leaked memos from anonymous underground sources prove that world politicians and celebrities have been replaced with advanced synthetic androids controlled via satellite mind control beams hidden in ordinary streetlights.",
        "subject": "Government",
        "date": "September 26, 2026"
    },
    {
        "title": "BOMBSHELL: 5G Cell Towers Cause Spontaneous Levitation and Telepathy in Domestic Cats",
        "text": "Shocking viral footage circulating across social media shows household pets floating in mid-air near telecommunication towers, confirming secret government telepathic radiation testing on unsuspecting suburban communities.",
        "subject": "conspiracy",
        "date": "September 25, 2026"
    },
    {
        "title": "EXPOSED: Secret Bank Vault Under Niagara Falls Contains Trillions in Lost Pirate Gold",
        "text": "Treasure hunters claim deep-diving sonar scans have uncovered a sunken subterranean fortress behind Niagara Falls packed with ancient gold bullion hidden by time-traveling colonial admirals.",
        "subject": "News",
        "date": "September 24, 2026"
    },
    {
        "title": "UNBELIEVABLE: NASA Staged the Solar Eclipse Using Giant Space Mirrors to Hide Planet X",
        "text": "Astrology insiders blow the lid on NASA's planetary cover-up, claiming orbital mega-reflectors were deployed in low orbit to simulate an eclipse and prevent stargazers from noticing a rogue wandering planet approaching Earth.",
        "subject": "conspiracy",
        "date": "September 23, 2026"
    },
    {
        "title": "MIRACLE ALERT: Eating Raw Gold Flakes Allows Humans to Live for 500 Years Without Sleep",
        "text": "Forbidden alchemical manuscripts recovered from ancient catacombs reveal that consuming pure elemental gold dust transforms human DNA into immortal crystalline structures immune to fatigue.",
        "subject": "News",
        "date": "September 22, 2026"
    },
    {
        "title": "SCANDAL: Secret World Government Bans Oxygen Breathing to Impose Planetary Carbon Taxes",
        "text": "Outrageous leaked documents prove bureaucrats are plotting to install mandatory personal respiration meters on every citizen to tax each breath of air as an environmental penalty starting next month.",
        "subject": "politics",
        "date": "September 21, 2026"
    }
] * 25  # Replicate for robust train/test split

df_true = pd.DataFrame(true_news)
df_fake = pd.DataFrame(fake_news)

df_true.to_csv("data/raw/True.csv", index=False)
df_fake.to_csv("data/raw/Fake.csv", index=False)

print(f"Created True.csv with {len(df_true)} records")
print(f"Created Fake.csv with {len(df_fake)} records")
