import { collection, doc, writeBatch, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { Opportunity, Course, Lesson } from '../types';

export const SEED_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp_issai_summer_research',
    title: 'ISSAI Summer Research Program',
    description: 'A premier research initiative where talented high school developers and junior researchers collaborate with leading PhD mentors on cutting-edge computer vision, neural-language rendering (NLP), and assistive robotics fields.',
    category: 'Research',
    deadline: '2026-07-15',
    prerequisites: ['Basic Python proficiency', 'Introductory statistics coursework', 'Science teacher recommendation letter'],
    imageUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
    isOnline: false,
    location: 'Astana, Kazakhstan (Hybrid)',
    organization: 'Institute of Smart Systems & AI',
    eligibility: 'Grades 10–11, minimum 3.7 GPA, strong interest in deep learning.',
    applicationUrl: 'https://issai.nu.edu.kz/summer-camp'
  },
  {
    id: 'opp_wharton_biz_challenge',
    title: 'Wharton Youth Business Challenge',
    description: 'An immersive global corporate strategy and leadership competition where students analyze real-world tech and sustainability cases, build financial valuation files, and pitch before venture capitalists.',
    category: 'Business',
    deadline: '2026-08-01',
    prerequisites: ['Basic economics knowledge', 'Pitch deck slide familiarity', 'Teams of 3-4 peers'],
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    isOnline: true,
    location: 'Online',
    organization: 'Wharton School of Penn',
    eligibility: 'Grades 9–11, fluent in English, strong analytical skills.',
    applicationUrl: 'https://globalyouth.wharton.upenn.edu/'
  },
  {
    id: 'opp_global_tech_olympiad',
    title: 'Global Tech Olympiad 2026',
    description: 'A rapid-fire coding challenge covering discrete mathematics, graph traversal, dynamic programming, and automated game strategy under tight memory and computational constraints.',
    category: 'Programming',
    deadline: '2026-06-30',
    prerequisites: ['C++, Python, or Java mastery', 'Understanding of basic sorting and search algorithms'],
    imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
    isOnline: true,
    location: 'Online',
    organization: 'Tech Olympiad Committee',
    eligibility: 'Grades 8–11, individual participants of any country.',
    applicationUrl: 'https://techolympiad.org'
  },
  {
    id: 'opp_harvard_bluecrew',
    title: 'Harvard BlueCrew Community Initiative',
    description: 'A hands-on public advocacy and education program where students organize peer academic help clinics, lead environmental restoration sprints, and help local families design financial budgets.',
    category: 'Social Impact',
    deadline: '2026-09-10',
    prerequisites: ['Public speaking interest', 'Active in local student governance or community volunteering'],
    imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80',
    isOnline: false,
    location: 'Boston, MA (In-person)',
    organization: 'Harvard Alumni Impact Association',
    eligibility: 'Grades 8–11, minimum 15 documented volunteer hours.',
    applicationUrl: 'https://harvard-bluecrew.volunteer.org'
  },
  {
    id: 'opp_astana_hub_incubation',
    title: 'Astana Hub Youth Incubation Program',
    description: 'Turn your software prototype into a venture-backed startup! Spend 6 weeks with elite software architects drafting pitch decks, prototyping Web APIs, and exploring customer acquisition pathways.',
    category: 'Business',
    deadline: '2026-07-05',
    prerequisites: ['Basic operational code prototype', 'One-page summary of the startup idea'],
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    isOnline: false,
    location: 'Astana Hub, Kazakhstan',
    organization: 'Astana Hub Startups',
    eligibility: 'Grades 10–11, teams of 2 to 4 people.',
    applicationUrl: 'https://astanahub.com'
  },
  {
    id: 'opp_mit_think_scholars',
    title: 'MIT THINK Scholars Program',
    description: 'An elite national initiative promoting research and engineering designs. Selected students receive direct expert mentoring from MIT researchers, a $1,000 research stipend, and a sponsored visit to the MIT campus.',
    category: 'STEM',
    deadline: '2026-11-20',
    prerequisites: ['A fully written 3-page science proposal or engineering concept blueprint'],
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    isOnline: true,
    location: 'Remote & Cambridge, MA',
    organization: 'Massachusetts Institute of Technology',
    eligibility: 'Grades 9–11, global students with eligible technical proposals.',
    applicationUrl: 'https://think.mit.edu'
  },
  {
    id: 'opp_financial_leaders_summit',
    title: 'Youth Financial Leadership Summit',
    description: 'Discover the mechanics of global markets, algorithmic trade structures, quantitative finance, and micro-loan charity structures. Features real-life simulation trade rooms.',
    category: 'Finance',
    deadline: '2026-08-15',
    prerequisites: ['Mastery of high school algebra', 'Basic spreadsheet competence (Excel/Sheets)'],
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
    isOnline: false,
    location: 'New York City, NY',
    organization: 'Youth Finance Foundation',
    eligibility: 'Grades 9–11, eager desire to learn capital theory.',
    applicationUrl: 'https://youthfinancefoundation.org'
  },
  {
    id: 'opp_greenplanet_policy',
    title: 'GreenPlanet Climate Policy Fellowship',
    description: 'Conduct extensive qualitative and legal analysis on sustainable energy shifts. Work under policy scholars to research grid resilience and craft actionable recommendations for local councils.',
    category: 'Social Impact',
    deadline: '2026-10-01',
    prerequisites: ['Statement essay explaining your climate goals', 'One historical high-school writing sample'],
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    isOnline: true,
    location: 'Remote',
    organization: 'GreenPlanet Policy Institute',
    eligibility: 'Grades 10–11, excellent research and prose writing skills.',
    applicationUrl: 'https://greenplanetpolicy.org'
  },
  {
    id: 'opp_girls_who_code',
    title: 'Girls Who Code Summer Immersion Program',
    description: 'A world-renowned workshop teaching web design, game development, custom UI layout coding, and simple cloud deployment. Network with tech mentors.',
    category: 'STEM',
    deadline: '2026-07-10',
    prerequisites: ['Eagerness to make things', 'No prior coding background necessary'],
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    isOnline: true,
    location: 'Remote',
    organization: 'Girls Who Code Corp.',
    eligibility: 'Grades 8–11, identifies as female or non-binary.',
    applicationUrl: 'https://girlswhocode.com'
  },
  {
    id: 'opp_stanford_economics_acad',
    title: 'Stanford Pre-Collegiate Economics Academy',
    description: 'Dive deep into game theory, microeconomic auction design, behavioral market metrics, and global currencies under leading Stanford faculty instruction.',
    category: 'Finance',
    deadline: '2026-07-25',
    prerequisites: ['Completion of AP Calculus or strong trigonometry coursework', 'Math instructor recommendation'],
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    isOnline: false,
    location: 'Stanford, CA (In-person)',
    organization: 'Stanford University',
    eligibility: 'Grade 11, supreme academic standing in science/math.',
    applicationUrl: 'https://precollegiate.stanford.edu'
  }
];

export const SEED_COURSES: Course[] = [
  {
    id: 'course_sat_prep',
    title: 'SAT Preparation: Digital Modules & Math Mechanics',
    description: 'Master the Digital SAT. We break down verbal craft & structure, vocabulary in context, reading evaluation, and core math mechanics including advanced algebra and circle theorems.',
    instructor: 'Clara Vance (Perfect SAT 1600 Scorer)',
    duration: '8 Hours',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    category: 'STEM',
    lessonsCount: 5
  },
  {
    id: 'course_ielts_foundations',
    title: 'IELTS Foundations: Elite Writing & Oral Speaking',
    description: 'Practical, step-by-step frameworks to achieve a band 7.5+ in the International English Language Testing System. Learn paragraph cohesion, graph descriptions, and oral confidence.',
    instructor: 'Dr. Nigel Harris (Chief IELTS Examiner Emeritus)',
    duration: '10 Hours',
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80',
    category: 'Social Impact',
    lessonsCount: 5
  },
  {
    id: 'course_intro_economics',
    title: 'Introduction to Economics: Micro & Macro Fundamentals',
    description: 'Learn how global markets work. Core explore sequences on supply-demand shifts, consumer utility, inflation index calculation, central banking reserve rates, and fiscal debt levers.',
    instructor: 'Prof. Robert Stone (Academic Board)',
    duration: '12 Hours',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    category: 'Business',
    lessonsCount: 5
  }
];

export const SEED_LESSONS: Lesson[] = [
  // Course 1: SAT Preparation (course_sat_prep)
  {
    id: 'lesson_sat_1',
    courseId: 'course_sat_prep',
    order: 1,
    title: '1. Introduction to the Digital SAT Layout & Adaptive Rules',
    videoPlaceholder: 'https://www.w3schools.com/html/mov_bbb.mp4',
    content: `## The Modern Digital SAT: Setting Up for a High Score

Unlike the old paper-based SAT, the contemporary test is **fully digital and multi-stage adaptive**. This means your performance in the first module determines the grading difficulty of the second.

### Core Key Mechanics to Master:
1. **Adaptive Module Splits**: Each section (Reading & Writing, Math) features two modules. Scoring well on Module 1 unlocks the "Hard Module," which is required to score above a 600.
2. **The Desmos Calculator**: Built right into the testing software. Know how to plot coordinates and equations rapidly.
3. **Pacing Constraints**:
   - *Reading & Writing*: 54 questions in 64 minutes (approx. 71 seconds per question).
   - *Math*: 44 questions in 70 minutes (approx. 95 seconds per question).

Use the timing clock in the UI to measure your pace during practice blocks!`,
    quiz: [
      {
        question: 'Under the multi-stage adaptive structure of the Digital SAT, what unlocks the higher-scoring "Hard Module"?',
        options: [
          'Completing all questions with minutes remaining on the clockwise timer',
          'Achieving a high performance accuracy score in Module 1 of that section',
          'Having an academic GPA over 3.8 before registering for the exam',
          'Solving the optional essay at the end of the math suite answers'
        ],
        correctAnswer: 1
      },
      {
        question: 'What calculator tool is built-in and fully authorized for use on both math modules?',
        options: [
          'TI-89 Classic Emulator',
          'Dynamic Desmos Calculator',
          'Symbolab Math Solver',
          'Standard physical financial register'
        ],
        correctAnswer: 1
      },
      {
        question: 'Approximately how much time is allotted per question on the Reading & Writing module?',
        options: [
          '45 seconds',
          '71 seconds',
          '120 seconds',
          '95 seconds'
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'lesson_sat_2',
    courseId: 'course_sat_prep',
    order: 2,
    title: '2. Verbal Module: Vocabulary in Context & Transitions',
    videoPlaceholder: 'https://www.w3schools.com/html/mov_bbb.mp4',
    content: `## Words in Context & Sentence Transitions

To master Digital SAT Verbal, you need to understand semantic range and logical linking words. 

### Vocabulary in Context
Do not just memorize dictionaries; look for **systematic structural clues**:
- Contrast Clues (*however, although, conversely*)
- Elaborative Clues (*specifically, further, indeed*)
- Causal Clues (*therefore, as such, consequently*)

### Sample Analysis:
Look at the sentence: "The director’s early scripts were characterized by chaotic plots; by contrast, her late plays are notably _________."
The "by contrast" clue triggers the search for an antonym of "chaotic plots." A great answer choice would be "coherent" or "regimented."`,
    quiz: [
      {
        question: 'Which of the following transitions indicates that the subsequent sentence provides an extreme example or highly specific evidence of the prior claim?',
        options: [
          'To that end',
          'By contrast',
          'Indeed',
          'Nevertheless'
        ],
        correctAnswer: 2
      },
      {
        question: 'If a passage states that a local law is "deleterious to the community is actually a misnomer," what does the author imply about the law?',
        options: [
          'It is highly harmful',
          'It is not harmful in reality',
          'It is highly famous',
          'It cannot be enforced'
        ],
        correctAnswer: 1
      },
      {
        question: 'What is the recommended mental process for "Words in Context" questions?',
        options: [
          'Choose the longest and most sophisticated word immediately',
          'Plug in each word and select which sounds the most dynamic',
          'Predict a simple placeholder word based on context clues first, then find its nearest synonym',
          'Ask to skip of the question'
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'lesson_sat_3',
    courseId: 'course_sat_prep',
    order: 3,
    title: '3. Verbal Module: Command of Evidence & Rhetorical Synthesis',
    videoPlaceholder: 'https://www.w3schools.com/html/mov_bbb.mp4',
    content: `## Data Charts and Rhetorical Synthesis Lists

Reading questions contain rigorous passages evaluating scientific experiments and historical diaries.

### Rhetorical Synthesis Guide:
For "Rhetorical Synthesis" (where you are given bulleted notes and asked to fulfill a specific prompt):
1. **Read only the PROMPT first**. It will say something like: "The student wants to highlight a contrast between the two telescope models."
2. **Ignore all bullets** that don't directly mention BOTH telescope models or don't highlight a contrast.
3. Compare the surviving choices. The correct answer will directly fit the objective of the prompt while conveying accurate information.`,
    quiz: [
      {
        question: 'When answering "bully-list" Rhetorical Synthesis prompts, which action should you take FIRST?',
        options: [
          'Read and memorize all individual bullet points',
          'Identify and isolate the specific goal written in the prompt target',
          'Eliminate option A',
          'Skim the scientific reference index'
        ],
        correctAnswer: 1
      },
      {
        question: 'How does a correct "Command of Evidence" answer relate to a scientific chart provided in the passage?',
        options: [
          'It can contradict the chart as long as the prose text matches',
          'It must accurately represent the chart details and directly support the central hypothesis of the scientist',
          'It must extrapolate values outside the visible bounds of the coordinate graph',
          'It should focus strictly on the historical biography of the scientist'
        ],
        correctAnswer: 1
      },
      {
        question: 'If a prompt asks you to "introduce the novel to an audience unfamiliar with its premise," which choice fits best?',
        options: [
          'Written in 1925, the book cost $2 to buy originally.',
          'Under the author’s pen name, the volume achieved dynamic sales figures.',
          'The Great Gatsby is a 1925 novel that explores themes of wealth, romance, and deception in New York.',
          'Scholars have long debated the ending of the third chapter.'
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'lesson_sat_4',
    courseId: 'course_sat_prep',
    order: 4,
    title: '4. Math Module: Heart of Algebra & System Solutions',
    videoPlaceholder: 'https://www.w3schools.com/html/mov_bbb.mp4',
    content: `## The Heart of Algebra: Linear Equations & Relationships

Linear systems of equations form over 35% of the SAT Math suite. You must solve them analytically and know how to graph them on Desmos.

### System Intersection Counts:
For a linear system:
$$\\begin{cases} y = m_1x + b_1 \\\\ y = m_2x + b_2 \\end{cases}$$
- **Exactly One Solution**: Different slopes ($m_1 \\neq m_2$).
- **No Solution**: Parallel lines. Equal slopes ($m_1 = m_2$) but different y-intercepts ($b_1 \\neq b_2$).
- **Infinitely Many Solutions**: Identical lines. Equal slopes ($m_1 = m_2$) and equal y-intercepts ($b_1 = b_2$).

*Pro Tip*: If you are given coefficients like $ax + by = c$, solve for $y$ or type the raw systems straight into the Desmos utility to find intersections automatically!`,
    quiz: [
      {
        question: 'Under what rule will a system of two linear functions fail to intersect (have no solution)?',
        options: [
          'Their slopes are reciprocal values and y-intercepts are equal',
          'Their slopes are identical but their y-intercept constants are different',
          'One line is completely vertical and the other is totally horizontal',
          'Their equation constants sums are odd integers'
        ],
        correctAnswer: 1
      },
      {
        question: 'Solve for x: if 3x - 5 = 16, then what is the value of 6x + 10?',
        options: [
          '42',
          '52',
          '31',
          '28'
        ],
        correctAnswer: 1
      },
      {
        question: 'If a linear model maps a tutor’s total pay as P = 45h + 20, where h is teaching hours, what does the constant 20 represent?',
        options: [
          'The hourly rate of tutoring sessions',
          'The base-level appointment or registration fee regardless of hours',
          'The maximum hours the tutor can teach',
          'The cost of SAT textbooks'
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'lesson_sat_5',
    courseId: 'course_sat_prep',
    order: 5,
    title: '5. Math Module: Quadratic Vertex & Circle Geometry',
    videoPlaceholder: 'https://www.w3schools.com/html/mov_bbb.mp4',
    content: `## Quadratics & Advanced Circle Geometry

High-scoring math questions require solid mastery of parabolas and standard coordinate circles.

### Parabolas & The Vertex
For standard form $y = ax^2 + bx + c$, the x-coordinate of the vertex is:
$$x = -\\frac{b}{2a}$$
To find the vertex y-coordinate, evaluate the quadratic function at that $x$ value.

### Circle Equation
In a cartesian coordinate system, the standard formula of a circle is:
$$(x - h)^2 + (y - k)^2 = r^2$$
- Center is at point $(h, k)$.
- Radius is $r$ (remember to take the square root of the right side value!).

*Geometry Check*: Remember that arc degrees total 360, while radians equal $2\\pi$. Arc lengths and sector areas are directly proportional to their angles!`,
    quiz: [
      {
        question: 'Identify the coordinates of the center and the exact radius of the circle defined by the equation: (x - 4)^2 + (y + 5)^2 = 49.',
        options: [
          'Center: (-4, 5), Radius: 49',
          'Center: (4, -5), Radius: 7',
          'Center: (-4, -5), Radius: 7',
          'Center: (4, 5), Radius: 7'
        ],
        correctAnswer: 1
      },
      {
        question: 'What is the x-coordinate of the minimum vertex on the parabola y = 2x^2 - 12x + 5?',
        options: [
          '6',
          '3',
          '-3',
          '1.5'
        ],
        correctAnswer: 1
      },
      {
        question: 'If a sector of a circle has a central angle of 90 degrees and the total area of the circle is 64',
        options: [
          '16',
          '32',
          '8',
          '64'
        ],
        correctAnswer: 0
      }
    ]
  },

  // Course 2: IELTS Foundations (course_ielts_foundations)
  {
    id: 'lesson_ielts_1',
    courseId: 'course_ielts_foundations',
    order: 1,
    title: '1. Academic Writing Task 1: Chart Description & Trend Metrics',
    videoPlaceholder: 'https://www.w3schools.com/html/mov_bbb.mp4',
    content: `## IELTS Academic Writing Task 1: Data Synthesis

In Task 1, you must write a report of at least 150 words describing visual data (a bar chart, line graph, pie chart, or industrial process diagram).

### Four Scoring Criteria:
1. **Task Achievement**: Direct comparisons, correct trends, and a clear, descriptive overview paragraph.
2. **Coherence & Cohesion**: Logical flow, cohesive linking expressions.
3. **Lexical Resource**: Diverse nouns, action verbs, and precise adjectives.
4. **Grammatical Range**: Flawless compound and complex sentences.

### Vital Rule:
**Never write personal opinions** or list assumptions as to why data shifted. Simply report the visual facts precisely.`,
    quiz: [
      {
        question: 'Which element is an absolute requirement for achieving a Band 7+ in IELTS Task 1 Task Achievement?',
        options: [
          'An argumentative conclusion paragraph with personal economic recommendations',
          'A clear overview summarizing main trends, differences, or developmental phases',
          'Exactly five paragraph indent structures with custom citations',
          'Historical background details of the researchers who compiled the chart'
        ],
        correctAnswer: 1
      },
      {
        question: 'Which phrase is highly recommended to describe a line chart that rose rapidly and reached its highest state?',
        options: [
          'The metric fluctuated around a steady baseline',
          'The value rocketed and hit a peak of...',
          'The numbers did some interesting changes',
          'The statistics decreased to zero level'
        ],
        correctAnswer: 1
      },
      {
        question: 'Are you allowed to include personal opinions explain "why" a company’s sales dropped in your Task 1 essay?',
        options: [
          'Yes, showing market knowledge increases lexical scoring margins',
          'No, Task 1 is strictly an objective summary of visual facts without external speculation',
          'Only in the final summary section',
          'Only if the chart has no clear dates'
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'lesson_ielts_2',
    courseId: 'course_ielts_foundations',
    order: 2,
    title: '2. Academic Writing Task 2: High-Scoring Essay Blueprints',
    videoPlaceholder: 'https://www.w3schools.com/html/mov_bbb.mp4',
    content: `## IELTS Task 2: The Argumentative Essay

Task 2 is worth twice as much as Task 1. You must compile a structured argumentative essay of **250 words or more** in 40 minutes.

### The Four-Step Essay Blueprint:
1. **Introduction**:
   - Paraphrase the prompt.
   - Outline your thesis (your exact stance).
2. **Body Paragraph 1 (Support Focus A)**:
   - Topic sentence.
   - Core explanation.
   - Concrete example.
3. **Body Paragraph 2 (Support Focus B)**:
   - Topic sentence.
   - Core explanation.
   - Concrete example.
4. **Conclusion**:
   - Rephrase your core stance and summarize key reasons.

*Lexical Range Tip*: Replace simple words like "good" with *providential*, *beneficial*, or *virtuous*. Change "bad" to *detrimental*, *adverse*, or *implausible*.`,
    quiz: [
      {
        question: 'What is the recommended timing split and minimum word count for IELTS Writing Task 2?',
        options: [
          '20 minutes and 150 words',
          '40 minutes and 250 words',
          '60 minutes and 300 words',
          '30 minutes and 200 words'
        ],
        correctAnswer: 1
      },
      {
        question: 'In an "Agree or Disagree" Task 2 prompt, where must your main thesis first be clearly declared?',
        options: [
          'Hidden implicitly within the first body paragraph structure only',
          'Stated directly at the end of your introductory paragraph',
          'Only in the final line of your conclusion',
          'Nowhere; essays must remain completely neutral'
        ],
        correctAnswer: 1
      },
      {
        question: 'Which word acts as a premium band score synonym for "harmful"?',
        options: [
          'Implausible',
          'Detrimental',
          'Adverse',
          'Providential'
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'lesson_ielts_3',
    courseId: 'course_ielts_foundations',
    order: 3,
    title: '3. The Speaking Test: Long Turn Frameworks',
    videoPlaceholder: 'https://www.w3schools.com/html/mov_bbb.mp4',
    content: `## IELTS Speaking: Part 1, 2, and 3 Strategies

The speaking test is an intimate 11–14 minute interview divided into three stages:

### Speaking Structure:
- **Part 1 (Introduction & Familiar Topics)**: Simple 2-3 sentence answers about your hobbies, family, or city. Be natural.
- **Part 2 (The Cue Card / Individual Long Turn)**: You receive a prompt card and have 1 minute to plan. You must speak continuously for **1 to 2 minutes**.
- **Part 3 (Two-Way Abstract Dialogue)**: General, social-philosophical questions related to the Part 2 topic.

### Part 2 Planning Strategy:
Use your 1-minute planning time to create a **mind map of four columns** based on the prompts. Write high-level vocabulary words under each column so you can look down and weave them into your speech.`,
    quiz: [
      {
        question: 'How long are you expected to speak continuously during your Speaking Part 2 Cue Card individual response?',
        options: [
          'Precisely 30 seconds',
          'Between 1 and 2 minutes',
          'Exactly 5 minutes without pauses',
          '10 minutes'
        ],
        correctAnswer: 1
      },
      {
        question: 'In Speaking Part 3, how should your answers differ from your Speaking Part 1 answers?',
        options: [
          'Part 3 is highly informal and focuses on what you ate for breakfast',
          'Part 3 requires abstract, broad social commentary rather than personal, self-centric anecdotes',
          'Part 3 should be answered with single word phrases to save voice strain',
          'There is no structural difference'
        ],
        correctAnswer: 1
      },
      {
        question: 'If you do not hear or understand a question during Speaking Part 3, what should you do?',
        options: [
          'Remain completely silent and wait for the examiner to move on',
          'Politely ask for clarification using a native phase: "Could you rephrase that, please?"',
          'Incorporate random vocabulary and hope for the best',
          'Shrug'
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'lesson_ielts_4',
    courseId: 'course_ielts_foundations',
    order: 4,
    title: '4. Listening and Reading: Keyword Scanning & Pacing Secrets',
    videoPlaceholder: 'https://www.w3schools.com/html/mov_bbb.mp4',
    content: `## Scoring high on Listening & Reading Modules

Both modules contain **40 questions** with strict completion timelines. You must master the art of looking for synonyms.

### Reading: Skimming vs. Scanning
- **Skimming**: Moving over text quickly to extract the central theme of each paragraph.
- **Scanning**: Searching for specific visual anchors (such as numbers, years, capitalized chemical formulas, or geographical names) to locate where a question is answered.

### Listening: Watch for Distractors
IELTS Listening audio often includes "corrective distractors."
*Example*: "We will depart at 5 PM on Tuesday... Oh, wait, the schedule changed, let's make it Thursday at 10 AM instead."
Make sure to write down the final agreed information, not the first mention.`,
    quiz: [
      {
        question: 'What is a "corrective distractor" in IELTS Listening tests?',
        options: [
          'A loud alarm sound on the tape to split your focus',
          'An initial detail stated by a speaker that is immediately corrected or changed later in the audio',
          'A typo in the answer document',
          'A secondary speaker arguing in a different language'
        ],
        correctAnswer: 1
      },
      {
        question: 'What is the utility of "skimming" a passage in IELTS academic reading?',
        options: [
          'Reading every single word slowly to memorize spelling variables',
          'Gaining a rapid high-level map of paragraph main ideas before reading questions',
          'Finding misspelled words in the text',
          'Calculating page letter density averages'
        ],
        correctAnswer: 1
      },
      {
        question: 'How do questions in the reading passages generally flow chronologically?',
        options: [
          'In complete reverse order from the end of the text to the front',
          'Sequentially, meaning the answer to question 3 is usually found after the answer to question 2',
          'Randomly throughout the document blocks',
          'In order of word count length'
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'lesson_ielts_5',
    courseId: 'course_ielts_foundations',
    order: 5,
    title: '5. IELTS Assessment Metrics & Core Band Criteria',
    videoPlaceholder: 'https://www.w3schools.com/html/mov_bbb.mp4',
    content: `## Decoding IELTS Band Scores

Knowing how you are graded is key to unlocking a higher score. Your final score is the average of your results in all four sections.

### Lexical Resource (LR) Scoring Tips:
- Show your range by using **expressive idioms** (*e.g., "at the eleventh hour," "over the moon"*).
- Make sure to keep your tone academic and formal throughout.
- Avoid using conversational or colloquial phrases in your written essays.

### Grammatical Range & Accuracy (GRA):
Mix simple structures with advanced clauses:
- Subordinate clauses (*"Although urban migration is growing..."*)
- Conditional clauses (*"If councils invest in transit, congestion can be mitigated..."*)
- Relative clauses (*"Taxes, which curb carbon generation, are essential..."*)`,
    quiz: [
      {
        question: 'How is your final overall IELTS Band Score mathematically calculated?',
        options: [
          'It equals the score of your best reading section alone',
          'It is the arithmetic mean of all four category scores, rounded to the nearest half band',
          'It is based on the grading speed of the examiner',
          'It is weighted purely on the complexity of your speaking test vocabulary'
        ],
        correctAnswer: 1
      },
      {
        question: 'Which grammar structures are highly recommended to elevate your Grammatical Range and Accuracy score?',
        options: [
          'Short, repetitive active voice declarations',
          'A structured mix of compound-complex sentences with conditionals and relative clauses',
          'Repeated exclamation marks and rhetorical questions',
          'Double negative indicators'
        ],
        correctAnswer: 1
      },
      {
        question: 'When using idiomatic expressions, what does the examiner evaluate?',
        options: [
          'Your speed while pronouncing them',
          'Whether you use them in a natural, socially relevant, and accurate semantic context',
          'If you list more than ten in one minute',
          'If the idiom includes numbers'
        ],
        correctAnswer: 1
      }
    ]
  },

  // Course 3: Introduction to Economics (course_intro_economics)
  {
    id: 'lesson_econ_1',
    courseId: 'course_intro_economics',
    order: 1,
    title: '1. Economic Thought: Scarcity, Tradeoffs & PPF',
    videoPlaceholder: 'https://www.w3schools.com/html/mov_bbb.mp4',
    content: `## Scarcity & The Foundations of Choice

All economic frameworks originate from a simple reality: **resources are finite, but human desires are infinite**. This tension is called scarcity.

### The Production Possibility Frontier (PPF)
The PPF is a visual curve representing the maximum production capacity of two goods, given a fixed set of technology and resources.

- **Points Inside the Curve**: Inefficient. Some labor or factories are sitting idle.
- **Points On the Curve**: Efficient. Resources are fully utilized.
- **Points Outside the Curve**: Unattainable in the short run without technological growth or trade expansion.

*Opportunity Cost Definition*: The value of the next best alternative you give up when making a choice.`,
    quiz: [
      {
        question: 'What does a Production Possibility Frontier (PPF) curve visually map?',
        options: [
          'The inflation rate over five fiscal periods',
          'The maximum output combinations of two goods that can be created with current resources',
          'The historical consumer demand for luxury goods',
          'The total national debt in relation to GDP'
        ],
        correctAnswer: 1
      },
      {
        question: 'How is "Opportunity Cost" defined in economic fundamentals?',
        options: [
          'The total monetary pricing cost of buying an asset',
          'The value of the next best alternative given up when a choice is made',
          'The promotional discounts offered during trade fairs',
          'The taxation fee rate levied by a central treasury'
        ],
        correctAnswer: 1
      },
      {
        question: 'A point situated inside the PPF boundary curve indicates what structural property?',
        options: [
          'Resource capacity is completely overburdened and unsustainable',
          'Productive resources are being utilized inefficiently',
          'The state is experiencing massive technological hyper-growth',
          'The economy possesses infinite reserves'
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'lesson_econ_2',
    courseId: 'course_intro_economics',
    order: 2,
    title: '2. Microeconomics: Supply, Demand, and Price Elasticities',
    videoPlaceholder: 'https://www.w3schools.com/html/mov_bbb.mp4',
    content: `## Supply & Demand Dynamics

The intersection of supply and demand curves determines the clearing price and quantity of a good in a competitive market.

- **Law of Demand**: As the price of a good falls, consumers buy more. This creates a downward-sloping curve.
- **Law of Supply**: As the price of a good rises, suppliers produce more. This creates an upward-sloping curve.

### Price Elasticity of Demand (PED)
PED measures how responsive consumer demand is to a change in price:
$$PED = \\frac{\\% \\text{ Change in Quantity Demanded}}{\\% \\text{ Change in Price}}$$
- **Elastic (PED > 1)**: Small price changes cause large shifts in quantity demanded (*e.g., luxury items*).
- **Inelastic (PED < 1)**: Price changes have very little impact on demand (*e.g., life-saving medicines*).`,
    quiz: [
      {
        question: 'Under standard market parameters, what occurs when a legal price ceiling is established BELOW the natural market clearing equilibrium?',
        options: [
          'Suppliers increase output, causing major stock surpluses',
          'A market shortage forms because quantity demanded exceeds quantity supplied',
          'Demands drop to zero instantly',
          'Consumers refuse to buy the good'
        ],
        correctAnswer: 1
      },
      {
        question: 'Why does life-saving insulin medicine display highly inelastic demand curve properties?',
        options: [
          'It is very cheap to manufacture globally',
          'There are many close substitutes available on the market',
          'Consumers must have it to survive, so they will pay whatever price is demanded',
          'Governments make purchases optional'
        ],
        correctAnswer: 2
      },
      {
        question: 'What is the mathematical equation for Price Elasticity of Demand (PED)?',
        options: [
          'Percent change in Price multiplied by percent change in Quantity',
          'Percent change in Quantity Demanded divided by percent change in Price',
          'Total cost divided by units produced',
          'GDP divided by total population size'
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'lesson_econ_3',
    courseId: 'course_intro_economics',
    order: 3,
    title: '3. Macroeconomics: GDP, Economic Cycles, and Inflation',
    videoPlaceholder: 'https://www.w3schools.com/html/mov_bbb.mp4',
    content: `## Macroeconomic Metrics: GDP & Inflation

Macroeconomics shifts focus from individual markets to national and global scales.

### Gross Domestic Product (GDP)
The total market value of all final goods and services produced within a country in a year.
$$GDP = C + I + G + (X - M)$$
- **$C$**: Consumer Spending
- **$I$**: Private Investment
- **$G$**: Government Expenditure
- **$(X-M)$**: Net Exports (Exports minus Imports)

### Inflation
Inflation is the gradual decrease in a currency's purchasing power, measured by the **Consumer Price Index (CPI)**. Moderate inflation is normal, but hyperinflation can cripple an economy.`,
    quiz: [
      {
        question: 'In the formula for GDP (C + I + G + NX), what does the "I" component represent?',
        options: [
          'Interest rates charged by investment institutions',
          'Private business investments in physical capital, equipment, and inventories',
          'Individual income tax returns collected by the treasury',
          'International import spending margins'
        ],
        correctAnswer: 1
      },
      {
        question: 'What index is commonly used to measure the average change over time in prices paid by consumers for a basket of goods?',
        options: [
          'Producer Cost Index',
          'Consumer Price Index (CPI)',
          'Federal Reserve Rate Metric',
          'Dow Jones Industrial Index'
        ],
        correctAnswer: 1
      },
      {
        question: 'If a country reports that real GDP has contracted for two consecutive fiscal quarters, what phase of the business cycle is it entering?',
        options: [
          'Golden Hyper-expansion',
          'Economic Recession',
          'Structural Plateau',
          'Tariff equilibrium'
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'lesson_econ_4',
    courseId: 'course_intro_economics',
    order: 4,
    title: '4. Monetary Policy: Interest Rates & Central Banking',
    videoPlaceholder: 'https://www.w3schools.com/html/mov_bbb.mp4',
    content: `## The Mechanics of Monetary Policy

Central banks, such as the Federal Reserve, control the money supply to stable inflation and support employment.

### Three Primary Central Bank Levers:
1. **Open Market Operations (OMO)**: Selling or buying government bonds.
   - *Buying Bonds*: Increases bank reserves, injecting liquidity to lower interest rates.
   - *Selling Bonds*: Pulls liquidity out of the economy, raising interest rates to curb inflation.
2. **The Reserve Requirement Ratio**: The minimum cash percentage banks must keep in reserve.
3. **The Discount Rate**: The interest rate central banks charge commercial banks for short-term loans.`,
    quiz: [
      {
        question: 'If a central bank wants to slow down inflation, what open-market action will it take?',
        options: [
          'Purchase massive supplies of corporate equity',
          'Sell government bonds to commercial banks to pull cash reserves out of circulation',
          'Print extra physical bank currency notes',
          'Decrease treasury interest rates to zero'
        ],
        correctAnswer: 1
      },
      {
        question: 'What is the definition of the "Reserve Requirement Ratio"?',
        options: [
          'The interest rate charged when a bank borrows from the government',
          'The fraction of customer deposits that banks must retain in cash vaults rather than lending out',
          'The minimal corporate taxation rate of the country',
          'The gold vault weight totals'
        ],
        correctAnswer: 1
      },
      {
        question: 'Which rate represents the cost for commercial banks to borrow directly from the central banking window?',
        options: [
          'Prime index price',
          'Discount rate',
          'Mortgage standard level',
          'Bond coupon coupon rate'
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'lesson_econ_5',
    courseId: 'course_intro_economics',
    order: 5,
    title: '5. Fiscal Policy & International Trade Tariffs',
    videoPlaceholder: 'https://www.w3schools.com/html/mov_bbb.mp4',
    content: `## Government Budgets & International Trade

While central banks control the money supply, governments use **Fiscal Policy** to steer economic activity.

### Fiscal Policy Actions:
- **Expansionary**: Increasing government spending ($G$) and lowering tax rates to boost consumer demand during recessions.
- **Contractionary**: Reducing government spending and raising taxes to curb inflation and pay down national debt.

### Trade Policy & Tariffs:
A **Tariff** is a tax levied on imported foreign goods. While tariffs can protect domestic industries, they often lead to higher consumer prices and retaliatory tariffs from trade partners.`,
    quiz: [
      {
        question: 'What are the two primary tools used by governments to execute Fiscal Policy?',
        options: [
          'Printing paper bills and fixing stock exchange margins',
          'Government spending and taxation policies',
          'Setting interest rates and reserve requirements',
          'Regulating corporate wages and pricing systems'
        ],
        correctAnswer: 1
      },
      {
        question: 'What is a "tariff" in global economics?',
        options: [
          'A license fee required to establish a commercial business',
          'A tax levied on imported foreign items entering a country',
          'A subsidy paid to encourage shipping',
          'A type of currency swap contract'
        ],
        correctAnswer: 1
      },
      {
        question: 'If a government runs a "budget deficit," what does this imply?',
        options: [
          'Its currency reserves are entirely depleted',
          'Its tax collections are less than its annual expenditures',
          'It has banned all imports from abroad',
          'Total exports outpace consumer spending'
        ],
        correctAnswer: 1
      }
    ]
  }
];

export async function seedDatabaseIfEmpty() {
  try {
    const oppsRef = collection(db, 'opportunities');
    const oppsSnap = await getDocs(oppsRef);

    // If already populated, skip seeding to preserve state
    if (!oppsSnap.empty) {
      console.log('Database already has seeded data. Preschool skipped!');
      return;
    }

    console.log('Seeding clean mock database payload...');
    const batch = writeBatch(db);

    // Seed Opportunities
    SEED_OPPORTUNITIES.forEach((opp) => {
      batch.set(doc(db, 'opportunities', opp.id), opp);
    });

    // Seed Courses
    SEED_COURSES.forEach((course) => {
      batch.set(doc(db, 'courses', course.id), course);
    });

    // Seed Lessons
    SEED_LESSONS.forEach((lesson) => {
      batch.set(doc(db, 'lessons', lesson.id), lesson);
    });

    await batch.commit();
    console.log('Database seeded successfully in firestore!');
  } catch (err) {
    console.error('Error during database seeding:', err);
  }
}
