import os
import re
import urllib.request
import urllib.error
import ssl

PDF_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "pdfs")
os.makedirs(PDF_DIR, exist_ok=True)

PDFS = [
    ("Annual-Report-FY25-26.pdf", "https://granulesindia.com/wp-content/uploads/2026/07/Granules_Annual-Report-FY26-1.pdf"),
    ("Integrated-Report-FY24-25.pdf", "https://granulesindia.com/wp-content/uploads/2025/07/Granules_Integrated-Report-2024-25.pdf"),
    ("Annual-Report-FY23-24.pdf", "https://granulesindia.com/wp-content/uploads/2024/07/GranulesIndia-limited-AR-2023-24.pdf"),
    ("Annual-Report-FY22-23.pdf", "https://granulesindia.com/wp-content/uploads/pdf/Granules-AR-2022-23.pdf"),
    ("Annual-Report-FY21-22.pdf", "https://granulesindia.com/wp-content/uploads/2022/09/Granules-India-AR-2021-22.pdf"),
    ("Annual-Report-FY20-21.pdf", "https://granulesindia.com/wp-content/uploads/pdf/7846Granules-AR-FY21.pdf"),
    ("Annual-Report-FY19-20.pdf", "https://granulesindia.com/wp-content/uploads/pdf/4302Granules%20AR%202019-20.pdf"),
    ("Annual-Report-FY18-19.pdf", "https://granulesindia.com/wp-content/uploads/pdf/3127Annual%20Report%20-%20FY18-19.pdf"),
    ("Annual-Report-FY17-18.pdf", "https://granulesindia.com/wp-content/uploads/pdf/8058Annual%20Report%20-%20FY17-18.pdf"),
    ("Annual-Report-FY16-17.pdf", "https://granulesindia.com/wp-content/uploads/pdf/2198AR2016-17.pdf"),
    ("Annual-Report-FY15-16.pdf", "https://granulesindia.com/wp-content/uploads/pdf/2668Annual%20Report%202015-2016.pdf"),
    ("Annual-Report-FY14-15.pdf", "https://granulesindia.com/wp-content/uploads/pdf/2427Annual%20Report%20-%20FY14-15.pdf"),
    ("Annual-Report-FY13-14.pdf", "https://granulesindia.com/wp-content/uploads/pdf/2027Annual%20Report%20-%20FY13-14.pdf"),
    ("Annual-Report-FY12-13.pdf", "https://granulesindia.com/wp-content/uploads/pdf/8742Annual%20Report%20-%20FY12-13.pdf"),
    ("Annual-Report-FY11-12.pdf", "https://granulesindia.com/wp-content/uploads/pdf/6127Annual%20Report%20-%20FY11-12.pdf"),
    ("Annual-Report-FY10-11.pdf", "https://granulesindia.com/wp-content/uploads/pdf/3268Annual%20Report%20-%20FY10-11.pdf"),
    ("Annual-Report-FY09-10.pdf", "https://granulesindia.com/wp-content/uploads/pdf/6181Annual%20Report%20-%20FY09-10.pdf"),
    ("Annual-Report-FY08-09.pdf", "https://granulesindia.com/wp-content/uploads/pdf/6994Annual%20Report%20-%20FY08-09.pdf"),
    ("Annual-Report-FY07-08.pdf", "https://granulesindia.com/wp-content/uploads/pdf/2157Annual%20Report%20-%20FY07-08.pdf"),
    ("Annual-Report-FY06-07.pdf", "https://granulesindia.com/wp-content/uploads/pdf/6249Annual%20Report%20-%20FY06-07.pdf"),
    ("Annual-Report-FY05-06.pdf", "https://granulesindia.com/wp-content/uploads/pdf/2361Annual%20Report%20-%20FY05-06.pdf"),
]

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

for filename, url in PDFS:
    filepath = os.path.join(PDF_DIR, filename)
    if os.path.exists(filepath):
        print(f"[SKIP] {filename} already exists")
        continue
    print(f"[DOWNLOAD] {filename}...", end=" ", flush=True)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, context=ctx, timeout=60) as resp:
            data = resp.read()
            with open(filepath, "wb") as f:
                f.write(data)
            print(f"OK ({len(data) / 1024 / 1024:.1f} MB)")
    except Exception as e:
        print(f"FAILED: {e}")

print("\nDone! PDFs saved to:", PDF_DIR)
print(f"Total files: {len([f for f in os.listdir(PDF_DIR) if f.endswith('.pdf')])}")
