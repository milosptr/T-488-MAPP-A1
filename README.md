# Toodler

## Description

Toodler is a Kanban-style task management application built with React Native and Expo. This mobile application enables users to organize their projects using boards, lists, and tasks following the Kanban methodology. Developed as part of the Umbrella agency's project management initiative, Toodler allows users to create multiple boards for different projects, organize tasks within customizable lists, and track progress by moving tasks between lists. The application demonstrates modern mobile development practices using Expo Router for file-based navigation and TypeScript for type safety.

## Table of Contents

- Installation
- Features
- Technologies Used
- Platform Support
- Project Structure
- Setup Instructions
- Running the App
- Testing
- Screenshots
- Known Issues
- Future Improvements

## Running the App

### Navigate to project directory

`cd MAPP`

### Install dependencies

`npm install`

### Running the App

`npm start`

This will start the Expo development server. You can then:

- Press `i` to run on iOS simulator
- Press `a` to run on Android emulator
- Scan the QR code with Expo Go app on your physical device

**Additional platform-specific commands:**

`npm run ios` - Run directly on iOS simulator

`npm run android` - Run directly on Android emulator

`npm run web` - Run on web browser

## Features

The application is designed to implement the following features based on assignment requirements:

### Boards (25%)

- View a list of all boards within the Board view
- Create a new board with name, optional description, and thumbnail photo
- Delete a board

### Lists (25%)

- View all lists associated with a specific board
- Create a new list with name, optional color, and board reference
- Delete a list

### Tasks (30%)

- View all tasks associated with a specific list
- Create a new task with name, description, and completion status
- Move tasks from one list to another (drag and drop functionality)

### Extras (20%)

- Additional features may be implemented beyond the core requirements for enhanced functionality and higher grades

**Current Status:** The project is in early development phase. Data structures and type definitions are established, and the Expo Router navigation setup is in place.

## Technologies Used

- React Native (v0.81.5)
- Expo (~54.0.25)
- Expo Router (~6.0.15) - File-based routing and navigation
- React Navigation (v7.1.8)
- TypeScript (~5.9.2)
- State Management Solution: In-memory data management (data stored locally in `data/data.ts`)
- Expo Vector Icons (v15.0.3)
- React (v19.1.0)
- ESLint (v9.39.1) - Code quality and linting
- Prettier (v3.6.2) - Code formatting
- React Native Reanimated (v4.1.1) - Animations
- React Native Safe Area Context (v5.6.0) - Safe area handling

## Platform Support

### Primary Development Platform

- Primary Platform: iOS
- Test Device: iOS Simulator
- OS Version: Latest iOS version supported by Expo SDK 54

### Secondary Platform Testing

- Secondary Platform: Android
- Test Device: Android Emulator
- OS Version: Latest Android version supported by Expo SDK 54
- Testing Status: Early development phase - both platforms under active development
- Known Platform-Specific Issues: None at this time

### Platform-Specific Features

No platform-specific features at this time. The application uses React Native's cross-platform capabilities to provide a consistent experience across both iOS and Android.

## Project Structure

```
MAPP/
├── app/                          # Expo Router screens and navigation
│   ├── (tabs)/                   # Tab-based navigation screens
│   │   ├── _layout.tsx          # Tab layout configuration
│   │   ├── index.tsx            # First tab screen
│   │   └── two.tsx              # Second tab screen
│   ├── _layout.tsx              # Root layout
│   ├── +html.tsx                # Custom HTML wrapper
│   ├── +not-found.tsx           # 404 error screen
│   └── modal.tsx                # Modal screen
├── assets/                       # Static assets (images, fonts)
│   ├── fonts/                   # Custom fonts
│   └── images/                  # App icons and images
├── components/                   # Reusable React components
│   ├── EditScreenInfo.tsx
│   ├── ExternalLink.tsx
│   ├── StyledText.tsx
│   ├── Themed.tsx
│   └── useColorScheme.ts
├── constants/                    # App-wide constants
│   └── Colors.ts                # Color definitions
├── data/                         # Data layer
│   └── data.ts                  # Pre-populated sample data
├── types/                        # TypeScript type definitions
│   └── data.ts                  # Data model interfaces (Board, List, Task)
├── app.json                      # Expo configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── .eslintrc.js                 # ESLint configuration
└── .prettierrc.js               # Prettier configuration
```

**Key Directory Explanations:**

- `/app` - Contains all screens using Expo Router's file-based routing system
- `/components` - Reusable UI components used across multiple screens
- `/constants` - Global constants like color schemes
- `/data` - Pre-populated data that serves as the in-memory database
- `/types` - TypeScript interfaces and type definitions for type safety

**Data Models (defined in `types/data.ts`):**

**Board:**

- id: number
- name: string
- description: string (optional for user input but present in object)
- thumbnailPhoto: string

**List:**

- id: number
- name: string
- color: string (hex color code, optional for user to set but present in object)
- boardId: number (reference to parent board)

**Task:**

- id: number
- name: string
- description: string
- isFinished: boolean (completion status)
- listId: number (reference to parent list)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher, v18+ recommended)
- npm or yarn
- Expo CLI (optional but recommended): `npm install -g expo-cli`
- Xcode (for iOS development, macOS only)
- Android Studio (for Android development)

### Environment Setup

1. Install React Native dependencies
    - Ensure Node.js and npm are installed: `node --version` and `npm --version`
    - Install Expo CLI globally (optional): `npm install -g expo-cli`

2. Configure development environment

    **For iOS (macOS only):**
    - Install Xcode from Mac App Store
    - Install Command Line Tools: `xcode-select --install`
    - Accept Xcode license: `sudo xcodebuild -license accept`

    **For Android:**
    - Install Android Studio from [developer.android.com](https://developer.android.com/studio)
    - Open Android Studio and install Android SDK (API 33 or higher recommended)
    - Configure ANDROID_HOME environment variable

3. Set up emulators/simulators

    **iOS Simulator (macOS):**
    - Open Xcode > Preferences > Components
    - Download desired iOS simulator versions

    **Android Emulator:**
    - Open Android Studio > AVD Manager
    - Create a new virtual device (Pixel 5 recommended)
    - Select a system image (API 33 or higher)
    - Launch the emulator

4. Clone/download the project and install dependencies

    ```bash
    cd MAPP
    npm install
    ```

5. Start the development server
    ```bash
    npm start
    ```

**Additional useful commands:**

- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Automatically fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Testing

The project includes a basic testing setup using React Test Renderer.

**Run tests:**

```bash
npm test
```

**Current test coverage:**

- Sample test for `StyledText` component located in `components/__tests__/StyledText-test.js`

**Note:** Additional tests will be added as features are implemented. Students are encouraged to write unit tests for components and integration tests for data operations.

## Screenshots

Screenshots will be added as features are implemented during development.

_Placeholder for future screenshots showing:_

- Boards list view
- Board detail view with lists
- Task list view
- Create board modal
- Create list modal
- Create task modal
- Task movement between lists

## Known Issues

No known issues currently.

**Important Note:**

- **Data Persistence:** All data is stored in memory using pre-populated data from `data/data.ts`. Any changes made during runtime (creating, updating, or deleting boards, lists, or tasks) will be lost when the application restarts. This is intentional for the current assignment phase as specified in the requirements. Each time the app starts, it reloads the original data from the data file.

## Future Improvements

### Core Feature Implementation

- Complete CRUD operations for Boards (Create, Read, Update, Delete)
- Complete CRUD operations for Lists
- Complete CRUD operations for Tasks
- Implement drag-and-drop functionality for moving tasks between lists
- Add edit functionality for boards, lists, and tasks

### Data Persistence

- Implement AsyncStorage for persistent local storage
- Add data export/import functionality (JSON format)
- Consider backend API integration for cloud synchronization

### User Experience Enhancements

- Add animations and smooth transitions
- Implement search and filter functionality for boards and tasks
- Enhance dark mode support (currently basic theme support exists)
- Improve accessibility features (screen reader support, larger touch targets)
- Add task sorting options (by name, date, priority)

### Additional Features (Extras)

- Task due dates and reminders with push notifications
- Task priority levels (high, medium, low)
- User authentication and multiple user profiles
- Board sharing and collaboration features
- Activity history and audit log
- Task comments and discussions
- File attachments to tasks
- Board templates for common project types
- Calendar integration
- Analytics and productivity insights
- Offline mode with sync when online

### Code Quality and Performance

- Increase test coverage (unit and integration tests)
- Implement CI/CD pipeline
- Add performance monitoring
- Optimize rendering for large datasets
- Implement virtualized lists for better performance
- Add error boundaries for better error handling

---

**Project Assignment:** This project is developed as part of an academic assignment for the Umbrella agency project management initiative.

**Last Updated:** November 2025
