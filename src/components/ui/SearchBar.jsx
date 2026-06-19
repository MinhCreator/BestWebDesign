const SearchBar = ({ value, onChange, placeholder, classNameStyle}) => {
    return (
      <div className="relative flex items-center">
        <span className="absolute left-3 text-gray-400 text-sm">🔍</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Search..."}
          className={classNameStyle}
          // w-full rounded border border-gray-200 py-2 pl-8 pr-3 text-sm focus:border-[#55b576] focus:ring-2 focus:ring-[#55b576]/20 focus:outline-none
        />
      </div>
    );
}
export default SearchBar;