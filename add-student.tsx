import {
  useCreateStudent,
  getListStudentsQueryKey,
  getGetDashboardSummaryQueryKey,
  getGetRiskDistributionQueryKey,
  getGetSubjectAveragesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, ArrowLeft, BrainCircuit } from "lucide-react";
import { Link } from "wouter";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  mathScore: z.coerce.number().min(0).max(100),
  scienceScore: z.coerce.number().min(0).max(100),
  englishScore: z.coerce.number().min(0).max(100),
  attendance: z.coerce.number().min(0).max(100),
  studyHours: z.coerce.number().min(0).max(24),
  assignmentsCompleted: z.coerce.number().min(0).max(100),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddStudent() {
  const createStudent = useCreateStudent();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      mathScore: 85,
      scienceScore: 85,
      englishScore: 85,
      attendance: 95,
      studyHours: 2,
      assignmentsCompleted: 90,
    },
  });

  const onSubmit = (data: FormValues) => {
    createStudent.mutate({ data }, {
      onSuccess: (res) => {
        queryClient.invalidateQueries({ queryKey: getListStudentsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetRiskDistributionQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetSubjectAveragesQueryKey() });
        toast({ title: "Student added successfully", description: "AI Analysis complete." });
        setLocation(`/student/${res.student.id}`);
      },
      onError: (err) => {
        toast({ 
          title: "Error adding student", 
          description: err.error || "An unexpected error occurred", 
          variant: "destructive" 
        });
      }
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/students">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-muted-foreground hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Add Student</h1>
          <p className="text-muted-foreground mt-1">Input data to generate an AI risk analysis.</p>
        </div>
      </div>

      <GlassCard className="p-8 border-t-4 border-t-primary">
        <div className="flex items-center gap-3 mb-8 p-4 bg-primary/10 border border-primary/20 rounded-lg text-primary">
          <BrainCircuit className="w-6 h-6" />
          <p className="text-sm font-medium">Data submitted here will be immediately processed by the AI engine to determine risk factors and generate a personalized plan.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Doe" className="bg-black/20 border-white/10 text-white focus-visible:ring-primary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="mathScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Math Score (0-100)</FormLabel>
                    <FormControl>
                      <Input type="number" className="bg-black/20 border-white/10 text-white" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="scienceScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Science Score (0-100)</FormLabel>
                    <FormControl>
                      <Input type="number" className="bg-black/20 border-white/10 text-white" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="englishScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">English Score (0-100)</FormLabel>
                    <FormControl>
                      <Input type="number" className="bg-black/20 border-white/10 text-white" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="attendance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Attendance %</FormLabel>
                    <FormControl>
                      <Input type="number" className="bg-black/20 border-white/10 text-white" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="studyHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Study Hours/Day</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.5" className="bg-black/20 border-white/10 text-white" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assignmentsCompleted"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Assignments Done %</FormLabel>
                    <FormControl>
                      <Input type="number" className="bg-black/20 border-white/10 text-white" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-4 border-t border-border/50 flex justify-end gap-4">
              <Link href="/students">
                <Button type="button" variant="outline" className="border-white/10 text-white hover:bg-white/5 hover:text-white">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={createStudent.isPending}>
                {createStudent.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    Analyze & Save
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </GlassCard>
    </div>
  );
}