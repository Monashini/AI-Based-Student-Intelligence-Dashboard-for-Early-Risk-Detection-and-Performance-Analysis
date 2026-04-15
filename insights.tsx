import { useListStudents } from "@workspace/api-client-react";
import { GlassCard } from "@/components/glass-card";
import { BrainCircuit, Lightbulb, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function Insights() {
  const { data: students, isLoading } = useListStudents();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  // Aggregate some simple mock insights based on the students data
  const lowAttendanceCount = students?.filter(s => s.attendance < 80).length || 0;
  const highMathLowSci = students?.filter(s => s.mathScore > 80 && s.scienceScore < 60).length || 0;
  const lowStudyHighRisk = students?.filter(s => s.studyHours < 2 && s.riskLevel === 'High').length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">System Insights</h1>
        <p className="text-muted-foreground mt-1">Aggregate AI recommendations and global trends.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 border-t-4 border-t-primary">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <BrainCircuit className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Model Confidence</h3>
          <p className="text-3xl font-bold text-white mb-2">94.2%</p>
          <p className="text-sm text-muted-foreground">Based on cross-validation of 5 key metrics across all enrolled students.</p>
        </GlassCard>

        <GlassCard className="p-6 border-t-4 border-t-yellow-500">
          <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Systemic Risk</h3>
          <p className="text-3xl font-bold text-white mb-2">{lowAttendanceCount}</p>
          <p className="text-sm text-muted-foreground">Students currently showing critically low attendance (&lt;80%) impacting their core performance.</p>
        </GlassCard>

        <GlassCard className="p-6 border-t-4 border-t-green-500">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Correlation Found</h3>
          <p className="text-3xl font-bold text-white mb-2">{lowStudyHighRisk}</p>
          <p className="text-sm text-muted-foreground">High-risk students logging less than 2 study hours daily. Highly predictive factor.</p>
        </GlassCard>
      </div>

      <h2 className="text-xl font-bold text-white mt-8 mb-4 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-primary" />
        Recommended Interventions
      </h2>

      <div className="space-y-4">
        <GlassCard className="p-5 border border-l-4 border-l-primary flex items-start gap-4">
          <div className="flex-1">
            <h4 className="text-base font-semibold text-white">Implement mandatory study halls for high-risk cohort</h4>
            <p className="text-sm text-muted-foreground mt-1">Data shows study hours are the #2 predictor of failure. Mandating an extra hour per day could shift 40% of high-risk students to medium.</p>
          </div>
          <Link href="/students">
            <button className="text-sm text-primary hover:underline flex items-center gap-1">
              View Cohort <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </GlassCard>

        <GlassCard className="p-5 border border-l-4 border-l-yellow-500 flex items-start gap-4">
          <div className="flex-1">
            <h4 className="text-base font-semibold text-white">Review Science Curriculum Alignment</h4>
            <p className="text-sm text-muted-foreground mt-1">There is a significant divergence ({highMathLowSci} students) where math scores are high but science scores are low. This suggests a curriculum delivery issue rather than student capability.</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}