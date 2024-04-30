// app/page.tsx
"use client"

import { useEffect, useState } from "react"
import JobCard from "../components/JobCard"
import SearchBar from "../components/SearchBar"

interface Project {
  id: number
  title: string
  description: string
  salary: string
  client: Client
}

interface Client {
  id: number
  company_name: string
  address: string
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error(err))
  }, [])

  console.log(projects)
  return (
    <div className="p-8">
      <SearchBar />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {projects.map((project, index) => (
          <JobCard
            id={project.id}
            key={index}
            title={project.title}
            company={project.client.company_name}
            location={project.client.address}
            salary={project.salary}
          />
        ))}
      </div>
    </div>
  )
}
