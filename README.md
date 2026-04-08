# 📅 Wall Calendar App

A responsive and interactive wall calendar built using React.

## Features

- Monthly calendar view with dynamic images
- Smooth month navigation with flip animation
- Day range selection (start, end, and intermediate states)
- Add events for specific dates
- Monthly notes section
- Holiday markers
- Dynamic theme based on month
- Data persistence using localStorage
- Responsive design (mobile + desktop)

## Design Decisions

- Used a single `Date` object to avoid state sync issues between month and year
- Implemented range selection using date comparison logic
- Used localStorage for persistence instead of backend for simplicity
- Added UI enhancements (animations, themes) to improve UX

## Tech Stack

- React (Functional Components + Hooks)
- CSS (custom styling)

## How to Run Locally

```bash
npx create-react-app calendar-app
cd calendar-app
npm install
npm start
