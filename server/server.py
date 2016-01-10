from flask import Flask
from lxml import html
from flask import request
from urlparse import urlparse
import requests
import json
import urllib2
from urllib2 import urlopen
from cookielib import CookieJar
app = Flask(__name__)

def check_if_empty(elements):
	if len(elements) < 1:
		return ''
	else:
		return elements[0]

def reverse_image_search(image_url):
	metadata_urls = []

	cj = CookieJar()
	opener = urllib2.build_opener(urllib2.HTTPCookieProcessor(cj))
	opener.addheaders = [('User-agent', 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.27 Safari/537.17')]

	googlepath = 'http://google.com/searchbyimage?image_url='+image_url

	sourceCode = opener.open(googlepath).read()
	tree = html.fromstring(sourceCode)
	metadata_urls = tree.xpath('//h3[@class="r"]//a/@href')

	return metadata_urls

def get_metadata(metadata_url):
		# Clean the url to scrape
		domain = urlparse(metadata_url)[1].replace('www.','') #netloc

		if domain == 'amazon.com':
			print "IT'S AMAZON", metadata_url
			# scrape the page
			page = requests.get(metadata_url)
			tree = html.fromstring(page.content)

			productTitle = ''
			contributors = []
			isbn = ''
			rating = ''

			# load twice to fix problem with parser
			for i in range(2):
				productTitle = check_if_empty(tree.xpath('//span[@id="productTitle"]/text()')) 
				contributors = tree.xpath('//a[@class="a-link-normal contributorNameID"]/text()')
				isbn = check_if_empty(tree.xpath('//li//b[contains(text(),"ISBN-10")]/../text()'))
				
				rating = check_if_empty(tree.xpath('//span[@class="reviewCountTextLinkedHistogram noUnderline"]/@title'))
				rating = rating.replace(' out of ', ' ')
				rating = rating.split(' ')[0]
				rating = rating.replace('.','-')
				rating = rating.replace('-0','')

				image_url = check_if_empty(tree.xpath('//div[@id="mainImageContainer"]//img/@src'))

			print "title:", productTitle
			print "contributors:", contributors
			print "ISBN:", isbn
			print "image url:", image_url
			print "rating: ", rating

			data = {
				'title': productTitle,
				'contributors': contributors,
				'isbn': isbn,
				'rating': rating,
				'image_url': image_url
				}
			json_str = json.dumps(data)

			return json_str
		else:
			print "DENIED PARSING OF ", metadata_url
			return ''

@app.route("/", methods=['GET'])
def post_image_url():
	if request.method == 'GET':
		# Get incoming image url to reverse lookup
		imgurl = request.args['url']

		# get the list of metadata urls to perform parsing for
		metadata_urls = reverse_image_search(imgurl)

		# retrieve metadata from the urls
		for url in metadata_urls:
			temp = get_metadata(url)
			if temp is not None:
				return temp
				# break

		return ''


		


if __name__ == "__main__":
    app.run(debug=True)