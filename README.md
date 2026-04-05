# NGO GPS Orienteering App

A Progressive Web App (PWA) for orienteering events organized by NGOs, allowing visitors to walk around and redeem souvenirs with scores earned by visiting checkpoints.

## Features

### Host Features
- Pre-generate random login codes or manage user accounts with security codes
- Preset and manage events (active/inactive, add checkpoints with name/location/description)
- Preset and manage redemption store (product photo/name/score required/description/quantity)
- View all user scores, manual adjustments with security code
- Manual redemption of scores by recording items
- Manage notification board, update messages to users

### User Features
- Register with phone SMS or host-generated codes
- Select event to enter the map with checkpoint page
- Go to spot and click to open QR code scanner
- View current scores
- View notification board
- View redemption page (details only, redemption done manually at counter)

### Optional Features
- GPS-sensitive checkpoint jumping when nearby
- Photo taking and review/submit as checkpoint task
- Multiple choice questions with correct answer display upon submission
- Redemption record updates by host

## Tech Stack
- React with TypeScript
- Vite for build tool
- PWA for mobile compatibility

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure
- `src/components/` - Reusable UI components
- `src/pages/` - Page components for different views
- `src/` - Main app files

## Timeline
- First version completed and deployed
- Testing phase in progress
- Ready for production use

## Future
Ongoing maintenance and feature enhancements for future events.