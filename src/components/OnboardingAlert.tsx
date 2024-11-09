import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const OnboardingAlert = () => {
  return (
    <Card x-chunk="dashboard-02-chunk-0">
      <CardHeader className="p-4">
        <CardTitle className="text-lg">1/4 steps</CardTitle>

        <CardTitle className="text-lg">Onboarding Pending!</CardTitle>
        <CardDescription className="text-sm">
          Complete onboarding to give your first mock interview.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
        <Button size="sm" className="w-full" asChild>
          <Link href={"/onboarding"}>Complete Onboarding</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default OnboardingAlert;
