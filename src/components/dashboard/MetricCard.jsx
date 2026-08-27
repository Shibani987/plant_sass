const MetricCard = ({ label, value }) => (
  <article className="rounded-lg border border-[#dbe5d1] bg-white p-5">
    <p className="text-sm text-[#64705f]">{label}</p>
    <strong className="mt-2 block text-2xl font-black">{value}</strong>
  </article>
);

export default MetricCard;
