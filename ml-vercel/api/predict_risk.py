from http.server import BaseHTTPRequestHandler
import json


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length)) if length else {}

        series = body.get("predicted_series", [])
        savings_rate = float(body.get("savings_rate", 0))
        debt_ratio = float(body.get("debt_ratio", 0))

        mean_pred = sum(series) / max(1, len(series))
        variability = (max(series) - min(series)) if len(series) > 1 else 0
        score = int(min(100, max(0,
            (variability / max(1, mean_pred)) * 100
            - savings_rate * 20
            + debt_ratio * 50
        )))

        risk_class = "low" if score < 30 else ("medium" if score < 70 else "high")

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps({
            "risk_score": score,
            "risk_class": risk_class,
            "reasons": [
                f"variability:{round(variability, 2)}",
                f"savings_rate:{savings_rate}"
            ]
        }).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, x-api-key")
        self.end_headers()
