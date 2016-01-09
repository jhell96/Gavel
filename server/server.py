from flask import Flask
from lxml import html
from flask import request
from urlparse import urlparse
import requests
app = Flask(__name__)

def check_if_empty(elements):
	if len(elements) < 1:
		return ''
	else:
		return elements[0]

@app.route("/", methods=['GET'])
def get_metadata():
	if request.method == 'GET':
		# Clean the url to scrape
		scrape_url = request.args['url']
		domain = urlparse(scrape_url)[1].replace('www.','') #netloc

		if domain == 'amazon.com':
			# scrape the page
			page = requests.get(scrape_url)
			tree = html.fromstring(page.content)

			productTitle = ''
			contributors = []

			# load twice to fix problem with parser
			for i in range(2):
				productTitle = check_if_empty(tree.xpath('//span[@id="productTitle"]/text()')) 
				contributors = tree.xpath('//a[@class="a-link-normal contributorNameID"]/text()')

			# isbn_div = tree.xpath('//div[@id="isbn_feature_div"]/')
			print "title:", productTitle
			print "contributors:", contributors

			return "DONE"
		else:
			print "DENIED PARSING OF ", scrape_url



if __name__ == "__main__":
    app.run()