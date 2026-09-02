"""
Export vectors from local Qdrant to JSON file.
Usage: python export_vectors.py
Output: ../exports/vectors_export.json
"""
import json
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from qdrant_client import QdrantClient
from rag.vectorstore import COLLECTION_NAME, PERSIST_DIR


def export_vectors():
    print(f"Exporting from local Qdrant at: {PERSIST_DIR}")
    
    client = QdrantClient(path=PERSIST_DIR)
    
    try:
        info = client.get_collection(COLLECTION_NAME)
        total_points = info.points_count or 0
    except Exception as e:
        print(f"Error: Collection '{COLLECTION_NAME}' not found. Run ingest.py first.")
        return
    
    print(f"Found {total_points} vectors to export")
    
    # Scroll through all points
    all_points = []
    offset = None
    batch_num = 0
    
    while True:
        result = client.scroll(
            collection_name=COLLECTION_NAME,
            limit=100,
            offset=offset,
            with_payload=True,
            with_vectors=True,
        )
        
        points, next_offset = result
        all_points.extend(points)
        batch_num += 1
        print(f"  Batch {batch_num}: fetched {len(points)} points (total: {len(all_points)})")
        
        if next_offset is None:
            break
        offset = next_offset
    
    # Convert to export format
    export_data = {
        "collection_name": COLLECTION_NAME,
        "vector_size": 384,
        "total_points": len(all_points),
        "points": []
    }
    
    for point in all_points:
        export_data["points"].append({
            "id": str(point.id),
            "vector": point.vector,
            "payload": point.payload,
        })
    
    # Save to file
    export_dir = Path(__file__).resolve().parent.parent / "exports"
    export_dir.mkdir(exist_ok=True)
    output_file = export_dir / "vectors_export.json"
    
    with open(output_file, "w") as f:
        json.dump(export_data, f)
    
    print(f"\nExport complete!")
    print(f"  File: {output_file}")
    print(f"  Points: {len(all_points)}")
    print(f"  Size: {output_file.stat().st_size / 1024:.1f} KB")
    print(f"\nNext step: Upload this file to Qdrant Cloud using import_vectors.py")


if __name__ == "__main__":
    export_vectors()
