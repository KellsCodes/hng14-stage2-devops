import sys
import redis
import time
import os
import signal

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
r = redis.Redis(host=REDIS_HOST, port=6379, decode_responses=True)


keep_running = True


def handle_signal(signum, frame):
    global keep_running
    print("Received shutdown signal, Finishing current job...")
    keep_running = False


signal.signal(signal.SIGTERM, handle_signal)
signal.signal(signal.SIGINT, handle_signal)


def process_job(job_id):
    try:
        print(f"Processing job {job_id}")
        time.sleep(2)  # simulate work
        r.hset(f"job:{job_id}", "status", "completed")
        r.lrem("job_processing", 0, job_id)  # remove job from processing list
        print(f"Done: {job_id}")
    except Exception as e:
        print(f"Error processing job {job_id}: {e}")
        r.hset(f"job:{job_id}", "status", "failed")


while keep_running:
    try:
        job_id = r.brpoplpush("job", "job_processing", timeout=5)
        if job_id:
            process_job(job_id)
    except redis.ConnectionError:
        print("Redis connection error, retrying in 5 seconds...")
        time.sleep(5)
    except Exception as e:
        print(f"Error in worker loop: {e}")

print("Worker shutting down...")
sys.exit(0)
