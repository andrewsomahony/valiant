# valiant
Valiant Athletics Website

I use nodeenv with pyenv just for organization and ease of use.

To install nodeenv, you need to set your local Python version to below 3.0,
as for some reason, node has trouble installing with versions 3.0 or beyond.

Once node and npm are installed and nodeenv is activated, then you can switch
your local Python back to above 3.0 if you desire.

Requirements:
gulp.js

Install with:

npm install -g gulp

heroku config:set NPM_CONFIG_LOGLEVEL=verbose --app valiant
heroku run bash --app valiant