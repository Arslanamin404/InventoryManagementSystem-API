export const Card = ({ title, value, icon }) => {
  return (
    <div className="bg-white shadow-sm rounded-2xl p-5 flex items-center gap-4">
      <div className="bg-blue-100 rounded-full p-2">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-xl font-bold">{value}</h3>
      </div>
    </div>
  );
};
