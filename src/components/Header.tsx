const Header = () => {
  return (
    <div className="bg-black text-white p-4 shadow-lg bg-opacity-100">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <img
            src="/logo.png"
            alt="TGIS Logo"
            className="h-12 md:h-16 w-auto object-contain"
          />
        </div>
        <h1 className="text-xl md:text-2xl font-bold tracking-wide text-center flex-1">
          HydroTerrain Maps
        </h1>
        <div className="hidden md:block w-[100px]">
          {/* Empty div for balance */}
        </div>
      </div>
    </div>
  );
};

export default Header; 