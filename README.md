# TalentFlow - A Mini Hiring Platform

A comprehensive React application for HR teams to manage jobs, candidates, and assessments. Built with TypeScript, React Router, Tailwind CSS, and local persistence using IndexedDB.

## Features

### Jobs Management
- **Jobs Board**: Paginated list with search, filtering, and sorting
- **CRUD Operations**: Create, edit, archive, and delete jobs
- **Drag & Drop Reordering**: Optimistic updates with rollback on failure
- **Deep Links**: Direct access to job details via `/jobs/:jobId`
- **Validation**: Required fields and unique slug generation

### Candidates Management
- **Virtualized List**: Efficient rendering of 1000+ candidates
- **Advanced Search**: Client-side search by name and email
- **Stage Filtering**: Filter candidates by application stage
- **Candidate Timeline**: Track progression through hiring stages
- **Notes System**: Add and manage candidate notes
- **Stage Transitions**: Move candidates between stages

### Assessments
- **Assessment Builder**: Create job-specific assessments
- **Question Types**: Single choice, multiple choice, text, numeric, file upload
- **Live Preview**: Real-time preview of assessment forms
- **Validation Rules**: Required fields, numeric ranges, character limits
- **Conditional Logic**: Show/hide questions based on previous answers
- **Local Persistence**: All data stored in IndexedDB

## Technical Architecture

### Frontend Stack
- **React 18** with TypeScript
- **React Router** for client-side routing
- **Tailwind CSS** for styling
- **React Window** for virtualization
- **React Hook Form** for form management
- **Lucide React** for icons

### Data Layer
- **Dexie.js** for IndexedDB operations
- **MSW (Mock Service Worker)** for API simulation
- **Local Persistence** with write-through caching

### Key Features
- **Artificial Latency**: 200-1200ms delays simulate real API calls
- **Error Simulation**: 5-10% error rate on write operations
- **Optimistic Updates**: Immediate UI updates with rollback on failure
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx     # Main layout with navigation
│   └── JobModal.tsx   # Job creation/editing modal
├── pages/             # Route components
│   ├── JobsBoard.tsx  # Jobs listing and management
│   ├── JobDetail.tsx  # Individual job view
│   ├── CandidatesList.tsx # Candidates with virtualization
│   ├── CandidateDetail.tsx # Candidate profile and timeline
│   └── AssessmentBuilder.tsx # Assessment creation tool
├── mocks/             # API mocking setup
│   ├── handlers.ts    # MSW request handlers
│   └── browser.ts     # Browser worker setup
├── database.ts        # Dexie schema and types
├── seedData.ts        # Database seeding logic
└── App.tsx           # Main application component
```

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd talentflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Usage

### Jobs Management
1. **View Jobs**: Navigate to the Jobs tab to see all available positions
2. **Create Job**: Click "Create Job" to add a new position
3. **Edit Job**: Click the edit icon on any job to modify details
4. **Archive Job**: Use the archive button to hide jobs from active listings
5. **Reorder Jobs**: Drag and drop jobs to change their display order

### Candidates Management
1. **View Candidates**: Go to the Candidates tab to see all applicants
2. **Search Candidates**: Use the search bar to find specific candidates
3. **Filter by Stage**: Use the dropdown to filter by application stage
4. **View Profile**: Click on any candidate to see their detailed profile
5. **Update Stage**: Use the stage buttons to move candidates through the process
6. **Add Notes**: Click "Add Notes" to record observations about candidates

### Assessments
1. **Create Assessment**: Go to a job detail page and click "Assessment"
2. **Build Questions**: Add sections and questions of various types
3. **Preview Form**: Use the "Show Preview" button to see the candidate's view
4. **Save Assessment**: Click "Save Assessment" to persist your changes

## API Endpoints

The application uses MSW to simulate a REST API with the following endpoints:

### Jobs
- `GET /api/jobs` - List jobs with pagination and filtering
- `POST /api/jobs` - Create a new job
- `PATCH /api/jobs/:id` - Update a job
- `PATCH /api/jobs/:id/reorder` - Reorder jobs

### Candidates
- `GET /api/candidates` - List candidates with search and filtering
- `POST /api/candidates` - Create a new candidate
- `PATCH /api/candidates/:id` - Update candidate stage or notes
- `GET /api/candidates/:id/timeline` - Get candidate timeline

### Assessments
- `GET /api/assessments/:jobId` - Get assessment for a job
- `PUT /api/assessments/:jobId` - Create or update assessment
- `POST /api/assessments/:jobId/submit` - Submit assessment response

## Data Models

### Job
```typescript
interface Job {
  id: string;
  title: string;
  slug: string;
  status: 'active' | 'archived';
  tags: string[];
  order: number;
  description?: string;
  requirements?: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Candidate
```typescript
interface Candidate {
  id: string;
  name: string;
  email: string;
  stage: 'applied' | 'screen' | 'tech' | 'offer' | 'hired' | 'rejected';
  jobId: string;
  appliedAt: Date;
  updatedAt: Date;
  notes?: string;
}
```

### Assessment
```typescript
interface Assessment {
  id: string;
  jobId: string;
  title: string;
  sections: AssessmentSection[];
  createdAt: Date;
  updatedAt: Date;
}
```

## Technical Decisions

### State Management
- **Local State**: React hooks for component-level state
- **Server State**: Direct API calls with MSW mocking
- **Persistence**: IndexedDB with Dexie for offline capability

### Performance Optimizations
- **Virtualization**: React Window for large candidate lists
- **Lazy Loading**: Route-based code splitting
- **Optimistic Updates**: Immediate UI feedback with error handling

### Error Handling
- **Network Errors**: Simulated 5-10% error rate on write operations
- **Validation**: Client-side form validation with error messages
- **Rollback**: Automatic state restoration on failed operations

### Accessibility
- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: WCAG compliant color schemes

## Deployment

The application can be deployed to any static hosting service:

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `build` folder** to your hosting service

3. **Configure routing** for client-side routing support

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.