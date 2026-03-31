import { CheckCircle2, MapPin, Tag, FileText } from "lucide-react";
import { Issue } from "../types";

interface ResultCardProps {
  issue: Partial<Issue>;
}

export default function ResultCard({ issue }: ResultCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 md:p-8 border-b border-border bg-green-500/10 flex flex-col items-center justify-center text-center">
        <div className="h-16 w-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Report Submitted Successfully</h3>
        <p className="text-sm text-muted-foreground mt-2 font-medium max-w-sm">
          Your issue has been logged, assigned an ID, and routed to the correct department.
        </p>
      </div>
      
      <div className="p-6 md:p-8 space-y-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-12">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-4 w-4 text-blue-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Detected Category
              </h4>
            </div>
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center rounded-full border border-border px-4 py-1.5 text-sm font-semibold bg-background shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                {issue.issue_type}
              </div>
              {issue.confidence && (
                <div className="text-xs font-bold text-blue-600 bg-blue-500/10 px-2 py-1 rounded-md">
                  {Math.round(issue.confidence * 100)}% Match
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
             <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-red-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Location Data
              </h4>
            </div>
            <div className="text-sm font-medium text-foreground bg-muted p-3 rounded-lg border border-border inline-block">
              {issue.latitude?.toFixed(5)}, {issue.longitude?.toFixed(5)}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-4 w-4 text-purple-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              AI Analysis Report
            </h4>
          </div>
          <div className="bg-muted p-5 rounded-xl border border-border text-sm md:text-base text-foreground font-medium leading-relaxed relative">
            <div className="text-4xl text-muted-foreground/30 absolute top-2 left-2 font-serif">&quot;</div>
            <span className="relative z-10 block indent-4">
              {issue.description}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
