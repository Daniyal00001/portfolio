"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, UserPlus, Users, Mail, Shield, Trash2 } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    setLoading(true);
    // Fetch all profiles (which represent our admins)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) console.error("Error fetching users:", error);
    else setUsers(data || []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id, email) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user.id === id) {
      alert("You cannot delete your own account.");
      return;
    }

    if (!confirm(`Are you sure you want to remove ${email} from admins? This only deletes their profile, not their auth account (needs Supabase dashboard for that).`)) return;

    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) alert("Error: " + error.message);
    else fetchUsers();
  };

  if (loading) {
     return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-display font-bold text-charcoal-blue dark:text-verdigris">
              User Management
            </h1>
            <p className="text-muted-foreground">Manage admin access and roles</p>
        </div>
        <Button className="bg-burnt-peach hover:bg-burnt-peach/90 text-white" onClick={() => alert("To add a new admin:\n1. Go to Supabase > Authentication > Users\n2. Add User\n3. They can then login and their profile will be created.")}>
          <UserPlus className="mr-2 h-4 w-4" /> Add Admin
        </Button>
      </div>

      <div className="grid gap-6">
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" /> Authorized Administrators
                </CardTitle>
                <CardDescription>
                    The following users have access to this dashboard.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border text-muted-foreground">
                                <th className="text-left py-3 font-medium">Name</th>
                                <th className="text-left py-3 font-medium">Email</th>
                                <th className="text-left py-3 font-medium">Role</th>
                                <th className="text-right py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {users.map((u) => (
                                <tr key={u.id} className="group hover:bg-muted/50 transition-colors">
                                    <td className="py-4 font-medium">{u.name || "N/A"}</td>
                                    <td className="py-4 text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-3 w-3" /> {u.email}
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <span className="px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider">
                                            Admin
                                        </span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleDeleteUser(u.id, u.email)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
