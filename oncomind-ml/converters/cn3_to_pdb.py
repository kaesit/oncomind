import argparse
import json
import gzip
import os


def load_cn3(path: str):
     try:
          # Try gzip
          with gzip.open(path, "rt", encoding="utf-8") as f:
               return json.load(f)
     except OSError:
          # Not gzip → load normal JSON
          with open(path, "r", encoding="utf-8") as f:
               return json.load(f)


def extract_atoms(data: dict):
    """
    Attempt to extract atom coordinates and elements from CN3.

    Expected CN3 structure examples:
    {
         "atoms": {
              "coords": [[x,y,z], ...],
              "elements": ["C", "N", ...]
         }
    }

    or:

    {
         "positions": [...],
         "types": [...]
    }
    """

    # Case 1: atoms → coords + elements
    if "atoms" in data:
        atom_block = data["atoms"]
        coords = atom_block.get("coords")
        elements = atom_block.get("elements")
        if coords and elements:
            return coords, elements

    # Case 2: positions + types
    if "positions" in data and "types" in data:
        return data["positions"], data["types"]

    # Case 3: heuristic search
    candidates = []
    for key, val in data.items():
        if isinstance(val, dict):
            if "coords" in val and "elements" in val:
                return val["coords"], val["elements"]
        if key.lower() in ("coords", "coordinates") and "elements" in data:
            return data[key], data["elements"]

    raise ValueError("No atom coordinate data found in CN3 file.")


def write_pdb(coords, elements, output_path):
    """Write minimal PDB ATOM records."""
    with open(output_path, "w") as f:
        for i, (xyz, elem) in enumerate(zip(coords, elements), start=1):
            x, y, z = xyz
            f.write(
                f"ATOM  {i:5d}  {elem:>2}   MOL     1"
                f"    {x:8.3f}{y:8.3f}{z:8.3f}  1.00  0.00           {elem:>2}\n"
            )
        f.write("END\n")


def main():
     parser = argparse.ArgumentParser(
          description="Convert a CN3 molecular file to PDB format."
     )

     parser.add_argument(
          "--input",
          type=str,
          required=True,
          help="Path to input CN3 file, e.g. example.cn3",
     )
     parser.add_argument(
          "--output", type=str, default=None, help="Output PDB path, e.g. example.pdb"
     )
     args = parser.parse_args()

     input_path = args.input
     output_path = args.output

     if output_path is None:
          output_path = os.path.splitext(input_path)[0] + ".pdb"

     print(f"🔹 Loading CN3 file: {input_path}")
     data = load_cn3(input_path)

     print("🔹 Extracting atoms...")
     coords, elements = extract_atoms(data)

     print("🔹 Writing PDB output...")
     write_pdb(coords, elements, output_path)

     print(f"✅ Conversion complete: {output_path}")


if __name__ == "__main__":
     main()
