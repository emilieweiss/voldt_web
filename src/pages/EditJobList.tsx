import { useParams } from 'react-router'

const EditJob = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold">Edit Job {id}</h2>
      <form>
        <div>
          <label>Job Title:</label>
          <input type="text" className="border rounded px-2 py-1" />
        </div>
        <div className="mt-4">
          <label>Job Description:</label>
          <textarea className="border rounded px-2 py-1"></textarea>
        </div>
        <button className="bg-blue-500 text-white py-2 px-4 rounded mt-4">Save Changes</button>
      </form>
    </div>
  )
}

export default EditJob
