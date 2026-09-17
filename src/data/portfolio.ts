export const profile = {
  name: 'MK Haque',
  role: 'Full Stack Developer',
  email: 'mkhaque.business@gmail.com',
  github: 'https://github.com/mkhaque1',
  linkedin: 'https://linkedin.com/in/mkhaque',
  intro:
    'I turn complex ideas into thoughtful digital products. Front to back. Detail to system.',
  about:
    'My work connects the parts people see with the systems they depend on. I care about clear interfaces, maintainable architecture, and the small interactions that make software feel considered.',
};

export const skills = [
  {
    id: 'interface',
    number: '01',
    title: 'Interface',
    subtitle: 'Where the product becomes tangible.',
    description:
      'Accessible, responsive interfaces with a strong visual point of view and deliberate interaction design.',
    items: [
      'TypeScript',
      'JavaScript',
      'React',
      'Next.js',
      'Astro',
      'HTML & CSS',
    ],
  },
  {
    id: 'systems',
    number: '02',
    title: 'Systems',
    subtitle: 'The structure behind the experience.',
    description:
      'Application logic, authentication, and APIs organized around clear boundaries and maintainability.',
    items: [
      'Node.js',
      'Express',
      'REST APIs',
      'GraphQL',
      'Authentication',
      'Testing',
    ],
  },
  {
    id: 'data',
    number: '03',
    title: 'Data',
    subtitle: 'Information, carefully connected.',
    description:
      'Data models and persistence strategies shaped around the needs of the product.',
    items: ['PostgreSQL', 'MongoDB', 'Prisma', 'Redis', 'SQL', 'Data modeling'],
  },
  {
    id: 'delivery',
    number: '04',
    title: 'Delivery',
    subtitle: 'From an idea to a working release.',
    description:
      'Versioned, repeatable workflows with attention to deployment, performance, and quality.',
    items: ['Git', 'Docker', 'CI/CD', 'Linux', 'Vercel', 'Performance'],
  },
];

export const projects = [
  {
    number: '01',
    title: 'Forma',
    type: 'Full stack',
    category: 'fullstack',
    year: 'CONCEPT',
    description:
      'A sample commerce concept exploring a quieter approach to product discovery and checkout.',
    stack: ['Next.js', 'PostgreSQL', 'Stripe'],
    theme: 'forma',
    label: 'Commerce, without the noise.',
    url: '',
  },
  {
    number: '02',
    title: 'Signal',
    type: 'Frontend',
    category: 'frontend',
    year: 'CONCEPT',
    description:
      'A sample analytics interface exploring hierarchy, readable reporting, and focused workflows.',
    stack: ['React', 'TypeScript', 'CSS'],
    theme: 'signal',
    label: 'A clearer view of everything.',
    url: '',
  },
  {
    number: '03',
    title: 'Orbit',
    type: 'Full stack',
    category: 'fullstack',
    year: 'CONCEPT',
    description:
      'A sample collaboration platform exploring connected workspaces, permissions, and team context.',
    stack: ['Astro', 'Node.js', 'PostgreSQL'],
    theme: 'orbit',
    label: 'Good work moves together.',
    url: '',
  },
];

export const process = [
  {
    number: '01',
    title: 'Understand',
    text: 'Start with the problem, the people, and the constraints. Make the right thing clear before making it real.',
  },
  {
    number: '02',
    title: 'Shape',
    text: 'Connect information architecture, interface design, and technical decisions into a coherent direction.',
  },
  {
    number: '03',
    title: 'Build',
    text: 'Develop in deliberate iterations. Treat accessibility, performance, and maintainability as part of the work.',
  },
  {
    number: '04',
    title: 'Refine',
    text: 'Test the complete experience, resolve the rough edges, and make the handoff as thoughtful as the product.',
  },
];
