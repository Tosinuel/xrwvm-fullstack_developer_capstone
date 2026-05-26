import requests
from django.conf import settings

backend_url = getattr(settings, 'backend_url', '')
sentiment_analyzer_url = getattr(settings, 'sentiment_analyzer_url', '')


def get_request(endpoint, **kwargs):
    params = ""
    if kwargs:
        param_list = []
        for key, value in kwargs.items():
            param_list.append(key + "=" + value)
        params = "&".join(param_list) + "&"

    # Build URL properly - only add "?" if there are params
    if params:
        request_url = backend_url + endpoint + "?" + params
    else:
        request_url = backend_url + endpoint

    print("GET from {}".format(request_url))
    try:
        response = requests.get(request_url)
        return response.json()
    except Exception as e:
        print(f"Network exception occurred: {e}")
        return None


def analyze_review_sentiments(text):
    request_url = sentiment_analyzer_url + "analyze/" + text
    try:
        response = requests.get(request_url)
        return response.json()
    except Exception as e:
        print(f"Network exception occurred: {e}")
        return {"sentiment": "neutral"}


def post_review(data_dict):
    request_url = backend_url + "/insert_review"
    try:
        response = requests.post(request_url, json=data_dict)
        return response.json()
    except Exception as e:
        print(f"Network exception occurred: {e}")
        return None
