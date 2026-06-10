import json

log_path = r"C:\Users\teams\.gemini\antigravity\brain\94c53cdd-7191-4fa2-a0a7-14b4def6ddc8\.system_generated\logs\transcript.jsonl"

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        if data.get('type') == 'USER_INPUT':
            print(f"Step {data.get('step_index')}: {data.get('content')}")

