from pathlib import Path 
import subprocess as sp


def install():

    # check node_modules exists
    if not Path('node_modules').exists():
        sp.run(['npm', 'i'], check=True, cwd=Path.cwd(), capture_output=True, text=True, encoding='utf-8')

    # check private/server/.venv exists
    if not Path('private/server/.venv').exists():
        sp.run(['python', '-m', 'venv', 'private/server/.venv'], check=True, cwd=Path.cwd(), capture_output=True, text=True, encoding='utf-8')
        # activate venv
        sp.run(['private/server/.venv/Scripts/activate.bat'], check=True, cwd=Path.cwd(), capture_output=True, text=True, encoding='utf-8')
        sp.run(['python', '-m', 'pip', 'install', '-r', 'private/server/requirements.txt'], check=True, cwd=Path.cwd(), capture_output=True, text=True, encoding='utf-8')

    # run app
    sp.run(['npm', 'run', 'dev'], check=True, cwd=Path.cwd(), capture_output=True, text=True, encoding='utf-8')

    # run server
    sp.run(['fastapi', 'private/server/main.py'], check=True, cwd=Path.cwd(), capture_output=True, text=True, encoding='utf-8')


if __name__ == '__main__':
    install()