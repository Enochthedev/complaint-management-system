"use client";

import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export function useRealtimeComplaints() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const supabase = createSupabaseClient();

  useEffect(() => {
    // Initial fetch
    const fetchComplaints = async () => {
      const { data, error } = await supabase
        .from("complaints")
        .select("*, student:student_id(full_name, matric_number)")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching complaints:", error);
        toast({
          title: "Error",
          description: "Failed to fetch complaints",
          variant: "destructive",
        });
      } else {
        setComplaints(data || []);
      }
      setLoading(false);
    };

    fetchComplaints();

    // Set up real-time subscription
    const channel = supabase
      .channel("complaints-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "complaints",
        },
        (payload) => {
          console.log("Real-time update:", payload);

          if (payload.eventType === "INSERT") {
            // New complaint added
            toast({
              title: "New Complaint",
              description: "A new complaint has been submitted",
            });

            // Refetch to get the complete data with student info
            fetchComplaints();
          } else if (payload.eventType === "UPDATE") {
            // Complaint updated
            setComplaints((prev) =>
              prev.map((complaint) =>
                complaint.id === payload.new.id
                  ? { ...complaint, ...payload.new }
                  : complaint
              )
            );

            toast({
              title: "Complaint Updated",
              description: "A complaint status has been changed",
            });
          } else if (payload.eventType === "DELETE") {
            // Complaint deleted
            setComplaints((prev) =>
              prev.filter((complaint) => complaint.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, toast]);

  return { complaints, loading, refetch: () => setLoading(true) };
}
