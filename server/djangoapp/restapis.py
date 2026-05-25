import requests
from django.conf import settings

backend_url = getattr(settings, 'backend_url', '')
sentiment_analyzer_url = getattr(settings, 'sentiment_analyzer_url', '')


def get_request(endpoint, **kwargs):
    params = ""
    if kwargs:
        for key, value in kwargs.items():
            params = params + key + "=" + value + "&"

    request_url = backend_url + endpoint + "?" + params
    print("GET from {}".format(request_url))
    try:
        response = requests.get(request_url)
        return response.json()
    except Exception:
        print("Network exception occurred")
        return None


def analyze_review_sentiments(text):
    request_url = sentiment_analyzer_url + "analyze/" + text
    try:
        response = requests.get(request_url)
        return response.json()
    except Exception:
        print("Network exception occurred")
        return {"sentiment": "neutral"}


def post_review(data_dict):
    request_url = backend_url + "/insert_review"
    try:
        response = requests.post(request_url, json=data_dict)
        return response.json()
    except Exception:
        print("Network exception occurred")
        return None
