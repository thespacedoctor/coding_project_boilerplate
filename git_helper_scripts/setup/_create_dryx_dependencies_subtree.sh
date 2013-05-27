#! /bin/sh

## DRYX PYTHON DEPENDENCIES
git remote add dryxPM-remote git@github.com:thespacedoctor/dryxPythonModulesFC.git
git fetch dryxPM-remote
git checkout -b dryxPM-subtree dryxPM-remote/dev
git checkout dev
git read-tree --prefix=dependencies/dryx_code/python/ -u dryxPM-subtree
git ac "added dryx dependency code"
