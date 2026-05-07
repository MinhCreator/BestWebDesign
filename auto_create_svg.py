import os

getXml = input("Paste your svg code here: ")
lstETE = [string for string in getXml.split("\n")]
getPath = input("Where to save the svg file?: ")
getName = input("What is the name of the svg file?: ")
try:
    with open(f"{os.getcwd()}/{getPath}/{getName}.svg", "w") as f:
        for i in lstETE:
            f.write(f"{i}\n")
except Exception as e:
    print(e)
