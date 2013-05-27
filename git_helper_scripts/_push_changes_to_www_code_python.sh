#! /bin/sh

git checkout www-code-python-subtree
git reset --hard
git pull
git merge --squash -s subtree --no-commit dev
git ac "merging in changes from external project"
git push www-code-python-remote www-code-python-subtree:master
git cod
