import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { Search, Plus, Key, Globe, Copy, Pencil, Shield, Trash2, Folder, User, FolderPlus } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PasswordFormDialog } from "@/components/modals/password-form";
import { useToast } from "@/hooks/use-toast";
import { generateKey, decryptPassword } from "@/lib/crypto";
import type { Password } from "@shared/schema";
import { PasswordHealth } from "@/components/password-health";
import { Link } from "wouter";

export default function Dashboard() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [showFolderInput, setShowFolderInput] = useState(false);

  const { data: passwords = [] } = useQuery<Password[]>({
    queryKey: ["/api/passwords"],
  });

  // Get unique folders
  const folders = [...new Set(passwords.map(p => p.category))].filter(Boolean);

  const createPasswordMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/passwords", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/passwords"] });
      toast({
        title: "Success",
        description: "Password saved successfully",
      });
    },
  });

  const deletePasswordMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/passwords/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/passwords"] });
      toast({
        title: "Success",
        description: "Password deleted successfully",
      });
    },
  });

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      // Create a placeholder password with the new folder
      createPasswordMutation.mutate({
        name: `${newFolderName} Folder`,
        website: "",
        username: "",
        encryptedPassword: "placeholder",
        category: newFolderName,
        tags: "[]"
      });

      setNewFolderName("");
      setShowFolderInput(false);
    }
  };

  const handleCopyPassword = async (password: Password) => {
    try {
      const key = generateKey(user!.masterKey);
      const decrypted = decryptPassword(password.encryptedPassword, key);
      await navigator.clipboard.writeText(decrypted);
      toast({
        title: "Copied",
        description: "Password copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to decrypt password",
        variant: "destructive",
      });
    }
  };

  const handleDeletePassword = (id: number) => {
    if (window.confirm("Are you sure you want to delete this password?")) {
      deletePasswordMutation.mutate(id);
    }
  };

  const filteredPasswords = passwords.filter(
    (p) =>
      (!selectedFolder || p.category === selectedFolder) &&
      (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.website?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.username?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#696969]">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Key className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Password Vault</h1>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/settings" className="flex items-center gap-2 hover:text-primary">
              <User className="h-4 w-4" />
              <span className="text-sm text-muted-foreground">
                {user?.username}
              </span>
            </Link>
            <Button
              variant="outline"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              className="pl-10"
              placeholder="Search passwords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            {showFolderInput ? (
              <div className="flex gap-2">
                <Input
                  placeholder="New folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
                <Button onClick={handleCreateFolder}>Create</Button>
                <Button variant="ghost" onClick={() => setShowFolderInput(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => setShowFolderInput(true)}
              >
                <FolderPlus className="mr-2 h-4 w-4" />
                New Folder
              </Button>
            )}

            <PasswordFormDialog
              trigger={
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Password
                </Button>
              }
              onSubmit={(data) => createPasswordMutation.mutate(data)}
              folders={folders}
            />
          </div>
        </div>

        {/* Password Health Overview */}
        <div className="mb-8">
          <PasswordHealth passwords={passwords} masterKey={user!.masterKey} />
        </div>

        {/* Folders Grid */}
        {!selectedFolder ? (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {folders.map((folder) => (
              <Card
                key={folder}
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => setSelectedFolder(folder)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Folder className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{folder || "General"}</h3>
                      <p className="text-sm text-muted-foreground">
                        {passwords.filter(p => p.category === folder).length} passwords
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <Button
                variant="ghost"
                onClick={() => setSelectedFolder(null)}
              >
                ← Back to Folders
              </Button>
            </div>
            {/* Password List */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredPasswords.map((password) => (
                <Card key={password.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Globe className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{password.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {password.username}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopyPassword(password)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <PasswordFormDialog
                          trigger={
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          }
                          defaultValues={password}
                          onSubmit={(data) => createPasswordMutation.mutate(data)}
                          folders={folders}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeletePassword(password.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}