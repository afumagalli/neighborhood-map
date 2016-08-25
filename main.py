import os
import webapp2
import jinja2

template_dir = os.path.join(os.path.dirname(__file__))
jinja_env = jinja2.Environment(loader = jinja2.FileSystemLoader(template_dir),
                               autoescape = True)

class Handler(webapp2.RequestHandler):
    """Defines functions for rendering pages and setting cookies"""
    def write(self, *a, **kw):
        """Writes to the web page"""
        self.response.write(*a, **kw)

    def render_str(self, template, **kw):
        """Renders a Jinja template"""
        t = jinja_env.get_template(template)
        return t.render(kw)

    def render(self, template, **kw):
        """Writes rendered template to page"""
        self.write(self.render_str(template, **kw))

class MainHandler(Handler):
    """Renders the front page"""
    def get(self):
        self.render("index.html")

app = webapp2.WSGIApplication([
    ('/', MainHandler)
], debug=True)
