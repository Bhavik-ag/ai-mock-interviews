"use client";

import { useState, FC } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StepOne from "./components/StepOne";
import StepTwo from "./components/StepTwo";
import { formSchema, FormData } from "./types";
import {
  createUserOnboardingDetails,
  uploadUserFile,
  generateResumeSummary,
} from "@/lib/supabase/fetchers";
import { UserResponse } from "@supabase/supabase-js";
import AuthLayout from "@/components/ui/auth-layout";
import { Icons } from "@/components/ui/icons";
import supabaseBrowserClient from "@/lib/supabase/client";
import Link from "next/link";

const OnboardingView: FC<{
  from: "google" | "email" | undefined;
  user: UserResponse;
}> = ({ from, user }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const defaultValues: FormData = {
    college: "",
    profession: "student",
    passing_year: "",
    company: "",
    job_title: "",
    years_of_experience: "",
    resume: [] as File[],
  };

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues,
  });

  const { handleSubmit, trigger, getValues } = methods;

  const handleNext = async () => {
    const isStepValid = await trigger();
    if (isStepValid && step < 2) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    createUserOnboardingDetails(data); // Non blocking call
    const resume = getValues("resume")[0];

    if (!resume) return;

    try {
      const uploadedResume = await uploadUserFile(resume);

      generateResumeSummary(resume)
        .then((data) => {
          // API Call
          fetch("/api/resume-summary", {
            method: "POST",
            body: JSON.stringify({
              resumeText: data.summary,
              filePath: uploadedResume?.fullPath,
            }),
          });
        })
        .catch(() => {
          console.log("Unable to upload resume");
        });

      // Update user metadata setting onboarding to true
      await supabaseBrowserClient.auth.updateUser({
        data: {
          isOnboarding: true,
        },
      });

      setIsLoading(false);
      router.push("/");
    } catch {
      // TODO: Add a toast
      console.log("Error uploading resume");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    const isFormValid = await trigger();
    if (isFormValid) {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-md py-4 shadow-none rounded-none border-0">
        <FormProvider {...methods}>
          <form className="">
            <CardHeader>
              <CardTitle className="text-2xl mb-2 text-gray-900 dark:text-gray-100">
                Tell us about yourself!
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Step {step} of 2
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 1 && <StepOne />}
              {step === 2 && <StepTwo />}
            </CardContent>
            <CardFooter className="flex justify-between">
              {step > 1 && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={handlePrevious}
                >
                  Previous
                </Button>
              )}
              {step < 2 ? (
                <div className="flex flex-col gap-2 w-full">
                  <Button type="button" onClick={handleNext} className="w-full">
                    Next
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    asChild
                    className="w-full"
                  >
                    <Link href={"/"}>Skip</Link>
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isLoading}
                  className="flex items-center justify-center"
                >
                  {isLoading && (
                    <Icons.spinner className="animate-spin w-4 h-4 mx-2" />
                  )}
                  Submit
                </Button>
              )}
            </CardFooter>
          </form>
        </FormProvider>
      </Card>
    </AuthLayout>
  );
};

export default OnboardingView;
