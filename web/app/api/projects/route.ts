// app/api/projects/route.ts
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
})

const projectProto = grpc.loadPackageDefinition(packageDefinition).project

const client = new projectProto.ProjectService(
  "localhost:50051",
  grpc.credentials.createInsecure()
)

export async function GET(request: Request) {
  try {
    const response = await new Promise((resolve, reject) => {
      client.listProjects({}, (err: any, response: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(response.projects)
        }
      })
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}