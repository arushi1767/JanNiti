import { ExternalLink } from "lucide-react";
import { getSchemeUrl } from "@/lib/schemeLinks";

interface SourceBadgeProps {
  source: string;
  className?: string;
}

export function SourceBadge({ source, className = "" }: SourceBadgeProps) {
  const url = getSchemeUrl(source);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 hover:bg-green-100 transition-colors ${className}`}
    >
      <ExternalLink className="h-3 w-3 shrink-0" />
      {source}
    </a>
  );
}

export default SourceBadge;
