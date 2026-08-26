import { dashboardStats } from "../../data";
const OverviewStatsCOmponent = ({value, label, description}) => {
  return (
    <div className="text-left bg-paper border-2 rounded-xl px-5 py-5 hover:shadow-md transition-shadow group border-ink/20">
      <p className="ov_stats_number  font-serif text-4xl font-bold mb-1 text-ink">
        {value}
      </p>
      <p className="ov_stats_type font-semibold text-sm text-ink">
        {label}
      </p>
      <p className="ov_stats_status font-mono text-xs text-taupe mt-0.5 uppercase tracking-wider">
       {description}
      </p>
    </div>
  );
};

const Dashboard = () => {
  const gridOv = [];
  
  for (let index = 0; index < dashboardStats.length; index++) {
    gridOv.push(<OverviewStatsCOmponent value={dashboardStats[index].value} label={dashboardStats[index].label } description={dashboardStats[index].description} />);
  }
  return (
    <>
      <section className="oveerview_stats">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{gridOv}</div>
      </section>
      <div>
        <h2 className="font-serif text-lg font-semibold text-ink mb-3 flex items-center gap-2 ">
            <span className="w-5 h-px bg-ink inline-block"></span>
          Actions rapides
        </h2>
        <div className="add-new-buttons flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-ink text-cream rounded-lg text-sm font-medium hover:bg-ink/80 transition-colors">+ Ajouter un étudiant</button>
            <button className="flex items-center gap-2 px-4 py-2.5 border-2 border-ink text-ink rounded-lg text-sm font-medium hover:bg-ink/5 transition-colors">+ Créer un cours</button>
            <button className="flex items-center gap-2 px-4 py-2.5 border-2 border-ink text-ink rounded-lg text-sm font-medium hover:bg-ink/5 transition-colors">+ Créer un examen</button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
