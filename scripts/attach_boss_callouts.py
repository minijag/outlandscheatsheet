"""Apply reviewed journal-to-mechanic mappings; does not rescan journals.

Rules match only boss speech. New mechanics describe the announcement, not
unobserved combat effects. Unmatched future phrases require another review.
"""
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
# Boss heading, followed by mechanic name | phrase pattern. Existing mechanic
# names are reused verbatim; other names become new journal-derived mechanics.
RULES = """
@Behemoth Basilisk
Calls for Aid|calls for aid
Debilitating Slime|slime
Menacing Gaze|gazes menacingly
Strange Shards|strange shards
Regurgitated Stones|strange stones
Tail Lash|lashes tail
Screech|screeches
@Infernus
Infernal Summons|raises hell
Flame Rifts|flame rift
Flaming Fury|unleashes .*fury|unleashes fury
Inferno|summons inferno
Hellfire|hellfire
Earth Carving|carves the earth
Rage Explosion|explodes with rage
Summoned Flames|summons flames
@Great Sunken Serpent
Ranged Reinforcements|sends a call to the deep
Tidal Floor|stirs the water
Deep Breath|breathes extremely deeply
Earth Shaking|shakes the earth
Circling|circles
@Emperor Dragon
Draconic Summons|calls for aid
Feed|begins to feed
Flamemark|flamemark
Long Deep Breath|takes a long, deep breath
Dragon Breath|takes a deep breath
Massive Breath|massive breath
Wing Beats|beats massive wings
Charge|begins to charge
@Lord Bile
Regurgitated Meals|regurgitates previous meals
Stomach Rumble|stomach begins to rumble
Discomfort|looks .*uncomfortable|looks uncomfortable
Pink Vomit|vomits
Built-Up Gas|built up gas
@Aegis High Priestess
Living Blood|brings blood to life
Web|spins gigantic web trails
Blood Magic|spins a bloody mess
Spider Transformation|shapeshifts
Poison Saliva|spits vile venom
Scythe Spin|spins scythe
Chaos Signs|forms many chaos signs|forms several chaotic signs
Spin Out|spins out
@Kraul Hivemother
Clicking|clicks
Dust Cloud|dust cloud
Larval Eggs|larval eggs
Hivemind|channels hivemind
Mold Spores|mold spores
Bombs|explosive eggs
Fly Infestation|fly infestation
@Ocean's Fury
Sea Call|issues sea call
Typhoon|gathers an epic typhoon
@Forgotten King
Undead Reinforcements|rallies long-dead bannermen
Strange Ritual|strange ritual
Bone Blades|bone blades
Offerings|offering
Spike Traps|bone skewers
Mummification|mummification
Gathered Bones|gathers .*bones|gathers bones
Cursed Status|cursed
@Gargoyle Primogen
Summons Adds|raises hell
Stonecrafting Masterwork|stonecrafting
Immolation Runes|immolation runes
Monument Pillaging|monuments
Intimidated Status|intimidated
Hell's Bells|hell's bells
Death's Head|death's head
Static|static
@Kraul Hydra
Snakecharm|snakecharm
Strange Orbs|strange orbs
Deep Breath|deep breath
Snake Pits|snake pits
Coiled Energy|coiled energy
Glowmark Status|glowmark
Body Storm|tempest
@Gatekeeper
Summons Adds|summons minions
Starfall|ghostly meteors
Stars|draws deep from the ether
Eldritch Power|eldritch power
Arcane Spheres|arcane spheres
Balefire|balefire
Mirror Images|mirror images
Chain Lightning|harnesses .*lightning|harnesses lightning
@Terathan Goliath
Swarm Summons|summons the swarm
Acid Spray|acid
Spine Volley|spines
Infectious Spores|infectious spores
Cave-In|cave in
Falling Stalactites|stalactites
Burrowing Ants|vibrations below
@Stygian Gaoler
Prison Reinforcements|sounds alarm
Gaolbreak|gaolbreak
Suppression Blast|suppression fields
Searchlights|searchlights
Stygian Energy|stygian energy
Imprisonment|imprisonment
Turned to Stone|turned to stone
Lockdown|lockdown
@Undermind
Reinforcement Call|raises hell
Breath of the Deep|breath of the deep
Mindshrooms|mindshrooms
Brain Coral|brain coral
Drowned Monoliths|drowned monoliths
Extended Maw|extends maw
Fishy Imprisonment|fishy imprisonment
@Abyssal Daemon
Rift Servants|summons servants from the rift
Abyssal Claws|abyssal claws
Abyssal Doom|abyssal doom
Beckons the Void|beckons the void
Abyssal Souls|abyssal souls
Green Sphere|abyssal sphere
Abyssal Fury|abyssal fury
@Astral Daemon
Rift Servants|summons servants from the rift
Cosmic Rays|cosmic rays
Astral Energy|astral energy
Astral Mirror|astral mirrors
Solar Rings|solar rings
Stardust Shower|stardust shower
Pillars of Creation|pillars of creation
@Storm Daemon
Rift Servants|summons servants from the rift
Lightning Blitz|lightning blitz
Lightning Rod|lightning rods
Tempest|tempest
Shockshot|shockshot
Supercharge|supercharge
Overcharge|overcharge
Ion Spheres|ion spheres
@Terrorwood
Propagation|propagates
Swampy Seeds|swampy seeds
Explosive Mushrooms|plants .*spores|plants spores
Needle Seeds|needle seeds
Spikeseeds|spikeseeds
@Sanguineous
Deflection|deflects
Spell Parry|parries spell
Living Blood|brings blood to life
Charge|charges
Shapeshift|shapeshifts
Sword and Shield|readies sword and shield
Stirring Blood|blood begins to stir
Heart Attacks|heart attacks
Reaching Below|reaches below
Reaching Beyond|reaches far beyond
Blood Burst|sprays .*blood|sprays blood
@Pit Dragon
Screech|screeches
Deep Breath|deep breath
Massive Breath|massive breath
Unleashed Evil|unleashes .*evil|unleashes evil
Dematerialization|dematerializes|materializes
Ranged Summons|summons beasts of the pit
@Speaker For The Dead
Phantom Summons|speaks to the dead
Memorial Candles|memorial candles
Flaming Skulls|flaming skulls
Embalming Mixture|embalming mixture
Raised Dead|raises .*dead|raises dead
@Lodestone
Earth Beckoning|beckons the earth
Damage Reflection|harmonic refraction
Ground Pounding|pounds the ground
Thrown Stones|throws .*stones|throws stones
Crush|crushes
Earth Descent and Return|returns from the earth|descends to the earth
Harmonic Feedback|harmonic feedback
@Ancient Drowned Dragon
Groan|groans
Massive Breath|massive breath
Deep Breath|deep breath
Bone Tide|tide of bone|surge of bones
Scalding Water Breath|scalding water
@Heart Of The Mountain
Spreads|spreads
Shapes Fire|shapes .*fire|shapes fire
Releases Stored Energy|store of energy|stored energy
Accelerates|accelerat
Draws From the Core|from the core
@Cistern Gorgon
Summons Serpents|releases serpents
Focused Gaze|focuses .*gaze|focuses gaze
Arrows|unleashes .*arrows
Ice Storm|ice storm|freezing rain
Stirred Water|stirs the water
Toxic Arrows|toxic arrows
Crippling Arrows|crippling arrows
Chilling Arrows|chilling arrows
@Great Abyssal Hornbeast
Wail|wails
Shoulder Blades|shoulder blades
Icy Abyss|icy abyss
@Gargoyle Archon
Summons Adds|raises hell
Golden Wings|golden wings
Pane|pane
Stone Fists|stone fists
Archon Statue|stonecrafting
@Oblivion Deathmage
Oblivion|gathers oblivion
Deathstare|deathstare
Haunting|haunting
Deathgrip|deathgrip
Faces Death|faces .*death|faces death
@Marinerbane
Deep Dwellers|stirs deep dwellers
Exploding Sharks|catch of the
Drowned Gunners|cannon crew
Explosive Barrels|glowing barrels
Launch|lashes out
Feelers|feelers
@Broodbearer
Brooding|broods
Webbing|readies webbing
@Echo Of A Lost Age
Painful Memory|painful memory
Wail for the Past|wails for the past
@Flamekeeper
Eruption|erupts
"""

# Wording-based descriptions deliberately avoid inventing damage or counters.
DESCRIPTIONS = {
    "Scythe Spin": "Spins a scythe, with a violent variant. Its reach and damage are unconfirmed.",
    "Chaos Signs": "Forms multiple chaos signs. Their effects and interactions are unconfirmed.",
    "Spin Out": "Announces spinning out; its movement pattern and resulting effect are unknown.",
    "Clicking": "Makes a clicking sound. Its effect is unknown.",
    "Dust Cloud": "Announces a dust cloud; its area, duration, and effects are unknown.",
    "Larval Eggs": "Lays larval eggs, sometimes a colony. What hatches and when remain unknown.",
    "Hivemind": "Channels the hivemind, with an urgent variant. Its target and effects are unknown.",
    "Mold Spores": "Gathers mold spores, sometimes a swarm. Their effects are unconfirmed.",
    "Fly Infestation": "Announces a fly infestation; its targets and effects are unknown.",
    "Calls for Aid": "Calls for assistance, suggesting a reinforcement cue.",
    "Debilitating Slime": "Announces a spray of debilitating slime.",
    "Menacing Gaze": "Fixes a menacing gaze; the affected target and resulting effect are unknown.",
    "Strange Shards": "Flings a shower of strange shards.",
    "Regurgitated Stones": "Regurgitates strange stones, sometimes announced as many stones.",
    "Tail Lash": "Lashes its tail wildly.",
    "Screech": "Screeches. Any additional effect is unconfirmed.",
    "Flame Rifts": "Announces the creation of one or several flame rifts.",
    "Flaming Fury": "Announces a release of fury, with a flaming variant.",
    "Inferno": "Announces a summoned inferno.",
    "Hellfire": "Calls down hellfire, sometimes described as almighty.",
    "Earth Carving": "Carves the earth, with a variant extending to the core.",
    "Rage Explosion": "Announces an explosion of rage.",
    "Summoned Flames": "Announces summoned flames.",
    "Deep Breath": "Draws a deep breath as a possible wind-up cue.",
    "Massive Breath": "Draws a massive breath. Its effect is unconfirmed.",
    "Earth Shaking": "Announces shaking the earth, sometimes violently.",
    "Circling": "Circles rapidly or feverishly.",
    "Flamemark": "Places a flamemark, with a powerful variant.",
    "Wing Beats": "Beats its massive wings furiously.",
    "Regurgitated Meals": "Regurgitates previous meals. What appears is unconfirmed.",
    "Stomach Rumble": "Its stomach begins to rumble, sometimes violently.",
    "Discomfort": "Looks uncomfortable or extremely uncomfortable, suggesting a wind-up cue.",
    "Built-Up Gas": "Releases a large amount of built-up gas.",
    "Sea Call": "Issues a sea call, suggesting a reinforcement signal.",
    "Typhoon": "Gathers an epic typhoon.",
    "Strange Ritual": "Begins a strange ritual, with an intensified variant.",
    "Bone Blades": "Fashions bone blades, sometimes a full panoply.",
    "Offerings": "Makes several offerings or a grand offering.",
    "Mummification": "Begins mummification, sometimes announced as mass mummification.",
    "Gathered Bones": "Gathers bones or a mass of bones.",
    "Cursed Status": "The boss is annotated as cursed. This may be an applied status rather than an outgoing ability.",
    "Intimidated Status": "The boss is annotated as intimidated. This may be an applied status rather than an outgoing ability.",
    "Glowmark Status": "A glowmark annotation appears on the boss; its origin is not established.",
    "Monument Pillaging": "Pillages monuments, with a variant announcing razing and pillaging.",
    "Death's Head": "Raises a death's head, sometimes described as fatal.",
    "Snakecharm": "Displays Snakecharm. Its source and effect are unconfirmed.",
    "Strange Orbs": "Unleashes strange orbs, sometimes in a flurry.",
    "Snake Pits": "Creates snake pits, sometimes a swarm of them.",
    "Coiled Energy": "Releases coiled energy, with a torrent variant.",
    "Eldritch Power": "Unleashes a torrent of eldritch power.",
    "Arcane Spheres": "Creates a battery of arcane spheres.",
    "Balefire": "Wields balefire, with a wild variant.",
    "Mirror Images": "Forms several mirror images.",
    "Swarm Summons": "Summons a swarm. The creature types are unconfirmed.",
    "Acid Spray": "Sprays a torrent of acid.",
    "Spine Volley": "Releases a flurry of spines.",
    "Infectious Spores": "Shoots a cloud of infectious spores.",
    "Cave-In": "Starts a cave-in, sometimes described as deadly.",
    "Falling Stalactites": "Brings down stalactites, sometimes as a shower.",
    "Gaolbreak": "Announces a gaolbreak or wild gaolbreak.",
    "Searchlights": "Engages searchlights, sometimes in a sweep.",
    "Stygian Energy": "Unleashes stygian energy, with a massive variant.",
    "Imprisonment": "Begins imprisonment, with a lengthy variant.",
    "Turned to Stone": "Signals a transformation to stone. The affected target is unconfirmed.",
    "Lockdown": "Initiates lockdown, with a rapid variant.",
    "Reinforcement Call": "Announces 'raises hell', suggesting a reinforcement cue.",
    "Breath of the Deep": "Announces a breath of the deep, sometimes a long breath.",
    "Mindshrooms": "Spews mindshrooms, with a massive variant.",
    "Brain Coral": "Unleashes brain coral, sometimes a slew of it.",
    "Drowned Monoliths": "Raises drowned monoliths, sometimes a swathe of them.",
    "Extended Maw": "Extends its maw, with a hungry variant.",
    "Fishy Imprisonment": "Announces fishy imprisonment, with a severe variant.",
    "Rift Servants": "Summons servants from the rift. The servant types are unconfirmed.",
    "Abyssal Doom": "Manifests abyssal doom, sometimes described as certain.",
    "Abyssal Fury": "Unleashes abyssal fury, with a terrifying variant.",
    "Lightning Blitz": "Announces a lightning blitz, with an arcing variant.",
    "Shockshot": "Announces a shockshot, with a crackling variant.",
    "Supercharge": "Announces both the start of supercharge and when it subsides.",
    "Overcharge": "Announces both the start of overcharge and when it subsides.",
    "Propagation": "Announces propagation, suggesting growth or spawning.",
    "Swampy Seeds": "Plants a great deal of swampy seeds.",
    "Needle Seeds": "Plants needle seeds, sometimes a field of them.",
    "Spikeseeds": "Shoots spikeseeds, sometimes a swarm.",
    "Deflection": "Deflects an attack. Which attack types can be deflected is unconfirmed.",
    "Spell Parry": "Announces parrying a spell.",
    "Living Blood": "Brings blood to life, suggesting an animation or summon.",
    "Charge": "Announces a charge.",
    "Shapeshift": "Announces a change of form.",
    "Sword and Shield": "Readies a sword and shield.",
    "Stirring Blood": "Announces that blood begins to stir.",
    "Heart Attacks": "Announces inducing heart attacks, with a fatal variant.",
    "Reaching Below": "Reaches below; the destination and resulting effect are unknown.",
    "Reaching Beyond": "Reaches far beyond; the destination and resulting effect are unknown.",
    "Unleashed Evil": "Unleashes evil, sometimes described as abyssal.",
    "Dematerialization": "Announces complete dematerialization and subsequent materialization.",
    "Memorial Candles": "Lights memorial candles, sometimes a large number.",
    "Flaming Skulls": "Throws flaming skulls, sometimes a pile.",
    "Embalming Mixture": "Prepares embalming mixture, sometimes a massive amount.",
    "Raised Dead": "Raises dead, sometimes a good number of them.",
    "Earth Beckoning": "Beckons the earth. Any resulting objects or creatures are unconfirmed.",
    "Ground Pounding": "Pounds the ground, sometimes to dust.",
    "Thrown Stones": "Throws stones, sometimes many stones.",
    "Crush": "Announces a crushing action.",
    "Earth Descent and Return": "Announces descending to the earth and returning from it.",
    "Harmonic Feedback": "Experiences harmonic feedback; the resulting effect is not identified.",
    "Groan": "Groans; no specific attack is identified by this cue.",
    "Bone Tide": "Unleashes a tide or surge of bones.",
    "Scalding Water Breath": "Breathes scalding water, sometimes a torrent.",
    "Focused Gaze": "Focuses a gaze, with a hateful variant.",
    "Ice Storm": "Calls down an ice storm or freezing rain.",
    "Stirred Water": "Stirs the water, sometimes into a frenzy.",
    "Toxic Arrows": "Readies toxic arrows, with a potent variant.",
    "Crippling Arrows": "Readies crippling arrows, with a potent variant.",
    "Chilling Arrows": "Readies potent chilling arrows.",
    "Wail": "Wails; no specific attack is identified by this cue.",
    "Shoulder Blades": "Fires shoulder blades, sometimes a barrage.",
    "Icy Abyss": "Reaches into the icy abyss, with a deeper variant.",
    "Golden Wings": "Unleashes golden wings, sometimes a litany.",
    "Stone Fists": "Throws stone fists, sometimes a torrent.",
    "Deathstare": "Announces a deathstare, with a piercing variant.",
    "Haunting": "Begins a haunting, sometimes described as eerie.",
    "Deathgrip": "Announces a deathgrip, with a mortal variant.",
    "Faces Death": "Announces facing death or certain death.",
    "Deep Dwellers": "Stirs deep dwellers, suggesting a reinforcement cue.",
    "Feelers": "Sends out feelers, sometimes a horde.",
    "Brooding": "Announces brooding; the cue alone does not identify offspring or their behavior.",
    "Webbing": "Readies webbing, suggesting an upcoming web effect.",
    "Painful Memory": "Announces a painful memory; the target and effect are not identified.",
    "Wail for the Past": "Wails for the past; the target and effect are not identified.",
    "Eruption": "Erupts. Its area and damage are unconfirmed.",
}


def canonical_name(name):
    # Accept saved reports generated before the project roster was corrected.
    return "Aegis High Priestess" if name == "Aegis High Priest" else name


def main():
    output = ROOT / "src/journal-callouts.json"
    if output.exists():
        print("One-time import already completed. Existing ability data is preserved; edit src/journal-callouts.json directly.")
        return
    report = json.loads((ROOT / "reports/boss-callouts/report.json").read_text(encoding="utf-8"))
    rules = {}
    for line in RULES.strip().splitlines():
        if line.startswith("@"):
            boss = line[1:]
            rules[boss] = []
        else:
            name, pattern = line.split("|", 1)
            rules[boss].append((name, re.compile(pattern, re.I)))
    result = {"generatedFrom": report["generated_at"], "bosses": {canonical_name(b["name"]): {} for b in report["bosses"]}}
    for row in report["phrases"]:
        if row["category"] != "boss speech":
            continue
        row = {**row, "boss": canonical_name(row["boss"])}
        matches = [name for name, pattern in rules.get(row["boss"], []) if pattern.search(row["phrase"])]
        if len(matches) != 1:
            raise ValueError(f"Review required ({matches}): {row['boss']}: {row['phrase']}")
        name = matches[0]
        entry = result["bosses"][row["boss"]].setdefault(name, {"description": DESCRIPTIONS.get(name), "callouts": []})
        entry["callouts"].append({"phrase": row["phrase"], "count": row["count"], "source": Path(row["example_file"]).name, "line": row["example_line"], "timestamp": row["example_timestamp"]})
    # Exclusive creation also prevents overwriting a file created during import.
    with output.open("x", encoding="utf-8") as stream:
        stream.write(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    print(f"Attached {sum(len(e['callouts']) for b in result['bosses'].values() for e in b.values())} callouts to {sum(len(b) for b in result['bosses'].values())} mechanics.")


if __name__ == "__main__":
    main()
