import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from './firebase';
import { Opportunity, Course } from '../types';

export const SAMPLE_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp_wharton",
    title: "Wharton Global Youth Investment Competition",
    description: "A world-class virtual simulation for high school students to manage $100k for a potential client. Learn how to draft client-focused portfolios, analyze corporate fundamentals, and evaluate macroeconomic sectors.",
    category: "Business",
    organization: "Wharton School, University of Pennsylvania",
    eligibility: "Grades 9-12 (Teams of 4-7)",
    deadline: "2026-09-15",
    applicationUrl: "https://globalyouth.wharton.upenn.edu/",
    imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "opp_issai",
    title: "ISSAI Summer Research Program",
    description: "Collaborate on cutting-edge Machine Learning and Data Science research projects with leading university scholars and industry scientists. Students write and submit co-authored draft manuscripts.",
    category: "Research",
    organization: "Institute of Smart Systems and Artificial Intelligence",
    eligibility: "Grade 10-12 (Prior coding helpful)",
    deadline: "2026-07-28",
    applicationUrl: "https://issai.nu.edu.kz/",
    imageUrl: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "opp_google_science",
    title: "Google Global Science Fair",
    description: "A global online competition open to individual innovators and small groups. Present hypotheses, scientific testing procedures, and models to solve crucial local and planetary challenges.",
    category: "STEM",
    organization: "Google Inc. & Scientific American",
    eligibility: "Ages 13-18 (Solo or partners)",
    deadline: "2026-10-05",
    applicationUrl: "https://sciencefair.withgoogle.com/",
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "opp_usaco",
    title: "USA Computing Olympiad (USACO)",
    description: "National computer science tournament testing mathematical and algorithmic efficiency. Compete across Bronze, Silver, Gold, and Platinum divisions using C++, Java, or Python.",
    category: "Programming",
    organization: "USACO Foundation",
    eligibility: "Pre-College Students",
    deadline: "2026-12-18",
    applicationUrl: "http://www.usaco.org/",
    imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "opp_yale_ scholars",
    title: "Yale Young Global Scholars (YYGS)",
    description: "An intensive academic enrichment program bringing together students from over 150 nations. Engage with Yale faculty, participate in seminar courses, and research planetary policy issues.",
    category: "Research",
    organization: "Yale University Office of Academic Affairs",
    eligibility: "Ages 16-18 (Grades 10-11)",
    deadline: "2026-11-20",
    applicationUrl: "https://globalscholars.yale.edu/",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "opp_john_locke",
    title: "John Locke Institute Essay Competition",
    description: "Prestigious global writing competition evaluating philosophy, politics, economics, history, and law. Essays are assessed by professors from Oxford and Princeton.",
    category: "Humanities",
    organization: "John Locke Institute",
    eligibility: "Ages 18 and under",
    deadline: "2026-06-30",
    applicationUrl: "https://www.johnlockeinstitute.com/",
    imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "opp_regeneron_sts",
    title: "Regeneron Science Talent Search (STS)",
    description: "The nation's oldest and most prestigious science and math competition for high school seniors. Submit original scientific research for significant college scholarships.",
    category: "Research",
    organization: "Society for Science",
    eligibility: "Grade 12 Scholars",
    deadline: "2026-11-12",
    applicationUrl: "https://www.societyforscience.org/regeneron-sts/",
    imageUrl: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "opp_amc",
    title: "AMC 10 & 12 / Mathematics Olympiads",
    description: "Prestigious contest series to identify mathematical talent and qualify scholars for the American Invitational Mathematics Examination (AIME) and USA Mathematical Olympiads.",
    category: "STEM",
    organization: "Mathematical Association of America",
    eligibility: "Grades 10 or 12 below",
    deadline: "2026-10-25",
    applicationUrl: "https://www.maa.org/math-competitions",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "opp_conrad",
    title: "Conrad Global Startup Challenge",
    description: "An elite global startup and entrepreneurship challenge for high school students. Pitch technology-driven solutions to build actual businesses solving real-world global issues.",
    category: "Business",
    organization: "Conrad Foundation",
    eligibility: "Ages 13-18 (Teams of 2-5)",
    deadline: "2026-11-01",
    applicationUrl: "https://www.conradchallenge.org/",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "opp_mit_think",
    title: "MIT THINK Scholars Initiative",
    description: "A science, technology, and engineering initiative that supports student research. Selected high school finalists receive seed funding, mentorship from MIT professors, and a trip to MIT's campus.",
    category: "STEM",
    organization: "Massachusetts Institute of Technology (MIT)",
    eligibility: "Pre-college High School students",
    deadline: "2026-01-15",
    applicationUrl: "https://think.mit.edu/",
    imageUrl: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "opp_hmmt",
    title: "Harvard-MIT Mathematics Tournament (HMMT)",
    description: "One of the absolute largest and most challenging math tournaments in the world. Solve complex puzzles, geometry grids, and proofs in highly competitive team settings.",
    category: "STEM",
    organization: "Harvard & MIT Math Coalitions",
    eligibility: "Grades 9-12 (Teams of 6-8)",
    deadline: "2026-10-10",
    applicationUrl: "https://www.hmmt.org/",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80"
  }
];

export const SAMPLE_COURSES: Course[] = [
  {
    id: "course_sat",
    title: "SAT Preparation: Math & Verbal Essentials",
    description: "Fully comprehensive strategic curriculum to master high-score strategies on the Digital SAT. Focused heavily on grid-in mechanics, command of evidence, and syntax structures.",
    instructor: "Dr. Clara Thorne",
    category: "STEM",
    lessonsCount: 3,
    lessons: [
      {
        id: "lesson_sat_1",
        title: "Advanced Algebraic Mechanics & Functions",
        duration: "18 mins",
        content: `### Interactive Mastery: Advanced Algebraic Mechanics
In this first module, you will master linear inequalities, systems of equations, and complex function modeling on the digital SAT.

#### Core Concept Strategy
On the digital SAT, approximately **35% of Math questions** fall under the "Heart of Algebra" content domain. 

##### 1. System of Equations - Dynamic Slopes
A system containing equations $y = mx + b_1$ and $y = nx + b_2$ has:
- **Zero solutions** if $m = n$ and $b_1 \\neq b_2$ (parallel linear tracks).
- **Infinite solutions** if $m = n$ and $b_1 = b_2$ (coincident tracks).
- **One unique solution** if $m \\neq n$.

##### 2. The Desmos Advantage
Keep in mind that when graphing, you can quickly find intersecting coordinate structures by plotting both terms and hovering your mouse pointer over the vertex intersection.

#### Formula Showcase: The Quadratic Discriminant
For a second-order polynomial equation $ax^2 + bx + c = 0$, the roots are directly determined by the discriminant:
$$\\Delta = b^2 - 4ac$$
- **$\\Delta > 0$**: Two distinct real solutions.
- **$\\Delta = 0$**: Exactly one real solution (tangent curve coordinate).
- **$\\Delta < 0$**: No real solutions (two imaginary solutions).`,
        question: {
          quizText: "A system of equations has 0 intersections. Equation 1 is y = 4x - 7. Equation 2 is y = (k-1)x + 12. What is the value of k?",
          options: [
            "3",
            "4",
            "5",
            "k cannot be determined"
          ],
          correctIndex: 2,
          explanation: "For the system to have 0 solutions, the lines must be parallel, meaning their slopes are equal. Therefore, k - 1 = 4, which yields k = 5."
        }
      },
      {
        id: "lesson_sat_2",
        title: "Command of Evidence: Contextual Parsing",
        duration: "22 mins",
        content: `### Mastery: Reading Command of Evidence
This module introduces logical inference mapping to help you secure top scores in SAT reading sections.

#### Critical Reading Tactics: The Pivot Indicator
When analyzing dense academic summaries, focus immediately on logical shift words (e.g., *nevertheless*, *alternatively*, *conversely*). Answers that rely on speculation outside the given prompt text are always incorrect.

##### Key Strategy: No Assumption Rule
If the passage asserts that "some botanists remain skeptical of cellular root signals under low soil acidity," do not select an answer claiming "high acidity stimulates maximum cellular signaling." That is an unstated, speculative inverse. Seek literal textual overlap.`,
        question: {
          quizText: "Which word signals a key contrast pivot in dense SAT passages?",
          options: [
            "Furthermore",
            "Consequently",
            "Nevertheless",
            "Illustratively"
          ],
          correctIndex: 2,
          explanation: "'Nevertheless' represents an academic contrast pivot, demonstrating a shift in critical perspective or evidentiary claims."
        }
      },
      {
        id: "lesson_sat_3",
        title: "Math Grid-In: Strategy & Format",
        duration: "15 mins",
        content: `### Digital SAT Grid-In Mechanics
Unlike multiple-choice items, grid-ins provide no options to eliminate. Precision is vital.

#### Solving Grid-In Fractions
- You can key in fractions (e.g., $7/3$) up to five spaces.
- Never enter mixed numbers like $3 \\frac{1}{2}$ as $31/2$. Always convert them to improper fractions ($7/2$) or decimals ($3.5$).
- Fill in leading decimals accurately (e.g., $.667$ for $2/3$, not $.66$).`,
        question: {
          quizText: "If 3x + 12 = 21, what is the value of 2x?",
          options: [
            "3",
            "6",
            "9",
            "18"
          ],
          correctIndex: 1,
          explanation: "3x = 9, so x = 3. Therefore, 2x = 6. Enter 6."
        }
      }
    ]
  },
  {
    id: "course_research",
    title: "Academic Research Methodology & Scholarly Writing",
    description: "Undergo a rigorous academic drafting routine. Structure literature reviews, define methodologies, analyze parameters, and format citations like senior peer reviewers.",
    instructor: "Prof. Julian Mercer",
    category: "Research",
    lessonsCount: 3,
    lessons: [
      {
        id: "lesson_res_1",
        title: "Formulating Hypotheses & Academic Aims",
        duration: "25 mins",
        content: `### Advanced Research Writing: Defining Core Hypotheses
A pristine academic research paper relies entirely on a research aim that is specific and testable.

#### The Anatomy of strong Research Hypotheses
A research hypothesis must contain:
1. **Independent Variable(s) ($X$)**: The factor controlled or altered.
2. **Dependent Variable(s) ($Y$)**: The observed outcome metric.
3. **Control Variables**: Other elements held constant to preserve causal integrity.

##### Formulaic Representation
$$H_0 \\text{ (Null Hypothesis): } \\mu_1 = \\mu_2$$
$$H_1 \\text{ (Alternative Hypothesis): } \\mu_1 \\neq \\mu_2$$

#### Literature Review Mechanics
Always anchor your aims within the prevailing literature. Your introductory paragraphs should illustrate a distinct academic knowledge gap before introducing your novel methodology.`,
        question: {
          quizText: "To prove a causal relationship, which of the following variables must you actively control or isolate?",
          options: [
            "Independent variables",
            "Confounding extraneous variables",
            "Dependent outcome metrics",
            "Qualitative descriptors"
          ],
          correctIndex: 1,
          explanation: "Confounding extraneous variables represent outside elements that could distort causal tracking and must remain controlled."
        }
      },
      {
        id: "lesson_res_2",
        title: "Quantitative Methodology: Signal & Noise",
        duration: "20 mins",
        content: `### Quantitative Methodology & Statistical Models
Explore data processing techniques, regression lines, and error testing models.

#### Calculating the P-Value Accuracy
In quantitative modeling, a **p-value** of $< 0.05$ indicates that there is a less than 5% probability that your results occurred by pure random chance, making it standard for rejecting the null hypothesis.

$$\\text{If } p \\le 0.05 \\implies \\text{Reject } H_0$$`,
        question: {
          quizText: "What is the standard significance threshold (p-value) for rejecting the null hypothesis in peer-reviewed scientific studies?",
          options: [
            "p < 0.50",
            "p < 0.10",
            "p < 0.05",
            "p < 0.01 only"
          ],
          correctIndex: 2,
          explanation: "p < 0.05 remains the widely accepted standard scientific ceiling to declare statistical significance."
        }
      },
      {
        id: "lesson_res_3",
        title: "Academic Citations & Formatting Styles",
        duration: "18 mins",
        content: `### Academic Style Guides: APA vs. Harvard
Master in-text citations and reference tracking structures.

#### APA In-Text Styles
- (Author, Year) format. Example: *(Mercer, 2026)*.
- Page references are required for direct quotes: *(Mercer, 2026, p. 44)*.
- Format multi-author publications using *et al.* starting with three or more authors.`,
        question: {
          quizText: "Which is the correct APA in-text format for a direct quote from page 12 of a book written by Thorne in 2024?",
          options: [
            "(Thorne, 12)",
            "(Thorne, 2024, p. 12)",
            "(Thorne 2024, page 12)",
            "(Thorne, p.12)"
          ],
          correctIndex: 1,
          explanation: "APA in-text format requires the author name, publication year, and 'p. [number]' page notation for direct extracts."
        }
      }
    ]
  },
  {
    id: "course_olympiad",
    title: "Olympiad Level Algorithms & Data Structures",
    description: "Empower your computational thinking. Tackle graph traversals, complexity runtimes, and optimal memoized array allocations for USACO competitions.",
    instructor: "Coach Kenji Tanaka",
    category: "Programming",
    lessonsCount: 3,
    lessons: [
      {
        id: "lesson_oly_1",
        title: "Runtime Complexities & Big-O Notation",
        duration: "30 mins",
        content: `### Computational Thinking: Rigorous Runtimes
In Olympiad computer science, passing a test case requires your program to execute within **1.0 to 2.0 seconds** (approx. $10^8$ operations).

#### Graphing the Complexity Hierarchy
$$\\mathcal{O}(1) < \\mathcal{O}(\\log N) < \\mathcal{O}(N) < \\mathcal{O}(N \\log N) < \\mathcal{O}(N^2) < \\mathcal{O}(2^N) < \\mathcal{O}(N!)$$

##### Strategy for USACO Competitors
- If $N \\le 20$, custom recursion ($\\mathcal{O}(2^N)$) is safe.
- If $N \\le 1000$, double iteration ($\\mathcal{O}(N^2)$) works.
- If $N \\ge 10^5$, structure your approach with heap maps, sorting algorithms, or segment trees ($\\mathcal{O}(N \\log N)$ or linear structures).`,
        question: {
          quizText: "A test problem features N = 200,000 array items. What maximum complexity is safe to pass under a standard 1.0s limit?",
          options: [
            "O(N^2)",
            "O(N log N)",
            "O(2^N)",
            "O(N!)"
          ],
          correctIndex: 1,
          explanation: "With N = 200,000, an O(N^2) solution requires 4 * 10^10 operations (will TLE). O(N log N) requires only ~3.6 * 10^6 operations, easily running under 0.1 seconds."
        }
      },
      {
        id: "lesson_oly_2",
        title: "Graph Traversal: Edge Modeling & DFS",
        duration: "25 mins",
        content: `### Graph Theory: Adjacency Maps & Depth First Search (DFS)
Master node modeling and recursive graph traversal in C++ or Python.

#### Adjacency Lists
Using an array of vectors to model links:
\`\`\`cpp
vector<int> adj[MAX_N];
adj[u].push_back(v);
adj[v].push_back(u); // if undirected
\`\`\`

#### DFS Recursive Implementation
\`\`\`python
def dfs(node):
    visited[node] = True
    for neighbor in adj[node]:
        if not visited[neighbor]:
            dfs(neighbor)
\`\`\`
This recursive algorithm runs in $\\mathcal{O}(V + E)$ time, allowing complete coverage of connected node clusters in linear space.`,
        question: {
          quizText: "What is the runtime complexity of Depth First Search on a graph containing V vertices and E undirected edges?",
          options: [
            "O(V)",
            "O(E^2)",
            "O(V * E)",
            "O(V + E)"
          ],
          correctIndex: 3,
          explanation: "DFS traverses every individual vertex and its immediate linked list of neighboring edges exactly once, yielding O(V + E) complexity."
        }
      },
      {
        id: "lesson_oly_3",
        title: "Dynamic Programming: Knapsack Basics",
        duration: "32 mins",
        content: `### Dynamic Programming Strategy: Memoized States
Learn the core art of solving complex issues by storing cached solutions to overlapping sub-problems.

#### The 0/1 Knapsack Problem
Given $N$ items with individual weights $w_i$ and values $v_i$, maximize overall value within a bag limit $W$:
$$\\text{State: } dp[i][j] = \\max(dp[i-1][j],\\; dp[i-1][j - w_i] + v_i)$$
This optimizes the search space from an exponential $\\mathcal{O}(2^N)$ recursion down to a quadratic $\\mathcal{O}(N \\cdot W)$ grid search.`,
        question: {
          quizText: "What primary mechanism differentiates Dynamic Programming from standard brute-force recursive operations?",
          options: [
            "Floating-point rounding",
            "Pointer garbage collection",
            "Memoization and cached states",
            "Recursive stack overflow triggers"
          ],
          correctIndex: 2,
          explanation: "Memoization (storing computed outputs to eliminate duplicate calculations) is the core mechanism of Dynamic Programming."
        }
      }
    ]
  }
];

export const seedDatabaseIfEmpty = async () => {
  try {
    const oppDocs = await getDocs(collection(db, 'opportunities'));
    if (oppDocs.empty) {
      console.log("Seeding sample opportunities catalog to Firestore...");
      const batch = writeBatch(db);
      SAMPLE_OPPORTUNITIES.forEach((opp) => {
        const docRef = doc(db, 'opportunities', opp.id);
        batch.set(docRef, opp);
      });
      await batch.commit();
    }

    const courseDocs = await getDocs(collection(db, 'courses'));
    if (courseDocs.empty) {
      console.log("Seeding course tracks to Firestore...");
      const batch = writeBatch(db);
      SAMPLE_COURSES.forEach((course) => {
        const docRef = doc(db, 'courses', course.id);
        batch.set(docRef, course);
      });
      await batch.commit();
    }
  } catch (err) {
    console.error("Error in seedDatabaseIfEmpty:", err);
  }
};
