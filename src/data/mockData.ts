import { Subject, Task, ScheduleSlot, DailyGoal } from '../types';

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub-mern',
    name: 'MERN Stack',
    code: 'CS-401',
    category: 'Web Engineering',
    targetHours: 45,
    completedHours: 0,
    color: 'emerald',
    description: 'MongoDB database schema, Express REST API routing, React hooks & architecture, Node.js asynchronous runtime.',
    topics: [
      { id: 't1', title: 'Express Middleware & Routing', completed: false },
      { id: 't2', title: 'MongoDB Aggregation Pipeline', completed: false },
      { id: 't3', title: 'JWT Authentication & HttpOnly Cookies', completed: false },
      { id: 't4', title: 'React Context API & Custom Hooks', completed: false },
      { id: 't5', title: 'Fullstack Deployment on Render/Vercel', completed: false },
    ],
  },
  {
    id: 'sub-py',
    name: 'Python',
    code: 'CS-302',
    category: 'Programming & Data',
    targetHours: 40,
    completedHours: 0,
    color: 'blue',
    description: 'Object-Oriented Python, generators, decorators, memory model, and FastAPI asynchronous microservices.',
    topics: [
      { id: 'p1', title: 'OOP: Dunder Methods & Inheritance', completed: false },
      { id: 'p2', title: 'Decorators, Generators & Iterators', completed: false },
      { id: 'p3', title: 'Asyncio & Concurrency Foundations', completed: false },
      { id: 'p4', title: 'FastAPI Dependency Injection & Pydantic', completed: false },
      { id: 'p5', title: 'Pytest & Integration Test Suites', completed: false },
    ],
  },
  {
    id: 'sub-java',
    name: 'Java',
    code: 'CS-305',
    category: 'Core Systems',
    targetHours: 35,
    completedHours: 0,
    color: 'amber',
    description: 'Java Collections framework, JVM internals, garbage collection tuning, multithreading, and executor services.',
    topics: [
      { id: 'j1', title: 'Collections: HashMap & ConcurrentHashMap', completed: false },
      { id: 'j2', title: 'JVM Memory: Heap, Stack & Metaspace', completed: false },
      { id: 'j3', title: 'Thread Synchronization & ReentrantLock', completed: false },
      { id: 'j4', title: 'Java 17 Streams & Functional Interfaces', completed: false },
    ],
  },
  {
    id: 'sub-mobile',
    name: 'Mobile Development',
    code: 'CS-310',
    category: 'Application Engineering',
    targetHours: 30,
    completedHours: 0,
    color: 'indigo',
    description: 'Cross-platform native bridges, React Native component lifecycle, offline SQLite sync, and navigation patterns.',
    topics: [
      { id: 'm1', title: 'Native Bridge & Hermes Engine Architecture', completed: false },
      { id: 'm2', title: 'React Navigation & Deep Linking', completed: false },
      { id: 'm3', title: 'Offline-First SQLite Storage & MMKV', completed: false },
      { id: 'm4', title: 'Push Notifications & Background Jobs', completed: false },
    ],
  },
  {
    id: 'sub-oose',
    name: 'OOSE',
    code: 'CS-415',
    category: 'Software Architecture',
    targetHours: 30,
    completedHours: 0,
    color: 'violet',
    description: 'Object-Oriented Software Engineering: SOLID principles, GoF design patterns, UML diagrams, and clean architecture.',
    topics: [
      { id: 'o1', title: 'SOLID Design Principles with Code Examples', completed: false },
      { id: 'o2', title: 'Factory, Observer & Strategy Patterns', completed: false },
      { id: 'o3', title: 'UML Class, Sequence & Activity Diagrams', completed: false },
      { id: 'o4', title: 'Domain-Driven Design (DDD) Aggregates', completed: false },
    ],
  },
  {
    id: 'sub-dc',
    name: 'Distributed Computing',
    code: 'CS-480',
    category: 'Advanced Systems',
    targetHours: 40,
    completedHours: 0,
    color: 'rose',
    description: 'CAP Theorem, consensus algorithms (Raft/Paxos), event-driven microservices, gRPC, and distributed caching.',
    topics: [
      { id: 'd1', title: 'CAP Theorem & PACELC Trade-offs', completed: false },
      { id: 'd2', title: 'Raft Consensus: Leader Election & Log Replication', completed: false },
      { id: 'd3', title: 'Consistent Hashing in Dynamo-style Stores', completed: false },
      { id: 'd4', title: 'Eventual Consistency & Vector Clocks', completed: false },
      { id: 'd5', title: 'gRPC Protobuf Service Definition', completed: false },
    ],
  },
];

// All dummy tasks, timetable slots, and goals removed for clean production state
export const INITIAL_TASKS: Task[] = [];

export const INITIAL_SCHEDULE: ScheduleSlot[] = [];

export const INITIAL_GOALS: DailyGoal[] = [];
