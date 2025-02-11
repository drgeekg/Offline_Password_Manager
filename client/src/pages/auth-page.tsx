import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Lock, UserPlus, LogIn } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { Redirect } from "wouter";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();

  const loginForm = useForm({
    defaultValues: { username: "", password: "" },
    resolver: zodResolver(insertUserSchema),
  });

  const registerForm = useForm({
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
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password" 
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Master Password</FormLabel>
                        <Input type="password" {...field} />
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Register</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...registerForm}>
                <form
                  onSubmit={registerForm.handleSubmit((data) => registerMutation.mutate(data))}
                  className="space-y-4"
                >
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <Input {...field} />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Master Password</FormLabel>
                        <Input type="password" {...field} />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit" 
                    className="w-full"
                    disabled={registerMutation.isPending}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Register
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center text-primary-foreground p-8">
        <div className="max-w-lg">
          <Lock className="h-16 w-16 mb-4" />
          <h1 className="text-4xl font-bold mb-4">Secure Password Manager</h1>
          <p className="text-lg opacity-90">
            Keep your passwords safe and encrypted locally on your device. Generate strong passwords,
            organize them into categories, and access them securely with your master password.
          </p>
        </div>
      </div>
    </div>
  );
}
