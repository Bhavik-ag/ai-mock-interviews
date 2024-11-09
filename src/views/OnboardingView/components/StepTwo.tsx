import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const StepTwo: FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="resume">Upload Resume</Label>
        <Input id="resume" type="file" {...register("resume")} />
        {errors.resume && (
          <p className="text-red-500">{errors.resume.message as string}</p>
        )}
      </div>
    </div>
  );
};

export default StepTwo;
