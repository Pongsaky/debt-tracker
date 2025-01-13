Prompt: Create a Debt Tracker Web Application

Framework & Version:
•	Framework: Next.js
•	Version: 14.1.0

Programming Rules:
1.	Use export default function for .tsx components.
2.	Separate code logically to ensure maintainability.
3.	Use meaningful, concise, and descriptive variable names.
4.	Use TypeScript to enhance type safety and maintainability.

Application Overview:

This is a personal debt tracker web application designed for a single user (me) to manage and monitor debts effectively. The system consists of two main parts: Debt Section and Debtor. The implementation will initially use mock data, as real data will be integrated after the database setup is complete.

Design & Development Guidelines:
1.	Maintain a user-friendly design with clear navigation and intuitive workflows.
2.	Ensure responsiveness for both desktop and mobile views.
3.	Implement efficient state management using Context API.
4.	Use TypeScript interfaces to define the structure of mock data for both Debt Sections and Debtors.
5.	Ensure a proper folder structure for separating:
	•	Components
	•	Styles
	•	Utilities


Part 1: Debt Section

Entity Information:
1.	Name: The name of the debt (e.g., “Spotify CU,” “YouTube Premium”).
2.	Category: Defines the frequency of the debt, such as:
	•	Monthly
	•	Daily
	•	Weekly
	•	Every X days
	•	One-time
3.	Members: The individuals associated with the debt (linked to the Debtor part).
4.	Status: Tracks the progress of the debt (e.g., Completed, In Progress).
5.	Created Date: Automatically set when the section is created.
6.	End Date: Automatically set when the status changes to “Completed.”
7.	Duration: Calculated as the time elapsed from the created date to the end date.

Workflow:
1.	Adding a Section:
	•	Inputs:
	•	Name: Text input.
	•	Category: Dropdown with search.
	•	Members: Multi-selection dropdown with search.
	•	Other fields are automatically filled.
	•	The end date is determined when the status changes to “Completed.”
2.	Member Information Based on Category:
	•	For “One-time” debts: Each member has only an Outstanding Cash input field.
	•	For recurring debts: Members have:
	•	Outstanding Cash (current debt).
	•	Increase Debt: Automatically increases based on the category’s frequency (e.g., monthly).
3.	Completion: Once inputs are filled, the section is created.

Features:
1.	CRUD operations for debt sections (Create, Read, Update, Delete).
2.	View individual debt section details, including:
	•	All defined fields.
	•	Announcement Feature: Generates an informative text summary containing the section name and member details (name and outstanding cash) for easy copying and sharing via chat applications.

Part 2: Debtor

Entity Information:
	1.	English Name: Unique identifier for the debtor.
	2.	Thai Name: To handle cases of duplicate English names.

Features:
1.	Display a list of all debtors.
2.	View individual debtor details, including:
	•	Current debts (organized by debt section).
	•	Historical debts for reference.
3.	CRUD operations for debtors (Create, Read, Update, Delete).
4.	Update debtor details, ensuring it aligns with member information in the Debt Section.

Implementation Details:
•	Mock Data: Use mock data for both debt sections and debtors. Replace with real data once the database setup is complete.

• Debt Section Example:
interface DebtSection {
  id: string;
  name: string;
  category: 'Monthly' | 'Daily' | 'Weekly' | 'Every X days' | 'One-time';
  members: string[];
  status: 'Completed' | 'In Progress';
  createdDate: string;
  endDate: string | null;
  duration: string | null;
}

const mockDebts: DebtSection[] = [
  {
    id: '1',
    name: 'Spotify CU',
    category: 'Monthly',
    members: ['John Doe', 'Jane Smith'],
    status: 'In Progress',
    createdDate: '2025-01-01',
    endDate: null,
    duration: null,
  },
];

• Debtor Example:
interface Debtor {
  id: string;
  englishName: string;
  thaiName: string;
}

const mockDebtors: Debtor[] = [
  { id: '1', englishName: 'John Doe', thaiName: 'จอห์น โด' },
  { id: '2', englishName: 'Jane Smith', thaiName: 'เจน สมิธ' },
];

Folder Structure Example:
src/
├── components/        // UI Components
├── contexts/          // Context API state management
├── interfaces/        // TypeScript interfaces
├── styles/            // Global and component-specific styles
├── utils/             // Utility functions
└── mock/              // Mock data