from fastapi.testclient import TestClient
from backend import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

def test_songs_endpoint():
    response = client.get("/songs")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if len(data) > 0:
        assert "title" in data[0]

def test_song_by_id():
    # Assuming /songs/{id} exists in your API
    response = client.get("/songs/1")
    if response.status_code == 200:
        data = response.json()
        assert "title" in data
    else:
        assert response.status_code in (404, 422)
