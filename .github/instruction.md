# SecureScribe Web - AI Coding Guidelines

## Architecture Overview
- **Framework**: Next.js 15 with App Router (`app/` directory)
- **Language**: TypeScript with strict type checking
- **UI Library**: Fluent UI React Components (v9) with custom styling via `makeStyles`
- **State Management**:
  - React Query (`@tanstack/react-query`) for server state and API data
  - Redux Toolkit for client-side state
  - Custom contexts for auth, sidebar, and theme
- **Internationalization**: next-intl with Vietnamese (`vi`) and English (`en`) locales
- **Styling**: Tailwind CSS + Fluent UI tokens, CSS modules for component-specific styles

## Key Patterns & Conventions

### 1. Data Fetching with React Query
```typescript
// Query keys are centralized in lib/queryClient.ts
export const queryKeys = {
  projects: ['projects'] as const,
  project: (id: string) => ['projects', id] as const,
  // ... more keys
};

// API services use ApiWrapper for consistent error handling
export const getProjects = async (filters?: ProjectFilter): Promise<{ data: ProjectResponse[]; pagination: any }> => {
  return ApiWrapper.executePaginated(() =>
    axiosInstance.get(`/projects${QueryBuilder.build({ ...filters })}`)
  );
};

// Components use React Query hooks with structured query keys
const { data: projects, isLoading } = useQuery({
  queryKey: queryKeys.projects,
  queryFn: () => getProjects(),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### 2. Component Structure
```typescript
// Server components for data fetching and SEO
export default async function ProjectsPage() {
  const projects = await getProjects(); // Direct API calls in server components
  return <ProjectsClient projects={projects} />;
}

// Client components for interactivity
'use client';
function ProjectsClient({ projects }: { projects: ProjectResponse[] }) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.projects,
    queryFn: () => getProjects(),
    initialData: projects, // SSR hydration
  });

  return (
    <div className={styles.container}>
      {/* Fluent UI components with custom styling */}
    </div>
  );
}
```

### 3. Fluent UI Styling Pattern
```typescript
const useStyles = makeStyles({
  container: {
    maxWidth: '1600px',
    margin: '0 auto',
    ...shorthands.padding('40px', '32px'),
    '@media (max-width: 768px)': {
      ...shorthands.padding('24px', '16px'),
    },
  },
  card: {
    ...shorthands.padding('28px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    boxShadow: tokens.shadow4,
  },
});

function MyComponent() {
  const styles = useStyles();
  return <div className={styles.container}>...</div>;
}
```

### 4. API Layer Architecture
```typescript
// services/api/axiosInstance.ts - Centralized HTTP client
const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/v1`,
});

// Automatic token injection via interceptors
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// services/api/project.ts - Domain-specific API functions
export const getProject = async (id: string, includeMembers = false): Promise<ProjectWithMembers> => {
  return ApiWrapper.execute(() =>
    axiosInstance.get(`/projects/${id}${includeMembers ? '?include_members=true' : ''}`)
  );
};
```

### 5. Internationalization
```typescript
// Use next-intl hooks in components
const t = useTranslations('ProjectDetail');
const tProjects = useTranslations('Projects');

return (
  <Text>{t('projectName')}</Text>
  <Badge>{tProjects('status.active')}</Badge>
);
```

### 6. Error Handling & Toast Notifications
```typescript
// Use custom showToast hook for user feedback
import { showToast } from '@/hooks/useShowToast';

// In React Query mutations
const mutation = useMutation({
  mutationFn: () => archiveProject(projectId),
  onSuccess: () => {
    showToast('success', t('projectArchived'));
    queryClient.invalidateQueries({ queryKey: queryKeys.projects });
  },
  onError: (error: any) => {
    showToast('error', error?.response?.data?.detail || t('archiveError'));
  },
});
```

### 7. Configuration Management
```typescript
// Runtime config loaded from window.__ENV__ (injected by env-config.js)
export function loadRuntimeConfig(): RuntimeConfig {
  if (typeof window !== 'undefined' && window.__ENV__) {
    return window.__ENV__ as RuntimeConfig;
  }
  return getFallbackConfig(); // Server-side fallback
}

// API endpoint configuration
const config = loadRuntimeConfig();
axiosInstance.defaults.baseURL = `${config.API_ENDPOINT}/v1`;
```

## Development Workflow

### Local Development
```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Run linting
yarn lint

# Format code
yarn format
```

### Docker Development
```bash
# Build and run with docker-compose
docker-compose up --build

# Or build manually
docker build -t securescribe-web .
docker run -p 3030:3030 securescribe-web
```

## Common Patterns to Follow

### 1. File Organization
- `app/[locale]/` - Next.js app router pages
- `components/` - Reusable UI components
- `services/api/` - API service functions
- `types/` - TypeScript type definitions
- `hooks/` - Custom React hooks
- `context/` - React context providers
- `lib/` - Utility functions and configurations

### 2. Component Props & Types
```typescript
interface ProjectDetailClientProps {
  projectId: string;
}

export function ProjectDetailClient({ projectId }: ProjectDetailClientProps) {
  // Component logic
}
```

### 3. Query Invalidation Strategy
```typescript
// After mutations, invalidate related queries
queryClient.invalidateQueries({ queryKey: queryKeys.projects });
queryClient.invalidateQueries({ queryKey: queryKeys.project(projectId) });
```

### 4. Responsive Design
```typescript
const useStyles = makeStyles({
  container: {
    ...shorthands.padding('40px', '32px'),
    '@media (max-width: 768px)': {
      ...shorthands.padding('24px', '16px'),
    },
  },
});
```

## Key Files to Reference
- `lib/queryClient.ts` - React Query configuration and query keys
- `services/api/axiosInstance.ts` - HTTP client setup
- `context/ReactQueryProvider.tsx` - Query client provider
- `app/RootLayoutClient.tsx` - Main app layout and providers
- `types/project.type.ts` - Type definitions example
- `components/layout/Header.tsx` - Complex component with multiple patterns

## Performance Considerations
- React Query caching with 5-minute staleTime for most data
- Image optimization with Next.js Image component
- Code splitting with dynamic imports for modals
- Bundle analysis with webpack bundle analyzer (if needed)

## Security Notes
- JWT tokens stored in localStorage with automatic injection
- API requests include Bearer token authentication
- Input sanitization with DOMPurify for rich text content
- CORS headers configured in axios interceptors