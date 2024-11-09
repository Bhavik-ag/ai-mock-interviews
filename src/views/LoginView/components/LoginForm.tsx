"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { emailLogin } from "../actions";
import { zodResolver } from "@hookform/resolvers/zod";
import FormError from "@/components/ui/form-error";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Social } from "@/components/auth/social";
import { Icons } from "@/components/ui/icons";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(3, { message: "Password must contain atleast 3 characters" })
    .max(20, { message: "Password can'nt be of more than 20+ characters" }),
});

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: { email: string; password: string }) {
    try {
      setIsLoading(true);
      await emailLogin(values);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm shadow-none bg-transparent border-none">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {error && <FormError message={error} />}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <Button className="w-full" size={"lg"} disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="animate-spin w-4 h-4 mx-2" />
              )}
              Sign in
            </Button>
          </form>
        </Form>
        <Social />
      </CardContent>
      <CardFooter className="flex-col gap-2 w-full">
        <p className="text-sm">
          Don&apos;t have an Account?{" "}
          <Link href="/auth/signup" className="font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
