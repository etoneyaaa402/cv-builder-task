# CV Builder Project

This is a Next.js project with internationalization (i18n) support (English and Polish).

## Getting Started

### Prerequisites

Ensure you have Node.js installed on your machine.

### Installation

Install the project dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Running the Development Server

To start the development server, run:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Internationalization (i18n)

The application supports English and Polish.

- `/` - English (Default)
- `/en` - English (Redirects to `/`)
- `/pl` - Polish

You can edit the translation files in `messages/en.json` and `messages/pl.json`.

## Project Structure

- `src/app`: Application routes and layouts.
- `src/components`: Reusable UI components.
- `src/i18n`: Internationalization configuration.
- `messages`: Translation JSON files.
- `public`: Static assets.

## Testing

### Run tests

```bash
npm test
```

### Run with coverage

```bash
npm test -- --coverage
```

Coverage is collected from `src/**/*.{ts,tsx}`, excluding generated files and page wrappers. The threshold is **80% line coverage**.

### Writing tests

Use the custom `render` from `src/test-utils.tsx` — it wraps components with all app providers (TanStack Query, next-intl, next-themes):

```tsx
import { render, screen } from "@/test-utils";
import { MyComponent } from "@/components/features/MyComponent";

it("renders", () => {
    render(<MyComponent />);
    expect(screen.getByText("...")).toBeInTheDocument();
});
```

Tests are colocated with source files inside `__tests__/` subdirectories.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
