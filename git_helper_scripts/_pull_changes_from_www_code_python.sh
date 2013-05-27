#! /bin/sh

git checkout www-code-python-subtree
git pull
git reset --hard
git checkout dev
git merge --squash -X subtree=dependencies/www_code/python --no-commit www-code-python-subtree
git ac "merged in changes from dryx's www python code repo"
