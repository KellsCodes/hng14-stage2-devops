File: api/main.py
Line: 8
Issue: Manually calling .decode function
Solution: initialized client with decode_responses set to True and removed te manual .decode function.

File: api/main.py
Line: 22
Issue: if not status condition is broad check for any falsy value; triggers if status is None or is an empty string (") or the number 0
Solution: if status is None; triggers only if the key/field does not exist in Redis. It is more precise. It allows empty strings or other falsy values to pass through if they are actually stored in the database.

File: api/main.py
Line: 23
Issue: return {"error": "not found"} returns HTTP 200 OK status code, this means success to the computer making it difficult for the frontend to catch and writes extra code to look inside the message to see if it's an error.
Solution: return {"error": "not found"}, 404. Returns the HTTP 404 Not Found status code. This follows standard REST API patterns.

File: api/main.py
Lines: 14 and 15
Issue: Atomicity (lpush then hset). The code performs the two separate operations. If a server crashes or the network blips after the lpush but before the hset, it will have a job_id in queue that has no corresponding metadata (status) in the hash
Solution: pipe = r.pipeline(); pipe.execute(). This ensures both commands happen together (or not at all).


File: api/main.py
Line: 8
Issue: Hardcoded host and port which fails when containerized.
Solution: Get the host and port values from environment variables or default to localhost or the default port.

File: api/requirements.txt
Lines: 1,2,3
Issue: No versioning on the dependencies, will cause dependency drift
Solution: Pinned the versions

File: frontend/app.js
Line: 6
Issue: Hardcoded string for API_URL, container cannot find the python API service in the Docker network
Solution: Use process.env

File: frontend/app.js
Line: 14
Issue: improper status code for resource creation
Solution: Return 201 status for successful creation

File: frontend/app.js
Line: 16
Issue: No logging for production debugging
Solution: Better logging for debugging in production

File: frontend/app.js
Line: 25
Issue: Does not handle specific status code from backend but general 500 server error
Solution: Pass through the actual status (404) and message

File: frontend/views/index.html
Line: 32
Issue: No safety check if request failed, kept polling continuously
Solution: check if the request failed and throw error and stop pollin so server will not be overwhelmed.

File: frontend/views/index.html
Line: 58
Issue: Not checking if the status is strictly terminal
Solution: Check for 'completed' and potential 'failed' states

File: worker/worker.py
Line: 6
Issue: Hardcoded connection and missing decoding
Solution: used os.getenv and decode_responses=True

File: worker/worker.py
Line: 4
Issue: Ungraceful shutdown (Zombie tasks), imported signal but never used.
Solution: Use a signal handler to finish the current job before exiting

File: worker/worker.py
Line: 24
Issue: Job remained in processing list after processing
Solution: Remove from 'processing' list once done

File: worker/worker.py
Line: 34
Issue: Data loss, brpop is destructive. If the worker crashes after this line but before finishing process_job, that job_id is lost.
Solution: use brpoplpush (reliable queue pattern) to move the job to a 'processing' list until it's finished.