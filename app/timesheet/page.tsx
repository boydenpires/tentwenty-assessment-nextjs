import { Suspense } from "react";
import TimesheetView from "@/app/components/TimesheetView";

export default function TimesheetPage() {
  return (
    <Suspense>
      <TimesheetView />
    </Suspense>
  );
}
