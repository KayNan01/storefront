import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { useDemoStore } from "@/stores/demoStore";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  staticData: { sitemap: "exclude-subtree" },
  beforeLoad: () => {
    if (!useDemoStore.getState().user) throw redirect({ to: "/auth" });
  },
  component: () => <Outlet />,
});
