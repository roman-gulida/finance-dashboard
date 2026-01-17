type StatCardProps = {
  title: string;
  value: string;
  subtext?: string;
};

function StatCard({ title, value, subtext }: StatCardProps) {
  return (
    <div>
      <h4>{title}</h4>
      <p>{value}</p>
      {subtext && <span>{subtext}</span>}
    </div>
  );
}

export default StatCard;
