from pathlib import Path 
import subprocess as sp
import sys
import os

def install():
    cwd = Path.cwd()
    venv_path = cwd / 'private/server' / '.venv'
    
    # 1. Install Node Modules
    if not (cwd / 'node_modules').exists():
        print("Installing npm packages...")
        sp.run(['npm', 'i'], check=True, shell=True)

    # 2. Setup Python Venv
    if not venv_path.exists():
        print("Creating virtual environment...")
        sp.run([sys.executable, '-m', 'venv', str(venv_path)], check=True)
        
        # Determine the pip path (Windows vs Unix)
        pip_exe = venv_path / 'Scripts' / 'pip.exe' if os.name == 'nt' else venv_path / 'bin' / 'pip'
        
        print("Installing requirements...")
        sp.run([str(pip_exe), 'install', '-r', 'private/server/requirements.txt'], check=True)

    # 3. Run Servers Concurrently
    # Point directly to the fastapi executable in the venv
    fastapi_exe = venv_path / 'Scripts' / 'fastapi.exe' if os.name == 'nt' else venv_path / 'bin' / 'fastapi'

    print("Starting FastAPI server...")
    # We use Popen so it doesn't block the script
    api_proc = sp.Popen(
        [str(fastapi_exe), 'dev'],
        cwd=cwd / 'private/server',
        shell=True
    )

    print("Starting Frontend...")
    frontend_proc = sp.Popen(['npm', 'run', 'dev'], cwd=cwd, shell=True)

    # Keep the main script alive while processes run
    try:
        api_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\nStopping servers...")
        api_proc.terminate()
        frontend_proc.terminate()

if __name__ == "__main__":
    install()