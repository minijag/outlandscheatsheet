const img = (file) => file ? `/bosses/${file}` : null
const mechanic = (file) => file ? `/mechanics/${file}` : null

export const bosses = [
  {
    name: 'Behemoth Basilisk', type: 'Main Boss', location: 'Cavernam', slayer: 'Monstrous', role: 'Armored melee', confidence: 'medium', image: img('behemoth-basilisk.gif'),
    summary: 'A positional poison fight built around breath attacks and falling ice.',
    abilities: [
      ['Poison Breath', 'Projects a heavily damaging poison attack into its threatened area.'],
      ['Icy Needles', 'Flaps its wings and drops dodgeable ice projectiles around players.'],
    ],
    tips: ['Carry cures and keep them hotkeyed.', 'Spread loosely and move when the wing animation begins.'],
  },
  {
    name: 'Infernus', type: 'Main Boss', location: 'Inferno', slayer: 'Daemonic', role: 'Melee / mage', confidence: 'medium', image: img('infernus.gif'),
    summary: 'An arena-control encounter where safe floor space steadily disappears.',
    abilities: [
      ['Expanding Flames', 'Progressively covers sections of the arena floor in fire.'],
      ['Moving Firewall', 'Sends moving lines of fire through the encounter space.'],
      ['Infernal Summons', 'Calls increasingly dangerous fire-themed minions.'],
    ],
    tips: ['Preserve safe floor space.', 'Dodge moving fire and clear dangerous adds promptly.'],
  },
  {
    name: 'Great Sunken Serpent', type: 'Main Boss', location: 'Pulma', slayer: 'Beastial', role: 'Stealth melee', confidence: 'medium', image: img('great-sunken-serpent.gif'),
    summary: 'A floor-awareness fight with a dangerous ranged-add finish.',
    abilities: [
      ['Tidal Floor', 'Water changing color telegraphs dangerous floor tiles.'],
      ['Deadly Traps', 'Converts portions of the arena into damaging hazards.'],
      ['Ranged Reinforcements', 'Summons hard-hitting ranged minions at lower health.'],
    ],
    tips: ['Move immediately when the water changes.', 'Either pause for adds or commit to a coordinated burn.'],
  },
  {
    name: 'Emperor Dragon', type: 'Main Boss', location: 'Nusero', slayer: 'Beastial', role: 'Fast melee', confidence: 'medium', image: img('emperor-dragon.gif'),
    summary: 'A movement fight that punishes stacking and ignored reinforcements.',
    abilities: [
      ['Dragon Breath', 'A slow directional breath attack that can be sidestepped.'],
      ['Charge', 'Rushes a target or location and punishes stacked players.'],
      ['Draconic Summons', 'Calls Spine Breakers, Sun Wyrms, and dragons.'],
    ],
    tips: ['Spread for the charge.', 'Clear summons before finishing the boss.'],
  },
  {
    name: 'Aegis High Priest', type: 'Main Boss', location: 'Aegis Keep', slayer: 'Humanoid', role: 'Stealth melee / mage', confidence: 'medium', image: img('aegis-high-priest.gif'),
    summary: 'A layered control fight featuring webs, blood magic, poison, and priority casters.',
    abilities: [
      ['Spider Transformation', 'Transforms into a giant spider and gains access to web attacks.'],
      ['Web', 'Restrains players and prolongs exposure to other mechanics.'],
      ['Blood Magic', 'Casts area burst and bleed attacks.'],
      ['Poison Saliva', 'Spits poison at a selected player.'],
      ['Tracking Orb', 'Travels toward a player’s recorded position and can be outrun.'],
      ['Blood Sorcerers', 'Priority caster adds that inflict area bleed effects.'],
    ],
    tips: ['Keep moving during orb attacks.', 'Kill Blood Sorcerers immediately and carry cure potions.'],
  },
  {
    name: 'Lord Bile', type: 'Main Boss', location: 'Darkmire Temple', slayer: 'Monstrous', role: 'Slow melee', confidence: 'medium', image: img('lord-bile.gif'),
    summary: 'A poison-heavy attrition fight with persistent pools and delayed explosions.',
    abilities: [
      ['Pink Vomit', 'Creates floor pools that deal direct damage and may poison.'],
      ['Delayed Detonation', 'Applies a delayed explosion capable of killing an unprepared player.'],
      ['Poison Spit', 'Launches poison at distant targets.'],
      ['Otyugh Summon', 'Calls a dangerous add with very large area damage.'],
    ],
    tips: ['Avoid pools and spread before detonations.', 'Prioritize Otyughs; bring substantial healing and cures.'],
  },
  {
    name: "Ocean's Fury", type: 'Main Boss', location: 'Ships', slayer: 'Monstrous', role: 'Melee', confidence: 'medium', image: img('ocean-s-fury.gif'),
    summary: 'A mobile ocean encounter dominated by arena-wide pressure and targeted blasts.',
    abilities: [
      ['Arena-wide AoE', 'Performs large attacks with few safe areas near the boss.'],
      ['Targeted Explosions', 'Explosions emerge beneath player positions.'],
    ],
    tips: ['Remain in motion and avoid clustering.', 'Retreat to resupply rather than chain-dying near the encounter.'],
  },
  {
    name: 'The Forgotten King', type: 'Main Boss', location: 'Ossuary', slayer: 'Undead', role: 'Armored melee', confidence: 'medium', image: img('the-forgotten-king.gif'),
    summary: 'A trap gauntlet with punishing undead reinforcements.',
    abilities: [
      ['Spike Traps', 'Spikes appear at player locations with little warning and can cause bleeding.'],
      ['Explosive Traps', 'Marked traps detonate after a short delay.'],
      ['Undead Reinforcements', 'Summons liches and other ranged undead.'],
      ['Zombie Dragon', 'Priority summon with a dangerous disease breath.'],
    ],
    tips: ['Keep moving and avoid overlapping markers.', 'Kill the Zombie Dragon first.'],
  },
  {
    name: 'Gargoyle Primogen', type: 'Main Boss', location: 'Shadowspire Cathedral', slayer: 'Daemonic', role: 'Armored melee / mage', confidence: 'medium', image: img('gargoyle-primogen.jpg'),
    summary: 'An add-control check whose late waves can overwhelm even large groups.',
    abilities: [
      ['Summon Waves', 'Calls increasingly dangerous waves of cathedral monsters.'],
      ['Flame Shapers', 'Priority adds capable of extreme group damage.'],
      ['Priests', 'Support adds that reinforce the encounter.'],
      ['Boss Burst', 'A high-damage ability capable of wiping clustered or weakened players.'],
    ],
    tips: ['Kill Flame Shapers and Priests immediately.', 'Use controlled damage and dedicated healers.'],
  },
  {
    name: 'Kraul Hydra', type: 'Main Boss', location: 'Kraul Hive', slayer: 'Beastial', role: 'Heavy melee', confidence: 'medium', image: img('kraul-hydra.gif'),
    summary: 'A raid-style positioning test mixing fixed patterns, body storms, disease, and lethal adds.',
    abilities: [
      ['Hive Reinforcements', 'Summons exceptionally dangerous Kraul creatures.'],
      ['Hive Warden', 'Priority add with heavy area damage.'],
      ['Hive Queen', 'Priority add with high disease damage.'],
      ['Radial Barrage', 'Fires projectiles on fixed radial trajectories, dividing the arena into sectors.'],
      ['Body Storm', 'Creates a damaging storm around the Hydra.'],
    ],
    tips: ['Identify the radial safe sector.', 'Withdraw during storms and kill Wardens and Queens immediately.'],
  },
  {
    name: 'Gatekeeper', type: 'Main Boss', location: 'Mausoleum', slayer: 'Undead', role: 'Mage', confidence: 'medium', image: img('gatekeeper.gif'),
    summary: 'A movement-discipline fight with two opposite reactions: freeze during Chain Lightning, then keep moving through Starfall.',
    abilities: [
      ['Chain Lightning', 'Repeatedly strikes in response to player movement across a very large area. Stop moving when Chain Lightning begins; additional movement causes additional strikes.'],
      ['Starfall', 'Calls down a rapid barrage of stars that can kill a stationary player almost instantly. Move continuously until the Starfall sequence ends.'],
      ['Paralysis', 'Lightning can paralyze players and interrupt spellcasting, making unnecessary movement during Chain Lightning even more dangerous.'],
      ['Hybrid AoE', 'Deals both physical and magical area damage.'],
      ['Summoned Casters', 'Adds contribute additional area damage.'],
    ],
    tips: ['Chain Lightning: stop moving until it ends.', 'Starfall: keep moving until it ends.', 'Keep the boss engaged in melee to reduce casts and assign dedicated healers.'],
  },
  {
    name: 'Terathan Goliath', type: 'Main Boss', location: 'Mount Petram', slayer: 'Monstrous', role: 'Arena-wide melee', confidence: 'medium', image: img('terathan-goliath.gif'),
    summary: 'A relentless movement check built around arena-wide damage and lethal ants erupting beneath stationary targets.',
    abilities: [
      ['Arena-Wide Assault', 'Unleashes area damage across the encounter space with no reliable blind spot. Stay healthy enough to survive unavoidable pulses.'],
      ['Burrowing Ants', 'Calls ants up beneath player positions for a heavy burst. Move as soon as the ground attack begins.'],
      ['Exploding Ants', 'Targets current positions with explosive ants; continuous movement prevents the detonations from stacking under the group.'],
    ],
    tips: ['Keep moving whenever ants begin to surface.', 'Top off before arena-wide attacks.', 'Delay corpse recovery until the boss and ground effects have moved away.'],
  },
  {
    name: 'Stygian Gaoler', type: 'Main Boss', location: 'Wilderness', slayer: 'Construct', role: 'Objective-control melee', confidence: 'medium', image: img('stygian-gaoler.gif'),
    summary: 'A prison-themed control fight where Watchstones, suppression blasts, and reinforcements compete for the group’s attention.',
    abilities: [
      ['Prison Watchstones', 'Creates targetable Watchstones around the arena. Destroy them promptly so encounter objectives do not accumulate.'],
      ['Suppression Blast', 'Announces and releases a named area burst. Spread out and keep health high when the cast appears.'],
      ['Turned to Steel', 'Temporarily locks down affected targets with a steel transformation, leaving them vulnerable to follow-up pressure.'],
      ['Prison Reinforcements', 'Fills the arena with prison-themed adds that must be controlled while the boss remains active.'],
    ],
    tips: ['Assign players to Watchstones and adds instead of tunneling the boss.', 'Spread for Suppression Blast.', 'Protect allies who are Turned to Steel.'],
  },
  {
    name: 'The Undermind', type: 'Main Boss', location: 'Tidal Tomb', slayer: 'Monstrous', role: 'Armored melee / mage', confidence: 'low', image: img('theundermind.gif'),
    summary: 'A 200,000-health armored hybrid with 50–60 melee damage, 150 Magery, and 30–40 spell damage. Its regional systems are documented, but a boss-specific ability breakdown is not yet public.',
    abilities: [
      ['Oxygen Clock — verified regional', 'After 10 minutes without a refill, Minor Deprivation deals 5 unavoidable damage every 5 seconds while above 66% health. At 20 minutes, Major Deprivation deals 10 every 5 seconds while above 33%. Recovery Dolphins outside boss rooms fully refill Oxygen every 5 seconds.'],
      ['Pressure — verified system, boss use unconfirmed', 'When any Pressure stack expires, every active stack resolves together as raw damage that ignores armor, then all stacks are removed. Public documentation does not confirm that The Undermind itself applies Pressure.'],
      ['Interactive Objects — boss family verified, assignment unknown', 'Tidal Tomb boss abilities can create Drowned Monoliths, Abyssal Spheres, and Lightning Rods. Their progress bars can be double-clicked, and the objects can be damaged; no public source identifies which one belongs to The Undermind.'],
      ['Post-Death Effect — verified presentation', 'The Undermind has a dedicated post-death visual and sound sequence. Official notes do not describe an additional damaging after-death mechanic.'],
    ],
    tips: ['Wait beside the Recovery Dolphin for a full refill before entering.', 'If Pressure appears, heal before its shortest timer expires because all stacks resolve together.', 'Double-click or damage active boss objects immediately, but do not rely on an unverified object assignment.'],
  },
  {
    name: 'Abyssal Daemon', type: 'Omni Boss', location: 'Omni Realm', slayer: 'Daemonic', role: 'Melee / mage objective boss', confidence: 'medium', image: img('abyssal-daemon.gif'),
    summary: 'A bleed-and-disease fight built around an interactive sphere, incoming void orbs, and explosive souls.',
    abilities: [
      ['Green Sphere', 'Damages nearby players and throws flames while active. Double-click it to destroy it.', 'CLICK', 'The sphere damages anyone standing in its area and continues spawning random flames until a player double-clicks it. Treat it as the first-priority objective.', mechanic('abyssal-green-sphere.webp')],
      ['Flames', 'Spawn from the active sphere and deal minor damage. Step off the burning tile.', 'MOVE', 'Flames appear on random ground tiles for as long as the Green Sphere remains active. They deal minor damage; moving a single tile is enough to leave the fire.', mechanic('abyssal-flames.webp')],
      ['Abyssal Claws', 'Appear randomly around the arena and inflict a 30+ damage bleed.', 'MOVE', 'Claws can appear anywhere on the battlefield rather than only near the boss. Their hit applies a bleed for roughly 30 or more damage.', mechanic('abyssal-claws.webp')],
      ['Beckons the Void', 'Sends orbs inward from every side. Contact removes you into the Void for about 15 seconds.', 'MOVE', 'Void orbs enter from all sides of the arena. Touching one produces an effect similar to the Wilderness main boss and removes the player from the fight for approximately 15 seconds.', mechanic('abyssal-void.webp')],
      ['Abyssal Souls', 'Green ghosts explode into skulls for 50+ area damage and about 30 disease damage. Some variants deal area damage without disease.', 'MOVE', 'The green ghost variant bursts into skulls for roughly 50 or more area damage plus about 30 disease damage. The alternate soul explosion deals area damage without the disease component.', mechanic('abyssal-souls.webp')],
    ],
    tips: ['Destroy the Green Sphere immediately and leave every flame tile.', 'Watch every edge of the arena when void orbs begin moving inward.', 'Prepare bleed and disease mitigation such as Close Wounds, Immunize, Panacea, or defensive barriers.'],
  },
  {
    name: 'Astral Daemon', type: 'Omni Boss', location: 'Omni Realm', slayer: 'Daemonic', role: 'High-resist raid mage', confidence: 'medium', image: img('astral-daemon.gif'),
    summary: 'A high-damage debuff fight with player-copying mirrors, dangerous beams, and reflective Solar Rings.',
    abilities: [
      ['Astral Mirror', 'Spawns copies of random players until destroyed. Mirrors and copies expire after roughly 30–60 seconds.', 'CLICK', 'The mirror must be destroyed or it repeatedly creates random copies of players. Both the mirror and its copies eventually disappear after approximately 30–60 seconds if the group does not kill them first.', mechanic('astral-mirror.webp')],
      ['Astral Energy', 'Deals 50+ damage and applies Grievous Injury, reducing damage resistance.', null, 'The initial hit deals roughly 50 or more damage. Grievous Injury then lowers the affected player’s damage resistance, making overlapping mechanics substantially more dangerous.', mechanic('astral-focused-energy.webp')],
      ['Stardust Shower', 'Deals 50+ damage and applies Backlash, increasing spell-fizzle chance.', 'MOVE', 'Stardust Shower deals roughly 50 or more damage. Its Backlash debuff increases the victim’s chance to fizzle spell casts until the effect ends.', mechanic('astral-fireball.webp')],
      ['Pillars of Creation', 'Nearby beams deal 15+ damage per second.', 'MOVE', 'Each pillar projects a damaging beam. Remaining in its proximity deals roughly 15 or more damage every second, so leave the beam rather than trying to heal through it.', mechanic('astral-pillars.webp')],
      ['Cosmic Rays', 'Deal 50+ damage and apply Festering Wound, reducing healing received.', null, 'Cosmic Rays hit for roughly 50 or more damage and apply Festering Wound. The wound reduces all healing received by the affected player.', mechanic('astral-cosmic-rays.webp')],
      ['Solar Rings', 'Shield the boss, may reflect spells, and fire bursts for 25–50 damage.', 'HOLD', 'Solar Rings behave like a defensive shield. While they are active, the boss may reflect spells and the rings launch bursts dealing roughly 25–50 damage, so pause unsafe attacks.', mechanic('astral-solar-rings.webp')],
    ],
    tips: ['Destroy every Astral Mirror before player copies multiply.', 'Do not stand near Pillars of Creation.', 'Avoid stacking, stay at maximum practical range, and keep moving between mechanics.'],
  },
  {
    name: 'Storm Daemon', type: 'Omni Boss', location: 'Omni Realm', slayer: 'Daemonic', role: 'Mobile lightning controller', confidence: 'medium', image: img('storm-daemon.gif'),
    summary: 'A movement fight where Lightning Rods, Ion Spheres, Tempests, and a charge compete with an enrage timer.',
    abilities: [
      ['Lightning Rod', 'Priority target. Calls random 70–80 damage strikes until double-clicked or destroyed.', 'CLICK', 'Lightning Rods are the first priority. Their random strikes deal roughly 70–80 damage but can be avoided by moving. Players can cast spells while auto-attacking the rod.', mechanic('storm-lightning-rod.webp')],
      ['Ion Spheres', 'Charge ranged players, reflect some attacks, and deal roughly 50 stamina plus 15 area damage.', 'MOVE', 'Ion Spheres select ranged players and charge toward them. They reflect some incoming attacks and retaliate for roughly 50 stamina damage plus 15 area damage.', mechanic('storm-ion-spheres.webp')],
      ['Tempest', 'A hurricane deals roughly 10–15 area damage per second. It may slowly follow players, but this is unconfirmed.', 'MOVE', 'A Tempest spawns at a random location and deals approximately 10–15 area damage each second. The source suggests it slowly follows players but explicitly marks that behavior as unconfirmed.', mechanic('storm-tempest.webp')],
      ['Charge', 'Rushes through a targeted path similarly to the Emperor Dragon.', 'MOVE', 'The Storm Daemon appears to use a charge similar to the Emperor Dragon in Nusero. Leave the targeted path and avoid carrying it through stacked allies.'],
      ['Enrage Timer', 'The fight becomes more dangerous if the group takes too long.', 'BURN', 'The encounter includes an enrage timer. Balance immediate Lightning Rod control against sustained boss damage so the fight does not run too long.'],
    ],
    tips: ['Destroy every Lightning Rod before returning to the boss.', 'Spread ranged players so Ion Spheres do not converge on the group.', 'Keep moving through lightning and Tempest damage while maintaining enough damage to beat the enrage timer.'],
  },
  {
    name: 'The Terrorwood', type: 'Mini-Boss', location: 'Darkmire Temple', slayer: 'Nature', role: 'Stealth melee', confidence: 'medium', image: img('the-terrorwood.jpg'),
    summary: 'An arena-saturation fight where exploding mushrooms consume safe space.',
    abilities: [
      ['Explosive Mushrooms', 'Creates mushrooms that detonate for severe area damage.'],
      ['Arena Saturation', 'Repeated mushrooms progressively restrict safe movement.'],
    ],
    tips: ['Keep the boss centered to distribute hazards.', 'Move away before mushrooms detonate.'],
  },
  {
    name: 'Sanguineous', type: 'Mini-Boss', location: 'Aegis Keep', slayer: 'Humanoid', role: 'Armored melee', confidence: 'medium', image: img('sanguineous.jpg'),
    summary: 'A blood-and-bleed fight that demands movement and high health.',
    abilities: [
      ['Blood Burst', 'A large-radius initial hit.'],
      ['Bleeding Wound', 'Follows burst damage with dangerous damage over time.'],
      ['Blood Markers', 'Creates hazardous red ground effects around players.'],
    ],
    tips: ['Remain near full health and keep moving.', 'Retreat off-screen when suffering a heavy bleed.'],
  },
  {
    name: 'Pit Dragon', type: 'Mini-Boss', location: 'Nusero', slayer: 'Beastial', role: 'Melee', confidence: 'medium', image: img('pit-dragon.jpg'),
    summary: 'A mobile add-management fight with damage-triggered reinforcements.',
    abilities: [
      ['Dodgeable Area Attacks', 'Most attacks can be avoided through continuous movement or by leaving their radius.'],
      ['Ranged Summons', 'Calls hard-hitting ranged creatures.'],
      ['Damage-triggered Adds', 'Additional pressure is tied to damaging the boss.'],
    ],
    tips: ['Pause boss damage while clearing adds.', 'Use disposable summons as tanks.'],
  },
  {
    name: 'Speaker For The Dead', type: 'Mini-Boss', location: 'Ossuary', slayer: 'Humanoid', role: 'Mage', confidence: 'medium', image: img('speaker-for-the-dead.jpg'),
    summary: 'An add-driven caster fight where unchecked Phantoms rapidly snowball.',
    abilities: [
      ['Phantom Summons', 'Summons ranged spectral creatures.'],
      ['Area Spell Burst', 'Boss casting and accumulated summons can wipe a group rapidly.'],
    ],
    tips: ['Use selective boss damage.', 'Dedicate most players to eliminating Phantoms.'],
  },
  {
    name: 'Lodestone', type: 'Mini-Boss', location: 'Mount Petram', slayer: 'Elemental', role: 'Armored stealth melee', confidence: 'medium', image: img('lodestone.jpg'),
    summary: 'An interactive-object encounter built around a dangerous reflection window.',
    abilities: [
      ['Stone Blocks', 'Summons interactive stone objects.'],
      ['Damage Reflection', 'Harmful attacks can reflect while the relevant block remains active.'],
      ['Shining Stone', 'One block shines and can be double-clicked to end reflection.'],
    ],
    tips: ['Stop attacking when reflection appears.', 'Find and double-click the shining stone.'],
  },
  {
    name: 'Kraul Hivemother', type: 'Mini-Boss', location: 'Kraul Hive', slayer: 'Nature', role: 'Melee', confidence: 'medium', image: img('kraul-hivemother.png'),
    summary: 'A variable encounter that selects one of four forms and matching add packages.',
    abilities: [
      ['Four Forms', 'Selects one of four random encounter forms.'],
      ['Bombs', 'Places or launches dodgeable area explosives.'],
      ['Targeted Lightning', 'Punishes players who remain stacked.'],
      ['Spelltouched Adds', 'Dangerous caster adds capable of powerful spells.'],
    ],
    tips: ['Spread, dodge bombs, and identify the active form.', 'Prioritize Spelltouched adds.'],
  },
  {
    name: 'Ancient Drowned Dragon', type: 'Mini-Boss', location: 'Pulma', slayer: 'Undead', role: 'Melee', confidence: 'medium', image: img('ancient-drowned-dragon.jpg'),
    summary: 'A wave-timing fight where overlapping stages create lethal double hits.',
    abilities: [
      ['Tidal Wave', 'Sends a wave across the arena.'],
      ['Multistage Damage', 'The wave inflicts damage in several stages.'],
      ['Double Hit', 'Intersecting or successive wave stages can hit a player twice.'],
    ],
    tips: ['Move completely through or away from the wave path.', 'Durable groups may focus the boss and ignore weaker adds.'],
  },
  {
    name: 'Heart Of The Mountain', type: 'Mini-Boss', location: 'Inferno', slayer: 'Elemental', role: 'Mobile fire mage', confidence: 'medium', image: img('heart-of-the-mountain.jpg'),
    summary: 'A relentless fire-control fight built around frontal lanes, persistent burning ground, charges, and summoned elementals.',
    abilities: [
      ['Draws From the Core', 'Projects a damaging eruption along the boss’s forward path. Move sideways instead of retreating through the lane.'],
      ['Shapes Fire', 'Calls down large fire orbs that explode in an area and are followed by smaller flame-strike impacts.'],
      ['Releases Stored Energy', 'Erupts fire across the ground, creating flame strikes and lingering fire pits that rapidly punish anyone standing inside.'],
      ['Accelerates', 'Charges forward through a targeted lane, dealing heavy damage in front of the boss and leaving a burning trail behind.'],
      ['Spreads', 'Summons Fire Elementals and Living Flames while creating additional fire walls, sharply reducing safe floor space.'],
    ],
    tips: ['Fight from the side and leave frontal lanes immediately.', 'Keep rotating around persistent fire instead of crossing it.', 'Kill summoned elementals, then return to the boss.'],
  },
  {
    name: 'Cistern Gorgon', type: 'Mini-Boss', location: 'Mausoleum', slayer: 'Elemental', role: 'Mobile control archer', confidence: 'medium', image: img('cistern-gorgon.jpg'),
    summary: 'A control-heavy ranged fight featuring specialized arrows, petrification, persistent hazards, and frequent repositioning.',
    abilities: [
      ['Entangling Arrow', 'Fires a blue control arrow that immobilizes its target. Be ready to survive hazards while rooted.'],
      ['Adaptive Arrow Flurry', 'Repeats the most recently prepared special arrow as a multi-shot volley, spreading its root, poison, or resource-drain effect.'],
      ['Focused Gaze', 'Petrifies a target while Stone Asp reinforcements enter the fight and stamina is pressured.'],
      ['Toxic Arrow', 'Applies poison and can seed poisonous ground when repeated by the arrow flurry. Cure quickly and leave contaminated tiles.'],
      ['Stirs the Water', 'Raises water geysers beneath the group. Move out of the marked impacts immediately.'],
      ['Ice Storm', 'Calls down a persistent ice storm that damages players who remain inside.'],
      ['Exhaustion Arrow', 'Drains stamina and mana, sharply limiting escape and recovery options.'],
      ['Moves Like Quicksilver', 'Teleports to a new position, forcing the group to reacquire the boss and reset its formation.'],
    ],
    tips: ['Carry cures and reserve stamina for control effects.', 'Leave geysers, poison, and ice immediately.', 'Watch which special arrow is prepared before the next flurry.'],
  },
  {
    name: 'Great Abyssal Hornbeast', type: 'Mini-Boss', location: 'Cavernam', slayer: 'Beastial', role: 'Melee', confidence: 'low', image: img('great-abyssal-hornbeast.jpg'),
    summary: 'A physical beast encounter with moderate armor and no normal spellcasting.',
    abilities: [], tips: ['Use a conventional melee-boss formation.', 'No inherent poison is listed in the current public profile.'],
  },
  {
    name: 'Gargoyle Archon', type: 'Mini-Boss', location: 'Shadowspire Cathedral', slayer: 'Daemonic', role: 'Add-control hybrid', confidence: 'medium', image: img('gargoyle-archon.jpg'),
    summary: 'A mobile hybrid fight whose real danger comes from damage-triggered ranged reinforcements and summoned statues.',
    abilities: [
      ['Mobile Telegraphs', 'Uses avoidable area attacks that can be escaped by moving decisively away from the impact zone.'],
      ['Ranged Reinforcements', 'Summons hard-hitting ranged creatures that quickly overwhelm an unattended back line.'],
      ['Archon Statue', 'Creates a statue objective during the encounter. Clear it when stable, but prioritize dangerous live adds first.'],
      ['Damage-Triggered Waves', 'Additional summons are tied to continued damage on the boss, allowing the group to pause damage and regain control.'],
    ],
    tips: ['Stop boss damage when reinforcements begin to stack.', 'Kill ranged adds before statues.', 'Keep moving through area telegraphs.'],
  },
  {
    name: 'The Insatiable Maw', type: 'Mini-Boss', location: 'Ships', slayer: 'Monstrous', role: 'Ocean add controller', confidence: 'medium', image: img('the-insatiable-maw.png'),
    summary: 'An ocean mini-boss that slows the ship with Barnacles while repeated Sea Calls crowd the deck with additional threats.',
    abilities: [
      ['Barnacles', 'Applies a 25% ship-speed reduction for 30 seconds, limiting the crew’s ability to reposition.'],
      ['Sea Call', 'Calls another wave of ocean creatures, including Insatiable Masses, onto the encounter. Waves become dangerous when allowed to overlap.'],
    ],
    tips: ['Track the ship-speed penalty before committing to a maneuver.', 'Pull damage off the Maw and clear adds whenever waves begin to stack.', 'Use the crew to contain a single wave while players prevent a second from accumulating.'],
  },
  {
    name: 'Oblivion Deathmage', type: 'Mini-Boss', location: 'Wilderness', slayer: 'Humanoid', role: 'High-resist summoner', confidence: 'medium', image: img('oblivion-deathmage.png'),
    summary: 'A damage-paced summoner fight where Phantoms can unleash a group-wiping arena attack if they survive too long.',
    abilities: [
      ['Damage-Triggered Reinforcements', 'Summon waves are tied to damage dealt to the Deathmage, so the group can pause boss damage while stabilizing.'],
      ['Phantoms', 'Summons priority Phantoms that must be killed immediately.'],
      ['Phantom Arena Blast', 'A surviving Phantom can release a screen-wide area attack within roughly ten seconds, threatening the entire party.'],
    ],
    tips: ['Assign only a few damage dealers to the boss while the rest control adds.', 'Switch every available attacker to Phantoms immediately.', 'Pause boss damage before reinforcement waves overlap.'],
  },
  {
    name: 'Marinerbane', type: 'Mini-Boss', location: 'Tidal Tomb', slayer: 'Undead', role: 'Explosive add controller', confidence: 'medium', image: img('marinerbane.png'),
    summary: 'An underwater battlefield-control fight featuring explosive barrels, Drowned Gunners, airborne sharks, and forceful displacement.',
    abilities: [
      ['Oxygen — regional', 'Underwater players progressively lose Oxygen unless they visit a Recovery Dolphin.'],
      ['Explosive Barrels', 'Throws or places barrels around player positions. Watch the deck and leave their blast zones.'],
      ['Drowned Gunners', 'Summons cannon-equipped ranged adds that pressure the group from a distance.'],
      ['Exploding Sharks', 'Launches multiple sharks into the battlefield; they detonate around their landing areas and flood the floor with danger.'],
      ['Launch', 'Can violently knock a target away from the fight, disrupting positioning and exposing isolated players.'],
    ],
    tips: ['Refill Oxygen before the pull.', 'Kill Drowned Gunners as they appear.', 'Keep moving when barrels or airborne sharks enter the arena.'],
  },
]

export const sources = [
  { label: 'Official main-boss roster', url: 'https://wiki.uooutlands.com/Bosses' },
  { label: 'Official mini-boss roster', url: 'https://wiki.uooutlands.com/Mini_Bosses' },
  { label: 'Official Omni Boss system', url: 'https://wiki.uooutlands.com/Omni_Bosses' },
  { label: 'Current boss scaling', url: 'https://wiki.uooutlands.com/Boss-Type_Creature' },
]
