const StatCard = ({ title, value }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <p className="text-sm text-slate-500">{title}</p>
    <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
  </div>
);

export default StatCard;
