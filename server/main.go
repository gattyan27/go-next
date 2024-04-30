package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net"

	clientPb "github.com/gattyan27/go-next/server/pkg/grpc/client"
	projectPb "github.com/gattyan27/go-next/server/pkg/grpc/project"
	_ "github.com/lib/pq"

	"google.golang.org/grpc"
)

type server struct {
	projectPb.UnimplementedProjectServiceServer
	db *sql.DB
}

func NewServer(db *sql.DB) *server {
	return &server{db: db}
}

func (s *server) GetProject(ctx context.Context, req *projectPb.GetProjectRequest) (*projectPb.GetProjectResponse, error) {
	var p projectPb.Project
	var clientID int64
	err := s.db.QueryRow(`SELECT id, title, description, client_id, salary FROM projects WHERE id = $1`, req.Id).Scan(&p.Id, &p.Title, &p.Description, &clientID, &p.Salary)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("no project found with id: %v", req.Id)
		}
		return nil, fmt.Errorf("query failed: %v", err)
	}

	client := &clientPb.Client{}
	if err := s.db.QueryRow(`SELECT id, company_name, address FROM clients WHERE id = $1`, clientID).Scan(&client.Id, &client.CompanyName, &client.Address); err != nil {
		return nil, fmt.Errorf("query client failed: %v", err)
	}
	p.Client = client

	return &projectPb.GetProjectResponse{Project: &p}, nil
}

func (s *server) ListProjects(ctx context.Context, req *projectPb.ListProjectsRequest) (*projectPb.ListProjectsResponse, error) {
	projects := []*projectPb.Project{}
	rows, err := s.db.Query(`SELECT id, title, description, client_id, salary FROM projects ORDER BY id DESC LIMIT 10`)
	if err != nil {
		return nil, fmt.Errorf("query failed: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var p projectPb.Project
		var clientID int64
		if err := rows.Scan(&p.Id, &p.Title, &p.Description, &clientID, &p.Salary); err != nil {
			return nil, fmt.Errorf("rows scan failed: %v", err)
		}
		// Fetch client information based on clientID
		client := &clientPb.Client{}
		if err := s.db.QueryRow(`SELECT id, company_name, address FROM clients WHERE id = $1`, clientID).Scan(&client.Id, &client.CompanyName, &client.Address); err != nil {
			return nil, fmt.Errorf("query client failed: %v", err)
		}
		p.Client = client
		projects = append(projects, &p)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows final error: %v", err)
	}

	return &projectPb.ListProjectsResponse{Projects: projects}, nil
}

func (s *server) CreateProject(ctx context.Context, req *projectPb.CreateProjectRequest) (*projectPb.CreateProjectResponse, error) {
	tx, err := s.db.Begin()
	if err != nil {
		return nil, fmt.Errorf("begin transaction failed: %v", err)
	}
	defer tx.Rollback()

	var projectID int64
	err = tx.QueryRow(`INSERT INTO projects (title, description, client_id, salary) VALUES ($1, $2, $3, $4) RETURNING id`,
		req.Project.Title, req.Project.Description, req.Project.Client.Id, req.Project.Salary).Scan(&projectID)
	if err != nil {
		return nil, fmt.Errorf("insert project failed: %v", err)
	}

	if err := tx.Commit(); err != nil {
		return nil, fmt.Errorf("commit transaction failed: %v", err)
	}

	return &projectPb.CreateProjectResponse{
		Project: &projectPb.Project{
			Id:          projectID,
			Title:       req.Project.Title,
			Description: req.Project.Description,
			Salary:      req.Project.Salary,
			Client:      req.Project.Client,
		},
	}, nil
}

func main() {
	connStr := "user=postgres password=postgres dbname=postgres sslmode=disable host=db port=5432"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("failed to open database: %v", err)
	}
	defer db.Close()

	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	projectPb.RegisterProjectServiceServer(s, NewServer(db))
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}