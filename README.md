# Welcome to PureCare

## Project info

**URL**: https://lovable.dev/projects/26729754-f497-49b7-9db9-cbfa136494de

## Features and Architecture

### Dashboard Components

PureCare's dashboard implements a modular tab-based interface that provides healthcare professionals with comprehensive insights and functionality through the following components:

1. **OverviewTab** - Central hub that displays key metrics and recent activity across all aspects of the practice
2. **PatientsTab** - Manages patient data with demographic visualizations, growth trends, and alerts for patients requiring attention
3. **AppointmentsTab** - Tracks appointment scheduling, completion rates, and provides upcoming appointment views
4. **FinancialTab** - Presents financial metrics, invoice status, and revenue trends for practice management
5. **ClinicalTab** - Analyzes clinical data including prescriptions and medical records for patient care insights

Each tab is designed as a separate component to enhance code modularity, maintainability, and reusability. This architecture allows for independent development and testing of features while maintaining a consistent user interface.

### Patient Management Features

The PatientsTab component includes:

- Real-time patient statistics (total, active, new patients)
- Demographic visualization with interactive charts
- Patient growth trends analysis
- Patient attention alerts that highlight inactive patients or those requiring follow-up
- Recent patient listing with quick-access patient profiles

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/26729754-f497-49b7-9db9-cbfa136494de) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Firebase (Authentication, Firestore)
- Recharts for data visualization
- Lucide React for icons
- React Router for navigation

## Development Guidelines

When adding new features to the dashboard:

1. Keep components modular and focused on a specific domain
2. Follow the established design patterns for consistency
3. Ensure responsive design for all screen sizes
4. Include appropriate error handling and loading states
5. Use TypeScript interfaces to ensure type safety

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/26729754-f497-49b7-9db9-cbfa136494de) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
