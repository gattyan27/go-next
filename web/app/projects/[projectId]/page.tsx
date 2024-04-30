"use client"

import JobCard from "@/app/components/JobCard"
import SearchBar from "@/app/components/SearchBar"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

interface Project {
  id: number
  title: string
  description: string
  salary: string
  client: {
    id: number
    company_name: string
    address: string
  }
}

const ProjectDetailsPage = () => {
  const params = useParams()
  const projectId = params.projectId
  const [project, setProject] = useState<Project | null>(null)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    if (projectId) {
      fetch(`/api/projects/${projectId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error)
          } else {
            setProject(data)
          }
        })
        .catch((err) => {
          setError("Failed to fetch project details")
        })
    }
  }, [projectId])

  if (error) {
    return <p>Error: {error}</p>
  }

  if (!project) {
    return <p>Loading...</p>
  }

  return (
    <div className="p-8">
      <SearchBar />
      <div className="mt-4">
        <JobCard
          title={project.title}
          company={project.client.company_name}
          location={project.client.address}
          salary={project.salary}
        />
      </div>
    </div>
  )
}

export default ProjectDetailsPage
