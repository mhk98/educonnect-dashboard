import React, { useContext, Suspense, useEffect, lazy } from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import routes from "../routes";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ThemedSuspense from "../components/ThemedSuspense";
import { SidebarContext } from "../context/SidebarContext";

const Page404 = lazy(() => import("../pages/404"));

function Layout() {
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  let location = useLocation();

  const role = localStorage.getItem("role");
  const studentId = localStorage.getItem("userId");

  useEffect(() => {
    closeSidebar();
  }, [closeSidebar, location]);

  return (
    <div className="flex flex-col h-screen" style={{ background: "#f1f5f9" }}>
      {/* ── Full-width sticky header ── */}
      <Header />

      {/* ── Sidebar + Main content ── */}
      <div className={`flex flex-1 overflow-hidden ${isSidebarOpen ? "overflow-hidden" : ""}`}>
        <Sidebar />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <Suspense fallback={<ThemedSuspense />}>
            <Switch>
              {routes.map((route, i) =>
                route.component ? (
                  <Route
                    key={i}
                    exact={true}
                    path={`/app${route.path}`}
                    render={(props) => <route.component {...props} />}
                  />
                ) : null
              )}

              {role === "student" ? (
                <Redirect exact from="/app" to={`/app/editprofile/${studentId}`} />
              ) : (
                <Redirect exact from="/app" to="/app/dashboard" />
              )}
              <Route component={Page404} />
            </Switch>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default Layout;
