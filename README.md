# The Perfect Buddy - Tennis Community Website
The Perfect Buddy is a web application designed to connect tennis players with compatible playing partners. The platform helps users find tennis buddies based on skill level, schedule availability, and location preferences.

## Features
- **User Authentication**: Secure login and signup system
- **Game Matching**: Browse available tennis games in your area
- **Game Creation**: Create your own tennis matches and invite others
- **Game Requests**: Send and respond to game requests from other players
- **Player Rankings**: Rate your tennis partners after matches(This feature not yet availabel)
- **Skill Matching**: Find players at your skill level
- **Scheduling System**: Find games that fit your availability

## Tech Stack
- **Frontend**: React.js with Tailwind CSS
- **Routing**: React Router
- **Authentication**: Supabase Auth
- **Backend & Database**: Supabase with PostgrSQL
- **Styling**: Tailwind CSS with custom components
- **Build Tool**: Vite

## Getting Started
Prerequisites
- Node.js (version 14 or later recommended)
- npm or yarn package manager

Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/mayuraabhayasinghe/tpb-tennis-community
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
4. Configure your environment variables in the `.env` file
   
5. Start the development server:
   ```bash
   npm run dev
   ```

## User Flow
1. Users can sign up or log in to access the platform
2. On the home page, users can navigate to:
    - Browse available games
    - Send game requests to other players
    - Check player rankings
3. Users can create their own games and invite others to join
4. After playing, users can rate their tennis partners

## Future Enhancements
  - Mobile app version
  - In-app messaging system
  - Court booking integration
  - Tournament organization features
  - Advanced matchmaking algorithm
