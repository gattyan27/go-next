// app/page.tsx
"use client"

import { useEffect, useState } from "react"

interface Project {
  id: number
  name: string
  description: string
}

const Home = () => {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error(err))
  }, [])

  console.log(projects)

  return (
    <div>
      <h1>Projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default Home
