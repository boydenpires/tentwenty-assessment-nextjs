import TimesheetWeekClient from "@/app/components/timesheet/TimesheetWeekClient";

interface PageProps {
  params: Promise<{ weekId: string }>;
}

export default async function TimesheetDetailPage({ params }: PageProps) {
  const { weekId } = await params;

  return <TimesheetWeekClient weekId={weekId} />;
}
