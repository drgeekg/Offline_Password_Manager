import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Shield, UserPlus, Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { Redirect, Link } from "wouter";
import { useState } from "react";
import { z } from "zod";

// Extend the schema to include password confirmation
const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { user, registerMutation } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerForm = useForm<RegisterFormData>({
    defaultValues: { username: "", password: "", confirmPassword: "" },
    resolver: zodResolver(registerSchema),
  });

  if (user) {
    return <Redirect to="/" />;
  }

  const onSubmit = async (data: RegisterFormData) => {
    const { confirmPassword, ...userData } = data;
    try {
      await registerMutation.mutateAsync(userData);
      toast({
        title: "Success!",
        description: "Your account has been created successfully.",
        variant: "default",
      });
    } catch (error) {
      // Error is already handled by the mutation
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Create Account</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...registerForm}>
                <form
                  onSubmit={registerForm.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={registerForm.control}
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
                    control={registerForm.control}
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
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <div className="relative">
                          <Input 
                            type={showConfirmPassword ? "text" : "password"} 
                            {...field} 
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
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
                    disabled={registerMutation.isPending}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Register
                  </Button>
                </form>
              </Form>
              <p className="text-sm text-center mt-4 text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Login here
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center text-primary-foreground p-8">
        <div className="max-w-lg">
          <Shield className="h-16 w-16 mb-4" />
          <h1 className="text-4xl font-bold mb-4">Secure Password Manager</h1>
          <p className="text-lg opacity-90">
            Create your account to start managing your passwords securely. All data is encrypted and stored locally on your device.
          </p>
        </div>
      </div>
    </div>
  );
}