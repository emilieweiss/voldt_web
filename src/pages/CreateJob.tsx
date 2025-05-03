
const CreateJob = () => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold">Create a New Job</h2>
      <form>
        <div>
          <label>Job Title:</label>
          <input type="text" className="border rounded px-2 py-1" />
        </div>
        <div className="mt-4">
          <label>Job Description:</label>
          <textarea className="border rounded px-2 py-1"></textarea>
        </div>
        <button className="bg-blue-500 text-white py-2 px-4 rounded mt-4">Create Job</button>
      </form>
    </div>
  )
}

export default CreateJob
