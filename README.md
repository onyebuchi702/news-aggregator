# News Aggregator

A modern news aggregator built with Next.js 15 that fetches and displays articles from multiple sources.

## Features

- Article search and filtering by keyword, date, category, and source
- Personalized news feed with customizable sources
- Mobile-responsive design
- Data fetched from multiple news APIs (The Guardian, NewsAPI, New York Times)
- Docker containerization

## Tech Stack

- Next.js 15
- TypeScript
- TailwindCSS
- React Query for data fetching
- Axios for API requests
- Docker for containerization

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- API keys for:
  - The Guardian API
  - NewsAPI
  - New York Times API

### Installation

1. Clone the repository:
```
git clone https://github.com/onyebuchi702/news-aggregator
cd news-aggregator
```

2. Install dependencies:
npm install

3. Create a `.env.local` file in the root directory with your API keys:
```
GUARDIAN_API_KEY=ask-a-developer
GUARDIAN_API_URL=https://content.guardianapis.com/
NEWS_API_KEY=ask-a-developer
NEWS_API_URL=https://newsapi.org/v2/
NYT_API_KEY=ask-a-developer
NYT_API_SECRET=ask-a-developer
NYT_API_URL=https://api.nytimes.com/svc/search/v2/
NEXT_PUBLIC_BASE_API_URL=http://localhost:3001
```

4. Run the development server:
```
npm run dev
```

5. Open [http://localhost:3001](http://localhost:3001) in your browser to see the result.

## Docker Setup

1. Build and run the Docker container:
```
brew install docker-compose
docker-compose up --build
```

2. Access the application at [http://localhost:3001](http://localhost:3001)

## Project Structure

```
news-aggregator/
├── src/
│   ├── app/               # Next.js app router
│   ├── components/        # React components
│   │   ├── ui/            # UI components
│   ├── lib/               # enums, api configs & hooks
│   ├── services/          # API services
│   │   ├── api/           # API configuration
│   └── types/             # TypeScript type definitions
├── public/                # Static assets
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose configuration
└── .dockerignore          # Docker ignore file
```