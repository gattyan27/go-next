import Link from "next/link"

type JobCardProps = {
  id?: number
  title: string
  company: string
  location: string
  salary: string
}

const JobCard = ({ id, title, company, location, salary }: JobCardProps) => {
  return (
    <div className="bg-white shadow-md rounded-md p-4">
      <h2 className="text-gray-700 text-lg font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 mb-1">{company}</p>
      <p className="text-gray-600 mb-1">{location}</p>
      <p className="text-gray-600">{salary}</p>
      {id && (
        <Link href={`/projects/${id}`}>
          <p className="text-blue-500 hover:underline">詳細を見る</p>
        </Link>
      )}
    </div>
  )
}

export default JobCard
