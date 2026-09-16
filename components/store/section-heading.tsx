import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  href = "/shop",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: string;
  href?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {description && <p className="section-description">{description}</p>}
      </div>
      {action && (
        <Link className="text-link" href={href}>
          {action}
          <ArrowUpRight size={18} />
        </Link>
      )}
    </div>
  );
}
