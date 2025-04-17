# 🏥 Welcome to PureCare

> **Note**: The image files referenced in this README are placeholders. To properly display the images, replace the placeholder files in the `public` directory with actual image files.

<p align="center">
  <img src="https://github.com/yourusername/purecare/raw/main/public/logo.png" alt="PureCare Logo" width="200"/>
</p>

<p align="center">
  A modern healthcare management system for medical professionals
</p>

## 📋 Project info

**URL**: https://lovable.dev/projects/26729754-f497-49b7-9db9-cbfa136494de

## ✨ Features and Architecture

### 📊 Dashboard Components

PureCare's dashboard implements a modular tab-based interface that provides healthcare professionals with comprehensive insights and functionality through the following components:

1. **📈 OverviewTab** - Central hub that displays key metrics and recent activity across all aspects of the practice
2. **👥 PatientsTab** - Manages patient data with demographic visualizations, growth trends, and alerts for patients requiring attention
3. **📅 AppointmentsTab** - Tracks appointment scheduling, completion rates, and provides upcoming appointment views
4. **💰 FinancialTab** - Presents financial metrics, invoice status, and revenue trends for practice management
5. **💊 ClinicalTab** - Analyzes clinical data including prescriptions and medical records for patient care insights

<p align="center">
  <img src="https://github.com/yourusername/purecare/raw/main/public/dashboard-preview.png" alt="Dashboard Preview" width="800"/>
  <br>
  <em>Dashboard interface with modular components</em>
</p>

Each tab is designed as a separate component to enhance code modularity, maintainability, and reusability. This architecture allows for independent development and testing of features while maintaining a consistent user interface.

### 👥 Patient Management Features

The PatientsTab component includes:

- 📊 **Real-time patient statistics** (total, active, new patients)
- 📈 **Demographic visualization** with interactive charts
- 📉 **Patient growth trends** analysis
- ⚠️ **Patient attention alerts** that highlight inactive patients or those requiring follow-up
- 📋 **Recent patient listing** with quick-access patient profiles

<p align="center">
  <img src="https://github.com/yourusername/purecare/raw/main/public/patients-tab-preview.png" alt="Patients Tab Preview" width="800"/>
  <br>
  <em>Patients Tab with attention alerts and demographic visualizations</em>
</p>

#### Example Component: Patient Attention Alerts

```jsx
{hasAttentionNeeded && (
  <Card className="border-amber-200 bg-amber-50">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
        <AlertTriangle className="h-5 w-5" />
        Patients Needing Attention
      </CardTitle>
      <CardDescription className="text-amber-700">
        {patientsNeedingAttention.length} patient{patientsNeedingAttention.length !== 1 ? 's' : ''} require follow-up
      </CardDescription>
    </CardHeader>
    <CardContent>
      {/* Patient cards with action buttons */}
    </CardContent>
  </Card>
)}
```

## 🛠️ How can I edit this code?

There are several ways of editing your application.

### 🌐 Use Lovable

Simply visit the [Lovable Project](https://lovable.dev/projects/26729754-f497-49b7-9db9-cbfa136494de) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

### 💻 Use your preferred IDE

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

### ✏️ Edit a file directly in GitHub

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

### 🔄 Use GitHub Codespaces

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## 🧰 What technologies are used for this project?

This project is built with:

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" width="50" height="50" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" width="50" height="50" />
  <img src="https://raw.githubusercontent.com/vitejs/vite/main/docs/public/logo.svg" alt="Vite" width="50" height="50" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" alt="Tailwind CSS" width="50" height="50" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" alt="Firebase" width="50" height="50" />
</p>

- ⚡ **Vite** - Fast build tool and development server
- 📘 **TypeScript** - Type safety and enhanced developer experience
- ⚛️ **React** - Component-based UI framework
- 🎨 **shadcn-ui** - Beautifully designed components built with Radix UI and Tailwind
- 💨 **Tailwind CSS** - Utility-first CSS framework
- 🔥 **Firebase** - Authentication, Firestore database
- 📊 **Recharts** - Data visualization library
- 🎭 **Lucide React** - Beautiful & consistent icon set
- 🛣️ **React Router** - Declarative routing for React applications

## 📝 Development Guidelines

When adding new features to the dashboard:

1. 🧩 Keep components modular and focused on a specific domain
2. 🎯 Follow the established design patterns for consistency
3. 📱 Ensure responsive design for all screen sizes
4. ⚠️ Include appropriate error handling and loading states
5. 🔒 Use TypeScript interfaces to ensure type safety

<p align="center">
  <img src="https://github.com/yourusername/purecare/raw/main/public/component-structure.png" alt="Component Structure" width="600"/>
  <br>
  <em>PureCare's modular component architecture</em>
</p>

## 🚀 How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/26729754-f497-49b7-9db9-cbfa136494de) and click on Share -> Publish.

## 🌐 Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
