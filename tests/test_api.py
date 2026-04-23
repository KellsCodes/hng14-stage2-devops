def test_create_job(client):
    response = client.post("/jobs")
    assert response.status_code == 201
    assert "job_id" in response.json()


def test_get_job_not_found(client):
    response = client.get("/jobs/non-existent-id")
    assert response.status_code == 404
    assert response.json() == {"detail": "Job not found"}


def test_get_job_status(client, mock_redis):
    # Manually inject a job into our fake redis
    job_id = "test-uuid"
    mock_redis.hset(f"job:{job_id}", "status", "completed")

    response = client.get(f"/jobs/{job_id}")
    assert response.status_code == 200
    assert response.json() == {"job_id": job_id, "status": "completed"}
