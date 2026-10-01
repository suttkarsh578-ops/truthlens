import os
import pandas as pd

def inspect_datasets():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    csv_paths = [
        os.path.join(base_dir, "data", "raw", "Fake.csv"),
        os.path.join(base_dir, "data", "raw", "True.csv")
    ]
    
    for path in csv_paths:
        print("=" * 60)
        print(f"Inspecting file: {path}")
        print("=" * 60)
        if not os.path.exists(path):
            print("File does not exist!")
            continue
        
        df = pd.read_csv(path)
        print(f"Total Rows: {len(df)}")
        print(f"Columns: {list(df.columns)}")
        print(f"Data Types:\n{df.dtypes}")
        print("\nNull Values:")
        print(df.isnull().sum())
        print(f"\nTotal Duplicates (all cols): {df.duplicated().sum()}")
        print(f"Duplicate (title+text): {df.duplicated(subset=['title', 'text']).sum()}")
        print("\nSample 2 rows:")
        for idx, row in df.head(2).iterrows():
            print(f"[{idx}] Title: {row['title']}")
            print(f"    Subject: {row.get('subject', 'N/A')}, Date: {row.get('date', 'N/A')}")
            print(f"    Text snippet: {str(row['text'])[:120]}...\n")

if __name__ == "__main__":
    inspect_datasets()
