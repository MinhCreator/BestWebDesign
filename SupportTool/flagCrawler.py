#!/usr/bin/env python3
"""
ISO 3166-1 Alpha-2 Country Flag Crawler

This script crawls minimalist square country flags from https://kapowaz.github.io/square-flags/gallery,
filters them to follow the ISO 3166-1 alpha-2 standard, and saves the metadata and/or downloads the flags.
"""

import argparse
import json
import os
import re
import time
import urllib.request
import urllib.error

# Official ISO 3166-1 alpha-2 codes as of current standard (fallback offline list)
OFFICIAL_ISO_3166_1 = {
    'ad', 'ae', 'af', 'ag', 'ai', 'al', 'am', 'ao', 'aq', 'ar', 'as', 'at', 'au', 'aw', 'ax', 'az',
    'ba', 'bb', 'bd', 'be', 'bf', 'bg', 'bh', 'bi', 'bj', 'bl', 'bm', 'bn', 'bo', 'bq', 'br', 'bs',
    'bt', 'bv', 'bw', 'by', 'bz', 'ca', 'cc', 'cd', 'cf', 'cg', 'ch', 'ci', 'ck', 'cl', 'cm', 'cn',
    'co', 'cr', 'cu', 'cv', 'cw', 'cx', 'cy', 'cz', 'de', 'dj', 'dk', 'dm', 'do', 'dz', 'ec', 'ee',
    'eg', 'eh', 'er', 'es', 'et', 'fi', 'fj', 'fk', 'fm', 'fo', 'fr', 'ga', 'gb', 'gd', 'ge', 'gf',
    'gg', 'gh', 'gi', 'gl', 'gm', 'gn', 'gp', 'gq', 'gr', 'gs', 'gt', 'gu', 'gw', 'gy', 'hk', 'hm',
    'hn', 'hr', 'ht', 'hu', 'id', 'ie', 'il', 'im', 'in', 'io', 'iq', 'ir', 'is', 'it', 'je', 'jm',
    'jo', 'jp', 'ke', 'kg', 'kh', 'ki', 'km', 'kn', 'kp', 'kr', 'kw', 'ky', 'kz', 'la', 'lb', 'lc',
    'li', 'lk', 'lr', 'ls', 'lt', 'lu', 'lv', 'ly', 'ma', 'mc', 'md', 'me', 'mf', 'mg', 'mh', 'mk',
    'ml', 'mm', 'mn', 'mo', 'mp', 'mq', 'mr', 'ms', 'mt', 'mu', 'mv', 'mw', 'mx', 'my', 'mz', 'na',
    'nc', 'ne', 'nf', 'ng', 'ni', 'nl', 'no', 'np', 'nr', 'nu', 'nz', 'om', 'pa', 'pe', 'pf', 'pg',
    'ph', 'pk', 'pl', 'pm', 'pn', 'pr', 'ps', 'pt', 'pw', 'py', 'qa', 're', 'ro', 'rs', 'ru', 'rw',
    'sa', 'sb', 'sc', 'sd', 'se', 'sg', 'si', 'sj', 'sk', 'sl', 'sm', 'sn', 'so', 'sr', 'ss', 'st',
    'sv', 'sx', 'sy', 'sz', 'tc', 'td', 'tf', 'tg', 'th', 'tj', 'tk', 'tl', 'tm', 'tn', 'to', 'tr',
    'tt', 'tv', 'tw', 'tz', 'ua', 'ug', 'um', 'us', 'uy', 'uz', 'va', 'vc', 've', 'vg', 'vi', 'vn',
    'vu', 'wf', 'ws', 'ye', 'yt', 'za', 'zm', 'zw'
}

def fetch_official_iso_codes():
    """Fetches the official list of ISO 3166-1 alpha-2 codes from a reliable online source."""
    url = "https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/all/all.json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        print("[*] Fetching official ISO 3166-1 alpha-2 list from GitHub...")
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode('utf-8'))
            codes = {item["alpha-2"].lower() for item in data if "alpha-2" in item}
            if codes:
                print(f"[+] Loaded {len(codes)} official ISO 3166-1 alpha-2 codes.")
                return codes
    except Exception as e:
        print(f"[!] Warning: Could not fetch official ISO list ({e}). Using offline fallback.")
    return OFFICIAL_ISO_3166_1

def crawl_flags(strict=True, download_dir=None, output_file=None, delay=0.1):
    """Crawls country flags from the gallery and processes them."""
    gallery_url = "https://kapowaz.github.io/square-flags/gallery"
    req = urllib.request.Request(gallery_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    
    print(f"[*] Fetching flag gallery from {gallery_url}...")
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            html = response.read().decode('utf-8')
    except Exception as e:
        print(f"[-] Error: Failed to fetch gallery webpage: {e}")
        return

    # Extract flag card elements
    # Format pattern matches:
    # <div id="flag-ad">
    #   <code title="ad">ad</code>
    #   <img src="flags/ad.svg" />
    #   <p>Andorra</p>
    # </div>
    pattern = re.compile(
        r'<div id="flag-([^"]+)">\s*<code title="[^"]+">[^<]+</code>\s*<img src="([^"]+)" />\s*<p>([^<]+)</p>\s*</div>',
        re.DOTALL
    )
    
    matches = pattern.findall(html)
    print(f"[+] Found {len(matches)} total flags listed in the gallery.")
    
    # Load comparison set
    iso_set = fetch_official_iso_codes() if strict else None
    
    results = []
    skipped_non_iso = []
    skipped_format = []
    
    for code, img_path, name in matches:
        code_clean = code.strip().lower()
        name_clean = name.strip()
        
        # Check basic ISO 3166-1 alpha-2 shape: 2 letters
        is_two_letter = len(code_clean) == 2 and code_clean.isalpha()
        
        if not is_two_letter:
            skipped_format.append((code_clean, name_clean))
            continue
            
        if strict and code_clean not in iso_set:
            skipped_non_iso.append((code_clean, name_clean))
            continue
            
        full_img_url = f"https://kapowaz.github.io/square-flags/{img_path}"
        results.append({
            "code": code_clean.upper(),
            "name": name_clean,
            "image_url": full_img_url,
            "local_filename": f"{code_clean}.svg"
        })
        
    print(f"[+] Extracted {len(results)} valid country flag entries.")
    if skipped_non_iso:
        print(f"[*] Skipped {len(skipped_non_iso)} 2-letter codes not in ISO 3166-1: "
              f"{', '.join([c[0] for c in skipped_non_iso])}")
    if skipped_format:
        print(f"[*] Skipped {len(skipped_format)} non-two-letter subnational/language/regional codes.")
        
    # Write metadata output
    if output_file:
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(results, f, indent=2, ensure_ascii=False)
            print(f"[+] Saved flag metadata to {output_file}")
        except Exception as e:
            print(f"[-] Error writing metadata file: {e}")
            
    # Download images if requested
    if download_dir and results:
        os.makedirs(download_dir, exist_ok=True)
        print(f"[*] Starting download of {len(results)} flags to '{download_dir}'...")
        
        success_count = 0
        for i, item in enumerate(results, start=1):
            code = item["code"]
            img_url = item["image_url"]
            filename = item["local_filename"]
            dest_path = os.path.join(download_dir, filename)
            
            # Simple progress log
            print(f"    [{i}/{len(results)}] Downloading {code} ({filename})... ", end="", flush=True)
            
            try:
                img_req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
                with urllib.request.urlopen(img_req, timeout=10) as img_resp:
                    with open(dest_path, 'wb') as img_file:
                        img_file.write(img_resp.read())
                print("Success.")
                success_count += 1
            except Exception as e:
                print(f"Failed: {e}")
                
            if delay > 0 and i < len(results):
                time.sleep(delay)
                
        print(f"[+] Download complete: {success_count}/{len(results)} flags successfully downloaded.")

def main():
    parser = argparse.ArgumentParser(
        description="Crawler to extract ISO 3166-1 alpha-2 country flags from kapowaz's square-flags gallery."
    )
    parser.add_argument(
        "-o", "--output", 
        type=str, 
        default="flags_metadata.json", 
        help="JSON file path to save the flag metadata (default: flags_metadata.json)."
    )
    parser.add_argument(
        "-d", "--download-dir", 
        type=str, 
        default=None, 
        help="Directory path to download the flag SVG files. If omitted, files won't be downloaded."
    )
    parser.add_argument(
        "--lax", 
        action="store_true", 
        help="Lax mode: Include all 2-letter codes found in the gallery, even if they aren't in the official ISO 3166-1 list."
    )
    parser.add_argument(
        "--delay", 
        type=float, 
        default=0.1, 
        help="Delay in seconds between image downloads to prevent rate limits (default: 0.1s)."
    )
    
    args = parser.parse_args()
    
    # Run crawl
    crawl_flags(
        strict=not args.lax,
        download_dir=args.download_dir,
        output_file=args.output,
        delay=args.delay
    )

if __name__ == "__main__":
    main()
