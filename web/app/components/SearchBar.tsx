const SearchBar = () => {
  return (
    <div className="flex items-center border border-gray-200 rounded-md shadow-sm p-2">
      <input
        type="text"
        className="flex-grow px-4 py-2 border-none focus:outline-none focus:ring-0"
        placeholder="職種、キーワード、会社名"
      />
      <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 transition-colors">
        検索
      </button>
    </div>
  )
}

export default SearchBar
