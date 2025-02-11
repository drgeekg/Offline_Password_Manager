import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPasswordSchema } from "@shared/schema";
import { Eye, EyeOff, Save } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { generatePassword } from "@/lib/crypto";
import { analyzePassword } from "@/lib/password-health";
import { Progress } from "@/components/ui/progress";

export function PasswordFormDialog({
  trigger,
  onSubmit,
  folders = [],
  defaultValues = {
    name: "",
    website: "",
    username: "",
    encryptedPassword: "",
    category: "general",
    tags: "[]"
  }
}) {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const form = useForm({
    defaultValues,
    resolver: zodResolver(insertPasswordSchema),
  });
  const [passwordStrength, setPasswordStrength] = useState(analyzePassword(""));

  const handleGeneratePassword = () => {
    const password = generatePassword();
    form.setValue("encryptedPassword", password);
    setPasswordStrength(analyzePassword(password));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("encryptedPassword", e.target.value);
    setPasswordStrength(analyzePassword(e.target.value));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Password</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <Input {...field} placeholder="e.g. Amazon" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <Input {...field} type="url" placeholder="https://www.example.com" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input {...field} placeholder="username@example.com" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Folder</FormLabel>
                  <select
                    {...field}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  >
                    <option value="general">General</option>
                    {folders.map((folder) => (
                      <option key={folder} value={folder}>
                        {folder}
                      </option>
                    ))}
                  </select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="encryptedPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          onChange={handlePasswordChange}
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
                      <Button type="button" onClick={handleGeneratePassword}>
                        Generate
                      </Button>
                    </div>

                    {/* Strength Indicator */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Strength: {passwordStrength.label}</span>
                        <span className={`font-medium text-${passwordStrength.color}-500`}>
                          {passwordStrength.score}%
                        </span>
                      </div>
                      <Progress value={passwordStrength.score} />
                      {passwordStrength.recommendations.length > 0 && (
                        <ul className="text-xs text-muted-foreground mt-2">
                          {passwordStrength.recommendations.map((rec, i) => (
                            <li key={i}>• {rec}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Save Password
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}