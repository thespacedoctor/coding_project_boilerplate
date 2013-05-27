#! /bin/sh

git checkout dryxPM-subtree
git pull
git reset --hard
git checkout dev
git merge --squash -X subtree=dependencies/dryx_code/python --no-commit dryxPM-subtree
git ac "merged in changes from dryxPythonModulesFC"
