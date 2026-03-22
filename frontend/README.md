# UDT Course Manager: Frontend

A high-performance **React 19** frontend for the Course Management System, powered by **Vite 8** and **Material UI 7**.

---

## Standalone Execution

To run the frontend independently (outside of Docker), follow the steps below:

### 1. Installation
Install the required dependencies using NPM.
```bash
npm install
```

### 2. Configuration
The frontend communicates with the backend via the `API_URL`. Ensure your `.env` contains:
```javascript
API_URL=http://localhost:3001
```

### 3. Startup
Start the development server with Vite:
```bash
npm start
```

The application will be served at **[http://localhost:3000](http://localhost:3000)**.

---

## 🛠️ Main Tech Stack
- **React 19**: Modern component architecture
- **Vite 8**: Rapid development experience and optimized builds
- **Redux Toolkit**: Centralized state management
- **Material UI 7**: Beautiful and responsive design components
- **Framer Motion 12**: Micro-animations for a fluid user interface

---

## 🚢 Build for Production
To generate a production bundle:
```bash
npm build
```
The optimized files will be generated in the `dist` directory.

---

## 🧪 Testing

The frontend incorporates blazing fast headless unit testing initialized via **Vitest** and **React Testing Library**. Tests are structured alongside Redux slices and components under the `src/__tests__` directory.

### Available Test Scripts:

```bash
# Execute unit tests
npm run test:unit

# Generate code coverage report
npm run test:coverage
```
