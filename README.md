# Clarity Cash

A minimalist and visually elegant finance tracking application to manage income and expenses with clarity.

[cloudflarebutton]

## Key Features

-   **At-a-Glance Summary:** Instantly view your financial health with prominent cards for Total Income, Total Expenses, and Net Balance.
-   **Visual Overview:** An interactive bar chart visualizes your income versus expenses over the last 30 days, making trends easy to spot.
-   **Detailed History:** A clean, scrollable table lists all recent transactions, with clear visual indicators for income and expenses.
-   **Effortless Entry:** A smooth, slide-in panel allows for quick and easy addition of new transactions with robust form validation.
-   **Minimalist Design:** A clean, modern interface with generous whitespace and a focus on readability and user experience.

## Technology Stack

-   **Frontend:** React, Vite, TypeScript, Tailwind CSS
-   **UI Components:** shadcn/ui, Radix UI
-   **State Management:** Zustand
-   **Forms:** React Hook Form & Zod for validation
-   **Data Visualization:** Recharts
-   **Icons:** Lucide React
-   **Backend:** Hono running on Cloudflare Workers
-   **Data Persistence:** Cloudflare Durable Objects

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Bun](https://bun.sh/) package manager
-   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/clarity-cash.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd clarity-cash
    ```
3.  **Install dependencies:**
    ```bash
    bun install
    ```

## Development

To run the application locally, which starts both the Vite frontend development server and a local Wrangler instance for the backend, use the following command:

```bash
bun dev
```

The application will be available at `http://localhost:3000` (or the next available port).

## Deployment

This project is designed for seamless deployment to the Cloudflare network.

1.  **Login to Wrangler:**
    Authenticate the Wrangler CLI with your Cloudflare account.
    ```bash
    wrangler login
    ```

2.  **Deploy the application:**
    Run the deploy script, which will build the frontend and deploy both the static assets and the worker to your Cloudflare account.
    ```bash
    bun deploy
    ```

Alternatively, you can deploy directly from your GitHub repository using the button below.

[cloudflarebutton]

## Project Structure

-   `src/`: Contains the React frontend application code.
    -   `pages/`: Main application pages.
    -   `components/`: Reusable React components.
    -   `stores/`: Zustand state management stores.
    -   `lib/`: Utility functions and API client.
-   `worker/`: Contains the Hono backend code for the Cloudflare Worker.
    -   `index.ts`: Worker entry point.
    -   `user-routes.ts`: API route definitions.
    -   `entities.ts`: Durable Object entity definitions.
-   `shared/`: Contains TypeScript types and data shared between the frontend and backend.