
/**
 * StatsCard – metric card used in admin & customer dashboards.
 *
 * Props:
 *   title    (string) – metric label
 *   value    (string|number) – main figure
 *   icon     (string|node)  – emoji or JSX icon
 *   colorClass (string) – Tailwind bg+text classes for the icon wrapper
 *   trend    (string)  – optional trend text e.g. "+12% this week"
 *   trendUp  (bool)    – green if true, red if false, neutral if undefined
 */
export default function StatsCard({ title, value, icon, colorClass, trend, trendUp }) {
  return (
    <div className="bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] rounded-sm shadow-sm p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--text-secondary)] font-medium">{title}</p>
          <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{value}</p>
          {trend !== undefined && (
            <p
              className={`text-xs mt-1.5 font-medium ${
                trendUp === true
                  ? 'text-green-600'
                  : trendUp === false
                  ? 'text-red-600'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              {trend}
            </p>
          )}
        </div>
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center text-xl ${colorClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
