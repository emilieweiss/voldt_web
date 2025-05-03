
const SignUp = () => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold">Sign Up</h2>
      <form>
        <div>
          <label>Email:</label>
          <input type="email" className="border rounded px-2 py-1" />
        </div>
        <div className="mt-4">
          <label>Password:</label>
          <input type="password" className="border rounded px-2 py-1" />
        </div>
        <button className="bg-blue-500 text-white py-2 px-4 rounded mt-4">Sign Up</button>
      </form>
    </div>
  )
}

export default SignUp
