import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "En règle" | "Sous investigation";
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const isValid = status === "En règle";
  
  return (
    <div
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
        isValid 
          ? "bg-status-success/10 text-status-success" 
          : "bg-status-danger/10 text-status-danger",
        className
      )}
    >
      <div 
        className={cn(
          "w-2 h-2 rounded-full mr-1.5",
          isValid ? "bg-status-success" : "bg-status-danger"
        )} 
      />
      {status}
    </div>
  );
};
