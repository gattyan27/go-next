import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import { NextResponse } from "next/server"
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

export async function POST(request: Request) {
  try {
    const projectData = await request.json()
    const response = await new Promise((resolve, reject) => {
      client.createProject(
        { project: projectData },
        (err: any, response: any) => {
          if (err) {
            reject(err)
          } else {
            resolve(response.project)
          }
        }
      )
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "An error occurred while creating the project" },
      { status: 500 }
    )
  }
}
