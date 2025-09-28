import Dashboard from "@/components/dashboard/Dashboard";

export default function DashboardPage() {
  return (
    <div className="flex h-full w-full overflow-x-hidden overflow-y-auto">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-10">
        <Dashboard />
      </div>
    </div>
  );
}
