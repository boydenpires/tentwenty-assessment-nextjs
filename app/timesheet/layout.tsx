import { redirect } from "next/navigation";
import { verifySession } from "@/app/lib/session";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default async function TimesheetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-off-white flex flex-col">
      <Navbar name={session.name} />

      <div className="max-w-7xl w-full mx-auto px-4 md:px-6">
        <main className="pt-6 md:pt-[27px] pb-4">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
