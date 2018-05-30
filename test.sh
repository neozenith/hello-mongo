for i in `seq 1 100`; do 
	curl -H "Content-Type: application/json" -d @body.json -X POST http://localhost:3000/test
done
