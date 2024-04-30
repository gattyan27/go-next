import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import path from "path"

const PROTO_PATH = path.join(process.cwd(), "proto", "project.proto")
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
}) as protoLoader.PackageDefinition

const grpcObject = grpc.loadPackageDefinition(packageDefinition) as any
const client = new grpcObject.project.ProjectService(
  "server:50051",
  grpc.credentials.createInsecure()
)

export async function GET(
  req: Request,
  context: { params: { projectId: string } }
) {
  console.log("Request received")
  const { projectId } = context.params
  if (!projectId || typeof projectId !== "string") {
    return Response.json({ error: "Project ID is required" })
  }

  try {
    const response = await new Promise((resolve, reject) => {
      client.getProject({ id: projectId }, (err: any, response: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(response.project)
        }
      })
    })

    return Response.json(response)
  } catch (error) {
    console.error(error)
    return Response.json(
      { error: "An error occurred while fetching project details" },
      { status: 500 }
    )
  }
}
