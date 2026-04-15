import { useGetDashboardSummary, useGetRiskDistribution, useGetSubjectAverages, useListStudents } from "@workspace/api-client-react";
import { GlassCard } from "@/components/glass-card";
import { Users, AlertTriangle, TrendingUp, CheckCircle, GraduationCap, Clock, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { RiskBadge, RiskScore } from "@/components/risk-badge";
import { Link } from "wouter";
import { motion } from "framer-motion";

const COLORS = {
  High: "#ef4444",
  Medium: "#eab308",
  Low: "#22c55e"
};

export default function Dashboard() {
  const { data: summary, isLoading: isLoadingSummary } = useGetDashboardSummary();
  const { data: riskDist, isLoading: isLoadingRisk } = useGetRiskDistribution();
  const { data: subjectAvg, isLoading: isLoadingSubjects } = useGetSubjectAverages();
  const { data: students, isLoading: isLoadingStudents } = useListStudents();

  const riskPieData = riskDist ? [
    { name: "High", value: riskDist.High, color: COLORS.High },
    { name: "Medium", value: riskDist.Medium, color: COLORS.Medium },
    { name: "Low", value: riskDist.Low, color: COLORS.Low }
  ].filter(d => d.value > 0) : [];

  const subjectData = subjectAvg ? [
    { name: "Math", score: subjectAvg.math },
    { name: "Science", score: subjectAvg.science },
    { name: "English", score: subjectAvg.english }
  ] : [];

  const topAtRisk = students ? [...students].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Real-time student intelligence and risk monitoring.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-6" transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Total Students</h3>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white">
            {isLoadingSummary ? <Skeleton className="h-9 w-16" /> : summary?.totalStudents || 0}
          </div>
        </GlassCard>
        
        <GlassCard className="p-6" transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">High Risk Students</h3>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-red-400">
            {isLoadingSummary ? <Skeleton className="h-9 w-16" /> : summary?.highRiskCount || 0}
          </div>
        </GlassCard>

        <GlassCard className="p-6" transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Avg Overall Score</h3>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white">
            {isLoadingSummary ? <Skeleton className="h-9 w-16" /> : `${Math.round(summary?.averageScore || 0)}%`}
          </div>
        </GlassCard>

        <GlassCard className="p-6" transition={{ delay: 0.4 }}>
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Avg Attendance</h3>
            <CheckCircle className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold text-white">
            {isLoadingSummary ? <Skeleton className="h-9 w-16" /> : `${Math.round(summary?.averageAttendance || 0)}%`}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Chart */}
        <GlassCard className="p-6 col-span-1" transition={{ delay: 0.5 }}>
          <h3 className="text-lg font-semibold mb-4 text-white">Risk Distribution</h3>
          <div className="h-[250px] w-full relative">
            {isLoadingRisk ? (
              <div className="w-full h-full flex items-center justify-center">
                <Skeleton className="w-48 h-48 rounded-full" />
              </div>
            ) : riskPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {riskPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">No data available</div>
            )}
            
            {/* Center metric */}
            {!isLoadingRisk && riskPieData.length > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-white">{summary?.totalStudents}</span>
                <span className="text-xs text-muted-foreground">Students</span>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Subject Averages */}
        <GlassCard className="p-6 col-span-1 lg:col-span-2" transition={{ delay: 0.6 }}>
          <h3 className="text-lg font-semibold mb-4 text-white">Average Performance by Subject</h3>
          <div className="h-[250px] w-full">
            {isLoadingSubjects ? (
              <div className="w-full h-full flex items-end gap-4 p-4">
                <Skeleton className="w-full h-[60%]" />
                <Skeleton className="w-full h-[80%]" />
                <Skeleton className="w-full h-[40%]" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
                  <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} domain={[0, 100]} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}>
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(var(--primary) / ${0.7 + (index * 0.15)})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Top At-Risk Students List */}
      <GlassCard className="overflow-hidden" transition={{ delay: 0.7 }}>
        <div className="p-6 border-b border-border/50 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Highest Risk Students
          </h3>
          <Link href="/students" className="text-sm text-primary hover:text-primary/80 transition-colors">
            View All →
          </Link>
        </div>
        <div className="divide-y divide-border/50">
          {isLoadingStudents ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))
          ) : topAtRisk.length > 0 ? (
            topAtRisk.map((student, i) => (
              <motion.div 
                key={student.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + (i * 0.1) }}
              >
                <Link href={`/student/${student.id}`} className="block group">
                  <div className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center font-bold text-white shadow-inner">
                      {student.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate group-hover:text-primary transition-colors">{student.name}</p>
                      <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3"/> Avg: {Math.round(student.averageScore)}%</span>
                        <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Att: {student.attendance}%</span>
                      </div>
                    </div>
                    <div className="text-right w-32">
                      <RiskBadge level={student.riskLevel} className="mb-2" />
                      <RiskScore score={Math.round(student.riskScore)} level={student.riskLevel} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No students found.
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}