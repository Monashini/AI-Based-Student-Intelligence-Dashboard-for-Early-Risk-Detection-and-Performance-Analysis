import { useGetStudent, useAnalyzeStudent, getGetStudentQueryKey } from "@workspace/api-client-react";
import { GlassCard } from "@/components/glass-card";
import { RiskBadge, RiskScore } from "@/components/risk-badge";
import { Button } from "@/components/ui/button";
import { useRoute, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, Download, RefreshCw, BrainCircuit, Target, 
  CalendarDays, TrendingUp, AlertCircle, CheckCircle2, MinusCircle, 
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from "recharts";
import { motion } from "framer-motion";

export default function StudentDetail() {
  const [, params] = useRoute("/student/:id");
  const id = params?.id ? parseInt(params.id, 10) : 0;
  
  const { data, isLoading } = useGetStudent(id, { query: { enabled: !!id } });
  const analyzeStudent = useAnalyzeStudent();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleReanalyze = () => {
    analyzeStudent.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Analysis complete", description: "Latest data has been processed." });
        queryClient.invalidateQueries({ queryKey: getGetStudentQueryKey(id) });
      },
      onError: () => {
        toast({ title: "Analysis failed", variant: "destructive" });
      }
    });
  };

  const handleExport = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 col-span-1 lg:col-span-2" />
          <Skeleton className="h-64 col-span-1" />
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-12 text-white">Student not found</div>;
  }

  const { student, analysis } = data;

  const radarData = [
    { subject: 'Math', A: student.mathScore, fullMark: 100 },
    { subject: 'Science', A: student.scienceScore, fullMark: 100 },
    { subject: 'English', A: student.englishScore, fullMark: 100 },
    { subject: 'Attendance', A: student.attendance, fullMark: 100 },
    { subject: 'Assignments', A: student.assignmentsCompleted, fullMark: 100 },
  ];

  // Sort feature importance for horizontal bar chart
  const importanceData = [...analysis.featureImportance].sort((a, b) => b.importance - a.importance);

  return (
    <div className="space-y-6 pb-12 print:text-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/students">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-muted-foreground hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">{student.name}</h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              ID: {student.id} <span className="w-1 h-1 rounded-full bg-white/20" /> Added {new Date(student.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="border-white/10 text-white hover:bg-white/5"
            onClick={handleReanalyze}
            disabled={analyzeStudent.isPending}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${analyzeStudent.isPending ? 'animate-spin' : ''}`} />
            Re-Analyze
          </Button>
          <Button onClick={handleExport} className="bg-primary text-primary-foreground">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5 border-t-4" style={{ borderTopColor: student.riskLevel === 'High' ? '#ef4444' : student.riskLevel === 'Medium' ? '#eab308' : '#22c55e' }}>
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-muted-foreground">Risk Assessment</span>
            <RiskBadge level={analysis.riskLevel} />
          </div>
          <div className="mt-4">
            <RiskScore score={Math.round(analysis.riskScore)} level={analysis.riskLevel} className="h-3" />
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="text-sm font-medium text-muted-foreground mb-1">AI Weighted Score</div>
          <div className="text-3xl font-bold text-white mb-1">{Math.round(analysis.weightedScore)}%</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Activity className="w-3 h-3 text-primary" />
            Raw average: {Math.round(student.averageScore)}%
          </div>
        </GlassCard>
        
        <GlassCard className="p-5">
          <div className="text-sm font-medium text-muted-foreground mb-1">Attendance</div>
          <div className="text-3xl font-bold text-white mb-1">{student.attendance}%</div>
          <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5 mt-2">
            <div className={`h-full rounded-full ${student.attendance < 80 ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${student.attendance}%` }} />
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="text-sm font-medium text-muted-foreground mb-1">Study Hours</div>
          <div className="text-3xl font-bold text-white mb-1">{student.studyHours} <span className="text-lg text-muted-foreground font-normal">hrs/day</span></div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Radar */}
        <GlassCard className="p-6 col-span-1">
          <h3 className="text-lg font-semibold mb-4 text-white">Skills Overview</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.4)' }} />
                <Radar name="Student" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.4} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* AI Performance Summary & Insights */}
        <GlassCard className="p-6 col-span-1 lg:col-span-2 flex flex-col">
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-primary" />
            AI Intelligence Report
          </h3>
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 mb-6 text-sm text-white/90 leading-relaxed">
            {analysis.performanceSummary}
          </div>

          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Key Insights</h4>
          <div className="space-y-3 flex-1">
            {analysis.insights.map((insight, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (idx * 0.1) }}
                className="flex items-start gap-3 bg-black/20 p-3 rounded-lg border border-white/5"
              >
                <div className="mt-0.5 rounded-full bg-primary/20 p-1">
                  <Lightbulb className="w-3 h-3 text-primary" />
                </div>
                <p className="text-sm text-white/80">{insight}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Action Plan */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-green-400" />
            Action Plan
          </h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-3">
                <CalendarDays className="w-4 h-4" />
                Daily Plan
              </h4>
              <ul className="space-y-2">
                {analysis.dailyPlan.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4" />
                Weekly Goals
              </h4>
              <ul className="space-y-2">
                {analysis.weeklyGoals.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </GlassCard>

        {/* Feature Importance & Key Factors */}
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-white">Contributing Factors</h3>
            <div className="space-y-3">
              {analysis.keyFactors.map((factor, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                  <div className="flex items-center gap-3">
                    {factor.impact === 'positive' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                    {factor.impact === 'negative' && <AlertCircle className="w-4 h-4 text-red-400" />}
                    {factor.impact === 'neutral' && <MinusCircle className="w-4 h-4 text-yellow-400" />}
                    <span className="text-sm font-medium text-white">{factor.factor}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{factor.value}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-2 text-white">Feature Importance</h3>
            <p className="text-xs text-muted-foreground mb-4">Relative weight of metrics in AI model decision</p>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={importanceData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={true} vertical={false} />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="feature" stroke="rgba(255,255,255,0.6)" tick={{fontSize: 12}} width={80} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    formatter={(val: number) => [val.toFixed(2), "Importance"]}
                  />
                  <Bar dataKey="importance" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]}>
                    {importanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(var(--primary) / ${0.9 - (index * 0.15)})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
// Add Lightbulb import up top
import { Lightbulb } from "lucide-react";