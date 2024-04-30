package main

import (
	"context"
	"log"
	"net"

	"github.com/gattyan27/go-next/server/project"
	"google.golang.org/grpc"
)

type server struct {
    project.UnimplementedProjectServiceServer
}

func (s *server) ListProjects(ctx context.Context, req *project.ListProjectsRequest) (*project.ListProjectsResponse, error) {
    // TODO: データベースから案件情報を取得する処理を実装
    projects := []*project.Project{
        {Id: 1, Name: "Project 1", Description: "Description 1"},
        {Id: 2, Name: "Project 2", Description: "Description 2"},
    }
    return &project.ListProjectsResponse{Projects: projects}, nil
}

func main() {
    lis, err := net.Listen("tcp", ":50051")
    if err != nil {
        log.Fatalf("failed to listen: %v", err)
    }
    s := grpc.NewServer()
    project.RegisterProjectServiceServer(s, &server{})
    if err := s.Serve(lis); err != nil {
        log.Fatalf("failed to serve: %v", err)
    }
}
