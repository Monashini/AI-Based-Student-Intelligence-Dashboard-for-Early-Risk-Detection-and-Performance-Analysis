import { useListStudents, useDeleteStudent } from "@workspace/api-client-react";
import { GlassCard } from "@/components/glass-card";
import { RiskBadge, RiskScore } from "@/components/risk-badge";
import { Link } from "wouter";
import { Search, UserPlus, Trash2, ArrowRight, BookOpen, Clock, Activity } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getListStudentsQueryKey, getGetDashboardSummaryQueryKey, getGetRiskDistributionQueryKey, getGetSubjectAveragesQueryKey } from "@workspace/api-client-react";
import { motion } from "framer-motion";

export default function Students() {
  const { data: students, isLoading } = useListStudents();
  const deleteStudent = useDeleteStudent();
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const filteredStudents = students?.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this student?")) return;
    
    deleteStudent.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Student deleted successfully" });
        queryClient.invalidateQueries({ queryKey: getListStudentsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetRiskDistributionQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetSubjectAveragesQueryKey() });
      },
      onError: () => {
        toast({ title: "Failed to delete student", variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Students</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor all enrolled students.</p>
        </div>
        <Link href="/add-student">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <UserPlus className="w-4 h-4" />
            Add Student
          </Button>
        </Link>
      </div>

      <GlassCard className="p-6">
        <div className="relative mb-6">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search students by name..." 
            className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-muted-foreground focus-visible:ring-primary/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-black/20 border-y border-border/50">
              <tr>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Risk Level</th>
                <th className="px-4 py-3 font-medium">Risk Score</th>
                <th className="px-4 py-3 font-medium">Avg Score</th>
                <th className="px-4 py-3 font-medium">Attendance</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-4"><Skeleton className="h-5 w-32" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-5 w-16 rounded-full" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-5 w-24" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-5 w-12" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-5 w-12" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-8 w-8 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student, i) => (
                  <motion.tr 
                    key={student.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-4 py-4 font-medium text-white group-hover:text-primary transition-colors">
                      {student.name}
                    </td>
                    <td className="px-4 py-4">
                      <RiskBadge level={student.riskLevel} />
                    </td>
                    <td className="px-4 py-4 w-40">
                      <RiskScore score={Math.round(student.riskScore)} level={student.riskLevel} />
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {Math.round(student.averageScore)}%
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {student.attendance}%
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/student/${student.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/10">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => handleDelete(e, student.id)}
                          disabled={deleteStudent.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No students found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}