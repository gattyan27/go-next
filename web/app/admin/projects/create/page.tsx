"use client"

import Example from "@/app/components/Dialog"
import { useState } from "react"

const CreateProjectPage = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [salary, setSalary] = useState("")
  const [clientId, setClientId] = useState("")
  const [showDialog, setShowDialog] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const newProject = {
      title,
      description,
      salary,
      client: {
        id: Number(clientId),
      },
    }

    try {
      const response = await fetch("/api/admin/projects/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      })
      const data = await response.json()
      if (data.error) {
        console.error(data.error)
      } else {
        // 成功時のハンドリングを更新
        setShowDialog(true) // モーダルを表示
        // フォームの値をリセット
        setTitle("")
        setDescription("")
        setSalary("")
        setClientId("")
      }
    } catch (error) {
      console.error("Failed to create project", error)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">新しいプロジェクトを作成</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            タイトル
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-gray-700 mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            説明
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="text-gray-700 mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label
            htmlFor="salary"
            className="block text-sm font-medium text-gray-700"
          >
            給与
          </label>
          <input
            type="text"
            id="salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="text-gray-700 mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label
            htmlFor="clientId"
            className="text-gray-700 block text-sm font-medium text-gray-700"
          >
            クライアントID
          </label>
          <input
            type="number"
            id="clientId"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="text-gray-700 mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
          >
            プロジェクトを作成
          </button>
        </div>
      </form>

      {/* 成功時に表示するモーダル */}
      {showDialog && <Example />}
    </div>
  )
}

export default CreateProjectPage
