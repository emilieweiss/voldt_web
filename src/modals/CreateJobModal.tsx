import React, { useState } from "react"
import { supabase } from "../lib/supabaseClient"

interface CreateJobModalProps {
  isOpen: boolean
  onClose: () => void
}

const CreateJobModal: React.FC<CreateJobModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("")
  const [address, setAddress] = useState("")
  const [description, setDescription] = useState("")
  const [timeEstimate, setTimeEstimate] = useState("")
  const [deliveryTime, setDeliveryTime] = useState("")
  const [economy, setEconomy] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setLoading(true)

    if (!title || !address || !description || !timeEstimate || !deliveryTime || !economy) {
      setErrorMsg("Alle felter skal udfyldes")
      setLoading(false)
      return
    }

    const { error } = await supabase.from("job").insert({
      title,
      address,
      description,
      time: parseInt(timeEstimate),
      delivery: deliveryTime,
      money: parseFloat(economy),
    })

    setLoading(false)

    if (error) {
      console.error(error)
      setErrorMsg("Noget gik galt – prøv igen")
    } else {
      alert("Opgaven er oprettet!")
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-3/4 max-w-4xl p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">✕</button>
        <h2 className="text-2xl font-bold mb-6">Opret ny opgave</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-2">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded px-4 py-2" />
          </div>
          <div>
            <label className="block mb-2">Adresse</label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border rounded px-4 py-2" />
          </div>
          <div>
            <label className="block mb-2">Beskrivelse</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded px-4 py-2" />
          </div>
          <div>
            <label className="block mb-2">Tidsestimat (minutter)</label>
            <input value={timeEstimate} onChange={(e) => setTimeEstimate(e.target.value)} className="w-full border rounded px-4 py-2" />
          </div>
          <div>
            <label className="block mb-2">Afleveringstidspunkt</label>
            <input value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} className="w-full border rounded px-4 py-2" />
          </div>
          <div>
            <label className="block mb-2">Økonomi</label>
            <input value={economy} onChange={(e) => setEconomy(e.target.value)} className="w-full border rounded px-4 py-2" />
          </div>

          {errorMsg && (
            <div className="col-span-2 text-red-500 text-sm">{errorMsg}</div>
          )}

          <div className="col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white py-2 px-6 rounded disabled:opacity-50"
            >
              {loading ? "Opretter..." : "Opret opgave"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateJobModal
