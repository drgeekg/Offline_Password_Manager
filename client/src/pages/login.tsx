import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { Redirect, Link } from "wouter";
import { useState } from "react";

export default function LoginPage() {
  const { user, loginMutation } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const loginForm = useForm({
    defaultValues: { username: "", password: "" },
    resolver: zodResolver(insertUserSchema),
  });

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...loginForm}>
                <form
                  onSubmit={loginForm.handleSubmit((data) => loginMutation.mutate(data))}
                  className="space-y-4"
                >
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password" 
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Master Password</FormLabel>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            {...field} 
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit"
                    className="w-full"
                    disabled={loginMutation.isPending}
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </form>
              </Form>
              <p className="text-sm text-center mt-4 text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Register here
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center text-primary-foreground p-8">
        <div className="max-w-lg">
          <Lock className="h-16 w-16 mb-4" />
          <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
          <p className="text-lg opacity-90">
            Access your secure password vault and manage your credentials with confidence.
          </p>
        </div>
      </div>
    </div>
  );
}