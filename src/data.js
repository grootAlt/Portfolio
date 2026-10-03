const dv = (n, v = "original") => `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${n}/${n}-${v}.svg`;

export const profile = {
  name: "Shankar A R",
  role: "Senior Full Stack Developer",
  location: "Nagercoil, Tamil Nadu, India",
  email: "arshankaralwar@gmail.com",
  phone: "+91 9363016522",
  linkedin: "https://www.linkedin.com/in/shankar-azhwar",
  github: "https://github.com/grootAlt",
  typed: ["scalable web apps.", "high-performance APIs.", "data-heavy platforms.", "AI-integrated products."],
  about:
    "Senior Full Stack Developer with 4 years of experience building scalable, performance-optimized web applications. I own features from requirements to deployment, tune APIs and databases, integrate machine learning services, and mentor developers through code reviews and technical planning.",
};

export const stats = [
  { v: "4+", l: "Years of experience" },
  { v: "Billions", l: "Records & events processed" },
  { v: "40+", l: "Brand & retailer relationships" },
  { v: "~24", l: "Engineers collaborated with" },
];

export const skills = {
  Frontend: [
    { n: "React.js", i: dv("react") }, { n: "Next.js", i: dv("nextjs") }, { n: "TypeScript", i: dv("typescript") },
    { n: "JavaScript (ES6+)", i: dv("javascript") }, { n: "HTML5", i: dv("html5") }, { n: "CSS3", i: dv("css3") },
    // Uncomment to show:
    // { n: "Angular.js", i: dv("angularjs") },
    // { n: "Vue.js", i: dv("vuejs") },
  ],
  Backend: [
    { n: "Node.js", i: dv("nodejs") }, { n: "Express.js", i: dv("express") }, { n: "NestJS", i: dv("nestjs") },
    { n: "PHP", i: dv("php") }, { n: "Laravel", i: dv("laravel") }, { n: "Kafka", i: dv("apachekafka") },
    { n: "Redis", i: dv("redis") },
  ],
  Databases: [
    { n: "MongoDB", i: dv("mongodb") }, { n: "PostgreSQL", i: dv("postgresql") }, { n: "MySQL", i: dv("mysql") },
  ],
  "Cloud & DevOps": [
    { n: "AWS", i: dv("amazonwebservices", "original-wordmark") }, { n: "Azure", i: dv("azure") },
    // Uncomment to show:
    // { n: "GCP", i: dv("googlecloud") },
    { n: "Docker", i: dv("docker") }, { n: "CI/CD", i: dv("githubactions") },
    { n: "Git", i: dv("git") }, { n: "GitHub", i: dv("github") },
  ],
};

export const concepts = [
  "REST API Design", "Microservices", "Authentication (JWT)", "RBAC", "API Integration", "Scalability",
  "Performance Optimization", "Query Optimization", "Schema Design", "Large-Scale Data Processing",
  "Machine Learning Integration", "Agile / Scrum", "Code Review", "Technical Planning", "Mentoring",
  "Production Support", "Incident Resolution",
];

export const projects = [
  {
    name: "Footprints AI",
    tag: "Retail Media Platform",
    url: "https://www.footprints-ai.com",
    domain: "footprints-ai.com",
    role: "Senior Developer",
    color: "#7c5cff",
    blurb:
      "An AI-powered omnichannel retail media platform that turns in-store and online shopper behaviour into targetable audiences, helping retailers launch and scale their own retail media networks.",
    points: [
      "Built campaign, audience-targeting, analytics, reporting and workflow modules across frontend and backend.",
      "Engineered data-processing workflows handling billions of records and events across brand and retailer partnerships.",
      "Implemented user tracking, audience segmentation and campaign delivery features.",
      "Worked within a ~24-member engineering team supporting 40+ brand and retailer relationships.",
    ],
    stack: ["React.js", "Node.js", "TypeScript", "MongoDB", "PostgreSQL"],
    facts: ["Based in Bucharest, Romania", "Retail media for CEE & beyond", "Closed-loop attribution"],
  },
  {
    name: "Instant.ro",
    tag: "Romanian Automotive Platform",
    url: "https://instant.ro",
    domain: "instant.ro",
    role: "MERN Stack Developer · 2022 – 2023",
    color: "#19c3a6",
    blurb:
      "Romania's AI-driven marketplace for buying and selling used cars. It proposes a fair price in near real time and supports instant sale, dealer auction and classic listing flows.",
    points: [
      "Developed reusable React components and RESTful API endpoints for core listing and transaction workflows.",
      "Integrated third-party services and improved page load speed and API response times across frontend and backend.",
    ],
    stack: ["React.js", "Node.js", "Express.js", "JavaScript", "TypeScript", "REST APIs"],
    facts: ["AI price estimates (~96% accuracy)", "Compared against ~2M reference listings", "Dealer partnerships across Romania"],
  },
  {
    name: "Crawler AI",
    tag: "Web Data Extraction Platform",
    url: "",
    domain: "",
    role: "Backend Developer",
    color: "#ff8a3d",
    blurb:
      "An automated crawling platform that collects automotive listings from many websites, normalises them into structured data and serves it to downstream ML and ad-publishing workflows.",
    points: [
      "Built a Laravel backend that automatically crawls automotive websites and stores structured data in MySQL.",
      "Developed scraping and parsing modules for varying site structures.",
      "Exposed data through REST APIs to downstream ML and ad-publishing workflows.",
      "Monitored crawl runs to maintain data reliability.",
    ],
    stack: ["PHP", "Laravel", "MySQL", "REST APIs"],
    facts: ["Multi-site parsers", "Structured, queryable output", "Feeds ML pipelines"],
  },
];

export const experience = {
  title: "Senior Full Stack Developer",
  company: "App Innovation Technology",
  period: "Jul 2022 – Jun 2026",
  note: "Promoted from MERN Stack Developer to Senior Developer",
  points: [
    "Built and maintained Node.js, Express.js and NestJS services and RESTful APIs in TypeScript, plus React.js and Next.js interfaces.",
    "Designed and optimised scalable schemas in MongoDB, PostgreSQL and MySQL for complex application workflows.",
    "Improved API and database performance, reducing response times and stabilising production releases.",
    "Collaborated on frontend and backend architecture and technical planning for scalable, reusable modules.",
    "Conducted code reviews, guided debugging and mentored developers to maintain high engineering standards.",
    "Owned the full feature lifecycle: requirements, development, deployment, production support and incident resolution.",
    "Integrated machine learning services and native mobile applications with web and backend platforms.",
  ],
};

export const education = {
  degree: "B.E., Computer Science and Engineering",
  school: "James College of Engineering and Technology, Nagercoil",
  period: "2016 – 2020",
};

export const hobbies = [
  { key: "swim", name: "Swimming", icon: "🏊", line: "Laps that reset the mind", color: "#3ba7ff" },
  { key: "chess", name: "Chess", icon: "♟️", line: "Thinking a few moves ahead", color: "#a995ff" },
  { key: "cricket", name: "Cricket", icon: "🏏", line: "Team spirit on the pitch", color: "#2ee59d" },
  { key: "read", name: "Reading", icon: "📚", line: "Tech, ideas and stories", color: "#ffb547" },
  { key: "game", name: "Gaming", icon: "🎮", line: "Strategy and quick reflexes", color: "#ff5ca8" },
];
