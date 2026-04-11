import type { Category, Item } from '@/lib/db';

const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Linguagens de Programação', slug: 'programming-languages', icon: 'CodeIcon' },
  { id: 2, name: 'Bancos de Dados', slug: 'databases', icon: 'Database01Icon' },
  { id: 3, name: 'Ferramentas de Design', slug: 'design-tools', icon: 'ColorsIcon' },
];

const MOCK_ITEMS: Item[] = [
  // Programming Languages
  {
    id: 101, categoryId: 1, name: 'C++', firstLetter: 'C', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# C++\n\nA high-performance systems programming language with zero-cost abstractions.\n\n## Key Features\n\n- Manual memory management\n- Templates and generic programming\n- Object-oriented and procedural paradigms\n\n\`\`\`cpp\n#include <iostream>\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n}\n\`\`\``,
  },
  {
    id: 102, categoryId: 1, name: 'Go', firstLetter: 'G', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Go\n\nA statically typed, compiled language designed for simplicity and concurrency.\n\n## Key Features\n\n- Goroutines for lightweight concurrency\n- Built-in garbage collection\n- Fast compilation\n\n\`\`\`go\npackage main\nimport "fmt"\nfunc main() {\n    fmt.Println("Hello, World!")\n}\n\`\`\``,
  },
  {
    id: 103, categoryId: 1, name: 'Java', firstLetter: 'J', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Java\n\nA class-based, object-oriented language designed to run anywhere with the JVM.\n\n## Key Features\n\n- Write once, run anywhere\n- Strong static typing\n- Rich ecosystem (Maven, Spring, etc.)\n\n\`\`\`java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n\`\`\``,
  },
  {
    id: 104, categoryId: 1, name: 'JavaScript', firstLetter: 'J', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# JavaScript\n\nThe language of the web — dynamic, prototype-based, and event-driven.\n\n## Key Features\n\n- First-class functions\n- Async/await for concurrency\n- Runs in browsers and Node.js\n\n\`\`\`js\nconsole.log("Hello, World!");\n\`\`\``,
  },
  {
    id: 105, categoryId: 1, name: 'Kotlin', firstLetter: 'K', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Kotlin\n\nA modern, concise language that targets the JVM, Android, and more.\n\n## Key Features\n\n- Null safety by design\n- Extension functions\n- Interoperable with Java\n\n\`\`\`kotlin\nfun main() {\n    println("Hello, World!")\n}\n\`\`\``,
  },
  {
    id: 106, categoryId: 1, name: 'Python', firstLetter: 'P', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Python\n\nA readable, batteries-included language beloved for data science and scripting.\n\n## Key Features\n\n- Dynamic typing with optional type hints\n- Vast standard library\n- First choice for ML/AI\n\n\`\`\`python\nprint("Hello, World!")\n\`\`\``,
  },
  {
    id: 107, categoryId: 1, name: 'Ruby', firstLetter: 'R', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Ruby\n\nA dynamic language focused on developer happiness and elegant syntax.\n\n## Key Features\n\n- Everything is an object\n- Metaprogramming capabilities\n- Rails convention over configuration\n\n\`\`\`ruby\nputs "Hello, World!"\n\`\`\``,
  },
  {
    id: 108, categoryId: 1, name: 'Rust', firstLetter: 'R', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Rust\n\nA systems language with memory safety guarantees without garbage collection.\n\n## Key Features\n\n- Ownership and borrowing model\n- Zero-cost abstractions\n- No null pointer exceptions\n\n\`\`\`rust\nfn main() {\n    println!("Hello, World!");\n}\n\`\`\``,
  },
  {
    id: 109, categoryId: 1, name: 'Swift', firstLetter: 'S', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Swift\n\nApple's modern language for iOS, macOS, and beyond.\n\n## Key Features\n\n- Protocol-oriented programming\n- Optionals for nil safety\n- Powerful type inference\n\n\`\`\`swift\nprint("Hello, World!")\n\`\`\``,
  },
  {
    id: 110, categoryId: 1, name: 'TypeScript', firstLetter: 'T', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# TypeScript\n\nJavaScript with static types — adds safety and tooling to the web's native language.\n\n## Key Features\n\n- Structural type system\n- Interfaces and generics\n- Compiles to any JS target\n\n\`\`\`ts\nconst greet = (name: string): string => \`Hello, \${name}!\`;\nconsole.log(greet("World"));\n\`\`\``,
  },

  // Databases
  {
    id: 201, categoryId: 2, name: 'Cassandra', firstLetter: 'C', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Apache Cassandra\n\nA wide-column NoSQL database designed for massive scale and high availability.\n\n## Key Features\n\n- Peer-to-peer architecture\n- Tunable consistency\n- Linear write scalability\n\nBest for: time-series data, IoT, and globally distributed apps.`,
  },
  {
    id: 202, categoryId: 2, name: 'ClickHouse', firstLetter: 'C', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# ClickHouse\n\nA blazing-fast columnar OLAP database for real-time analytics.\n\n## Key Features\n\n- Column-oriented storage\n- Vectorized query execution\n- Excellent compression\n\nBest for: analytics dashboards, log analysis, ad-tech.`,
  },
  {
    id: 203, categoryId: 2, name: 'DynamoDB', firstLetter: 'D', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Amazon DynamoDB\n\nAWS's fully managed NoSQL key-value and document database.\n\n## Key Features\n\n- Single-digit millisecond performance\n- Auto-scaling\n- Global tables for multi-region\n\nBest for: serverless apps, gaming leaderboards, session stores.`,
  },
  {
    id: 204, categoryId: 2, name: 'Elasticsearch', firstLetter: 'E', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Elasticsearch\n\nA distributed search and analytics engine built on Apache Lucene.\n\n## Key Features\n\n- Full-text search with relevance scoring\n- Real-time indexing\n- RESTful JSON API\n\nBest for: search engines, log aggregation (ELK stack), observability.`,
  },
  {
    id: 205, categoryId: 2, name: 'MongoDB', firstLetter: 'M', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# MongoDB\n\nThe leading document database — stores data as flexible JSON-like BSON documents.\n\n## Key Features\n\n- Schema-flexible documents\n- Rich query language\n- Horizontal sharding\n\nBest for: content management, catalogs, real-time apps.`,
  },
  {
    id: 206, categoryId: 2, name: 'MySQL', firstLetter: 'M', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# MySQL\n\nThe world's most popular open-source relational database.\n\n## Key Features\n\n- ACID transactions\n- InnoDB storage engine\n- Broad hosting support\n\nBest for: web apps, CMS platforms, e-commerce.`,
  },
  {
    id: 207, categoryId: 2, name: 'Neo4j', firstLetter: 'N', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Neo4j\n\nThe world's leading graph database, built for connected data.\n\n## Key Features\n\n- Native graph storage\n- Cypher query language\n- ACID compliant\n\nBest for: fraud detection, recommendations, knowledge graphs.`,
  },
  {
    id: 208, categoryId: 2, name: 'PostgreSQL', firstLetter: 'P', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# PostgreSQL\n\nThe world's most advanced open-source relational database.\n\n## Key Features\n\n- Full ACID compliance\n- Advanced indexing (GIN, GiST, BRIN)\n- JSON support alongside relational\n\nBest for: complex queries, geospatial data, financial systems.`,
  },
  {
    id: 209, categoryId: 2, name: 'Redis', firstLetter: 'R', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Redis\n\nAn in-memory data structure store used as a database, cache, and message broker.\n\n## Key Features\n\n- Sub-millisecond latency\n- Rich data structures (strings, lists, sets, hashes)\n- Pub/Sub messaging\n\nBest for: caching, session management, real-time leaderboards.`,
  },
  {
    id: 210, categoryId: 2, name: 'SQLite', firstLetter: 'S', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# SQLite\n\nA serverless, self-contained, zero-configuration SQL database engine.\n\n## Key Features\n\n- File-based, no server required\n- Full SQL support\n- Embedded in billions of devices\n\nBest for: mobile apps, desktop software, prototypes, edge computing.`,
  },

  // Design Tools
  {
    id: 301, categoryId: 3, name: 'Adobe XD', firstLetter: 'A', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Adobe XD\n\nAdobe's UX/UI design and prototyping tool, part of the Creative Cloud.\n\n## Key Features\n\n- Vector design tools\n- Interactive prototyping\n- Integration with Photoshop & Illustrator\n\nBest for: teams already in the Adobe ecosystem.`,
  },
  {
    id: 302, categoryId: 3, name: 'Canva', firstLetter: 'C', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Canva\n\nA browser-based graphic design platform accessible to non-designers.\n\n## Key Features\n\n- Drag-and-drop editor\n- Thousands of templates\n- Brand kit management\n\nBest for: social media graphics, presentations, marketing materials.`,
  },
  {
    id: 303, categoryId: 3, name: 'Figma', firstLetter: 'F', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Figma\n\nThe industry-standard collaborative design tool for UI/UX teams.\n\n## Key Features\n\n- Real-time multiplayer editing\n- Component and variable systems\n- Dev Mode for handoff\n\nBest for: product design, design systems, team collaboration.`,
  },
  {
    id: 304, categoryId: 3, name: 'Framer', firstLetter: 'F', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Framer\n\nA design and prototyping tool that generates production-ready React code.\n\n## Key Features\n\n- Code and visual editing side by side\n- Advanced animations and interactions\n- Publishing directly to the web\n\nBest for: interactive prototypes and no-code websites.`,
  },
  {
    id: 305, categoryId: 3, name: 'Illustrator', firstLetter: 'I', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Adobe Illustrator\n\nThe industry standard for vector graphics and illustration.\n\n## Key Features\n\n- Infinite-resolution vector artwork\n- Powerful pen and shape tools\n- Typography control\n\nBest for: logos, icons, print graphics, illustrations.`,
  },
  {
    id: 306, categoryId: 3, name: 'Penpot', firstLetter: 'P', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Penpot\n\nThe open-source design and prototyping platform — self-hostable alternative to Figma.\n\n## Key Features\n\n- Open-source and free\n- SVG-based design format\n- Real-time collaboration\n\nBest for: privacy-conscious teams, open-source projects.`,
  },
  {
    id: 307, categoryId: 3, name: 'Photoshop', firstLetter: 'P', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Adobe Photoshop\n\nThe world's most powerful raster image editor.\n\n## Key Features\n\n- Non-destructive editing with layers\n- AI-powered tools (Generative Fill)\n- Industry-standard retouching\n\nBest for: photo editing, compositing, web assets.`,
  },
  {
    id: 308, categoryId: 3, name: 'Sketch', firstLetter: 'S', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Sketch\n\nA Mac-native vector design tool that pioneered the modern UI design workflow.\n\n## Key Features\n\n- Symbol and style systems\n- Extensive plugin ecosystem\n- Cloud sharing and collaboration\n\nBest for: macOS-based UI design teams.`,
  },
  {
    id: 309, categoryId: 3, name: 'Webflow', firstLetter: 'W', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Webflow\n\nA visual web design tool that generates clean, production-ready HTML/CSS.\n\n## Key Features\n\n- Visual CSS control\n- Built-in CMS\n- Hosting included\n\nBest for: marketing sites, landing pages, no-code web development.`,
  },
  {
    id: 310, categoryId: 3, name: 'Whimsical', firstLetter: 'W', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Whimsical\n\nA fast, visual workspace for flowcharts, wireframes, and mind maps.\n\n## Key Features\n\n- Flowcharts and diagrams\n- Wireframing tools\n- Mind maps and sticky notes\n\nBest for: ideation, architecture diagrams, quick wireframing.`,
  },
];

interface ItemsApiResponse {
  items: Item[];
  hasMore: boolean;
}

const originalFetch = window.fetch.bind(window);

window.fetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const url = input instanceof Request ? input.url : String(input);

  if (url === '/api/categories') {
    return Promise.resolve(
      new Response(JSON.stringify(MOCK_CATEGORIES), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  }

  if (url.startsWith('/api/items')) {
    const urlObj = new URL(url, 'http://localhost');
    const updatedAfter = urlObj.searchParams.get('updated_after') ?? '1970-01-01T00:00:00.000Z';
    const page = Number(urlObj.searchParams.get('page') ?? '1');
    const limit = Number(urlObj.searchParams.get('limit') ?? '200');

    const filtered = MOCK_ITEMS.filter((item) => item.updatedAt > updatedAfter);
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);
    const hasMore = start + limit < filtered.length;

    const body: ItemsApiResponse = { items: paginated, hasMore };
    return Promise.resolve(
      new Response(JSON.stringify(body), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  }

  return originalFetch(input, init);
};
