from pathlib import Path 
import subprocess as sp
import sys
import os

def install():
    cwd = Path.cwd()
    
    # 1. Install Node Modules
    if not (cwd / 'node_modules').exists():
        print("Installing npm packages...")
        sp.run(['npm', 'i'], check=True, shell=True)

    print("Starting Frontend...")
    frontend_proc = sp.Popen(['npm', 'run', 'build'], cwd=cwd, shell=True)

    # Keep the main script alive while processes run
    try:
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\nStopping servers...")
        frontend_proc.terminate()

if __name__ == "__main__":
    install()