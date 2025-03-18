import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, ClipboardCheck, Truck } from "lucide-react";
import { Login } from "./Login";
import { useAuth } from "../contexts/AuthContext";

export const Home = () => {
  const { user } = useAuth();
  return (
    <div className="flex min-h-screen flex-col ">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Inventory Management System
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    Streamline your inventory operations with our comprehensive
                    management solution for company staff and administrators.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    to="login"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                  >
                    Access Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
              {user ? "" : <Login />}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Key Features
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl">
                  Our inventory management system provides powerful tools to
                  efficiently track and manage your products.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="flex flex-row items-center gap-4 mb-4">
                  <ClipboardCheck className="h-8 w-8 text-gray-900" />
                  <h3 className="font-semibold text-lg">Stock Management</h3>
                </div>
                <p className="text-sm text-gray-500">
                  Track inventory levels in real-time with automated alerts for
                  low stock items.
                </p>
              </div>
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="flex flex-row items-center gap-4 mb-4">
                  <Truck className="h-8 w-8 text-gray-900" />
                  <h3 className="font-semibold text-lg">Order Processing</h3>
                </div>
                <p className="text-sm text-gray-500">
                  Manage purchase orders, receive shipments, and update
                  inventory automatically.
                </p>
              </div>
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="flex flex-row items-center gap-4 mb-4">
                  <BarChart3 className="h-8 w-8 text-gray-900" />
                  <h3 className="font-semibold text-lg">
                    Reporting & Analytics
                  </h3>
                </div>
                <p className="text-sm text-gray-500">
                  Generate detailed reports on inventory turnover, stock value,
                  and product performance.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
