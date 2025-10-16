import { ChevronRight } from "lucide-react";
const BlockName = ({ name }) => {
  return (
    <div className="text-white text-xl font-bold flex items-center justify-between px-4">
      <h1>{name}</h1>
      <div className="p-1 bg-neutral-800 rounded-sm">
        <ChevronRight />
      </div>
    </div>
  );
};

export default BlockName;
