const Results = () => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Enter / View Lab Results</h2>
      <form className="space-y-4 bg-white shadow p-6 rounded-lg max-w-lg">
        <input type="text" placeholder="Patient Name" className="w-full border p-2 rounded" />
        <input type="text" placeholder="Test Name" className="w-full border p-2 rounded" />
        <textarea placeholder="Result Details" className="w-full border p-2 rounded"></textarea>
        <button className="bg-blue-700 text-blue px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
};

export default Results;
