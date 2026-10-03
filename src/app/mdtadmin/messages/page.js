"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, Trash2, Calendar, Eye, EyeOff } from "lucide-react";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching messages:", error);
    else setMessages(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const toggleReadStatus = async (id, currentStatus) => {
    const { error } = await supabase
      .from("messages")
      .update({ is_read: !currentStatus })
      .eq("id", id);

    if (error) {
      alert("Error updating status");
    } else {
      setMessages(messages.map(m => m.id === id ? { ...m, is_read: !currentStatus } : m));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) {
      alert("Error deleting message");
    } else {
      setMessages(messages.filter(m => m.id !== id));
    }
  };

  const formatDate = (dateStr) => {
    try {
        const date = new Date(dateStr)
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(date)
    } catch (e) {
        return dateStr
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-verdigris" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal-blue dark:text-verdigris">
            Messages
          </h1>
          <p className="text-muted-foreground">Manage your contact form submissions.</p>
        </div>
        <Button variant="outline" onClick={fetchMessages}>Refresh</Button>
      </div>

      <div className="grid gap-4">
        {messages.map((msg) => (
          <Card key={msg.id} className={`border-border/50 bg-card/50 transition-all ${!msg.is_read ? 'border-l-4 border-l-tuscan-sun bg-tuscan-sun/5' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-bold">{msg.name}</CardTitle>
                    {!msg.is_read && <Badge className="bg-tuscan-sun text-white">New</Badge>}
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <Mail className="h-3 w-3" /> {msg.email}
                  </CardDescription>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(msg.created_at)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-background/40 p-4 rounded-md text-sm leading-relaxed mb-4 border italic">
                &quot;{msg.message}&quot;
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className={msg.is_read ? "text-muted-foreground" : "text-tuscan-sun hover:text-tuscan-sun"}
                    onClick={() => toggleReadStatus(msg.id, msg.is_read)}
                >
                  {msg.is_read ? (
                      <><EyeOff className="h-4 w-4 mr-2" /> Mark Unread</>
                  ) : (
                      <><Eye className="h-4 w-4 mr-2" /> Mark Read</>
                  )}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(msg.id)}>
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-24 text-muted-foreground border border-dashed rounded-lg bg-card/20">
            <Mail className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No messages yet. They will appear here when someone contacts you.</p>
          </div>
        )}
      </div>
    </div>
  );
}
