import json

log_path = r"C:\Users\teams\.gemini\antigravity\brain\94c53cdd-7191-4fa2-a0a7-14b4def6ddc8\.system_generated\logs\transcript.jsonl"

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        step = data.get("step_index", 0)
        # We want to see steps 185 to 200
        if 184 <= step <= 210:
            print(f"=== Step {step} ({data.get('source')}) ===")
            if data.get('content'):
                print("Content preview:", data.get('content')[:500])
            if data.get('tool_calls'):
                for tc in data['tool_calls']:
                    print(f"Tool: {tc.get('name')}")
                    print(f"Args: {json.dumps(tc.get('args'), ensure_ascii=False)[:500]}")
