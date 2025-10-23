import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";

export const PATHS = {
  INDEX: "/",
  HOME: "/home",
  VERIFY: "/verify",
  SEND_INFO: "/send-info", // Thêm route mới
  TIMEACTIVE: "/business-team",
};

const Index = lazy(() => import("@/pages/index"));
const Home = lazy(() => import("@/pages/home"));
const Verify = lazy(() => import("@/pages/verify"));
const SendInfo = lazy(() => import("@/pages/send-info")); // Import SendInfo
const NotFound = lazy(() => import("@/pages/not-found"));

const withSuspense = (Component) => (
  <Suspense fallback={<div></div>}>{Component}</Suspense>
);

const router = createBrowserRouter([
  {
    path: PATHS.INDEX,
    element: withSuspense(<NotFound />),
  },
  {
    path: PATHS.HOME,
    element: withSuspense(<Home />),
  },
  {
    path: PATHS.VERIFY,
    element: withSuspense(<Verify />),
  },
  {
    path: PATHS.SEND_INFO, // Thêm route SendInfo
    element: withSuspense(<SendInfo />),
  },
  {
    path: `${PATHS.TIMEACTIVE}/*`,
    element: withSuspense(<Index />),
  },
  {
    path: "*",
    element: withSuspense(<NotFound />),
  },
]);

export default router;