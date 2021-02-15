import sys; 
import json;

filenamePayload = f"temp/{sys.argv[1:][0]}-payload.json"
filenameCode = f"temp/{sys.argv[1:][0]}-eval-code"

with open(filenamePayload, 'r') as json_file:

    with open(filenameCode, 'r') as eval_file:
        payload = json.load(json_file)
        data = eval_file.read()

        exec(data)

        print(execute(payload))
