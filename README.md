
# Flight Search Application

## Overview

This is a full-stack flight search application that allows users to search for flight offers between various locations using the Amadeus API. The project consists of a **React** frontend and a **Spring Boot** backend, both containerized using **Docker**. The backend handles flight search requests, processes responses, and caches dictionary data (such as city and airport information) to optimize performance.

## Features

- Search flights between any two locations using the Amadeus API.
- React frontend for user interaction and display of flight offers.
- Spring Boot backend for handling API requests and responses.
- Cache IATA code information (cities, airports) to reduce API calls.
- Bearer token authentication to connect with the Amadeus API.

## Technologies Used

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Spring Boot, Java, Gradle
- **API**: Amadeus API
- **Containerization**: Docker, Docker Compose
- **Caching**: Spring Cache

## Setup Instructions

### Prerequisites

Make sure you have the following installed on your system:
- Node.js (v22.3.0)
- Java JDK (v22)
- Docker & Docker Compose

### Backend Setup

1. Clone the repository and navigate to the backend directory:
   ```bash
   cd flight-search-backend
   ```

2. Set up the Amadeus API credentials:
   - Create a file named `application.properties` under `src/main/resources`.
   - Add your Amadeus API key and secret:
     ```properties
     amadeus.api.key=your_amadeus_api_key
     amadeus.api.secret=your_amadeus_api_secret
     ```

3. Build and run the backend:

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../flight-search-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the application:
   ```bash
   npm run dev
   ```

## Running with Docker


1. Ensure Docker is installed and running on your machine.

2. Navigate to the project root directory and run the following command to build and start the containers:
   ```bash
   docker-compose up --build
   ```

3. The backend will be accessible at `http://localhost:8080`, and the frontend will be accesible at `http://localhost:3000`.


## Known Issues

- **Caching Issue**: Sometimes, if the cache is not properly invalidated, outdated city and airport information might be used.
- **Performance**: In case of a large number of flights, the backend might experience delays due to multiple API calls.
- **Docker**: Sometimes, when running with Docker, certification errores may occur on HTTPS requests to external APIs.