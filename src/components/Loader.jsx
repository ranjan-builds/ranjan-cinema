const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="flex space-x-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="relative w-12 h-16 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-lg transform hover:scale-110 transition-transform duration-300 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-black/30 rounded"></div>
            <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-black/30 rounded"></div>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-black text-xs font-bold">
              ★
            </div>
          </div>
        ))}
      </div>
      <div className="text-yellow-400 font-bold text-xl animate-pulse">
        Lights... Camera... Action!
      </div>
    </div>
  );
};
export default Loader;
