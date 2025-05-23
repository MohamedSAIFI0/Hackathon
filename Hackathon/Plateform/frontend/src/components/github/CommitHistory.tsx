
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { mockCommits } from "@/data/mockData";
import { GithubCommit } from "@/types";
import { Github, FileCode, Clock, AlertTriangle, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommitHistoryProps {
  studentExamId?: string;
  maxCommits?: number;
  showSuspicious?: boolean;
}

export const CommitHistory = ({
  studentExamId,
  maxCommits = 5,
  showSuspicious = true,
}: CommitHistoryProps) => {
  const [selectedCommit, setSelectedCommit] = useState<GithubCommit | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter commits by student exam if provided
  const filteredCommits = studentExamId
    ? mockCommits.filter((commit) => commit.studentExamId === studentExamId)
    : mockCommits;

  // Sort by timestamp descending and limit the number
  const commits = [...filteredCommits]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, maxCommits);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Handle commit click to show details
  const handleCommitClick = (commit: GithubCommit) => {
    setSelectedCommit(commit);
    setIsDialogOpen(true);
  };

  // Mock code changes for the commit dialog
  const getCodeChanges = (commit: GithubCommit) => {
    // In a real app, this would fetch actual diff from GitHub API
    if (commit.suspicious) {
      return [
        { type: "removed", content: "def calculate_factorial(n):" },
        { type: "removed", content: "    result = 1" },
        { type: "removed", content: "    for i in range(1, n + 1):" },
        { type: "removed", content: "        result *= i" },
        { type: "removed", content: "    return result" },
        { type: "added", content: "def calculate_factorial(n):" },
        {
          type: "added",
          content: "    # This code is suspiciously similar to another student's submission",
          suspicious: true,
        },
        { type: "added", content: "    if n == 0 or n == 1:" },
        { type: "added", content: "        return 1" },
        { type: "added", content: "    else:" },
        {
          type: "added",
          content: "        return n * calculate_factorial(n-1)",
          suspicious: true,
        },
      ];
    } else {
      return [
        { type: "added", content: "def greeter(name):" },
        { type: "added", content: '    return f"Hello, {name}!"' },
        { type: "added", content: "" },
        { type: "added", content: "# Test the function" },
        { type: "added", content: 'print(greeter("World"))' },
      ];
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Github className="h-5 w-5" />
        <h3 className="text-xl font-semibold">Historique des commits</h3>
      </div>
      
      <div className="space-y-3">
        {commits.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">
                <Github className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p>Aucun commit trouvé</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          commits.map((commit) => (
            <Card
              key={commit.id}
              className={cn(
                "overflow-hidden transition-colors",
                commit.suspicious && showSuspicious
                  ? "border-warning/50 bg-warning/5"
                  : ""
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <FileCode className="h-5 w-5" />
                    <span className="truncate">{commit.message}</span>
                  </CardTitle>
                  {commit.suspicious && showSuspicious && (
                    <Badge variant="outline" className="bg-warning/20 text-warning border-warning">
                      <AlertTriangle className="mr-1 h-3 w-3" /> Suspect
                    </Badge>
                  )}
                </div>
                <CardDescription className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDate(commit.timestamp)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-success">
                      <span className="font-medium">+{commit.additions}</span>
                      <Check className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-1 text-alert">
                      <span className="font-medium">-{commit.deletions}</span>
                      <X className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    SHA: {commit.sha.substring(0, 7)}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => handleCommitClick(commit)}
                >
                  Voir le détail
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Commit detail dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center justify-between">
              <span>{selectedCommit?.message}</span>
              {selectedCommit?.suspicious && showSuspicious && (
                <Badge variant="outline" className="bg-warning/20 text-warning border-warning">
                  <AlertTriangle className="mr-1 h-3 w-3" /> Code suspect
                </Badge>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription className="flex items-center justify-between">
              <div>
                Commit <code className="bg-muted px-1 py-0.5 rounded-sm">{selectedCommit?.sha.substring(0, 7)}</code>{" "}
                le {selectedCommit ? formatDate(selectedCommit.timestamp) : ""}
              </div>
              <div>
                <span className="text-success">+{selectedCommit?.additions}</span>
                {" / "}
                <span className="text-alert">-{selectedCommit?.deletions}</span>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="my-4 max-h-[400px] overflow-y-auto">
            <div className="github-code text-sm">
              {selectedCommit &&
                getCodeChanges(selectedCommit).map((line, index) => (
                  <div
                    key={index}
                    className={cn(
                      "github-code-line px-4 py-1",
                      line.type === "added" ? "github-code-added" : "",
                      line.type === "removed" ? "github-code-removed" : "",
                      line.suspicious ? "bg-warning/30" : ""
                    )}
                  >
                    {line.type === "added" ? "+ " : "- "}
                    {line.content}
                    {line.suspicious && (
                      <span className="ml-2 text-warning">⚠️ Suspect</span>
                    )}
                  </div>
                ))}
            </div>
          </div>

          <AlertDialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                // Open GitHub link in new tab
                if (selectedCommit) {
                  window.open(selectedCommit.url, "_blank");
                }
              }}
              className="mr-auto"
            >
              <Github className="mr-2 h-4 w-4" />
              Voir sur GitHub
            </Button>
            {selectedCommit?.suspicious && showSuspicious && (
              <Button
                variant="outline"
                className="border-warning text-warning hover:bg-warning/20"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Signaler
              </Button>
            )}
            <Button onClick={() => setIsDialogOpen(false)}>Fermer</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CommitHistory;
