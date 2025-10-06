import json
import pandas as pd

def normalize_playlist(json_path: str, csv_out: str = "normalized.csv"):
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Convert dict-of-dicts → DataFrame
    df = pd.DataFrame(data)
    
    # Add optional column for ratings (default None)
    if "star_rating" not in df.columns:
        df["star_rating"] = None
    
    df.to_csv(csv_out, index=False)
    return df

if __name__ == "__main__":
    df = normalize_playlist("playlist.json")
    print(df.head())
