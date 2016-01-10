import urllib2
from urllib2 import urlopen
from cookielib import CookieJar

import time

cj = CookieJar()
opener = urllib2.build_opener(urllib2.HTTPCookieProcessor(cj))
opener.addheaders = [('User-agent', 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.27 Safari/537.17')]

imagepath = 'http://studeri.org/wp-content/uploads/2015/03/sharknado.jpg'
googlepath = 'http://google.com/searchbyimage?image_url='+imagepath

sourceCode = opener.open(googlepath).read()

print(sourceCode)

# imageLookup()
