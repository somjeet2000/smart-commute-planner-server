# Smart Commute Planner Server

Smart Commute Planner is a travel planning application designed to make your journeys more convenient. It offers a largely no-touch experience, meaning that once set up, the app continuously monitors and provides the best travel options without needing constant input. It helps you plan your travel based on your preferences, including the best timings, routes, and real-time traffic updates.

## Clone Repository

Clone the repository using the Repository [URL](https://github.com/somjeet2000/smart-commute-planner-server.git).

```bash
https://github.com/somjeet2000/smart-commute-planner-server.git
```

## Installation

After cloning the repository, Install the necessary packages.

```node
npm install
```

## Create .env file

After the installation, create a .env file which contains the necessary and secure details, such as MongoDB URL, Google API Key, JWT Secret, App Version, Port details etc.

```node
## Paste your MONGODB_URL/Database_Name
MONGO_URL="<MONGODB_URL>/SmartCommutePlanner"

## Default port is 5000
PORT=5000

## JWT Signature
JWT_SIGN="<YOUR JWT_SIGNATURE>"

## Google Maps API Key
GOOGLE_MAPS_API_KEY="<GOOGLE_MAPS_API_KEY>"

## Application Version
APP_VERSION="v1"
```

## Run the Application

Use NPM to run the application.

```node
npm run server
```
