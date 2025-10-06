from fastapi import FastAPI, HTTPException
import pandas as pd

app = FastAPI()

# Load normalized CSV
df = pd.read_csv("normalized.csv")

@app.get("/songs")
def get_songs(skip: int = 0, limit: int = 10):
    """Fetch all songs with pagination"""
    return df.iloc[skip: skip + limit].to_dict(orient="records")

@app.get("/songs/{title}")
def get_song(title: str):
    """Fetch a song by title"""
    match = df[df["title"].str.lower() == title.lower()]
    if match.empty:
        raise HTTPException(status_code=404, detail="Song not found")
    return match.to_dict(orient="records")

@app.post("/songs/{song_id}/rate")
def rate_song(song_id: str, rating: int):
    """Rate a song (1–5 stars)"""
    if rating < 1 or rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be 1–5")
    idx = df[df["id"] == song_id].index
    if idx.empty:
        raise HTTPException(status_code=404, detail="Song not found")
    df.loc[idx, "star_rating"] = rating
    df.to_csv("normalized.csv", index=False)
    return {"song_id": song_id, "rating": rating}
