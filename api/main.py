from fastapi import FastAPI, HTTPException
import redis
import uuid
import os

app = FastAPI()

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)


@app.post("/jobs", status_code=201)  # Set explicit 201 status
def create_job():
    job_id = str(uuid.uuid4())
    # Use a pipeline to ensure both operations are sent together
    pipe = r.pipeline()
    pipe.lpush("job", job_id)
    pipe.hset(f"job:{job_id}", "status", "queued")
    pipe.execute()
    return {"job_id": job_id}


@app.get("/jobs/{job_id}")
def get_job(job_id: str):
    status = r.hget(f"job:{job_id}", "status")
    if status is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"job_id": job_id, "status": status}


@app.get("/health")
def health_check():
    return {"status": "ok"}
