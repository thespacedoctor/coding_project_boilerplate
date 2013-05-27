#! /bin/sh

## WWW PYTHON DEPENDENCIES
git remote add www-code-python-remote https://thespacedoctor@bitbucket.org/thespacedoctor/www_python_dependencies.git
git fetch www-code-python-remote
git checkout -b www-code-python-subtree www-code-python-remote/master
git checkout dev
git read-tree --prefix=dependencies/www_code/python/ -u www-code-python-subtree
git ac "added www python dependency code"
