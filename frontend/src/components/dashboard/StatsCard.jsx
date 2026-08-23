
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
    <div className="bg-white dark:bg-[#1a1a24] border border-gray-200 dark:border-white/10 rounded-sm shadow-sm p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {trend !== undefined && (
            <p
              className={`text-xs mt-1.5 font-medium ${
                trendUp === true
                  ? 'text-green-600'
                  : trendUp === false
                  ? 'text-red-600'
                  : 'text-gray-500 dark:text-gray-400'
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
