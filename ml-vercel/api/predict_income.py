from http.server import BaseHTTPRequestHandler
import json


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length)) if length else {}

        recent_incomes = body.get("recent_incomes", [])
        amounts = [p["amount"] for p in recent_incomes if "amount" in p]
        avg = sum(amounts) / max(1, len(amounts))
        predicted = [round(avg * (0.95 + 0.1 * (i / 6)), 2) for i in range(7)]
        volatility = (max(amounts) - min(amounts)) if len(amounts) > 1 else 0.0

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps({
            "predicted_next_7d": predicted,
            "volatility": round(volatility, 2),
            "confidence": 0.80
        }).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, x-api-key")
        self.end_headers()
