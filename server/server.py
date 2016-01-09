from flask import Flask, url_for, json, request
from lxml import html
from urlparse import urlparse
import pycurl, json
from StringIO import StringIO
from bs4 import BeautifulSoup
import requests
app = Flask(__name__)

def check_if_empty(elements):
	if len(elements) < 1:
		return ''
	else:
		return elements[0]

def get_metadata(scrape_url):
	# Clean the url to scrape
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

	else:
		print "DENIED PARSING OF ", scrape_url	

def build_json_return(whole_array):
    return json.dumps(whole_array)

# Parses returned code (html,js,css) and assigns to array using beautifulsoup
def google_image_results_parser(code):
    soup = BeautifulSoup(code)

    # initialize 2d array
    whole_array = {'links':[],
                   'description':[],
                   'title':[],
                   'result_qty':[]}

    # Links for all the search results
    for li in soup.findAll('li', attrs={'class':'g'}):
        sLink = li.find('a')
        whole_array['links'].append(sLink['href'])

    # Search Result Description
    for desc in soup.findAll('span', attrs={'class':'st'}):
        whole_array['description'].append(desc.get_text())

    # Search Result Title
    for title in soup.findAll('h3', attrs={'class':'r'}):
        whole_array['title'].append(title.get_text())

    # Number of results
    for result_qty in soup.findAll('div', attrs={'id':'resultStats'}):
        whole_array['result_qty'].append(result_qty.get_text())

    return build_json_return(whole_array)

@app.route("/", methods=['GET'])
def ocr_image():
	if request.method == 'GET':
		# Get URL for the image uploaded to Cloudinary and pushes to OCR server
		img_url = request.args['img_url']
		return google_image_results_parser(img_url)

		# next step is to take these results and put them through metadata parser
		# return "DONE"
	else:
		pass



if __name__ == "__main__":
    app.run()