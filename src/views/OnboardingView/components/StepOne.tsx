import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const StepOne: FC = () => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();
  const profession = watch("profession");

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="profession">Profession</Label>
        <Select onValueChange={(value) => setValue("profession", value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select profession" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="working_professional">
              Working Professional
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.profession && (
          <p className="text-red-500">{errors.profession.message as string}</p>
        )}
      </div>
      {profession === "student" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="college">School/University Name</Label>
            <Input id="college" {...register("college")} />
            {errors.college && (
              <p className="text-red-500">{errors.college.message as string}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="passing_year">Current Year of Study</Label>
            <Input id="passing_year" {...register("passing_year")} />
            {errors.passing_year && (
              <p className="text-red-500">
                {errors.passing_year.message as string}
              </p>
            )}
          </div>
        </>
      )}
      {profession === "working_professional" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Input id="company" {...register("company")} />
            {errors.company && (
              <p className="text-red-500">{errors.company.message as string}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="job_title">Job Title</Label>
            <Input id="job_title" {...register("job_title")} />
            {errors.job_title && (
              <p className="text-red-500">
                {errors.job_title.message as string}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="years_of_experience">Years of Experience</Label>
            <Input
              id="years_of_experience"
              {...register("years_of_experience")}
            />
            {errors.years_of_experience && (
              <p className="text-red-500">
                {errors.years_of_experience.message as string}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default StepOne;
