import { db, Job, Candidate, Assessment } from './database';

const jobTitles = [
  'Elite Castle Guard',
  'Royal Knight Commander',
  'Master Siege Engineer',
  'Cavalry Squadron Leader',
  'Archery Division Captain',
  'Infantry Battalion Chief',
  'Royal Scout Pathfinder',
  'Fortress Defense Specialist',
  'War Strategy Advisor',
  'Kingdom Battle Tactician',
  'Dragon Slayer Champion',
  'Elite Crossbow Regiment',
  'Castle Construction Overseer',
  'Royal Weapons Master',
  'Kingdom Logistics Commander',
  'Military Training Instructor',
  'Kingdom Reconnaissance Officer',
  'Royal Guard Protector',
  'Heavy Armor Division Leader',
  'Kingdom Naval Commander',
  'Siege Weapon Operator',
  'Elite Mounted Warrior',
  'Castle Blacksmith Master',
  'Kingdom Quartermaster',
  'Royal Messenger Corps'
];

const tags = [
  'Swordsmanship', 'Archery', 'Horsemanship', 'Strategy', 'Leadership', 'Combat', 'Defense', 'Siege',
  'Reconnaissance', 'Tactics', 'Training', 'Logistics', 'Fortification', 'Naval', 'Cavalry', 'Infantry',
  'Elite', 'Veteran', 'Rookie', 'Full-time', 'Seasonal', 'Campaign', 'Senior Rank', 'Officer', 'Enlisted',
  'Frontline', 'Support', 'Command', 'Mobile', 'Garrison', 'Expeditionary', 'Special Forces'
];

const firstNames = [
  'Arthur', 'Guinevere', 'Lancelot', 'Eleanor', 'Roland', 'Isolde', 'Percival', 'Morgana',
  'Gawain', 'Rowena', 'Tristan', 'Beatrice', 'Gareth', 'Viviane', 'Cedric', 'Elaine',
  'Edmund', 'Rosalind', 'Geoffrey', 'Cordelia', 'Baldwin', 'Guinivere', 'Alaric', 'Matilda',
  'Godwin', 'Adelaide', 'Ragnar', 'Freya', 'Thorin', 'Astrid', 'Sigurd', 'Brunhilde',
  'Leofric', 'Edith', 'Aldric', 'Giselle', 'Roderick', 'Meredith', 'Godfrey', 'Elowen',
  'Aldous', 'Rowena', 'Beowulf', 'Sigrid', 'Cedric', 'Hildegard', 'Drogo', 'Ingrid',
  'Egbert', 'Aelfgifu', 'Fenric', 'Brynhild', 'Godric', 'Clothilde', 'Harald', 'Dagmar',
  'Ivar', 'Eira', 'Jorund', 'Freja', 'Kendrick', 'Gwendolyn', 'Leopold', 'Heloise',
  'Magnus', 'Isolde', 'Niall', 'Jocelyn', 'Odo', 'Karlotta', 'Peredur', 'Linnea',
  'Quintus', 'Morwenna', 'Ragnor', 'Nerida', 'Seamus', 'Olwen', 'Tancred', 'Petra',
  'Ulric', 'Quintessa', 'Valdemar', 'Rosamund', 'Wolfric', 'Sybil', 'Xander', 'Tamsin',
  'Yvor', 'Una', 'Zephyr', 'Venetia', 'Aldwin', 'Winifred', 'Bran', 'Ximena',
  'Caradoc', 'Ysabel', 'Duncan', 'Zelda', 'Edric', 'Anwen', 'Finnian', 'Branwen',
  'Garrick', 'Catrin', 'Hadrian', 'Drusilla', 'Iolo', 'Enid', 'Jasper', 'Ffion'
];

const lastNames = [
  'Ironforge', 'Stormrider', 'Blackthorn', 'Silverhelm', 'Dragonbane', 'Shadowblade', 'Lionheart', 'Thundershield',
  'Ravencrest', 'Goldspear', 'Nightingale', 'Oakenshield', 'Frostborne', 'Flameheart', 'Steelwind', 'Stonefist',
  'Wolfsbane', 'Eaglewing', 'Warhammer', 'Brightblade', 'Darkwater', 'Swiftarrow', 'Bloodraven', 'Firebrand',
  'Moonshadow', 'Starforge', 'Cloudbreaker', 'Earthshaker', 'Windwhisper', 'Skystrike', 'Sunblade', 'Wintermane',
  'Ashwood', 'Emberfall', 'Grimwald', 'Hawkeye', 'Ironside', 'Knightfall', 'Lightbringer', 'Mountainheart',
  'Northstar', 'Proudfoot', 'Quickstrike', 'Redcrest', 'Shadowmere', 'Thornfield', 'Valorheart', 'Whitestone',
  'Battleborn', 'Crowley', 'Dawnbringer', 'Evergreen', 'Fairweather', 'Goldcrest', 'Highcastle', 'Ironwood',
  'Kingsley', 'Longbow', 'Morningstar', 'Nightshade', 'Proudheart', 'Ravenwood', 'Silvermoon', 'Thornheart',
  'Valorwatch', 'Wildewood', 'Blackstone', 'Coldsteel', 'Drakemore', 'Fairwind', 'Greymantle', 'Highsword',
  'Ironguard', 'Keensword', 'Lightfoot', 'Moonblade', 'Northguard', 'Proudsword', 'Redmane', 'Stormwatch',
  'Trueblade', 'Vanguard', 'Wardwell', 'Axeborn', 'Battleforge', 'Crowstrike', 'Drakeheart', 'Evenstar',
  'Fireforge', 'Goldcrown', 'Hammerfist', 'Ironvale', 'Knightbane', 'Lionsguard', 'Moonforge', 'Nightblade',
  'Oakheart', 'Stormborn', 'Thornshield', 'Valormane', 'Warbringer', 'Brightforge', 'Coldforge', 'Dawnstrike',
  'Emberforge', 'Firewatch', 'Goldwatch', 'Hammerfall', 'Ironwatch', 'Lightguard', 'Starwatch', 'Stormguard'
];

const stages: Candidate['stage'][] = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];

export async function seedDatabase() {
  // Clear existing data
  await db.jobs.clear();
  await db.candidates.clear();
  await db.candidateTimeline.clear();
  await db.assessments.clear();
  await db.assessmentResponses.clear();

  // Seed jobs
  const jobs: Job[] = [];
  for (let i = 0; i < 25; i++) {
    const title = jobTitles[i];
    const job: Job = {
      id: crypto.randomUUID(),
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      status: Math.random() > 0.3 ? 'active' : 'archived',
      tags: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => 
        tags[Math.floor(Math.random() * tags.length)]
      ),
      order: i,
      description: `The Kingdom seeks a skilled ${title} to serve in our glorious army. This noble quest requires valor, dedication, and unwavering loyalty to the crown.`,
      requirements: [
        'Proven combat experience or military training',
        '3+ years of service in a similar role',
        'Strong leadership and tactical skills',
        'Unwavering loyalty to the Kingdom'
      ],
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    };
    jobs.push(job);
  }
  await db.jobs.bulkAdd(jobs);

  // Seed candidates
  const candidates: Candidate[] = [];
  for (let i = 0; i < 1000; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const job = jobs[Math.floor(Math.random() * jobs.length)];
    const stage = stages[Math.floor(Math.random() * stages.length)];
    
    const candidate: Candidate = {
      id: crypto.randomUUID(),
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      stage,
      jobId: job.id,
      appliedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      notes: Math.random() > 0.7 ? 'Exemplary warrior with distinguished service record' : undefined
    };
    candidates.push(candidate);
  }
  await db.candidates.bulkAdd(candidates);

  // Seed candidate timeline
  for (const candidate of candidates) {
    const timelineEntries = [];
    const stages = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];
    const currentStageIndex = stages.indexOf(candidate.stage);
    
    for (let i = 0; i <= currentStageIndex; i++) {
      timelineEntries.push({
        id: crypto.randomUUID(),
        candidateId: candidate.id,
        stage: stages[i],
        timestamp: new Date(candidate.appliedAt.getTime() + i * 24 * 60 * 60 * 1000)
      });
    }
    
    if (timelineEntries.length > 0) {
      await db.candidateTimeline.bulkAdd(timelineEntries);
    }
  }

  // Seed assessments for first 3 jobs
  for (let i = 0; i < 3; i++) {
    const job = jobs[i];
    const assessment: Assessment = {
      id: crypto.randomUUID(),
      jobId: job.id,
      title: `${job.title} Training Trial`,
      sections: [
        {
          id: crypto.randomUUID(),
          title: 'Combat Proficiency',
          questions: [
            {
              id: crypto.randomUUID(),
              type: 'single-choice',
              question: 'How many years have you served in military campaigns?',
              required: true,
              options: ['0-1 years (Recruit)', '2-3 years (Soldier)', '4-5 years (Veteran)', '6+ years (Elite)']
            },
            {
              id: crypto.randomUUID(),
              type: 'multi-choice',
              question: 'Which weapons and combat styles have you mastered?',
              required: true,
              options: ['Longsword', 'Bow & Arrow', 'Crossbow', 'Pike', 'Mounted Combat', 'Hand-to-Hand', 'Siege Weapons', 'Naval Warfare']
            },
            {
              id: crypto.randomUUID(),
              type: 'short-text',
              question: 'Describe your most valorous battle achievement',
              required: true,
              maxLength: 500
            },
            {
              id: crypto.randomUUID(),
              type: 'long-text',
              question: 'Explain your tactical approach when facing a numerically superior enemy force',
              required: true,
              maxLength: 1000
            },
            {
              id: crypto.randomUUID(),
              type: 'numeric',
              question: 'Rate your strategic warfare abilities (1-10)',
              required: true,
              min: 1,
              max: 10
            }
          ]
        },
        {
          id: crypto.randomUUID(),
          title: 'Honor & Valor Assessment',
          questions: [
            {
              id: crypto.randomUUID(),
              type: 'single-choice',
              question: 'How do you maintain morale during prolonged sieges?',
              required: true,
              options: ['Lead by example and inspire troops', 'Organize drills and competitions', 'Share tales of past victories', 'Ensure proper provisions and rest']
            },
            {
              id: crypto.randomUUID(),
              type: 'long-text',
              question: 'Recount a time when you had to make a difficult decision that tested your honor',
              required: true,
              maxLength: 800
            }
          ]
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.assessments.add(assessment);
  }

  console.log('Database seeded successfully!');
}
