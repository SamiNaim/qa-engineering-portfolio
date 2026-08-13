"""Catnip — the Flask app from docker-curriculum.com, with an Elasticsearch-backed
search endpoint so the same image can also demonstrate multi-container networking.

Single container:   ES_URL unset  -> "/" works, "/search" returns 503
docker compose:     ES_URL=http://es:9200 -> "/search" queries the es service
"""

import os
import random
import socket

import requests
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

CAT_GIFS = [
    "https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif",
    "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif",
    "https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif",
    "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif",
]

# Read once at import time: environment is how a container is configured.
ES_URL = os.environ.get("ES_URL")
INDEX = "trucks"

SEED_DOCS = [
    {"name": "Kung Fu Tacos", "food": "tacos burritos mexican"},
    {"name": "Curry Up Now", "food": "curry indian burrito"},
    {"name": "The Chairman", "food": "bao pork chinese"},
]


def es_health():
    if not ES_URL:
        return "not configured"
    try:
        r = requests.get(f"{ES_URL}/_cluster/health", timeout=2)
        return r.json().get("status", "unknown")
    except requests.RequestException as exc:
        return f"unreachable ({exc.__class__.__name__})"


def ensure_seeded():
    """Create and fill the index on first use. Idempotent, so restarts are cheap."""
    if requests.head(f"{ES_URL}/{INDEX}", timeout=5).status_code == 200:
        return
    requests.put(f"{ES_URL}/{INDEX}", timeout=10)
    for i, doc in enumerate(SEED_DOCS, start=1):
        requests.put(
            f"{ES_URL}/{INDEX}/_doc/{i}",
            json=doc,
            params={"refresh": "wait_for"},
            timeout=10,
        )


@app.route("/")
def index():
    return render_template(
        "index.html",
        url=random.choice(CAT_GIFS),
        hostname=socket.gethostname(),
        es_status=es_health(),
    )


@app.get("/health")
def health():
    """Used by the Dockerfile HEALTHCHECK and by compose's depends_on."""
    return jsonify(status="ok", hostname=socket.gethostname(), elasticsearch=es_health())


@app.get("/search")
def search():
    if not ES_URL:
        return jsonify(error="ES_URL is not set; start this app with docker compose"), 503

    ensure_seeded()
    query = request.args.get("q", "")
    response = requests.get(
        f"{ES_URL}/{INDEX}/_search",
        json={"query": {"multi_match": {"query": query, "fields": ["name", "food"]}}},
        timeout=5,
    )
    hits = response.json()["hits"]["hits"]
    return jsonify(query=query, count=len(hits), results=[hit["_source"] for hit in hits])


if __name__ == "__main__":
    # 0.0.0.0, not 127.0.0.1: the port has to be reachable from outside the container.
    app.run(host="0.0.0.0", port=5000)
