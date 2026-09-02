"""
Import vectors to Qdrant Cloud from exported JSON file.
Usage: 
  1. Set QDRANT_URL and QDRANT_API_KEY in .env
  2. python import_vectors.py [--file path/to/export.json]
"""
import json
import sys
import os
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct


def import_vectors():
    # Get cloud credentials
    qdrant_url = os.getenv("QDRANT_URL")
    qdrant_api_key = os.getenv("QDRANT_API_KEY")
    
    if not qdrant_url or not qdrant_api_key:
        print("Error: QDRANT_URL and QDRANT_API_KEY must be set in .env file")
        print("\nSetup instructions:")
        print("1. Go to https://cloud.qdrant.io/")
        print("2. Create a free account and cluster")
        print("3. Copy the cluster URL and API key")
        print("4. Add to .env:")
        print("   QDRANT_URL=https://your-cluster.qdrant.io:6333")
        print("   QDRANT_API_KEY=your_api_key_here")
        return
    
    # Find export file
    export_file = None
    for arg in sys.argv[1:]:
        if arg.startswith("--file="):
            export_file = arg.split("=", 1)[1]
        elif not arg.startswith("--"):
            export_file = arg
    
    if not export_file:
        # Try default location
        default_path = Path(__file__).resolve().parent.parent / "exports" / "vectors_export.json"
        if default_path.exists():
            export_file = str(default_path)
        else:
            print("Error: No export file specified")
            print("Usage: python import_vectors.py --file=path/to/vectors_export.json")
            return
    
    export_path = Path(export_file)
    if not export_path.exists():
        print(f"Error: Export file not found: {export_file}")
        return
    
    print(f"Loading vectors from: {export_file}")
    with open(export_path) as f:
        data = json.load(f)
    
    collection_name = data["collection_name"]
    vector_size = data["vector_size"]
    total_points = data["total_points"]
    
    print(f"Collection: {collection_name}")
    print(f"Vector size: {vector_size}")
    print(f"Total points: {total_points}")
    
    # Connect to Qdrant Cloud
    print(f"\nConnecting to Qdrant Cloud: {qdrant_url}")
    client = QdrantClient(url=qdrant_url, api_key=qdrant_api_key)
    
    # Create collection if it doesn't exist
    collections = [c.name for c in client.get_collections().collections]
    if collection_name not in collections:
        print(f"Creating collection: {collection_name}")
        client.create_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE),
        )
    else:
        print(f"Collection '{collection_name}' already exists")
    
    # Import points in batches
    print("\nImporting vectors...")
    batch_size = 100
    imported = 0
    
    for i in range(0, len(data["points"]), batch_size):
        batch = data["points"][i:i + batch_size]
        
        points = []
        for p in batch:
            points.append(PointStruct(
                id=p["id"],
                vector=p["vector"],
                payload=p["payload"],
            ))
        
        client.upsert(collection_name=collection_name, points=points)
        imported += len(batch)
        print(f"  Imported {imported}/{total_points} points")
    
    print(f"\nImport complete!")
    print(f"  Collection: {collection_name}")
    print(f"  Points imported: {imported}")
    print(f"\nUpdate your .env file:")
    print(f"  QDRANT_URL={qdrant_url}")
    print(f"  QDRANT_API_KEY={qdrant_api_key}")


if __name__ == "__main__":
    import_vectors()
