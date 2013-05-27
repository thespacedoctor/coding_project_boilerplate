#! /bin/sh

git checkout dryxPM-subtree
git reset --hard
git pull
git merge --squash -s subtree --no-commit dev
git ac "merging in changes from external project"
git push dryxPM-remote dryxPM-subtree:dev
git cod
