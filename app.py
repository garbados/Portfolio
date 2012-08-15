import os
import json
import flask
import datetime
from flask_flatpages import FlatPages
from flask.ext.assets import Environment, Bundle

## APP ##
app = flask.Flask(__name__)
app.config.from_object('settings.Config')

## ASSETS ##
assets = Environment(app)

post_content = Bundle(
    'jquery.js',
    filters='jsmin',
    output='packed/post_content.js')

style = Bundle(
    Bundle(
        'bootstrap/less/bootstrap.less',
        'custom.less',
        filters='less'),
    output='packed/style.css',
    debug=False)

assets.register('post_content_js', post_content)
assets.register('style_css', style)

## PAGES ##
pages = FlatPages(app)

## ROUTES ##
@app.route('/')
def index():
    summary = pages.get('summary')
    return flask.render_template('index.html', summary=summary)

def sort_by_date(pages):
    pages.sort(key=lambda page:datetime.datetime.strptime(page.meta['date'], "%B, %Y"), reverse=True)
    return pages

def get_section(prefix):
    return [page for page in pages if prefix in page.path]

@app.route('/stories')
def stories_list():
    stories = get_section('stories')
    stories = sort_by_date(stories)
    return flask.render_template('index.html', stories=stories)

@app.route('/games')
def games_list():
    games = get_section('games')
    games = sort_by_date(games)
    return flask.render_template('index.html', games=games)

@app.route('/<path:path>')
def page_detail(path):
    page = pages.get_or_404(path)
    return flask.render_template('index.html', page=page)

## MAIN ##
if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)