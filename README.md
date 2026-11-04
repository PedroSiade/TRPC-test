# How to run locally

## Prerequisites

- **Node.js:** **20+** (LTS recommended).

## Installation

From the project root:

```bash
npm i
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in the browser.

## In-memory data

Tasks live in an **in-memory** store on the server (no database). Restarting `dev` resets the state to the initial development seed.

# Technical Decisions and Architecture

Regarding the project, I tried to follow the given requirements as closely as possible and implement everything requested.

I haven't worked with **tRPC** before, but I've spent most of my career working with Next.js. In medium-sized projects, one approach that has worked particularly well for me is **Feature-Based Architecture (FBA)**. So, I decided to combine these concepts into a monolithic application using Next.js, tRPC, and a feature-based structure.

## Architecture and tRPC

My main goal with tRPC was to take advantage of its end-to-end type safety while keeping the frontend communication simple. I wanted procedures to feel as close as possible to calling local functions, without having to manually maintain API contracts or duplicate types.

I also implemented a centralized error-handling approach on the backend. The idea was to catch application-level errors and map them to the appropriate tRPC errors. For example, a `NotFoundError` from the application layer could be mapped to a `NOT_FOUND` tRPC error.

I kept this implementation relatively simple, but the idea is to have a single place to handle and standardize errors. As the application grows, this approach could be extended to support more error types or evolved into a dedicated error-handling class.

## Data Fetching and Next.js

For input validation, I used **Zod**, while tRPC and TanStack Query handle communication and server-state management.

On the frontend, I focused on making good use of Next.js App Router features, particularly Server Components, client/server separation, and data prefetching.

For example, pages such as `tasks/[id]` are fully server-rendered, since they don't require significant client-side interaction. On the other hand, the task listing has interactive elements, so I used server-side prefetching to provide the initial data and then let TanStack Query manage client-side interactions.

I consider this approach particularly important in modern Next.js applications because it helps balance initial rendering, user experience, and client-side interactivity.

I also tried to keep the App Router layer thin, using its native responsibilities for layouts, loading states, error boundaries, and routing, rather than placing business logic directly inside route files.

## Feature-Based Architecture

I organized the frontend's business logic around features and entities. This might seem like a little overengineering for a project of this size, but it's an architectural approach I've found useful in practice.

The main benefit is separating responsibilities and keeping related components, hooks, types, and business logic close to each other. As the application grows, this makes it easier to locate code, maintain features independently, and avoid having everything concentrated in generic folders.

Of course, the structure should evolve according to the application's actual complexity. I don't think every project needs this level of organization from the beginning.

The `src` tree is split by responsibility:

```text
src/
├── app/                 # App Router: routes, layouts, loading, and error boundaries
│   ├── api/trpc/[trpc]  # HTTP entry point for tRPC
│   └── tasks/           # thin route files that compose feature pages
├── features/tasks/      # task feature: pages, components, hooks, schemas, and types
├── trpc/                # client, server caller, routers, and domain-error mapping
├── server/              # in-memory task repository
├── components/          # shared UI and layout
├── lib/                 # shared errors
└── utils/               # small helpers
```

- **`app`** owns routing only. A page such as `tasks/[id]` fetches through the server caller and renders a feature component. Loading and error files stay next to the route.
- **`features/tasks`** holds everything that belongs to the task domain: screens, hooks, the form reducer, Zod schemas, and types. `index.ts` is the public surface other layers import from.
- **`trpc`** is the contract between UI and server. Routers live here, the client and the server caller share the same procedures, and application errors are mapped to tRPC codes in one place.
- **`server`** holds data access. The repository keeps tasks in memory and does not know about routes or React. I'm not fully convinced about this folder, though. It is fine for a project this small, but in a medium-sized application I would organize persistence differently, closer to the feature, instead of a generic top-level `server` directory.
- **`components`**, **`lib`**, and **`utils`** are shared pieces that are not specific to a single feature.

## Form Management

Initially, I considered using React Hook Form, but I decided to implement the form state management using `useReducer` instead.

My intention was to keep the solution lightweight while centralizing the form's state transitions and business logic in a dedicated reducer (`taskFormReducer`).

The reducer handles responsibilities such as setting field values, initializing and resetting the form, and managing validation errors. This gave me more control over the form's behavior without introducing another dependency for a relatively simple use case.

## User Feedback

I also used a centralized toast mechanism to provide feedback for asynchronous operations, such as creating or deleting tasks.

I think consistent feedback is important for making the application easier to understand, especially when communicating with the backend. Users should always have a clear indication of whether an operation succeeded or failed.

## Final Considerations

These were the main technical decisions I made during the test.

My intention was to demonstrate not only that I could implement the requested features, but also that I could think about the application's maintainability and how its architecture could evolve over time.

At the same time, I tried to avoid unnecessary complexity. I believe in keeping things as simple as possible while still establishing a good foundation for future development.

Some decisions might be more than what this particular test strictly requires, but they reflect architectural approaches I've used successfully in real projects and wanted to demonstrate in this implementation.
