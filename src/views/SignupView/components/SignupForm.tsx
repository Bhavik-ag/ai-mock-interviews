"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signup } from "../actions";
import Link from "next/link";
import { Social } from "@/components/auth/social";
import FormError from "@/components/ui/form-error";
import { useState } from "react";
import FormSuccess from "@/components/ui/form-success";
import { Icons } from "@/components/ui/icons";

const SignUpSchema = z.object({
  fname: z
    .string()
    .max(15, {
      message: "Try adding a little short name",
    })
    .min(3, {
      message: "Name must contain atleast 3 characters",
    }),
  lname: z.string().max(15, {
    message: "Try adding a little short name",
  }),
  email: z.string().email(),
  password: z
    .string()
    .min(3, { message: "Password must contain atleast 3 characters" })
    .max(20, { message: "Password can'nt be of more than 20+ characters" }),
});

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [success, setSuccess] = useState<null | string>(null);

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      fname: "",
      lname: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: {
    fname: string;
    lname: string;
    email: string;
    password: string;
  }) {
    setSuccess("");
    setError("");

    try {
      setIsLoading(true);
      await signup(values);
      setSuccess("Account created successfully. Please check your email.");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
      form.reset();
    }
  }

  return (
    <Card className="w-full max-w-sm shadow-none bg-transparent border-none">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>Enter your email below to sign up.</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4">
        {error && <FormError message={error} />}
        {success && <FormSuccess message={success} />}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="fname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe@test.com" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="*********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size={"lg"}
              className="w-full flex items-center"
              disabled={isLoading}
            >
              {isLoading && (
                <Icons.spinner className="animate-spin w-4 h-4 mx-2" />
              )}
              Create Account{" "}
            </Button>
          </form>
        </Form>
        <Social />
      </CardContent>
      <CardFooter className="flex-col gap-2 w-full">
        <p className="text-sm">
          Already have an Account? Please{" "}
          <Link href="/auth/login" className="font-semibold hover:underline">
            Log In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
