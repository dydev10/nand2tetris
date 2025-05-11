import { 
  createRootRoute,
  createRoute,
  createRouter, 
  Outlet
} from '@tanstack/react-router';

// Import your components
import HomePage from './pages/HomePage';
import AssemblerPage from './pages/AssemblerPage';
import GatesPage from './pages/GatesPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import Layout from './components/Layout';

// Create a root route
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

// Create individual routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const assemblerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/assembler',
  component: AssemblerPage,
});

const gatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/gates',
  component: GatesPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

// Create a catch-all route for 404s
const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFoundPage,
});

// Create and export the router instance
const routeTree = rootRoute.addChildren([
  indexRoute,
  assemblerRoute,
  gatesRoute,
  aboutRoute,
  notFoundRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});