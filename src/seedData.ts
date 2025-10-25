import { db, Job, Candidate, Assessment } from './database';

const jobTitles = [
  'Senior Frontend Developer',
  'Full Stack Engineer',
  'React Developer',
  'Vue.js Developer',
  'Angular Developer',
  'Node.js Developer',
  'Python Developer',
  'Java Developer',
  'DevOps Engineer',
  'Cloud Architect',
  'Data Scientist',
  'Machine Learning Engineer',
  'Product Manager',
  'UX Designer',
  'UI Designer',
  'Marketing Manager',
  'Sales Representative',
  'Customer Success Manager',
  'HR Specialist',
  'Business Analyst',
  'QA Engineer',
  'Mobile Developer',
  'iOS Developer',
  'Android Developer',
  'Backend Developer'
];

const tags = [
  'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Java', 'AWS', 'Docker',
  'Kubernetes', 'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL', 'REST', 'Agile', 'Scrum',
  'Remote', 'Full-time', 'Part-time', 'Contract', 'Senior', 'Mid-level', 'Junior',
  'Frontend', 'Backend', 'Full-stack', 'Mobile', 'Web', 'Cloud', 'DevOps'
];

const firstNames = [
  'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'James', 'Jessica',
  'Robert', 'Ashley', 'William', 'Amanda', 'Richard', 'Jennifer', 'Charles',
  'Lisa', 'Joseph', 'Nancy', 'Thomas', 'Karen', 'Christopher', 'Betty',
  'Daniel', 'Helen', 'Matthew', 'Sandra', 'Anthony', 'Donna', 'Mark', 'Carol',
  'Donald', 'Ruth', 'Steven', 'Sharon', 'Paul', 'Michelle', 'Andrew', 'Laura',
  'Joshua', 'Sarah', 'Kenneth', 'Kimberly', 'Kevin', 'Deborah', 'Brian', 'Dorothy',
  'George', 'Lisa', 'Timothy', 'Nancy', 'Ronald', 'Karen', 'Jason', 'Betty',
  'Edward', 'Helen', 'Jeffrey', 'Sandra', 'Ryan', 'Donna', 'Jacob', 'Carol',
  'Gary', 'Sharon', 'Nicholas', 'Michelle', 'Eric', 'Laura', 'Jonathan', 'Sarah',
  'Stephen', 'Kimberly', 'Larry', 'Deborah', 'Justin', 'Dorothy', 'Scott', 'Lisa',
  'Brandon', 'Nancy', 'Benjamin', 'Karen', 'Samuel', 'Betty', 'Gregory', 'Helen',
  'Alexander', 'Sandra', 'Patrick', 'Donna', 'Jack', 'Carol', 'Dennis', 'Sharon',
  'Jerry', 'Michelle', 'Tyler', 'Laura', 'Aaron', 'Sarah', 'Jose', 'Kimberly',
  'Henry', 'Deborah', 'Adam', 'Dorothy', 'Douglas', 'Lisa', 'Nathan', 'Nancy',
  'Peter', 'Karen', 'Zachary', 'Betty', 'Kyle', 'Helen', 'Noah', 'Sandra',
  'Alan', 'Donna', 'Ethan', 'Carol', 'Jeremy', 'Sharon', 'Keith', 'Michelle',
  'Christian', 'Laura', 'Roger', 'Sarah', 'Terry', 'Kimberly', 'Sean', 'Deborah',
  'Gerald', 'Dorothy', 'Carl', 'Lisa', 'Harold', 'Nancy', 'Arthur', 'Karen',
  'Ryan', 'Betty', 'Lawrence', 'Helen', 'Joe', 'Sandra', 'Wayne', 'Donna',
  'Roy', 'Carol', 'Ralph', 'Sharon', 'Eugene', 'Michelle', 'Louis', 'Laura',
  'Philip', 'Sarah', 'Bobby', 'Kimberly', 'Johnny', 'Deborah', 'Willie', 'Dorothy'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill',
  'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell',
  'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner',
  'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris',
  'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper',
  'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox',
  'Ward', 'Richardson', 'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett',
  'Gray', 'Mendoza', 'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders',
  'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez', 'Powell', 'Jenkins',
  'Perry', 'Russell', 'Sullivan', 'Bell', 'Coleman', 'Butler', 'Henderson', 'Barnes',
  'Gonzales', 'Fisher', 'Vasquez', 'Simmons', 'Romero', 'Jordan', 'Patterson', 'Alexander',
  'Hamilton', 'Graham', 'Reynolds', 'Griffin', 'Wallace', 'Moreno', 'West', 'Cole',
  'Hayes', 'Bryant', 'Herrera', 'Gibson', 'Ellis', 'Tran', 'Medina', 'Aguilar',
  'Stevens', 'Murray', 'Ford', 'Castro', 'Marshall', 'Owens', 'Harrison', 'Fernandez'
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
      description: `We are looking for a ${title} to join our team. This role involves working on exciting projects and collaborating with a talented team.`,
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '3+ years of relevant experience',
        'Strong problem-solving skills',
        'Excellent communication skills'
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
      notes: Math.random() > 0.7 ? 'Strong candidate with relevant experience' : undefined
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
      title: `${job.title} Assessment`,
      sections: [
        {
          id: crypto.randomUUID(),
          title: 'Technical Skills',
          questions: [
            {
              id: crypto.randomUUID(),
              type: 'single-choice',
              question: 'How many years of experience do you have with the required technologies?',
              required: true,
              options: ['0-1 years', '2-3 years', '4-5 years', '6+ years']
            },
            {
              id: crypto.randomUUID(),
              type: 'multi-choice',
              question: 'Which of the following technologies are you familiar with?',
              required: true,
              options: ['React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java', 'AWS', 'Docker']
            },
            {
              id: crypto.randomUUID(),
              type: 'short-text',
              question: 'Describe your most challenging project',
              required: true,
              maxLength: 500
            },
            {
              id: crypto.randomUUID(),
              type: 'long-text',
              question: 'Explain your approach to solving complex problems',
              required: true,
              maxLength: 1000
            },
            {
              id: crypto.randomUUID(),
              type: 'numeric',
              question: 'Rate your problem-solving skills (1-10)',
              required: true,
              min: 1,
              max: 10
            }
          ]
        },
        {
          id: crypto.randomUUID(),
          title: 'Behavioral Questions',
          questions: [
            {
              id: crypto.randomUUID(),
              type: 'single-choice',
              question: 'How do you handle tight deadlines?',
              required: true,
              options: ['I prioritize tasks and communicate early', 'I work extra hours', 'I ask for help', 'I negotiate the deadline']
            },
            {
              id: crypto.randomUUID(),
              type: 'long-text',
              question: 'Tell us about a time you had to work with a difficult team member',
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
