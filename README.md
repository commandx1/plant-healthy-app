# plant-healthy-app

## 🚀 Features

- 🔐 **User Registration & Authentication**
  - Email verification during signup
  - Secure login system using JWT
- 📍 **Location Management**
  - Pick locations via an interactive map
  - Assign custom names to saved spots
- 🪴 **Plant Tracking**
  - Add plants to any of your saved locations
- 🌦️ **Weather Data Insights**
  - Integrates with [Open-Meteo Archive API](https://archive-api.open-meteo.com/v1/archive)
  - Compare humidity and precipitation over selected date ranges

---

## 🧠 Use Case

1. A user signs up and confirms their email.
2. After login, they pick a location from the map and give it a name.
3. They can add plants to each of their saved locations.
4. For each plant, they choose a date range.
5. The app fetches and displays humidity and precipitation data for that period using Open-Meteo.
6. Users can track whether the environment is suitable for the plant — or if it’s secretly crying for help 😢

## ⚙️ Tech Stack

### Frontend
- Vite + React + TypeScript
- leaflet.js
- react-oauth/google
- Ant Design
- framer-motion
- react-chartjs-2
- sass

### Backend
- NestJS (Node.js framework)
- MongoDB (Database)
- nodemailer
- google-auth-library

## 🔐 Authentication Flow

- Email-based registration with verification link
- Secure tokens with JWT
- Secrets are stored in `.env`

## 🌍 Weather Data Integration

We use [Open-Meteo's Archive API](https://archive-api.open-meteo.com/v1/archive) to retrieve:

- `precipitation_sum` (daily rainfall)
- `relative_humidity_2m_mean` (average humidity)

for selected coordinates and dates.

## 🛠️ Setup & Development

1. Clone the monorep
2. Go to backend folder
3. npm install & npm run start:dev
4. Go to frontend folder
5. npm install & npm run dev
